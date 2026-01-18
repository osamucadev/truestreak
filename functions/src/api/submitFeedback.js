// functions/src/api/submitFeedback.js
import { onCall, HttpsError } from "firebase-functions/v2/https";
import admin from "firebase-admin";

export const submitFeedback = onCall(
  {
    cors: true, // Habilita CORS
  },
  async (request) => {
    // Validar autenticação
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { message } = request.data;
    const userId = request.auth.uid;

    // Validações
    if (!message || typeof message !== "string") {
      throw new HttpsError("invalid-argument", "Mensagem inválida");
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length < 10) {
      throw new HttpsError(
        "invalid-argument",
        "Mensagem muito curta. Mínimo 10 caracteres."
      );
    }

    if (trimmedMessage.length > 5000) {
      throw new HttpsError(
        "invalid-argument",
        "Mensagem muito longa. Máximo 5000 caracteres."
      );
    }

    try {
      // Salvar feedback no Firestore
      const feedbackData = {
        userId,
        message: trimmedMessage,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "new",
      };

      const docRef = await admin
        .firestore()
        .collection("feedbacks")
        .add(feedbackData);

      console.log(`Feedback criado: ${docRef.id} por usuário ${userId}`);

      return {
        success: true,
        feedbackId: docRef.id,
      };
    } catch (error) {
      console.error("Erro ao salvar feedback:", error);
      throw new HttpsError("internal", "Erro ao salvar feedback");
    }
  }
);
