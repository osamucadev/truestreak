import "./EmptyState.scss";

const EmptyState = ({ onCreateCycle }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">💪</div>

      <h1>Bem-vindo ao seu treino!</h1>

      <p className="subtitle">
        Você ainda não tem um treino cadastrado. Crie seu primeiro treino agora
        e comece sua jornada de constância real!
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <span className="icon">🗓️</span>
          <span className="text">Crie seus dias de treino</span>
        </div>
        <div className="feature-card">
          <span className="icon">🏋️</span>
          <span className="text">Adicione seus exercícios</span>
        </div>
        <div className="feature-card">
          <span className="icon">🎯</span>
          <span className="text">Acompanhe seu progresso</span>
        </div>
      </div>

      <button className="btn-create-cycle" onClick={onCreateCycle}>
        + Criar meu primeiro treino
      </button>
    </div>
  );
};

export default EmptyState;
