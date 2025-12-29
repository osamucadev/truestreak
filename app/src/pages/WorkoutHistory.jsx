// app/src/pages/WorkoutHistory.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkouts } from "../hooks/useWorkouts";
import "./WorkoutHistory.scss";

const WorkoutHistory = () => {
  const navigate = useNavigate();
  const { history, loading, loadHistory } = useWorkouts();
  const [filter, setFilter] = useState("all"); // all, completed, skipped

  useEffect(() => {
    loadHistory(50); // Carregar últimos 50 treinos
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Hoje";
    if (isYesterday) return "Ontem";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getWorkoutIcon = (workout) => {
    if (workout.skippedReason === "cant") return "🚫";
    if (workout.skippedReason === "wont") return "💔";
    if (workout.wasFullyCompleted) return "✅";
    return "✓";
  };

  const getWorkoutStatus = (workout) => {
    if (workout.skippedReason === "cant") return "Não pôde ir";
    if (workout.skippedReason === "wont") return "Não quis ir";

    const completed =
      workout.completedExercises?.filter((e) => e.completed).length || 0;
    const total = workout.completedExercises?.length || 0;

    if (completed === 0) return "Pulado";
    if (completed === total) return "Completo";
    return `${completed}/${total} exercícios`;
  };

  const filteredHistory = history.filter((workout) => {
    if (filter === "all") return true;
    if (filter === "completed") {
      return workout.completedExercises?.some((e) => e.completed);
    }
    if (filter === "skipped") {
      return (
        workout.skippedReason ||
        !workout.completedExercises?.some((e) => e.completed)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="workout-history">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-history">
      <header className="history-header">
        <button className="btn-back" onClick={() => navigate("/")}>
          ← Voltar
        </button>
        <div className="header-info">
          <h1>Histórico de Treinos</h1>
          <p className="subtitle">
            {history.length}{" "}
            {history.length === 1 ? "treino registrado" : "treinos registrados"}
          </p>
        </div>
      </header>

      <div className="history-content">
        <div className="filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completos
          </button>
          <button
            className={`filter-btn ${filter === "skipped" ? "active" : ""}`}
            onClick={() => setFilter("skipped")}
          >
            Pulados
          </button>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📭</div>
            <h2>Nenhum treino encontrado</h2>
            <p>
              {filter === "all"
                ? "Comece sua jornada fazendo seu primeiro treino!"
                : "Nenhum treino encontrado com esse filtro."}
            </p>
          </div>
        ) : (
          <div className="timeline">
            {filteredHistory.map((workout, index) => (
              <div key={workout.id} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  {index < filteredHistory.length - 1 && (
                    <div className="marker-line"></div>
                  )}
                </div>

                <div
                  className={`workout-card ${
                    workout.skippedReason ? "skipped" : ""
                  }`}
                >
                  <div className="workout-header">
                    <div className="workout-icon">
                      {getWorkoutIcon(workout)}
                    </div>
                    <div className="workout-info">
                      <h3>{workout.dayName}</h3>
                      <p className="workout-date">{formatDate(workout.date)}</p>
                    </div>
                    <div className="workout-badges">
                      {workout.wasMandatory && (
                        <span className="badge mandatory">Obrigatório</span>
                      )}
                      {!workout.wasMandatory && (
                        <span className="badge free">Opcional</span>
                      )}
                    </div>
                  </div>

                  <div className="workout-status">
                    <span
                      className={`status-text ${
                        workout.skippedReason ? "skipped" : "completed"
                      }`}
                    >
                      {getWorkoutStatus(workout)}
                    </span>
                  </div>

                  {workout.notes && (
                    <div className="workout-notes">
                      <strong>Notas:</strong> {workout.notes}
                    </div>
                  )}

                  {workout.completedExercises &&
                    workout.completedExercises.length > 0 && (
                      <details className="workout-details">
                        <summary>Ver exercícios</summary>
                        <ul className="exercises-list">
                          {workout.completedExercises.map((ex, i) => (
                            <li
                              key={i}
                              className={ex.completed ? "completed" : "skipped"}
                            >
                              <span className="exercise-icon">
                                {ex.completed ? "✓" : "○"}
                              </span>
                              <span className="exercise-name">
                                {ex.exerciseName}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;
