import { useAuth } from "../contexts/AuthContext";
import "./Dashboard.scss";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
        <div className="welcome-card glass">
          <h1>Bem-vindo ao TrueStreak! 🎉</h1>
          <p className="subtitle">
            Você está autenticado e pronto para começar sua jornada de
            constância real.
          </p>

          <div className="status-grid">
            <div className="status-item glass2">
              <div className="status-icon">✅</div>
              <div className="status-text">
                <strong>Autenticação</strong>
                <span>Funcionando</span>
              </div>
            </div>

            <div className="status-item glass2">
              <div className="status-icon">🔥</div>
              <div className="status-text">
                <strong>Firestore</strong>
                <span>Configurado</span>
              </div>
            </div>

            <div className="status-item glass2">
              <div className="status-icon">⚡</div>
              <div className="status-text">
                <strong>Functions</strong>
                <span>Disponíveis</span>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>Próximos passos:</h3>
            <ul>
              <li>📝 Criar seu ciclo de treinos</li>
              <li>💪 Registrar primeiro treino</li>
              <li>🏆 Desbloquear conquistas</li>
              <li>📊 Acompanhar progresso</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
