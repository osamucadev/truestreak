// functions/src/api/submitReview.js
import { onCall, HttpsError } from "firebase-functions/v2/https";
import admin from "firebase-admin";

export const submitReview = onCall(
  {
    cors: true,
  },
  async (request) => {
    // Validar autenticação
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const { rating, comment, allowPublicShare } = request.data;
    const userId = request.auth.uid;

    // Validações
    if (!rating || typeof rating !== "number") {
      throw new HttpsError("invalid-argument", "Rating inválido");
    }

    if (rating < 1 || rating > 5) {
      throw new HttpsError(
        "invalid-argument",
        "Rating deve ser entre 1 e 5 estrelas"
      );
    }

    // Validar comment (se fornecido)
    if (comment !== null && comment !== undefined) {
      if (typeof comment !== "string") {
        throw new HttpsError("invalid-argument", "Comentário inválido");
      }

      if (comment.trim().length > 500) {
        throw new HttpsError(
          "invalid-argument",
          "Comentário muito longo. Máximo 500 caracteres."
        );
      }
    }

    // Validar allowPublicShare
    if (typeof allowPublicShare !== "boolean") {
      throw new HttpsError(
        "invalid-argument",
        "allowPublicShare deve ser booleano"
      );
    }

    try {
      // Verificar se usuário já enviou review
      const existingReviewQuery = await admin
        .firestore()
        .collection("reviews")
        .where("userId", "==", userId)
        .limit(1)
        .get();

      if (!existingReviewQuery.empty) {
        throw new HttpsError(
          "already-exists",
          "Você já enviou uma avaliação. Obrigado!"
        );
      }

      // Salvar review no Firestore
      const reviewData = {
        userId,
        rating,
        allowPublicShare,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "new", // new → approved → published
      };

      // Adicionar comentário apenas se fornecido
      if (comment && comment.trim().length > 0) {
        reviewData.comment = comment.trim();
      }

      const docRef = await admin
        .firestore()
        .collection("reviews")
        .add(reviewData);

      console.log(
        `Review criado: ${docRef.id} por usuário ${userId} - ${rating} estrelas`
      );

      return {
        success: true,
        reviewId: docRef.id,
      };
    } catch (error) {
      // Se for erro já conhecido, relancar
      if (error instanceof HttpsError) {
        throw error;
      }

      console.error("Erro ao salvar review:", error);
      throw new HttpsError("internal", "Erro ao salvar avaliação");
    }
  }
);
