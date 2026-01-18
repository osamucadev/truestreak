// functions/src/index.js
import admin from "firebase-admin";

// ✅ INICIALIZAR FIREBASE ADMIN ANTES DE IMPORTAR QUALQUER COISA
admin.initializeApp();

import {
  createCycle,
  updateCycleName,
  updateCycleStructure,
  getActiveCycle,
  getCycleHistory,
  logWorkout,
  skipWorkout,
  getWorkoutHistory,
  getCurrentStats,
} from "./api/cycles.js";

import { devPopulateWorkouts, devClearWorkouts } from "./api/dev.js";

import {
  getUserChallenges,
  markAchievementsAsViewed,
} from "./api/challenges.js";

import { submitFeedback } from "./api/submitFeedback.js";

import { submitReview } from "./api/submitReview.js";

// Exportar todas as functions
export {
  // Cycles
  createCycle,
  updateCycleName,
  updateCycleStructure,
  getActiveCycle,
  getCycleHistory,
  logWorkout,
  skipWorkout,
  getWorkoutHistory,
  getCurrentStats,

  // Dev Tools
  devPopulateWorkouts,
  devClearWorkouts,

  // Challenges
  getUserChallenges,
  markAchievementsAsViewed,

  // Feedback
  submitFeedback,

  // Review
  submitReview,
};
