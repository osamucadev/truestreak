// app/src/components/RatingPrompt.jsx
import { useState } from "react";
import { useRating } from "../hooks/useRating";
import "./RatingPrompt.scss";

const RatingPrompt = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [allowPublicShare, setAllowPublicShare] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const { submitReview, isSubmitting, error } = useRating();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await submitReview({
      rating,
      comment,
      allowPublicShare,
    });

    if (success) {
      setShowSuccess(true);

      // Fechar automaticamente após 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
        setRating(0);
        setComment("");
        setAllowPublicShare(true);
        onClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setHoveredRating(0);
      setComment("");
      setAllowPublicShare(true);
      setShowSuccess(false);
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && !isSubmitting) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rating-prompt-overlay" onClick={handleClose}>
      <div
        className="rating-prompt"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {showSuccess ? (
          <div className="rating-success">
            <div className="success-icon">🎉</div>
            <h2>Obrigado pela avaliação!</h2>
            <p>Seu feedback é muito importante para nós 💜</p>
          </div>
        ) : (
          <>
            <div className="rating-header">
              <h2>⭐ Como está sendo sua experiência?</h2>
              <button
                className="btn-close"
                onClick={handleClose}
                disabled={isSubmitting}
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="rating-form">
              <div className="form-group">
                <label>Avalie o TrueStreak</label>
                <div className="stars-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star ${
                        star <= (hoveredRating || rating) ? "filled" : ""
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      disabled={isSubmitting}
                      aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="rating-text">
                    {rating === 1 && "Precisa melhorar 😔"}
                    {rating === 2 && "Pode melhorar 🤔"}
                    {rating === 3 && "Bom! 😊"}
                    {rating === 4 && "Muito bom! 😄"}
                    {rating === 5 && "Excelente! 🤩"}
                  </p>
                )}
                {error && <p className="error-message">{error}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="rating-comment">
                  Quer nos contar mais? (opcional)
                </label>
                <textarea
                  id="rating-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="O que você mais gosta? O que podemos melhorar?"
                  rows={4}
                  disabled={isSubmitting}
                  maxLength={500}
                />
                <p className="char-count">{comment.length}/500</p>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={allowPublicShare}
                    onChange={(e) => setAllowPublicShare(e.target.checked)}
                    disabled={isSubmitting}
                  />
                  <span className="checkbox-text">
                    Autorizo compartilhar esta avaliação{" "}
                    <strong>anonimamente</strong> em nosso site e redes sociais
                    como prova social
                  </span>
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Agora não
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting || rating === 0}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default RatingPrompt;
