import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  createCycle as createCycleAPI,
  updateCycleName as updateCycleNameAPI,
  updateCycleStructure as updateCycleStructureAPI,
  getActiveCycle as getActiveCycleAPI,
  getCycleHistory as getCycleHistoryAPI,
} from "../services/cycles";

/**
 * Hook customizado para gerenciar ciclos de treino
 * USA CLOUD FUNCTIONS (não acessa Firestore direto)
 */
export const useCycles = () => {
  const { user } = useAuth();
  const [activeCycle, setActiveCycle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar ciclo ativo quando usuário estiver disponível
  useEffect(() => {
    if (!user) {
      setActiveCycle(null);
      setLoading(false);
      return;
    }

    loadActiveCycle();
  }, [user]);

  const loadActiveCycle = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getActiveCycleAPI();
      setActiveCycle(result.cycle);
    } catch (err) {
      console.error("Error loading active cycle:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCycle = async (cycleData) => {
    try {
      setError(null);
      const result = await createCycleAPI(cycleData);
      await loadActiveCycle(); // Recarregar
      return result;
    } catch (err) {
      console.error("Error creating cycle:", err);
      setError(err.message);
      throw err;
    }
  };

  const updateCycleName = async (cycleId, newName) => {
    try {
      setError(null);
      await updateCycleNameAPI(cycleId, newName);
      await loadActiveCycle(); // Recarregar
    } catch (err) {
      console.error("Error updating cycle name:", err);
      setError(err.message);
      throw err;
    }
  };

  const updateCycleStructure = async (cycleId, data) => {
    try {
      setError(null);
      const result = await updateCycleStructureAPI(cycleId, data);
      await loadActiveCycle(); // Recarregar
      return result;
    } catch (err) {
      console.error("Error updating cycle structure:", err);
      setError(err.message);
      throw err;
    }
  };

  const getCycleHistory = async () => {
    try {
      setError(null);
      const result = await getCycleHistoryAPI();
      return result.cycles;
    } catch (err) {
      console.error("Error getting cycle history:", err);
      setError(err.message);
      throw err;
    }
  };

  return {
    activeCycle,
    loading,
    error,
    createCycle,
    updateCycleName,
    updateCycleStructure,
    getCycleHistory,
    reload: loadActiveCycle,
  };
};
