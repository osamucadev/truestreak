import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import {
  validateCycleName,
  validateDays,
  sanitizeCycleData,
} from "../utils/validation.js";

const db = getFirestore();

/**
 * Criar novo ciclo de treino
 *
 * @param {Object} data
 * @param {string} data.name - Nome do ciclo
 * @param {Array} data.days - Array de dias com exercícios
 *
 * @returns {Object} { cycleId, cycle }
 */
export const createCycle = onCall(async (request) => {
  // Verificar autenticação
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Usuário não autenticado");
  }

  const userId = request.auth.uid;
  const { name, days } = request.data;

  // Validar nome
  const nameValidation = validateCycleName(name);
  if (!nameValidation.valid) {
    throw new HttpsError("invalid-argument", nameValidation.error);
  }

  // Validar dias
  const daysValidation = validateDays(days);
  if (!daysValidation.valid) {
    throw new HttpsError("invalid-argument", daysValidation.error);
  }

  try {
    // Sanitizar dados
    const sanitizedData = sanitizeCycleData({ name, days });

    // Verificar se já existe ciclo ativo
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "Usuário não encontrado");
    }

    const userData = userDoc.data();
    const cycles = userData.cycles || [];

    // Se já tem ciclo ativo, desativar
    const updatedCycles = cycles.map((cycle) => {
      if (cycle.isActive) {
        return {
          ...cycle,
          isActive: false,
          endedAt: new Date().toISOString(),
        };
      }
      return cycle;
    });

    // Criar novo ciclo
    const newCycle = {
      id: `cycle-${Date.now()}`,
      name: sanitizedData.name,
      isActive: true,
      startedAt: new Date().toISOString(),
      endedAt: null,
      currentPosition: 0,
      days: sanitizedData.days,
    };

    // Adicionar novo ciclo
    updatedCycles.push(newCycle);

    // Atualizar Firestore
    await userRef.update({
      cycles: updatedCycles,
    });

    return {
      success: true,
      cycleId: newCycle.id,
      cycle: {
        ...newCycle,
        startedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error creating cycle:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Erro ao criar ciclo");
  }
});

/**
 * Atualizar apenas o nome do ciclo (in-place, não versiona)
 *
 * @param {Object} data
 * @param {string} data.cycleId - ID do ciclo
 * @param {string} data.newName - Novo nome
 *
 * @returns {Object} { success: true }
 */
export const updateCycleName = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Usuário não autenticado");
  }

  const userId = request.auth.uid;
  const { cycleId, newName } = request.data;

  // Validar nome
  const nameValidation = validateCycleName(newName);
  if (!nameValidation.valid) {
    throw new HttpsError("invalid-argument", nameValidation.error);
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "Usuário não encontrado");
    }

    const userData = userDoc.data();
    const cycles = userData.cycles || [];

    // Encontrar ciclo
    const cycleIndex = cycles.findIndex((c) => c.id === cycleId);
    if (cycleIndex === -1) {
      throw new HttpsError("not-found", "Ciclo não encontrado");
    }

    // Verificar se é ativo
    if (!cycles[cycleIndex].isActive) {
      throw new HttpsError(
        "failed-precondition",
        "Não é possível renomear ciclo inativo"
      );
    }

    // Atualizar nome
    cycles[cycleIndex].name = newName.trim();

    // Salvar
    await userRef.update({ cycles });

    return { success: true };
  } catch (error) {
    console.error("Error updating cycle name:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Erro ao atualizar nome do ciclo");
  }
});

/**
 * Atualizar estrutura do ciclo (dias/exercícios)
 * CRIA NOVA VERSÃO - arquiva o antigo
 *
 * @param {Object} data
 * @param {string} data.cycleId - ID do ciclo atual
 * @param {string} data.name - Nome (pode ser o mesmo ou novo)
 * @param {Array} data.days - Nova estrutura de dias
 *
 * @returns {Object} { newCycleId, newCycle }
 */
export const updateCycleStructure = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Usuário não autenticado");
  }

  const userId = request.auth.uid;
  const { cycleId, name, days } = request.data;

  // Validar nome
  const nameValidation = validateCycleName(name);
  if (!nameValidation.valid) {
    throw new HttpsError("invalid-argument", nameValidation.error);
  }

  // Validar dias
  const daysValidation = validateDays(days);
  if (!daysValidation.valid) {
    throw new HttpsError("invalid-argument", daysValidation.error);
  }

  try {
    // Sanitizar dados
    const sanitizedData = sanitizeCycleData({ name, days });

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "Usuário não encontrado");
    }

    const userData = userDoc.data();
    const cycles = userData.cycles || [];

    // Encontrar ciclo antigo
    const oldCycleIndex = cycles.findIndex((c) => c.id === cycleId);
    if (oldCycleIndex === -1) {
      throw new HttpsError("not-found", "Ciclo não encontrado");
    }

    // Verificar se é ativo
    if (!cycles[oldCycleIndex].isActive) {
      throw new HttpsError(
        "failed-precondition",
        "Não é possível editar ciclo inativo"
      );
    }

    // Arquivar ciclo antigo
    cycles[oldCycleIndex] = {
      ...cycles[oldCycleIndex],
      isActive: false,
      endedAt: new Date().toISOString(),
    };

    // Criar nova versão
    const newCycle = {
      id: `cycle-${Date.now()}`,
      name: sanitizedData.name,
      isActive: true,
      startedAt: new Date().toISOString(),
      endedAt: null,
      currentPosition: 0,
      days: sanitizedData.days,
    };

    // Adicionar nova versão
    cycles.push(newCycle);

    // Atualizar Firestore
    await userRef.update({ cycles });

    return {
      success: true,
      newCycleId: newCycle.id,
      newCycle: {
        ...newCycle,
        startedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error updating cycle structure:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Erro ao atualizar estrutura do ciclo");
  }
});

/**
 * Obter ciclo ativo do usuário
 *
 * @returns {Object} { cycle } ou { cycle: null }
 */
export const getActiveCycle = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Usuário não autenticado");
  }

  const userId = request.auth.uid;

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "Usuário não encontrado");
    }

    const userData = userDoc.data();
    const cycles = userData.cycles || [];

    // Encontrar ciclo ativo
    const activeCycle = cycles.find((c) => c.isActive === true);

    return {
      cycle: activeCycle || null,
    };
  } catch (error) {
    console.error("Error getting active cycle:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Erro ao buscar ciclo ativo");
  }
});

/**
 * Obter histórico de ciclos do usuário
 *
 * @returns {Object} { cycles: [...] }
 */
export const getCycleHistory = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Usuário não autenticado");
  }

  const userId = request.auth.uid;

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "Usuário não encontrado");
    }

    const userData = userDoc.data();
    const cycles = userData.cycles || [];

    // Filtrar apenas inativos e ordenar por data de fim (mais recente primeiro)
    const history = cycles
      .filter((c) => !c.isActive)
      .sort((a, b) => {
        const dateA = a.endedAt?.toDate?.() || new Date(0);
        const dateB = b.endedAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

    return {
      cycles: history,
    };
  } catch (error) {
    console.error("Error getting cycle history:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Erro ao buscar histórico de ciclos");
  }
});
