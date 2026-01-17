// app/src/components/TierUpModal.jsx
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import {
  TIER_CONFIG,
  CHALLENGES,
  TIER_MESSAGES,
} from "../constants/challenges";
import "./TierUpModal.scss";

const TierUpModal = ({ tierUp, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Para confetti após 4 segundos
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!tierUp) return null;

  const tier = TIER_CONFIG[tierUp.tier];
  const challenge = CHALLENGES[tierUp.challengeId];
  const message = TIER_MESSAGES[tierUp.tier]?.[0] || "Parabéns!";

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="tier-up-modal-overlay" onClick={onClose}>
        <div className="tier-up-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>🎉 PARABÉNS! 🎉</h2>
          </div>

          <div className="tier-icon-container">
            <div className="tier-icon" style={{ color: tier.color }}>
              {tier.icon}
            </div>
            <h3 className="tier-name" style={{ color: tier.color }}>
              {tier.label}
            </h3>
          </div>

          <div className="challenge-info">
            <p className="message">{message}</p>
            <p className="challenge-name">
              {challenge.icon} {challenge.name}
            </p>
          </div>

          <div className="unlock-info">
            <p className="unlock-label">Desbloqueado em:</p>
            <p className="unlock-date">{formatDate(tierUp.unlockedAt)}</p>
          </div>

          <button className="btn-close" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </>
  );
};

export default TierUpModal;
