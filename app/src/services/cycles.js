import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/config";

/**
 * Criar novo ciclo de treino
 *
 * @param {Object} data
 * @param {string} data.name - Nome do ciclo
 * @param {Array} data.days - Array de dias com exercícios
 *
 * @returns {Promise<Object>} { cycleId, cycle }
 */
export const createCycle = async (data) => {
  try {
    const callable = httpsCallable(functions, "createCycle");
    const result = await callable(data);
    return result.data;
  } catch (error) {
    console.error("Error creating cycle:", error);
    throw new Error(error.message || "Erro ao criar ciclo");
  }
};

/**
 * Atualizar apenas o nome do ciclo (in-place)
 *
 * @param {string} cycleId - ID do ciclo
 * @param {string} newName - Novo nome
 *
 * @returns {Promise<Object>} { success: true }
 */
export const updateCycleName = async (cycleId, newName) => {
  try {
    const callable = httpsCallable(functions, "updateCycleName");
    const result = await callable({ cycleId, newName });
    return result.data;
  } catch (error) {
    console.error("Error updating cycle name:", error);
    throw new Error(error.message || "Erro ao renomear ciclo");
  }
};

/**
 * Atualizar estrutura do ciclo (dias/exercícios)
 * CRIA NOVA VERSÃO - arquiva o antigo
 *
 * @param {string} cycleId - ID do ciclo atual
 * @param {Object} data
 * @param {string} data.name - Nome (pode ser o mesmo ou novo)
 * @param {Array} data.days - Nova estrutura de dias
 *
 * @returns {Promise<Object>} { newCycleId, newCycle }
 */
export const updateCycleStructure = async (cycleId, data) => {
  try {
    const callable = httpsCallable(functions, "updateCycleStructure");
    const result = await callable({ cycleId, ...data });
    return result.data;
  } catch (error) {
    console.error("Error updating cycle structure:", error);
    throw new Error(error.message || "Erro ao atualizar ciclo");
  }
};

/**
 * Obter ciclo ativo do usuário
 *
 * @returns {Promise<Object>} { cycle } ou { cycle: null }
 */
export const getActiveCycle = async () => {
  try {
    const callable = httpsCallable(functions, "getActiveCycle");
    const result = await callable();
    return result.data;
  } catch (error) {
    console.error("Error getting active cycle:", error);
    throw new Error(error.message || "Erro ao buscar ciclo ativo");
  }
};

/**
 * Obter histórico de ciclos do usuário
 *
 * @returns {Promise<Object>} { cycles: [...] }
 */
export const getCycleHistory = async () => {
  try {
    const callable = httpsCallable(functions, "getCycleHistory");
    const result = await callable();
    return result.data;
  } catch (error) {
    console.error("Error getting cycle history:", error);
    throw new Error(error.message || "Erro ao buscar histórico");
  }
};
