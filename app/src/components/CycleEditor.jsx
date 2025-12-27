import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCycles } from "../hooks/useCycles";
import DayEditor from "./DayEditor";
import "./CycleEditor.scss";

const createEmptyDay = (position) => {
  return {
    id: `day-${Date.now()}-${Math.random()}`,
    name: "",
    position: position,
    isMandatory: true,
    exercises: [],
  };
};

const createEmptyExercise = () => {
  return {
    id: `ex-${Date.now()}-${Math.random()}`,
    name: "",
    setsReps: "",
    notes: "",
    steps: [],
    tips: [],
  };
};

const CycleEditor = ({ cycleToEdit }) => {
  const navigate = useNavigate();
  const { createCycle, updateCycleName, updateCycleStructure } = useCycles();

  const [cycleName, setCycleName] = useState(cycleToEdit?.name || "");
  const [days, setDays] = useState(cycleToEdit?.days || [createEmptyDay(0)]);
  const [editingDay, setEditingDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddDay = () => {
    const newDay = createEmptyDay(days.length);
    setDays([...days, newDay]);
  };

  const handleDeleteDay = (dayId) => {
    const newDays = days
      .filter((d) => d.id !== dayId)
      .map((d, index) => ({ ...d, position: index }));
    setDays(newDays);
  };

  const handleMoveDay = (dayId, direction) => {
    const currentIndex = days.findIndex((d) => d.id === dayId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= days.length) return;

    const newDays = [...days];
    [newDays[currentIndex], newDays[newIndex]] = [
      newDays[newIndex],
      newDays[currentIndex],
    ];

    const reindexedDays = newDays.map((d, index) => ({
      ...d,
      position: index,
    }));
    setDays(reindexedDays);
  };

  const handleEditDay = (day) => {
    setEditingDay(day);
  };

  const handleSaveDay = (updatedDay) => {
    const newDays = days.map((d) => (d.id === updatedDay.id ? updatedDay : d));
    setDays(newDays);
    setEditingDay(null);
  };

  const handleCancelEditDay = () => {
    setEditingDay(null);
  };

  const handleSave = async () => {
    if (!cycleName.trim()) {
      setError("O ciclo precisa ter um nome");
      return;
    }

    if (days.length === 0) {
      setError("Adicione pelo menos um dia");
      return;
    }

    const invalidDays = days.filter((d) => !d.name.trim());
    if (invalidDays.length > 0) {
      setError("Todos os dias precisam ter nome");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ Garantir que steps e tips estão sendo enviados
      const cleanedDays = days.map((day) => ({
        ...day,
        exercises: day.exercises.map((ex) => ({
          id: ex.id,
          name: ex.name,
          setsReps: ex.setsReps,
          notes: ex.notes || "",
          steps: ex.steps || [], // ✅ Preservar steps
          tips: ex.tips || [], // ✅ Preservar tips
        })),
      }));

      if (cycleToEdit) {
        await updateCycleStructure(cycleToEdit.id, {
          name: cycleName,
          days: cleanedDays,
        });
      } else {
        await createCycle({
          name: cycleName,
          days: cleanedDays,
        });
      }

      navigate("/");
    } catch (err) {
      console.error("Error saving cycle:", err);
      setError(err.message || "Erro ao salvar treino");
    } finally {
      setLoading(false);
    }
  };

  if (editingDay) {
    return (
      <DayEditor
        day={editingDay}
        onSave={handleSaveDay}
        onCancel={handleCancelEditDay}
      />
    );
  }

  return (
    <div className="cycle-editor">
      <header className="editor-header">
        <div>
          <h1>{cycleToEdit ? "Editar Treino" : "Criar Novo Treino"}</h1>
          <p className="subtitle">
            {cycleToEdit
              ? "Atualize a estrutura do seu treino"
              : "Configure os dias e exercícios do seu ciclo"}
          </p>
        </div>
      </header>

      <div className="editor-content">
        <div className="form-section">
          <label className="form-label">
            <span>Nome do ciclo</span>
            <input
              type="text"
              value={cycleName}
              onChange={(e) => setCycleName(e.target.value)}
              placeholder="Ex: Treino ABC, Push Pull Legs, Upper Lower..."
              className="input-text"
              maxLength={100}
            />
            <small>Use um nome que faça sentido pra você</small>
          </label>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Dias do Ciclo</h2>
            <span className="badge">
              {days.length} {days.length === 1 ? "dia" : "dias"}
            </span>
          </div>

          {days.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum dia adicionado ainda.</p>
              <p className="small">Clique no botão abaixo para começar!</p>
            </div>
          ) : (
            <div className="days-list">
              {days.map((day, index) => (
                <div key={day.id} className="day-card">
                  <div className="day-info">
                    <div className="day-number">{index + 1}</div>
                    <div className="day-details">
                      <h3>{day.name || "Sem nome"}</h3>
                      <div className="day-meta">
                        <span
                          className={`type-badge ${
                            day.isMandatory ? "mandatory" : "free"
                          }`}
                        >
                          {day.isMandatory ? "Obrigatório" : "Opcional"}
                        </span>
                        <span className="exercises-count">
                          {day.exercises.length}{" "}
                          {day.exercises.length === 1
                            ? "exercício"
                            : "exercícios"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="day-actions">
                    {index > 0 && (
                      <button
                        className="btn-icon"
                        onClick={() => handleMoveDay(day.id, "up")}
                        title="Mover pra cima"
                      >
                        ↑
                      </button>
                    )}
                    {index < days.length - 1 && (
                      <button
                        className="btn-icon"
                        onClick={() => handleMoveDay(day.id, "down")}
                        title="Mover pra baixo"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      className="btn-icon primary"
                      onClick={() => handleEditDay(day)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDeleteDay(day.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="btn-add" onClick={handleAddDay}>
            + Adicionar dia
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="editor-actions">
          <button
            className="btn ghost"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="btn primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar treino"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CycleEditor;
