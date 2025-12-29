import { useState } from "react";
import { createEmptyExercise } from "../utils/cycleUtils";
import "./DayEditor.scss";

const DayEditor = ({ day, onSave, onCancel }) => {
  const [dayName, setDayName] = useState(day.name || "");
  const [isMandatory, setIsMandatory] = useState(day.isMandatory ?? true);
  const [exercises, setExercises] = useState(day.exercises || []);
  const [error, setError] = useState("");
  const [collapsedSteps, setCollapsedSteps] = useState({});
  const [collapsedTips, setCollapsedTips] = useState({});

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

  const handleAddStep = (exerciseId) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, steps: [...(ex.steps || []), ""] };
        }
        return ex;
      })
    );
  };

  const handleUpdateStep = (exerciseId, stepIndex, value) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newSteps = [...ex.steps];
          newSteps[stepIndex] = value;
          return { ...ex, steps: newSteps };
        }
        return ex;
      })
    );
  };

  const handleRemoveStep = (exerciseId, stepIndex) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newSteps = ex.steps.filter((_, i) => i !== stepIndex);
          return { ...ex, steps: newSteps };
        }
        return ex;
      })
    );
  };

  const handleAddTip = (exerciseId) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, tips: [...(ex.tips || []), ""] };
        }
        return ex;
      })
    );
  };

  const handleUpdateTip = (exerciseId, tipIndex, value) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newTips = [...ex.tips];
          newTips[tipIndex] = value;
          return { ...ex, tips: newTips };
        }
        return ex;
      })
    );
  };

  const handleRemoveTip = (exerciseId, tipIndex) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newTips = ex.tips.filter((_, i) => i !== tipIndex);
          return { ...ex, tips: newTips };
        }
        return ex;
      })
    );
  };

  const toggleStepsCollapse = (exerciseId) => {
    setCollapsedSteps((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const toggleTipsCollapse = (exerciseId) => {
    setCollapsedTips((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleSave = () => {
    if (!dayName.trim()) {
      setError("O dia precisa ter um nome");
      return;
    }

    const invalidExercises = exercises.filter((ex) => !ex.name.trim());
    if (invalidExercises.length > 0) {
      setError("Remova ou preencha os exercícios vazios");
      return;
    }

    const invalidSetsReps = exercises.filter(
      (ex) => ex.name.trim() && !ex.setsReps.trim()
    );
    if (invalidSetsReps.length > 0) {
      setError("Todos os exercícios precisam ter séries/repetições");
      return;
    }

    const cleanedExercises = exercises.map((ex) => ({
      ...ex,
      steps: ex.steps?.filter((s) => s.trim()) || [],
      tips: ex.tips?.filter((t) => t.trim()) || [],
    }));

    const updatedDay = {
      ...day,
      name: dayName,
      isMandatory,
      exercises: cleanedExercises,
    };

    onSave(updatedDay);
  };

  return (
    <div className="day-editor">
      <header className="editor-header">
        <div>
          <h1>Editar Dia</h1>
          <p className="subtitle">
            Configure o nome, tipo e exercícios deste dia
          </p>
        </div>
      </header>

      <div className="editor-content">
        <div className="form-section">
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

        <div className="form-section">
          <div className="section-header">
            <h2>Exercícios</h2>
            <span className="badge">
              {exercises.length}{" "}
              {exercises.length === 1 ? "exercício" : "exercícios"}
            </span>
          </div>

          {exercises.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum exercício adicionado ainda.</p>
              <p className="small">Clique no botão abaixo pra começar!</p>
            </div>
          ) : (
            <div className="exercises-list">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="exercise-card">
                  <div className="exercise-header">
                    <div className="exercise-number">{index + 1}</div>
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
                          onClick={() =>
                            handleMoveExercise(exercise.id, "down")
                          }
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

                    <div className="input-group">
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
                        placeholder="Ex: 3x12, 3x60s, 4x15-20"
                        className="input-text small"
                      />
                      <small className="input-hint">
                        Formato livre: repetições ou tempo
                      </small>
                    </div>

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

                    <div className="collapsible-section">
                      <button
                        className="collapse-header"
                        onClick={() => toggleStepsCollapse(exercise.id)}
                      >
                        <span>
                          📋 Passo a passo ({exercise.steps?.length || 0})
                        </span>
                        <span className="collapse-icon">
                          {collapsedSteps[exercise.id] ? "▶" : "▼"}
                        </span>
                      </button>

                      {!collapsedSteps[exercise.id] && (
                        <div className="collapse-content">
                          {exercise.steps?.map((step, stepIndex) => (
                            <div key={stepIndex} className="list-item">
                              <span className="item-number">
                                {stepIndex + 1}.
                              </span>
                              <input
                                type="text"
                                value={step}
                                onChange={(e) =>
                                  handleUpdateStep(
                                    exercise.id,
                                    stepIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="Descreva o passo..."
                                className="input-text"
                              />
                              <button
                                className="btn-icon danger small"
                                onClick={() =>
                                  handleRemoveStep(exercise.id, stepIndex)
                                }
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            className="btn-add-item"
                            onClick={() => handleAddStep(exercise.id)}
                          >
                            +{" "}
                            {exercise.steps?.length > 0
                              ? "Adicionar mais um passo"
                              : "Adicionar passo"}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="collapsible-section">
                      <button
                        className="collapse-header"
                        onClick={() => toggleTipsCollapse(exercise.id)}
                      >
                        <span>💡 Dicas ({exercise.tips?.length || 0})</span>
                        <span className="collapse-icon">
                          {collapsedTips[exercise.id] ? "▶" : "▼"}
                        </span>
                      </button>

                      {!collapsedTips[exercise.id] && (
                        <div className="collapse-content">
                          {exercise.tips?.map((tip, tipIndex) => (
                            <div key={tipIndex} className="list-item">
                              <span className="item-icon">•</span>
                              <input
                                type="text"
                                value={tip}
                                onChange={(e) =>
                                  handleUpdateTip(
                                    exercise.id,
                                    tipIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="Escreva uma dica..."
                                className="input-text"
                              />
                              <button
                                className="btn-icon danger small"
                                onClick={() =>
                                  handleRemoveTip(exercise.id, tipIndex)
                                }
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            className="btn-add-item"
                            onClick={() => handleAddTip(exercise.id)}
                          >
                            +{" "}
                            {exercise.tips?.length > 0
                              ? "Adicionar mais uma dica"
                              : "Adicionar dica"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="btn-add" onClick={handleAddExercise}>
            + Adicionar exercício
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

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
