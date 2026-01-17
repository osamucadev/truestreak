// functions/src/api/cycles.js
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import {
  validateCycleName,
  validateDays,
  sanitizeCycleData,
} from "../utils/validation.js";
import { updateChallengesAfterWorkout } from "./challenges.js";

// ✅ REMOVIDO: const db = getFirestore();

/**
 * Criar novo ciclo de treino
 */
export const createCycle = onCall(
  {
    cors: true, // ✅ CORS
  },
  async (request) => {
    const db = getFirestore(); // ✅ ADICIONADO

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const userId = request.auth.uid;
    const { name, days } = request.data;

    const nameValidation = validateCycleName(name);
    if (!nameValidation.valid) {
      throw new HttpsError("invalid-argument", nameValidation.error);
    }

    const daysValidation = validateDays(days);
    if (!daysValidation.valid) {
      throw new HttpsError("invalid-argument", daysValidation.error);
    }

    try {
      const sanitizedData = sanitizeCycleData({ name, days });
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new HttpsError("not-found", "Usuário não encontrado");
      }

      const userData = userDoc.data();
      const cycles = userData.cycles || [];

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

      const newCycle = {
        id: `cycle-${Date.now()}`,
        name: sanitizedData.name,
        isActive: true,
        startedAt: new Date().toISOString(),
        endedAt: null,
        currentPosition: 0,
        days: sanitizedData.days,
      };

      updatedCycles.push(newCycle);

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
  }
);

/**
 * Atualizar apenas o nome do ciclo
 */
export const updateCycleName = onCall(
  {
    cors: true, // ✅ CORS
  },
  async (request) => {
    const db = getFirestore(); // ✅ ADICIONADO

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const userId = request.auth.uid;
    const { cycleId, newName } = request.data;

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

      const cycleIndex = cycles.findIndex((c) => c.id === cycleId);
      if (cycleIndex === -1) {
        throw new HttpsError("not-found", "Ciclo não encontrado");
      }

      if (!cycles[cycleIndex].isActive) {
        throw new HttpsError(
          "failed-precondition",
          "Não é possível renomear ciclo inativo"
        );
      }

      cycles[cycleIndex].name = newName.trim();

      await userRef.update({ cycles });

      return { success: true };
    } catch (error) {
      console.error("Error updating cycle name:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "Erro ao atualizar nome do ciclo");
    }
  }
);

/**
 * Atualizar estrutura do ciclo
 */
export const updateCycleStructure = onCall(
  {
    cors: true, // ✅ CORS
  },
  async (request) => {
    const db = getFirestore(); // ✅ ADICIONADO

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const userId = request.auth.uid;
    const { cycleId, name, days } = request.data;

    const nameValidation = validateCycleName(name);
    if (!nameValidation.valid) {
      throw new HttpsError("invalid-argument", nameValidation.error);
    }

    const daysValidation = validateDays(days);
    if (!daysValidation.valid) {
      throw new HttpsError("invalid-argument", daysValidation.error);
    }

    try {
      const sanitizedData = sanitizeCycleData({ name, days });

      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new HttpsError("not-found", "Usuário não encontrado");
      }

      const userData = userDoc.data();
      const cycles = userData.cycles || [];

      const oldCycleIndex = cycles.findIndex((c) => c.id === cycleId);
      if (oldCycleIndex === -1) {
        throw new HttpsError("not-found", "Ciclo não encontrado");
      }

      if (!cycles[oldCycleIndex].isActive) {
        throw new HttpsError(
          "failed-precondition",
          "Não é possível editar ciclo inativo"
        );
      }

      cycles[oldCycleIndex] = {
        ...cycles[oldCycleIndex],
        isActive: false,
        endedAt: new Date().toISOString(),
      };

      const newCycle = {
        id: `cycle-${Date.now()}`,
        name: sanitizedData.name,
        isActive: true,
        startedAt: new Date().toISOString(),
        endedAt: null,
        currentPosition: 0,
        days: sanitizedData.days,
      };

      cycles.push(newCycle);

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
  }
);

/**
 * Obter ciclo ativo do usuário
 */
export const getActiveCycle = onCall(
  {
    cors: true, // ✅ CORS
  },
  async (request) => {
    const db = getFirestore(); // ✅ ADICIONADO

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
  }
);

/**
 * Obter histórico de ciclos
 */
export const getCycleHistory = onCall(
  {
    cors: true, // ✅ CORS
  },
  async (request) => {
    const db = getFirestore(); // ✅ ADICIONADO

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
  }
);

/**
 * Registrar treino completo
 */
export const logWorkout = onCall(
  {
    cors: true, // ✅ CORS
  },
  async (request) => {
    const db = getFirestore(); // ✅ ADICIONADO

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const userId = request.auth.uid;
    const { cycleId, dayId, completedExercises, notes } = request.data;

    if (!cycleId || !dayId) {
      throw new HttpsError(
        "invalid-argument",
        "cycleId e dayId são obrigatórios"
      );
    }

    if (!Array.isArray(completedExercises)) {
      throw new HttpsError(
        "invalid-argument",
        "completedExercises deve ser array"
      );
    }

    try {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new HttpsError("not-found", "Usuário não encontrado");
      }

      const userData = userDoc.data();
      const cycles = userData.cycles || [];
      const workouts = userData.workouts || [];
      const stats = userData.stats || {
        currentStreak: 0,
        longestStreak: 0,
        totalWorkouts: 0,
        xp: 0,
        level: 1,
        lastWorkoutDate: null,
        nextDayPosition: 0,
      };

      const activeCycle = cycles.find((c) => c.isActive);
      if (!activeCycle || activeCycle.id !== cycleId) {
        throw new HttpsError("not-found", "Ciclo ativo não encontrado");
      }

      const day = activeCycle.days.find((d) => d.id === dayId);
      if (!day) {
        throw new HttpsError("not-found", "Dia não encontrado");
      }

      const today = new Date().toISOString().split("T")[0];
      const hasWorkoutToday = workouts.some(
        (w) =>
          w.date.startsWith(today) &&
          w.completedExercises.some((e) => e.completed)
      );

      if (hasWorkoutToday) {
        throw new HttpsError("already-exists", "Você já treinou hoje");
      }

      const wasFullyCompleted = completedExercises.every((e) => e.completed);
      const hasAnyCompleted = completedExercises.some((e) => e.completed);

      const newWorkout = {
        id: `workout-${Date.now()}`,
        cycleId,
        dayId,
        dayName: day.name,
        dayPosition: day.position,
        date: new Date().toISOString(),
        completedExercises,
        wasFullyCompleted,
        wasMandatory: day.isMandatory,
        skippedReason: null,
        notes: notes || "",
      };

      workouts.push(newWorkout);

      if (hasAnyCompleted) {
        stats.currentStreak += 1;
        stats.totalWorkouts += 1;
        stats.xp += 10;

        if (wasFullyCompleted) {
          stats.xp += 5;
        }

        if (stats.currentStreak > stats.longestStreak) {
          stats.longestStreak = stats.currentStreak;
        }

        stats.level = Math.floor(stats.xp / 100) + 1;
      }

      stats.lastWorkoutDate = new Date().toISOString();
      stats.nextDayPosition = (day.position + 1) % activeCycle.days.length;

      await userRef.update({
        workouts,
        stats,
      });

      const tierUps = await updateChallengesAfterWorkout(userId);

      return {
        success: true,
        workout: newWorkout,
        stats,
        tierUps,
      };
    } catch (error) {
      console.error("Error logging workout:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "Erro ao registrar treino");
    }
  }
);

/**
 * Pular treino
 */
export const skipWorkout = onCall(
  {
    cors: true, // ✅ CORS
  },
  async (request) => {
    const db = getFirestore(); // ✅ ADICIONADO

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const userId = request.auth.uid;
    const { cycleId, dayId, reason, nextDayChoice } = request.data;

    if (!cycleId || !dayId || !reason) {
      throw new HttpsError(
        "invalid-argument",
        "cycleId, dayId e reason são obrigatórios"
      );
    }

    if (!["cant", "wont"].includes(reason)) {
      throw new HttpsError(
        "invalid-argument",
        'reason deve ser "cant" ou "wont"'
      );
    }

    try {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new HttpsError("not-found", "Usuário não encontrado");
      }

      const userData = userDoc.data();
      const cycles = userData.cycles || [];
      const workouts = userData.workouts || [];
      const stats = userData.stats || {
        currentStreak: 0,
        longestStreak: 0,
        totalWorkouts: 0,
        xp: 0,
        level: 1,
        lastWorkoutDate: null,
        nextDayPosition: 0,
      };

      const activeCycle = cycles.find((c) => c.isActive);
      if (!activeCycle || activeCycle.id !== cycleId) {
        throw new HttpsError("not-found", "Ciclo ativo não encontrado");
      }

      const day = activeCycle.days.find((d) => d.id === dayId);
      if (!day) {
        throw new HttpsError("not-found", "Dia não encontrado");
      }

      const skipWorkout = {
        id: `workout-${Date.now()}`,
        cycleId,
        dayId,
        dayName: day.name,
        dayPosition: day.position,
        date: new Date().toISOString(),
        completedExercises: [],
        wasFullyCompleted: false,
        wasMandatory: day.isMandatory,
        skippedReason: reason,
        notes: "",
      };

      workouts.push(skipWorkout);

      if (day.isMandatory && reason === "wont") {
        if (stats.currentStreak > stats.longestStreak) {
          stats.longestStreak = stats.currentStreak;
        }
        stats.currentStreak = 0;
      }

      if (!day.isMandatory) {
        stats.currentStreak += 1;
      }

      stats.lastWorkoutDate = new Date().toISOString();

      if (typeof nextDayChoice === "number") {
        stats.nextDayPosition = nextDayChoice;
      } else {
        stats.nextDayPosition = (day.position + 1) % activeCycle.days.length;
      }

      await userRef.update({
        workouts,
        stats,
      });

      return {
        success: true,
        streakBroken: day.isMandatory && reason === "wont",
        stats,
        needsNextDayChoice: day.isMandatory,
      };
    } catch (error) {
      console.error("Error skipping workout:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "Erro ao registrar pulo de treino");
    }
  }
);

/**
 * Obter histórico de workouts
 */
export const getWorkoutHistory = onCall(
  {
    cors: true, // ✅ CORS
  },
  async (request) => {
    const db = getFirestore(); // ✅ ADICIONADO

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const userId = request.auth.uid;
    const { limit = 30 } = request.data;

    try {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new HttpsError("not-found", "Usuário não encontrado");
      }

      const userData = userDoc.data();
      const workouts = userData.workouts || [];

      const sortedWorkouts = workouts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);

      return {
        success: true,
        workouts: sortedWorkouts,
      };
    } catch (error) {
      console.error("Error getting workout history:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "Erro ao buscar histórico");
    }
  }
);

/**
 * Obter estatísticas atuais
 */
export const getCurrentStats = onCall(
  {
    cors: true, // ✅ CORS
  },
  async (request) => {
    const db = getFirestore(); // ✅ ADICIONADO

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
      const stats = userData.stats || {
        currentStreak: 0,
        longestStreak: 0,
        totalWorkouts: 0,
        xp: 0,
        level: 1,
        lastWorkoutDate: null,
        nextDayPosition: 0,
      };

      return {
        success: true,
        stats,
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError("internal", "Erro ao buscar estatísticas");
    }
  }
);
