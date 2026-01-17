// app/src/components/ChallengeCard.jsx
import { TIER_CONFIG, CHALLENGES } from "../constants/challenges";
import {
  getNextTier,
  calculateProgress,
  formatChallengeValue,
} from "../utils/challengeCalculator";
import "./ChallengeCard.scss";

const ChallengeCard = ({ challengeId, challengeData, compact = false }) => {
  const challenge = CHALLENGES[challengeId];
  const tier = TIER_CONFIG[challengeData.currentTier];
  const nextTier = getNextTier(challengeId, challengeData.currentTier);
  const progress = calculateProgress(
    challengeId,
    challengeData.currentValue,
    challengeData.currentTier
  );

  const hasUnviewed =
    challengeData.tierHistory?.some((t) => !t.viewed) || false;

  if (compact) {
    // Versão compacta para Dashboard
    return (
      <div className="challenge-card compact">
        <div className="challenge-header">
          <span className="challenge-icon" style={{ color: challenge.color }}>
            {challenge.icon}
          </span>
          <div className="challenge-title">
            <h4>{challenge.name}</h4>
            {hasUnviewed && <span className="unviewed-dot">●</span>}
          </div>
        </div>

        <div className="tier-display">
          <span className="tier-icon" style={{ color: tier.color }}>
            {tier.icon}
          </span>
          <span className="tier-name" style={{ color: tier.color }}>
            {tier.label}
          </span>
        </div>

        {nextTier && (
          <>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${challenge.color}, ${
                    TIER_CONFIG[nextTier.tier].color
                  })`,
                }}
              />
            </div>
            <p className="progress-text">
              {formatChallengeValue(challengeId, challengeData.currentValue)}/
              {formatChallengeValue(challengeId, nextTier.value)}
            </p>
          </>
        )}

        {!nextTier && <p className="max-tier">🏆 Nível Máximo!</p>}
      </div>
    );
  }

  // Versão completa para página de Achievements
  return (
    <div className="challenge-card full">
      <div className="challenge-header">
        <div className="challenge-info">
          <span className="challenge-icon" style={{ color: challenge.color }}>
            {challenge.icon}
          </span>
          <div>
            <h3>{challenge.name}</h3>
            <p className="challenge-description">{challenge.description}</p>
          </div>
        </div>
        {hasUnviewed && <span className="unviewed-badge">Novo!</span>}
      </div>

      <div className="tier-section">
        <div className="current-tier">
          <span className="tier-icon-large" style={{ color: tier.color }}>
            {tier.icon}
          </span>
          <div className="tier-info">
            <span className="tier-label">Tier Atual</span>
            <span className="tier-name" style={{ color: tier.color }}>
              {tier.label}
            </span>
          </div>
        </div>

        <div className="current-value">
          <span className="value-label">Seu Progresso</span>
          <span className="value-number">
            {formatChallengeValue(challengeId, challengeData.currentValue)}
          </span>
        </div>
      </div>

      {nextTier && (
        <div className="progress-section">
          <div className="progress-header">
            <span className="next-tier-label">
              Próximo: {TIER_CONFIG[nextTier.tier].label}
            </span>
            <span className="progress-percentage">{Math.round(progress)}%</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${challenge.color}, ${
                  TIER_CONFIG[nextTier.tier].color
                })`,
              }}
            />
          </div>

          <p className="remaining-text">
            Faltam{" "}
            {formatChallengeValue(
              challengeId,
              nextTier.value - challengeData.currentValue
            )}{" "}
            para {TIER_CONFIG[nextTier.tier].label}
          </p>
        </div>
      )}

      {!nextTier && (
        <div className="max-tier-section">
          <span className="max-tier-icon">🏆</span>
          <p className="max-tier-text">Você alcançou o tier máximo!</p>
        </div>
      )}

      {challengeData.tierHistory && challengeData.tierHistory.length > 0 && (
        <div className="tier-history">
          <h4>Histórico de Conquistas</h4>
          <div className="history-list">
            {[...challengeData.tierHistory].reverse().map((entry, index) => {
              const historyTier = TIER_CONFIG[entry.tier];
              const date = new Date(entry.unlockedAt);
              const formattedDate = date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={index} className="history-item">
                  <span
                    className="history-tier-icon"
                    style={{ color: historyTier.color }}
                  >
                    {historyTier.icon}
                  </span>
                  <div className="history-info">
                    <span
                      className="history-tier-name"
                      style={{ color: historyTier.color }}
                    >
                      {historyTier.label}
                    </span>
                    <span className="history-date">{formattedDate}</span>
                  </div>
                  {!entry.viewed && (
                    <span className="history-new-badge">Novo!</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;
