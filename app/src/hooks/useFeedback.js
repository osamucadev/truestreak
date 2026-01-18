// app/src/hooks/useFeedback.js
import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/config";

export const useFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitFeedback = async (data) => {
    const { message, name, email } = data;

    if (!message || message.trim().length === 0) {
      setError("Por favor, escreva sua mensagem.");
      return false;
    }

    if (message.trim().length < 10) {
      setError("Mensagem muito curta. Escreva pelo menos 10 caracteres.");
      return false;
    }

    // Validar email se fornecido
    if (email && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setError("Email inválido.");
        return false;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Chamar Cloud Function
      const submitFeedbackFunction = httpsCallable(functions, "submitFeedback");

      const result = await submitFeedbackFunction({
        message: message.trim(),
        name: name && name.trim().length > 0 ? name.trim() : null,
        email: email && email.trim().length > 0 ? email.trim() : null,
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
