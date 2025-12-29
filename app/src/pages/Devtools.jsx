// app/src/pages/DevTools.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { functions } from "../firebase/config";
import { httpsCallable } from "firebase/functions";
import "./DevTools.scss";

const DevTools = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generateWorkouts = async (scenario) => {
    if (!user) return;

    setLoading(true);
    setMessage("Gerando dados...");

    try {
      const populateWorkouts = httpsCallable(functions, "devPopulateWorkouts");
      const result = await populateWorkouts({ scenario });

      setMessage(
        `✅ ${result.data.count} treinos gerados com sucesso! Recarregue a página.`
      );
    } catch (error) {
      console.error("Error generating workouts:", error);
      setMessage(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearAllWorkouts = async () => {
    if (!user) return;
    if (!window.confirm("Tem certeza que quer deletar TODOS os treinos?"))
      return;

    setLoading(true);
    setMessage("Deletando todos os treinos...");

    try {
      const clearWorkouts = httpsCallable(functions, "devClearWorkouts");
      const result = await clearWorkouts();

      setMessage(
        `✅ ${result.data.count} treinos deletados. Recarregue a página.`
      );
    } catch (error) {
      console.error("Error clearing workouts:", error);
      setMessage(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dev-tools">
      <header className="dev-header">
        <button className="btn-back" onClick={() => navigate("/")}>
          ← Voltar
        </button>
        <div className="header-info">
          <h1>🛠️ Developer Tools</h1>
          <p className="subtitle">
            Popular dados de teste para visualizar stats
          </p>
        </div>
      </header>

      <div className="dev-content">
        <div className="warning-card">
          <div className="warning-icon">⚠️</div>
          <p>
            <strong>Atenção:</strong> Estas ferramentas são apenas para
            desenvolvimento. Os dados gerados são fictícios e serão misturados
            com seus treinos reais.
          </p>
        </div>

        <div className="scenarios-section">
          <h2>Cenários de Teste</h2>

          <div className="scenarios-grid">
            <div className="scenario-card">
              <h3>🔥 Streak Alto</h3>
              <p>30 dias seguidos de treinos completos</p>
              <button
                className="btn-scenario"
                onClick={() => generateWorkouts("streak-alto")}
                disabled={loading}
              >
                Gerar
              </button>
            </div>

            <div className="scenario-card">
              <h3>💔 Streak Quebrado</h3>
              <p>15 dias + quebra + 5 dias novos</p>
              <button
                className="btn-scenario"
                onClick={() => generateWorkouts("streak-quebrado")}
                disabled={loading}
              >
                Gerar
              </button>
            </div>

            <div className="scenario-card">
              <h3>📊 Irregular</h3>
              <p>50 treinos esparsos em 120 dias</p>
              <button
                className="btn-scenario"
                onClick={() => generateWorkouts("irregular")}
                disabled={loading}
              >
                Gerar
              </button>
            </div>

            <div className="scenario-card">
              <h3>⚠️ Muitos Skips</h3>
              <p>60 dias com 50% de skips</p>
              <button
                className="btn-scenario"
                onClick={() => generateWorkouts("muitos-skips")}
                disabled={loading}
              >
                Gerar
              </button>
            </div>

            <div className="scenario-card">
              <h3>🌟 Semana Perfeita</h3>
              <p>7 dias seguidos + treinos esparsos</p>
              <button
                className="btn-scenario"
                onClick={() => generateWorkouts("semana-perfeita")}
                disabled={loading}
              >
                Gerar
              </button>
            </div>

            <div className="scenario-card">
              <h3>🏋️ Exercícios Variados</h3>
              <p>40 treinos com diferentes exercícios</p>
              <button
                className="btn-scenario"
                onClick={() => generateWorkouts("exercicios-variados")}
                disabled={loading}
              >
                Gerar
              </button>
            </div>

            <div className="scenario-card">
              <h3>🚀 Massivo</h3>
              <p>100 treinos em 150 dias (testa limites)</p>
              <button
                className="btn-scenario"
                onClick={() => generateWorkouts("massivo")}
                disabled={loading}
              >
                Gerar
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`message ${
              message.includes("✅") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <div className="danger-zone">
          <h2>⚠️ Zona de Perigo</h2>
          <button
            className="btn-danger"
            onClick={clearAllWorkouts}
            disabled={loading}
          >
            🗑️ Deletar TODOS os treinos
          </button>
          <p className="danger-note">
            Esta ação não pode ser desfeita. Vai deletar todos os seus treinos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevTools;
