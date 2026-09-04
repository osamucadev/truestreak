import "./EmptyState.scss";

const EmptyState = ({ onCreateCycle }) => {
  return (
    <div className="empty-state">
      <p className="empty-kicker">Seu primeiro ciclo</p>
      <h1>Seu histórico começa aqui.</h1>

      <p className="subtitle">
        Organize os dias e exercícios que fazem sentido para você. Depois,
        registre o que aconteceu — inclusive quando o ritmo mudar.
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <span className="feature-index">01</span>
          <span className="text">Defina seus dias</span>
        </div>
        <div className="feature-card">
          <span className="feature-index">02</span>
          <span className="text">Adicione exercícios</span>
        </div>
        <div className="feature-card">
          <span className="feature-index">03</span>
          <span className="text">Acompanhe sua história</span>
        </div>
      </div>

      <button className="btn-create-cycle" onClick={onCreateCycle}>
        Criar meu primeiro ciclo
      </button>
    </div>
  );
};

export default EmptyState;
