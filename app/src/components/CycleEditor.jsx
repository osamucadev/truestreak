// app/src/components/CycleEditor.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCycles } from "../hooks/useCycles";
import { createEmptyDay } from "../utils/cycleUtils";
import DayEditor from "./DayEditor";
import "./CycleEditor.scss";

const CycleEditor = ({ cycleToEdit }) => {
  const navigate = useNavigate();
  const { createCycle, updateCycleStructure } = useCycles();

  const [cycleName, setCycleName] = useState(cycleToEdit?.name || "");
  const [days, setDays] = useState(cycleToEdit?.days || [createEmptyDay(0)]);
  const [editingDay, setEditingDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados para importação/exportação JSON
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

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

  // Função para importar treino a partir de JSON
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      // Validação básica da estrutura
      if (!parsed.name || !Array.isArray(parsed.days)) {
        setError("JSON inválido: precisa ter 'name' e 'days' (array)");
        return;
      }

      // Valida e processa cada dia
      const validatedDays = parsed.days.map((day, index) => {
        if (!day.name) {
          throw new Error(`Dia ${index + 1} precisa ter um nome`);
        }

        if (!Array.isArray(day.exercises)) {
          throw new Error(`Dia "${day.name}" precisa ter 'exercises' (array)`);
        }

        return {
          id: `day-${Date.now()}-${index}`,
          name: day.name,
          position: index,
          isMandatory: day.isMandatory ?? true,
          exercises: day.exercises.map((ex, exIndex) => {
            if (!ex.name) {
              throw new Error(
                `Exercício ${exIndex + 1} do dia "${day.name}" precisa ter nome`
              );
            }

            return {
              id: `ex-${Date.now()}-${index}-${exIndex}`,
              name: ex.name,
              setsReps: ex.setsReps || "",
              notes: ex.notes || "",
              steps: ex.steps || [],
              tips: ex.tips || [],
            };
          }),
        };
      });

      // Aplica os dados importados
      setCycleName(parsed.name);
      setDays(validatedDays);
      setJsonInput("");
      setShowJsonImport(false);
      setError("");
    } catch (err) {
      setError(`Erro ao importar JSON: ${err.message}`);
    }
  };

  // Função para exportar o treino atual como JSON
  const handleExportJson = () => {
    const exportData = {
      name: cycleName,
      days: days.map((day) => ({
        name: day.name,
        isMandatory: day.isMandatory,
        exercises: day.exercises.map((ex) => ({
          name: ex.name,
          setsReps: ex.setsReps,
          notes: ex.notes,
          steps: ex.steps,
          tips: ex.tips,
        })),
      })),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    navigator.clipboard.writeText(jsonString);
    alert("JSON copiado para a área de transferência!");
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

    const daysWithInvalidExercises = days.filter((day) =>
      day.exercises.some((ex) => !ex.name.trim())
    );
    if (daysWithInvalidExercises.length > 0) {
      setError("Todos os exercícios precisam ter nome");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const cleanedDays = days.map((day, index) => ({
        id: day.id,
        name: day.name.trim(),
        position: index,
        isMandatory: day.isMandatory,
        exercises: day.exercises.map((ex) => ({
          id: ex.id,
          name: ex.name.trim(),
          setsReps: ex.setsReps?.trim() || "",
          notes: ex.notes?.trim() || "",
          steps: ex.steps || [],
          tips: ex.tips || [],
        })),
      }));

      if (cycleToEdit) {
        await updateCycleStructure(cycleToEdit.id, {
          name: cycleName.trim(),
          days: cleanedDays,
        });
      } else {
        await createCycle({
          name: cycleName.trim(),
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

        {/* Seção de Importar/Exportar JSON */}
        <div className="form-section">
          <div className="section-header">
            <h2>Importar/Exportar</h2>
          </div>

          <div className="import-export-actions">
            <button
              className="btn ghost"
              onClick={() => setShowJsonImport(!showJsonImport)}
              type="button"
            >
              {showJsonImport ? "✕ Fechar" : "📋 Importar JSON"}
            </button>

            {(cycleName || days.length > 0) && (
              <button
                className="btn ghost"
                onClick={handleExportJson}
                type="button"
              >
                💾 Exportar JSON
              </button>
            )}
          </div>

          {showJsonImport && (
            <div className="json-import-area">
              <label className="form-label">
                <span>Cole o JSON do treino</span>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='{"name": "Treino ABC", "days": [...]}'
                  className="input-textarea"
                  rows={10}
                />
                <small>
                  Cole a estrutura completa do treino em formato JSON
                </small>
              </label>

              <button
                className="btn primary"
                onClick={handleImportJson}
                type="button"
              >
                Importar
              </button>
            </div>
          )}
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
                      title="Editar dia"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => handleDeleteDay(day.id)}
                      title="Excluir dia"
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
