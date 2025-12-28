// app/src/services/workouts.js
import { functions } from "../firebase/config";
import { httpsCallable } from "firebase/functions";

const logWorkoutFn = httpsCallable(functions, "logWorkout");
const skipWorkoutFn = httpsCallable(functions, "skipWorkout");
const getWorkoutHistoryFn = httpsCallable(functions, "getWorkoutHistory");
const getCurrentStatsFn = httpsCallable(functions, "getCurrentStats");

export const logWorkout = async (
  cycleId,
  dayId,
  completedExercises,
  notes = ""
) => {
  try {
    const result = await logWorkoutFn({
      cycleId,
      dayId,
      completedExercises,
      notes,
    });
    return result.data;
  } catch (error) {
    console.error("Error logging workout:", error);
    throw new Error(error.message || "Erro ao registrar treino");
  }
};

export const skipWorkout = async (
  cycleId,
  dayId,
  reason,
  nextDayChoice = null
) => {
  try {
    const result = await skipWorkoutFn({
      cycleId,
      dayId,
      reason,
      nextDayChoice,
    });
    return result.data;
  } catch (error) {
    console.error("Error skipping workout:", error);
    throw new Error(error.message || "Erro ao registrar pulo de treino");
  }
};

export const getWorkoutHistory = async (limit = 30) => {
  try {
    const result = await getWorkoutHistoryFn({ limit });
    return result.data;
  } catch (error) {
    console.error("Error getting workout history:", error);
    throw new Error(error.message || "Erro ao buscar histórico");
  }
};

export const getCurrentStats = async () => {
  try {
    const result = await getCurrentStatsFn();
    return result.data;
  } catch (error) {
    console.error("Error getting stats:", error);
    throw new Error(error.message || "Erro ao buscar estatísticas");
  }
};
