// app/src/hooks/useChallenges.js
import { useState, useEffect, useCallback } from "react";
import { functions } from "../firebase/config";
import { httpsCallable } from "firebase/functions";
import { useAuth } from "../contexts/AuthContext";

export const useChallenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState(null);
  const [unviewedCount, setUnviewedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar challenges
  const loadChallenges = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const getChallenges = httpsCallable(functions, "getUserChallenges");
      const result = await getChallenges();

      setChallenges(result.data.challenges);
      setUnviewedCount(result.data.unviewedCount || 0);
      setError(null);
    } catch (err) {
      console.error("Error loading challenges:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Marcar achievements como visualizados
  const markAsViewed = useCallback(async () => {
    if (!user) return;

    try {
      const markViewed = httpsCallable(functions, "markAchievementsAsViewed");
      await markViewed();

      setUnviewedCount(0);

      // Atualizar challenges localmente
      if (challenges) {
        const updatedChallenges = {};
        for (const challengeId in challenges) {
          updatedChallenges[challengeId] = {
            ...challenges[challengeId],
            tierHistory:
              challenges[challengeId].tierHistory?.map((t) => ({
                ...t,
                viewed: true,
              })) || [],
          };
        }
        setChallenges(updatedChallenges);
      }
    } catch (err) {
      console.error("Error marking as viewed:", err);
    }
  }, [user, challenges]);

  // Carregar ao montar
  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  return {
    challenges,
    unviewedCount,
    loading,
    error,
    reload: loadChallenges,
    markAsViewed,
  };
};
