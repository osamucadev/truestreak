// app/src/hooks/useRating.js
import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/config";

const RATING_PROMPT_KEY = "truestreak_rating_prompted";
const RATING_SUBMITTED_KEY = "truestreak_rating_submitted";
const WORKOUTS_FOR_PROMPT = 3; // Mostrar após 3 treinos

export const useRating = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Verificar se deve mostrar o prompt de rating
  const shouldShowRatingPrompt = (completedWorkoutsCount) => {
    // Não mostrar se já enviou rating
    const hasSubmitted = localStorage.getItem(RATING_SUBMITTED_KEY);
    if (hasSubmitted === "true") return false;

    // Não mostrar se já foi perguntado e usuário recusou
    const wasPrompted = localStorage.getItem(RATING_PROMPT_KEY);
    if (wasPrompted === "dismissed") return false;

    // Mostrar se completou 3+ treinos
    return completedWorkoutsCount >= WORKOUTS_FOR_PROMPT;
  };

  // Marcar que o prompt foi mostrado
  const markPromptShown = () => {
    localStorage.setItem(RATING_PROMPT_KEY, "shown");
  };

  // Marcar que o usuário dispensou o prompt
  const dismissPrompt = () => {
    localStorage.setItem(RATING_PROMPT_KEY, "dismissed");
  };

  // Enviar review
  const submitReview = async (reviewData) => {
    const { rating, comment, allowPublicShare } = reviewData;

    // Validações
    if (!rating || rating < 1 || rating > 5) {
      setError("Por favor, selecione uma avaliação de 1 a 5 estrelas.");
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Chamar Cloud Function
      const submitReviewFunction = httpsCallable(functions, "submitReview");

      const result = await submitReviewFunction({
        rating,
        comment: comment && comment.trim().length > 0 ? comment.trim() : null,
        allowPublicShare: allowPublicShare === true,
      });

      if (result.data.success) {
        // Marcar que o usuário enviou review
        localStorage.setItem(RATING_SUBMITTED_KEY, "true");
        setIsSubmitting(false);
        return true;
      } else {
        throw new Error(result.data.error || "Erro ao enviar avaliação");
      }
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      setError(err.message || "Erro ao enviar. Tente novamente.");
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    shouldShowRatingPrompt,
    markPromptShown,
    dismissPrompt,
    submitReview,
    isSubmitting,
    error,
  };
};
