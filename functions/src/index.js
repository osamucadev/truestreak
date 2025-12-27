import { onRequest } from "firebase-functions/v2/https";
import { onCall } from "firebase-functions/v2/https";

/**
 * Cloud Function de teste - HTTP Endpoint
 * URL: https://us-central1-<project-id>.cloudfunctions.net/hello
 */
export const hello = onRequest((request, response) => {
  response.json({ message: "TrueStreak" });
});

/**
 * Cloud Function de teste - Callable (para chamar do frontend)
 * Uso: const result = await httpsCallable(functions, 'helloCallable')()
 */
export const helloCallable = onCall((request) => {
  return {
    message: "TrueStreak",
    timestamp: new Date().toISOString(),
    user: request.auth?.uid || "anonymous",
  };
});
