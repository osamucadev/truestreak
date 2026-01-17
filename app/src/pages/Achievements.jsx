// app/src/pages/Achievements.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChallenges } from "../hooks/useChallenges";
import { CHALLENGE_ORDER, CHALLENGES } from "../constants/challenges";
import ChallengeCard from "../components/ChallengeCard";
import "./Achievements.scss";

const Achievements = () => {
  const navigate = useNavigate();
  const { challenges, unviewedCount, loading, markAsViewed } = useChallenges();

  // Marcar como visualizado ao entrar na página
  useEffect(() => {
    if (unviewedCount > 0) {
      markAsViewed();
    }
  }, [unviewedCount, markAsViewed]);

  if (loading) {
    return (
      <div className="achievements-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  if (!challenges) {
    return (
      <div className="achievements-page">
        <header className="achievements-header">
          <button className="btn-back" onClick={() => navigate("/")}>
            ← Voltar
          </button>
          <div className="header-info">
            <h1>🏆 Vitrine de Troféus</h1>
            <p className="subtitle">Suas conquistas e progressos</p>
          </div>
        </header>

        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h2>Nenhuma conquista ainda</h2>
          <p>
            Complete seu primeiro treino para começar a desbloquear troféus!
          </p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Ir para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calcular estatísticas gerais
  const totalTiers = CHALLENGE_ORDER.length * 10; // 7 desafios x 10 tiers (excluindo sem ranking)
  let unlockedTiers = 0;

  CHALLENGE_ORDER.forEach((challengeId) => {
    const challenge = challenges[challengeId];
    if (challenge && challenge.tierHistory) {
      unlockedTiers += challenge.tierHistory.length;
    }
  });

  const completionPercentage = Math.round((unlockedTiers / totalTiers) * 100);

  return (
    <div className="achievements-page">
      <header className="achievements-header">
        <button className="btn-back" onClick={() => navigate("/")}>
          ← Voltar
        </button>
        <div className="header-info">
          <h1>🏆 Vitrine de Troféus</h1>
          <p className="subtitle">Suas conquistas e progressos</p>
        </div>
      </header>

      <div className="achievements-summary">
        <div className="summary-card">
          <div className="summary-icon">🏆</div>
          <div className="summary-info">
            <h3>{unlockedTiers}</h3>
            <p>Troféus Desbloqueados</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-info">
            <h3>{completionPercentage}%</h3>
            <p>Completude</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">🎯</div>
          <div className="summary-info">
            <h3>{CHALLENGE_ORDER.length}</h3>
            <p>Desafios Ativos</p>
          </div>
        </div>
      </div>

      <div className="progress-overview">
        <div className="progress-header">
          <span>Progresso Geral</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="progress-bar-large">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="progress-text">
          {unlockedTiers} de {totalTiers} troféus desbloqueados
        </p>
      </div>

      <div className="challenges-grid">
        {CHALLENGE_ORDER.map((challengeId) => {
          const challenge = challenges[challengeId];
          if (!challenge) return null;

          return (
            <ChallengeCard
              key={challengeId}
              challengeId={challengeId}
              challengeData={challenge}
              compact={false}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
