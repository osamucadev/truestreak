// app/src/hooks/useFeedback.js
import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/config";

export const useFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitFeedback = async (message) => {
    if (!message || message.trim().length === 0) {
      setError("Por favor, escreva sua mensagem.");
      return false;
    }

    if (message.trim().length < 10) {
      setError("Mensagem muito curta. Escreva pelo menos 10 caracteres.");
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Chamar Cloud Function
      const submitFeedbackFunction = httpsCallable(functions, "submitFeedback");

      const result = await submitFeedbackFunction({
        message: message.trim(),
      });

      if (result.data.success) {
        setIsSubmitting(false);
        return true;
      } else {
        throw new Error(result.data.error || "Erro ao enviar feedback");
      }
    } catch (err) {
      console.error("Erro ao enviar feedback:", err);
      setError(err.message || "Erro ao enviar. Tente novamente.");
      setIsSubmitting(false);
      return false;
    }
  };

  return {
    submitFeedback,
    isSubmitting,
    error,
  };
};
