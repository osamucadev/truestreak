// app/src/hooks/useWorkouts.js
import { useState, useEffect } from "react";
import {
  logWorkout as logWorkoutService,
  skipWorkout as skipWorkoutService,
  getWorkoutHistory as getWorkoutHistoryService,
  getCurrentStats as getCurrentStatsService,
} from "../services/workouts";

export const useWorkouts = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar stats ao montar
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getCurrentStatsService();
      setStats(result.stats);
    } catch (err) {
      setError(err.message);
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (limit = 30) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getWorkoutHistoryService(limit);
      setHistory(result.workouts);
    } catch (err) {
      setError(err.message);
      console.error("Error loading history:", err);
    } finally {
      setLoading(false);
    }
  };

  const logWorkout = async (cycleId, dayId, completedExercises, notes = "") => {
    try {
      setError(null);
      const result = await logWorkoutService(
        cycleId,
        dayId,
        completedExercises,
        notes
      );
      setStats(result.stats);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const skipWorkout = async (cycleId, dayId, reason, nextDayChoice = null) => {
    try {
      setError(null);
      const result = await skipWorkoutService(
        cycleId,
        dayId,
        reason,
        nextDayChoice
      );
      setStats(result.stats);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    stats,
    history,
    loading,
    error,
    logWorkout,
    skipWorkout,
    loadHistory,
    reload: loadStats,
  };
};
