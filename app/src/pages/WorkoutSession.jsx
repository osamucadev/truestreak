import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCycles } from "../hooks/useCycles";
import { useWorkouts } from "../hooks/useWorkouts";
import "./WorkoutSession.scss";

const WorkoutSession = () => {
  const navigate = useNavigate();
  const { activeCycle, loading: cycleLoading } = useCycles();
  const { logWorkout, skipWorkout } = useWorkouts();

  const [currentDay, setCurrentDay] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedSteps, setExpandedSteps] = useState({});
  const [expandedTips, setExpandedTips] = useState({});
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [skipReason, setSkipReason] = useState(null);
  const [showNextDayDialog, setShowNextDayDialog] = useState(false);
  const [nextDayChoice, setNextDayChoice] = useState(null);

  useEffect(() => {
    if (activeCycle && !cycleLoading) {
      // Pegar o dia atual baseado no nextDayPosition (se tiver stats)
      // Por enquanto, pega o primeiro dia
      const day = activeCycle.days[0]; // TODO: usar stats.nextDayPosition
      setCurrentDay(day);

      // Inicializar exercícios como não completados
      const exercises = day.exercises.map((ex) => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        completed: false,
      }));
      setCompletedExercises(exercises);
    }
  }, [activeCycle, cycleLoading]);

  const toggleExercise = (exerciseId) => {
    setCompletedExercises((prev) =>
      prev.map((ex) =>
        ex.exerciseId === exerciseId ? { ...ex, completed: !ex.completed } : ex
      )
    );
  };

  const toggleSteps = (exerciseId) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const toggleTips = (exerciseId) => {
    setExpandedTips((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleFinishWorkout = async () => {
    const hasAnyCompleted = completedExercises.some((e) => e.completed);

    if (!hasAnyCompleted) {
      setError("Marque pelo menos 1 exercício como concluído");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await logWorkout(
        activeCycle.id,
        currentDay.id,
        completedExercises,
        notes
      );

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipClick = (reason) => {
    setSkipReason(reason);

    if (currentDay.isMandatory) {
      setShowNextDayDialog(true);
    } else {
      // Dia livre - só registra e vai pro próximo
      handleConfirmSkip(null);
    }
  };

  const handleConfirmSkip = async (choice) => {
    try {
      setLoading(true);
      setError("");

      const result = await skipWorkout(
        activeCycle.id,
        currentDay.id,
        skipReason,
        choice
      );

      if (result.streakBroken) {
        // Mostrar mensagem de streak quebrado
        alert("Sua streak foi zerada 😢");
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowNextDayDialog(false);
    }
  };

  if (cycleLoading || !currentDay) {
    return (
      <div className="workout-session">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando treino...</p>
        </div>
      </div>
    );
  }

  const completedCount = completedExercises.filter((e) => e.completed).length;
  const totalCount = completedExercises.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="workout-session">
      <header className="session-header">
        <button className="btn-back" onClick={() => navigate("/")}>
          ← Voltar
        </button>
        <div className="header-info">
          <h1>{currentDay.name}</h1>
          <div className="progress-info">
            <span
              className={`type-badge ${
                currentDay.isMandatory ? "mandatory" : "free"
              }`}
            >
              {currentDay.isMandatory ? "Obrigatório" : "Opcional"}
            </span>
            <span className="count">
              {completedCount}/{totalCount} exercícios
            </span>
          </div>
        </div>
      </header>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="session-content">
        <div className="exercises-list">
          {currentDay.exercises.map((exercise, index) => {
            const isCompleted = completedExercises.find(
              (e) => e.exerciseId === exercise.id
            )?.completed;

            return (
              <div
                key={exercise.id}
                className={`exercise-item ${isCompleted ? "completed" : ""}`}
              >
                <div className="exercise-main">
                  <label className="exercise-checkbox">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => toggleExercise(exercise.id)}
                    />
                    <span className="checkmark"></span>
                  </label>

                  <div className="exercise-info">
                    <h3>{exercise.name}</h3>
                    <p className="sets-reps">{exercise.setsReps}</p>
                    {exercise.notes && (
                      <p className="notes">{exercise.notes}</p>
                    )}
                  </div>
                </div>

                {exercise.steps && exercise.steps.length > 0 && (
                  <div className="collapsible-section">
                    <button
                      className="collapse-toggle"
                      onClick={() => toggleSteps(exercise.id)}
                    >
                      <span>📋 Passo a passo ({exercise.steps.length})</span>
                      <span className="icon">
                        {expandedSteps[exercise.id] ? "▼" : "▶"}
                      </span>
                    </button>
                    {expandedSteps[exercise.id] && (
                      <ol className="steps-list">
                        {exercise.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}

                {exercise.tips && exercise.tips.length > 0 && (
                  <div className="collapsible-section">
                    <button
                      className="collapse-toggle"
                      onClick={() => toggleTips(exercise.id)}
                    >
                      <span>💡 Dicas ({exercise.tips.length})</span>
                      <span className="icon">
                        {expandedTips[exercise.id] ? "▼" : "▶"}
                      </span>
                    </button>
                    {expandedTips[exercise.id] && (
                      <ul className="tips-list">
                        {exercise.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="notes-section">
          <label>
            <strong>Notas do treino (opcional)</strong>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como foi o treino? Alguma observação?"
              rows={3}
            />
          </label>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="session-actions">
          <button
            className="btn-skip cant"
            onClick={() => handleSkipClick("cant")}
            disabled={loading}
          >
            Não posso ir
          </button>
          <button
            className="btn-skip wont"
            onClick={() => handleSkipClick("wont")}
            disabled={loading}
          >
            Não quero ir
          </button>
          <button
            className="btn-finish"
            onClick={handleFinishWorkout}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Finalizar treino"}
          </button>
        </div>
      </div>

      {showNextDayDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Qual dia treinar amanhã?</h2>
            <p>Você pulou o treino de hoje. Escolha o que fazer amanhã:</p>

            <div className="dialog-options">
              <button
                className="dialog-btn"
                onClick={() => handleConfirmSkip(currentDay.position)}
              >
                Repetir hoje ({currentDay.name})
              </button>
              <button
                className="dialog-btn primary"
                onClick={() =>
                  handleConfirmSkip(
                    (currentDay.position + 1) % activeCycle.days.length
                  )
                }
              >
                Próximo dia (
                {
                  activeCycle.days[
                    (currentDay.position + 1) % activeCycle.days.length
                  ].name
                }
                )
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutSession;
