// app/src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCycles } from "../hooks/useCycles";
import { useWorkouts } from "../hooks/useWorkouts";
import { useChallenges } from "../hooks/useChallenges";
import EmptyState from "../components/EmptyState";
import TierUpModal from "../components/TierUpModal";
import ChallengeCard from "../components/ChallengeCard";
import { CHALLENGE_ORDER } from "../constants/challenges";
import "./Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { activeCycle: cycle, loading: cycleLoading } = useCycles();
  const { stats, loading: statsLoading } = useWorkouts();
  const {
    challenges,
    unviewedCount,
    reload: reloadChallenges,
  } = useChallenges();

  const [tierUpQueue, setTierUpQueue] = useState([]);
  const [currentTierUp, setCurrentTierUp] = useState(null);

  // Listener para tier ups (vindos do localStorage após workout)
  useEffect(() => {
    const checkForTierUps = () => {
      const storedTierUps = localStorage.getItem("pendingTierUps");
      if (storedTierUps) {
        try {
          const tierUps = JSON.parse(storedTierUps);
          if (tierUps.length > 0) {
            setTierUpQueue(tierUps);
            setCurrentTierUp(tierUps[0]);
            localStorage.removeItem("pendingTierUps");
          }
        } catch (error) {
          console.error("Error parsing tier ups:", error);
        }
      }
    };

    checkForTierUps();
  }, []);

  const handleCloseTierUpModal = () => {
    const remaining = tierUpQueue.slice(1);
    setTierUpQueue(remaining);

    if (remaining.length > 0) {
      setCurrentTierUp(remaining[0]);
    } else {
      setCurrentTierUp(null);
      reloadChallenges();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleStartWorkout = () => {
    if (!cycle) return;

    const nextDayPosition = stats?.nextDayPosition || 0;
    const nextDay = cycle.days[nextDayPosition];

    if (nextDay) {
      navigate(`/workout/${cycle.id}/${nextDay.id}`);
    }
  };

  const handleCreateCycle = () => {
    navigate("/cycle/create");
  };

  if (cycleLoading || statsLoading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  // Pegar desafio em destaque
  let featuredChallenge = null;
  let featuredChallengeId = null;

  if (challenges) {
    let maxProgress = 0;
    for (const challengeId of CHALLENGE_ORDER) {
      const challenge = challenges[challengeId];
      if (challenge && challenge.currentTier !== "diamanteAzul") {
        const progress = (challenge.currentValue / 100) * 50;
        if (progress > maxProgress) {
          maxProgress = progress;
          featuredChallenge = challenge;
          featuredChallengeId = challengeId;
        }
      }
    }

    if (!featuredChallenge && CHALLENGE_ORDER.length > 0) {
      featuredChallengeId = CHALLENGE_ORDER[0];
      featuredChallenge = challenges[featuredChallengeId];
    }
  }

  const nextDayPosition = stats?.nextDayPosition || 0;
  const todayDay = cycle?.days?.[nextDayPosition];

  return (
    <div className="dashboard">
      {/* Tier Up Modal */}
      {currentTierUp && (
        <TierUpModal tierUp={currentTierUp} onClose={handleCloseTierUpModal} />
      )}

      {/* ✅ HEADER SEMPRE PRESENTE */}
      <header className="dashboard-header">
        <div className="user-info">
          <div className="user-avatar">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} />
            ) : (
              <div className="avatar-placeholder">
                {user?.displayName?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <div className="user-details">
            <h2>Olá, {user?.displayName?.split(" ")[0] || "Usuário"}!</h2>
            {cycle && <p className="cycle-name">{cycle.name}</p>}
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </header>

      {/* ✅ CONTEÚDO CONDICIONAL */}
      {!cycle ? (
        <EmptyState onCreateCycle={handleCreateCycle} />
      ) : (
        <>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <h3>{stats?.currentStreak || 0}</h3>
                <p>Streak Atual</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <h3>{stats?.level || 1}</h3>
                <p>Nível</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💪</div>
              <div className="stat-info">
                <h3>{stats?.totalWorkouts || 0}</h3>
                <p>Treinos</p>
              </div>
            </div>
          </div>

          {/* CHALLENGES SHOWCASE */}
          {challenges && featuredChallenge && (
            <div className="challenges-showcase">
              <div className="showcase-header">
                <h3>🏆 Desafios</h3>
                {unviewedCount > 0 && (
                  <span className="unviewed-badge">{unviewedCount}</span>
                )}
              </div>

              <ChallengeCard
                challengeId={featuredChallengeId}
                challengeData={featuredChallenge}
                compact={true}
              />

              {unviewedCount > 0 && (
                <div className="unviewed-alert">
                  ⚠️ Você tem {unviewedCount}{" "}
                  {unviewedCount === 1 ? "conquista" : "conquistas"} não
                  visualizada
                  {unviewedCount === 1 ? "" : "s"}!
                </div>
              )}

              <button
                className="btn-view-achievements"
                onClick={() => navigate("/achievements")}
              >
                Ver vitrine completa →
              </button>
            </div>
          )}

          <div className="today-workout">
            <h3>Próximo Treino</h3>
            {todayDay ? (
              <div className="workout-card">
                <div className="workout-header">
                  <h4>{todayDay.name}</h4>
                  <span className="workout-badge">
                    {todayDay.isMandatory ? "⚡ Obrigatório" : "✨ Opcional"}
                  </span>
                </div>
                <div className="exercises-preview">
                  <p className="exercises-count">
                    {todayDay.exercises.length}{" "}
                    {todayDay.exercises.length === 1
                      ? "exercício"
                      : "exercícios"}
                  </p>
                </div>
                <button
                  className="btn-start-workout"
                  onClick={handleStartWorkout}
                >
                  Começar Treino
                </button>
              </div>
            ) : (
              <div className="no-workout">
                <p>Nenhum treino disponível hoje</p>
              </div>
            )}
          </div>

          <div className="quick-actions">
            <button className="action-btn" onClick={() => navigate("/history")}>
              <span className="action-icon">📜</span>
              <span className="action-label">Histórico</span>
            </button>

            <button className="action-btn" onClick={() => navigate("/stats")}>
              <span className="action-icon">📊</span>
              <span className="action-label">Estatísticas</span>
            </button>

            <button
              className="action-btn"
              onClick={() => navigate("/cycle/edit/" + cycle.id)}
            >
              <span className="action-icon">✏️</span>
              <span className="action-label">Editar Ciclo</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
