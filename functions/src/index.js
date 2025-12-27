import "./config/firebase-admin.js";
import { onRequest } from "firebase-functions/v2/https";
import { onCall } from "firebase-functions/v2/https";

// Test functions
export const hello = onRequest((request, response) => {
  response.json({ message: "TrueStreak" });
});

export const helloCallable = onCall((request) => {
  return {
    message: "TrueStreak",
    timestamp: new Date().toISOString(),
    user: request.auth?.uid || "anonymous",
  };
});

// Cycle management functions
export {
  createCycle,
  updateCycleName,
  updateCycleStructure,
  getActiveCycle,
  getCycleHistory,
} from "./api/cycles.js";
