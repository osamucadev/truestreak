import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCycles } from "../hooks/useCycles";
import EmptyState from "../components/EmptyState";
import "./Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { activeCycle, loading } = useCycles();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCreateCycle = () => {
    navigate("/cycle/create");
  };

  const handleEditCycle = () => {
    navigate("/cycle/edit");
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header glass">
        <div className="user-info">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="user-avatar"
            />
          )}
          <div>
            <h2>Olá, {user?.displayName?.split(" ")[0]}!</h2>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        <button className="btn-logout" onClick={handleSignOut}>
          Sair
        </button>
      </header>

      <main className="dashboard-content">
        {!activeCycle ? (
          <EmptyState onCreateCycle={handleCreateCycle} />
        ) : (
          <div className="active-cycle-card glass">
            <div className="cycle-header">
              <div>
                <h2>{activeCycle.name}</h2>
                <p className="cycle-meta">
                  {activeCycle.days?.length || 0} dias no ciclo
                </p>
              </div>
              <button className="btn-edit" onClick={handleEditCycle}>
                ✏️ Editar
              </button>
            </div>

            <div className="current-day glass2">
              <div className="day-badge">Próximo treino</div>
              {activeCycle.days && activeCycle.days.length > 0 ? (
                <>
                  <h3>
                    Dia {activeCycle.currentPosition + 1}:{" "}
                    {activeCycle.days[activeCycle.currentPosition]?.name}
                  </h3>
                  <div className="day-type">
                    {activeCycle.days[activeCycle.currentPosition]
                      ?.isMandatory ? (
                      <span className="type-badge mandatory">
                        ⚡ Obrigatório
                      </span>
                    ) : (
                      <span className="type-badge free">🌟 Livre</span>
                    )}
                  </div>

                  {activeCycle.days[activeCycle.currentPosition]?.exercises
                    ?.length > 0 && (
                    <div className="exercises-preview">
                      <strong>Exercícios:</strong>
                      <ul>
                        {activeCycle.days[activeCycle.currentPosition].exercises
                          .slice(0, 3)
                          .map((ex) => (
                            <li key={ex.id}>
                              {ex.name} {ex.setsReps && `- ${ex.setsReps}`}
                            </li>
                          ))}
                        {activeCycle.days[activeCycle.currentPosition].exercises
                          .length > 3 && (
                          <li className="more">
                            +
                            {activeCycle.days[activeCycle.currentPosition]
                              .exercises.length - 3}{" "}
                            exercícios
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <button className="btn-start">Iniciar treino</button>
                </>
              ) : (
                <p>Nenhum dia configurado</p>
              )}
            </div>

            <div className="quick-stats">
              <div className="stat-item glass2">
                <div className="stat-value">0</div>
                <div className="stat-label">Streak</div>
              </div>
              <div className="stat-item glass2">
                <div className="stat-value">0</div>
                <div className="stat-label">Treinos</div>
              </div>
              <div className="stat-item glass2">
                <div className="stat-value">1</div>
                <div className="stat-label">Level</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
