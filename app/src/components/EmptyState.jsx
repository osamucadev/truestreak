import "./EmptyState.scss";

const EmptyState = ({ onCreateCycle }) => {
  return (
    <div className="empty-state glass">
      <div className="empty-icon">💪</div>

      <h2>Bem-vindo ao seu treino!</h2>

      <p className="empty-description">
        Você ainda não tem um treino cadastrado. Crie seu primeiro treino agora
        e comece sua jornada de constância real!
      </p>

      <div className="empty-features">
        <div className="feature-item">
          <span className="feature-emoji">📅</span>
          <span>Crie seus dias de treino</span>
        </div>
        <div className="feature-item">
          <span className="feature-emoji">🏋️</span>
          <span>Adicione seus exercícios</span>
        </div>
        <div className="feature-item">
          <span className="feature-emoji">🎯</span>
          <span>Acompanhe seu progresso</span>
        </div>
      </div>

      <button className="btn-create-cycle" onClick={onCreateCycle}>
        + Criar meu primeiro treino
      </button>
    </div>
  );
};

export default EmptyState;
