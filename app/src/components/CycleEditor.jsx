import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCycles } from "../hooks/useCycles";
import DayEditor from "./DayEditor";
import "./CycleEditor.scss";

// Helper: Criar dia vazio
const createEmptyDay = (position) => {
  return {
    id: `day-${Date.now()}-${position}`,
    position,
    name: `Dia ${position + 1}`,
    isMandatory: true,
    exercises: [],
  };
};

const CycleEditor = ({ cycleToEdit = null, onSave, onCancel }) => {
  const navigate = useNavigate();
  const { createCycle, updateCycleStructure } = useCycles();

  const [cycleName, setCycleName] = useState("");
  const [days, setDays] = useState([]);
  const [editingDay, setEditingDay] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Carregar dados se for edição
  useEffect(() => {
    if (cycleToEdit) {
      setCycleName(cycleToEdit.name);
      setDays(cycleToEdit.days || []);
    } else {
      // Novo ciclo: começar com 1 dia vazio
      setDays([createEmptyDay(0)]);
    }
  }, [cycleToEdit]);

  const handleAddDay = () => {
    const newDay = createEmptyDay(days.length);
    setDays([...days, newDay]);
  };

  const handleEditDay = (dayId) => {
    const day = days.find((d) => d.id === dayId);
    setEditingDay(day);
  };

  const handleSaveDay = (updatedDay) => {
    setDays(days.map((d) => (d.id === updatedDay.id ? updatedDay : d)));
    setEditingDay(null);
  };

  const handleDeleteDay = (dayId) => {
    if (days.length === 1) {
      setError("O treino precisa ter pelo menos 1 dia");
      return;
    }

    const updatedDays = days
      .filter((d) => d.id !== dayId)
      .map((d, index) => ({ ...d, position: index })); // Reordenar

    setDays(updatedDays);
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

    // Atualizar positions
    const reordered = newDays.map((d, index) => ({ ...d, position: index }));
    setDays(reordered);
  };

  const handleSave = async () => {
    // Validações
    if (!cycleName.trim()) {
      setError("O treino precisa ter um nome");
      return;
    }

    if (days.length === 0) {
      setError("O treino precisa ter pelo menos 1 dia");
      return;
    }

    // Verificar se todos os dias têm nome
    const invalidDays = days.filter((d) => !d.name.trim());
    if (invalidDays.length > 0) {
      setError("Todos os dias precisam ter um nome");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const cycleData = {
        name: cycleName,
        days: days,
      };

      if (cycleToEdit) {
        // Atualizar (gera nova versão)
        await updateCycleStructure(cycleToEdit.id, cycleData);
      } else {
        // Criar novo
        await createCycle(cycleData);
      }

      if (onSave) {
        onSave();
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Erro ao salvar treino. Tente novamente.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/");
    }
  };

  if (editingDay) {
    return (
      <DayEditor
        day={editingDay}
        onSave={handleSaveDay}
        onCancel={() => setEditingDay(null)}
      />
    );
  }

  return (
    <div className="cycle-editor">
      <header className="editor-header glass">
        <div>
          <h1>{cycleToEdit ? "Editar Treino" : "Criar Treino"}</h1>
          <p className="subtitle">
            {cycleToEdit
              ? "Ao salvar, uma nova versão será criada"
              : "Crie seu ciclo de treinos personalizado"}
          </p>
        </div>
      </header>

      <div className="editor-content">
        {/* Nome do treino */}
        <div className="form-section glass">
          <label className="form-label">
            <span>Nome do treino</span>
            <input
              type="text"
              value={cycleName}
              onChange={(e) => setCycleName(e.target.value)}
              placeholder="Ex: Treino ABC, Push Pull Legs..."
              className="input-text"
              maxLength={50}
            />
            <small>Escolha um nome que faça sentido pra você</small>
          </label>
        </div>

        {/* Lista de dias */}
        <div className="form-section">
          <div className="section-header">
            <h2>Dias do treino</h2>
            <span className="badge">
              {days.length} {days.length === 1 ? "dia" : "dias"}
            </span>
          </div>

          <div className="days-list">
            {days.map((day, index) => (
              <div key={day.id} className="day-card glass">
                <div className="day-info">
                  <div className="day-number">Dia {index + 1}</div>
                  <div className="day-details">
                    <h3>{day.name || "Sem nome"}</h3>
                    <div className="day-meta">
                      <span
                        className={`type-badge ${
                          day.isMandatory ? "mandatory" : "free"
                        }`}
                      >
                        {day.isMandatory ? "⚡ Obrigatório" : "🌟 Livre"}
                      </span>
                      <span className="exercises-count">
                        {day.exercises?.length || 0} exercícios
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
                    onClick={() => handleEditDay(day.id)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDeleteDay(day.id)}
                    disabled={days.length === 1}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-add" onClick={handleAddDay}>
            + Adicionar dia
          </button>
        </div>

        {/* Mensagem de erro */}
        {error && <div className="error-message">{error}</div>}

        {/* Ações */}
        <div className="editor-actions">
          <button
            className="btn ghost"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            className="btn primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar treino"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CycleEditor;
