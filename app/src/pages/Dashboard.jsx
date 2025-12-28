// app/src/pages/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCycles } from "../hooks/useCycles";
import { useWorkouts } from "../hooks/useWorkouts";
import EmptyState from "../components/EmptyState";
import "./Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { activeCycle, loading: cycleLoading } = useCycles();
  const { stats, loading: statsLoading } = useWorkouts();

  const handleCreateCycle = () => navigate("/cycle/create");
  const handleEditCycle = () => navigate("/cycle/edit");
  const handleStartWorkout = () => navigate("/workout");

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (cycleLoading || statsLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Determinar qual dia treinar hoje
  const getTodayDay = () => {
    if (!activeCycle) return null;

    // Se não tem stats ainda (primeiro treino), usa position 0
    const position = stats?.nextDayPosition ?? 0;
    return activeCycle.days[position];
  };

  const todayDay = getTodayDay();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-info">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="user-avatar"
            />
          )}
          <div>
            <h2>Olá, {user?.displayName?.split(" ")[0] || "Usuário"}!</h2>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </header>

      <div className="dashboard-content">
        {!activeCycle ? (
          <EmptyState onCreateCycle={handleCreateCycle} />
        ) : (
          <>
            <div className="active-cycle-card">
              <div className="cycle-header">
                <div>
                  <h2>{activeCycle.name}</h2>
                  <p className="cycle-meta">
                    {activeCycle.days.length}{" "}
                    {activeCycle.days.length === 1 ? "dia" : "dias"} no ciclo
                  </p>
                </div>
                <button className="btn-edit" onClick={handleEditCycle}>
                  Editar
                </button>
              </div>

              {todayDay && (
                <div className="current-day">
                  <span className="day-badge">PRÓXIMO TREINO</span>
                  <h3>{todayDay.name}</h3>

                  <div className="day-type">
                    <span
                      className={`type-badge ${
                        todayDay.isMandatory ? "mandatory" : "free"
                      }`}
                    >
                      {todayDay.isMandatory ? "Obrigatório" : "Opcional"}
                    </span>
                    <span className="exercises-count">
                      {todayDay.exercises.length}{" "}
                      {todayDay.exercises.length === 1
                        ? "exercício"
                        : "exercícios"}
                    </span>
                  </div>

                  {todayDay.exercises.length > 0 && (
                    <div className="exercises-preview">
                      <strong>Exercícios:</strong>
                      <ul>
                        {todayDay.exercises.slice(0, 3).map((ex) => (
                          <li key={ex.id}>
                            {ex.name} {ex.setsReps && `— ${ex.setsReps}`}
                          </li>
                        ))}
                        {todayDay.exercises.length > 3 && (
                          <li className="more">
                            ... e mais {todayDay.exercises.length - 3}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <button className="btn-start" onClick={handleStartWorkout}>
                    ▶ Iniciar treino
                  </button>
                </div>
              )}
            </div>

            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-value">{stats?.currentStreak ?? 0}</div>
                <div className="stat-label">Streak</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats?.totalWorkouts ?? 0}</div>
                <div className="stat-label">Treinos</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats?.level ?? 1}</div>
                <div className="stat-label">Level</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
