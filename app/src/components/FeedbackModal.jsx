// app/src/components/FeedbackModal.jsx
import { useState } from "react";
import { useFeedback } from "../hooks/useFeedback";
import "./FeedbackModal.scss";

const FeedbackModal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { submitFeedback, isSubmitting, error } = useFeedback();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await submitFeedback(message);

    if (success) {
      setShowSuccess(true);
      setMessage("");

      // Fechar automaticamente após 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMessage("");
      setShowSuccess(false);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    // Esc fecha o modal
    if (e.key === "Escape" && !isSubmitting) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay" onClick={handleClose}>
      <div
        className="feedback-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {showSuccess ? (
          <div className="feedback-success">
            <div className="success-icon">✅</div>
            <h2>Feedback enviado!</h2>
            <p>Obrigado por ajudar a melhorar o TrueStreak 💜</p>
          </div>
        ) : (
          <>
            <div className="feedback-header">
              <h2>💬 Deixar Feedback</h2>
              <button
                className="btn-close"
                onClick={handleClose}
                disabled={isSubmitting}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <label htmlFor="feedback-message">
                  Bugs, sugestões, elogios... queremos ouvir você!
                </label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem aqui... (Enter quebra linha)"
                  rows={6}
                  disabled={isSubmitting}
                  autoFocus
                />
                {error && <p className="error-message">{error}</p>}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting || message.trim().length < 10}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Feedback"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
