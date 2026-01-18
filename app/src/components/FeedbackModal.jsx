// app/src/components/FeedbackModal.jsx
import { useState } from "react";
import { useFeedback } from "../hooks/useFeedback";
import "./FeedbackModal.scss";

const FeedbackModal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { submitFeedback, isSubmitting, error } = useFeedback();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await submitFeedback({
      message,
      name: name.trim() || null,
      email: email.trim() || null,
    });

    if (success) {
      setShowSuccess(true);
      setMessage("");
      setName("");
      setEmail("");

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
      setName("");
      setEmail("");
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
                  required
                />
                {error && <p className="error-message">{error}</p>}
              </div>

              <div className="optional-section">
                <p className="optional-header">
                  <span className="optional-badge">Opcional</span>
                  Quer receber uma resposta nossa?
                </p>
                <p className="optional-description">
                  Deixe seu nome e email abaixo. Prometemos que{" "}
                  <strong>não enviaremos spam</strong> — usaremos apenas para
                  responder seu feedback diretamente (um humano da nossa equipe,
                  não robô! 🤖❌).
                </p>

                <div className="optional-fields">
                  <div className="form-group">
                    <label htmlFor="feedback-name">Nome (opcional)</label>
                    <input
                      type="text"
                      id="feedback-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Como podemos te chamar?"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="feedback-email">Email (opcional)</label>
                    <input
                      type="email"
                      id="feedback-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <p className="privacy-notice">
                Ao enviar, você concorda com nossa{" "}
                <a
                  href="https://truestreak.life/privacidade"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Política de Privacidade
                </a>
                .
              </p>

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
