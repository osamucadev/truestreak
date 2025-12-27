import { useState } from "react";
import "./DayEditor.scss";

// Helper: Criar exercício vazio
const createEmptyExercise = () => {
  return {
    id: `ex-${Date.now()}-${Math.random()}`,
    name: "",
    setsReps: "",
    notes: "",
  };
};

const DayEditor = ({ day, onSave, onCancel }) => {
  const [dayName, setDayName] = useState(day.name || "");
  const [isMandatory, setIsMandatory] = useState(day.isMandatory ?? true);
  const [exercises, setExercises] = useState(day.exercises || []);
  const [error, setError] = useState("");

  const handleAddExercise = () => {
    const newExercise = createEmptyExercise();
    setExercises([...exercises, newExercise]);
  };

  const handleUpdateExercise = (exerciseId, field, value) => {
    setExercises(
      exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    );
  };

  const handleDeleteExercise = (exerciseId) => {
    setExercises(exercises.filter((ex) => ex.id !== exerciseId));
  };

  const handleMoveExercise = (exerciseId, direction) => {
    const currentIndex = exercises.findIndex((ex) => ex.id === exerciseId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= exercises.length) return;

    const newExercises = [...exercises];
    [newExercises[currentIndex], newExercises[newIndex]] = [
      newExercises[newIndex],
      newExercises[currentIndex],
    ];

    setExercises(newExercises);
  };

  const handleSave = () => {
    // Validações
    if (!dayName.trim()) {
      setError("O dia precisa ter um nome");
      return;
    }

    // Verificar exercícios vazios
    const invalidExercises = exercises.filter((ex) => !ex.name.trim());
    if (invalidExercises.length > 0) {
      setError("Remova ou preencha os exercícios vazios");
      return;
    }

    const updatedDay = {
      ...day,
      name: dayName,
      isMandatory,
      exercises,
    };

    onSave(updatedDay);
  };

  return (
    <div className="day-editor">
      <header className="editor-header glass">
        <div>
          <h1>Editar Dia</h1>
          <p className="subtitle">
            Configure o nome, tipo e exercícios deste dia
          </p>
        </div>
      </header>

      <div className="editor-content">
        {/* Nome e tipo do dia */}
        <div className="form-section glass">
          <label className="form-label">
            <span>Nome do dia</span>
            <input
              type="text"
              value={dayName}
              onChange={(e) => setDayName(e.target.value)}
              placeholder="Ex: A - Upper Pesado, Cardio, Descanso..."
              className="input-text"
              maxLength={50}
            />
            <small>Use um nome descritivo</small>
          </label>

          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={isMandatory}
              onChange={(e) => setIsMandatory(e.target.checked)}
            />
            <div className="checkbox-label">
              <strong>Dia obrigatório</strong>
              <small>
                {isMandatory
                  ? "Pular este dia afeta sua streak"
                  : "Dia opcional - não afeta streak se pular"}
              </small>
            </div>
          </label>
        </div>

        {/* Lista de exercícios */}
        <div className="form-section">
          <div className="section-header">
            <h2>Exercícios</h2>
            <span className="badge">
              {exercises.length}{" "}
              {exercises.length === 1 ? "exercício" : "exercícios"}
            </span>
          </div>

          {exercises.length === 0 ? (
            <div className="empty-state glass">
              <p>Nenhum exercício adicionado ainda.</p>
              <p className="small">Clique no botão abaixo pra começar!</p>
            </div>
          ) : (
            <div className="exercises-list">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="exercise-card glass">
                  <div className="exercise-number">{index + 1}</div>

                  <div className="exercise-fields">
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) =>
                        handleUpdateExercise(
                          exercise.id,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Nome do exercício"
                      className="input-text"
                    />

                    <input
                      type="text"
                      value={exercise.setsReps}
                      onChange={(e) =>
                        handleUpdateExercise(
                          exercise.id,
                          "setsReps",
                          e.target.value
                        )
                      }
                      placeholder="Ex: 3x8-10"
                      className="input-text small"
                    />

                    <input
                      type="text"
                      value={exercise.notes}
                      onChange={(e) =>
                        handleUpdateExercise(
                          exercise.id,
                          "notes",
                          e.target.value
                        )
                      }
                      placeholder="Notas (opcional)"
                      className="input-text"
                    />
                  </div>

                  <div className="exercise-actions">
                    {index > 0 && (
                      <button
                        className="btn-icon"
                        onClick={() => handleMoveExercise(exercise.id, "up")}
                        title="Mover pra cima"
                      >
                        ↑
                      </button>
                    )}
                    {index < exercises.length - 1 && (
                      <button
                        className="btn-icon"
                        onClick={() => handleMoveExercise(exercise.id, "down")}
                        title="Mover pra baixo"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDeleteExercise(exercise.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="btn-add" onClick={handleAddExercise}>
            + Adicionar exercício
          </button>
        </div>

        {/* Mensagem de erro */}
        {error && <div className="error-message">{error}</div>}

        {/* Ações */}
        <div className="editor-actions">
          <button className="btn ghost" onClick={onCancel}>
            Voltar
          </button>
          <button className="btn primary" onClick={handleSave}>
            Salvar dia
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayEditor;
