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

    const { message, name, email } = request.data;
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

    // Validar nome (se fornecido)
    if (name !== null && name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        throw new HttpsError("invalid-argument", "Nome inválido");
      }
      if (name.trim().length > 100) {
        throw new HttpsError(
          "invalid-argument",
          "Nome muito longo. Máximo 100 caracteres."
        );
      }
    }

    // Validar email (se fornecido)
    if (email !== null && email !== undefined) {
      if (typeof email !== "string" || email.trim().length === 0) {
        throw new HttpsError("invalid-argument", "Email inválido");
      }
      // Regex básico para validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        throw new HttpsError("invalid-argument", "Formato de email inválido");
      }
      if (email.trim().length > 200) {
        throw new HttpsError(
          "invalid-argument",
          "Email muito longo. Máximo 200 caracteres."
        );
      }
    }

    try {
      // Salvar feedback no Firestore
      const feedbackData = {
        userId,
        message: trimmedMessage,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "new",
      };

      // Adicionar nome e email apenas se fornecidos
      if (name && name.trim().length > 0) {
        feedbackData.name = name.trim();
      }

      if (email && email.trim().length > 0) {
        feedbackData.email = email.trim();
      }

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
