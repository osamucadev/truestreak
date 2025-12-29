// app/src/pages/Stats.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkouts } from "../hooks/useWorkouts";
import "./Stats.scss";

const Stats = () => {
  const navigate = useNavigate();
  const { stats, history, loading, loadHistory } = useWorkouts();
  const [calculatedStats, setCalculatedStats] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    loadHistory(100);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!stats || history.length === 0) {
        // Usuário sem treinos - mostrar empty state
        setIsEmpty(true);
        setCalculatedStats(getEmptyStats());
      } else {
        // Usuário com treinos - calcular stats
        setIsEmpty(false);
        calculateAdvancedStats();
      }
    }
  }, [stats, history, loading]);

  const getEmptyStats = () => {
    return {
      weekProgress: ["none", "none", "none", "none", "none", "none", "none"],
      completionRate: 0,
      totalExercises: 0,
      weekdayCounts: [0, 0, 0, 0, 0, 0, 0],
      maxWorkouts: 1,
      avgDaysBetween: 0,
      perfectWeeks: 0,
      bestMonth: null,
      mandatoryRate: 0,
      topExercise: null,
      cantPercent: 0,
      wontPercent: 0,
      recoveryRate: 0,
      calendar28: getLast28DaysCalendar([]),
      consistencyScore: 0,
      daysSinceLastWorkout: 999,
    };
  };

  const calculateAdvancedStats = () => {
    // Progresso últimos 7 dias
    const last7Days = getLast7Days();
    const weekProgress = last7Days.map((date) => {
      const workout = history.find(
        (w) => new Date(w.date).toDateString() === date.toDateString()
      );
      return workout
        ? workout.wasFullyCompleted
          ? "full"
          : "partial"
        : "none";
    });

    // Taxa de conclusão
    const completedWorkouts = history.filter((w) => w.wasFullyCompleted).length;
    const completionRate =
      history.length > 0
        ? Math.round((completedWorkouts / history.length) * 100)
        : 0;

    // Total de exercícios
    const totalExercises = history.reduce((sum, w) => {
      return (
        sum + (w.completedExercises?.filter((e) => e.completed).length || 0)
      );
    }, 0);

    // Dias da semana mais ativos
    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
    history.forEach((w) => {
      const day = new Date(w.date).getDay();
      weekdayCounts[day]++;
    });
    const maxWorkouts = Math.max(...weekdayCounts, 1);

    // Tempo médio entre treinos
    const avgDaysBetween =
      history.length > 1
        ? Math.round(
            ((new Date(history[0].date) -
              new Date(history[history.length - 1].date)) /
              (1000 * 60 * 60 * 24) /
              history.length) *
              10
          ) / 10
        : 0;

    // Semanas perfeitas
    const perfectWeeks = countPerfectWeeks();

    // Melhor mês
    const bestMonth = getBestMonth();

    // Taxa obrigatórios
    const mandatoryWorkouts = history.filter((w) => w.wasMandatory);
    const mandatoryCompleted = mandatoryWorkouts.filter(
      (w) => !w.skippedReason
    ).length;
    const mandatoryRate =
      mandatoryWorkouts.length > 0
        ? Math.round((mandatoryCompleted / mandatoryWorkouts.length) * 100)
        : 0;

    // Exercício mais frequente
    const exerciseCounts = {};
    history.forEach((w) => {
      w.completedExercises?.forEach((e) => {
        if (e.completed) {
          exerciseCounts[e.exerciseName] =
            (exerciseCounts[e.exerciseName] || 0) + 1;
        }
      });
    });
    const topExercise = Object.entries(exerciseCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    // Taxa de "não posso" vs "não quero"
    const skipped = history.filter((w) => w.skippedReason);
    const cantCount = skipped.filter((w) => w.skippedReason === "cant").length;
    const wontCount = skipped.filter((w) => w.skippedReason === "wont").length;
    const cantPercent =
      skipped.length > 0 ? Math.round((cantCount / skipped.length) * 100) : 0;

    // Recovery rate
    const recoveryRate = calculateRecoveryRate();

    // Calendário 28 dias
    const calendar28 = getLast28DaysCalendar(history);

    // Consistency score
    const consistencyScore = calculateConsistencyScore(
      completionRate,
      weekProgress.filter((d) => d !== "none").length,
      cantPercent
    );

    // Dias desde último treino
    const daysSinceLastWorkout =
      history.length > 0
        ? Math.floor(
            (new Date() - new Date(history[0].date)) / (1000 * 60 * 60 * 24)
          )
        : 999;

    setCalculatedStats({
      weekProgress,
      completionRate,
      totalExercises,
      weekdayCounts,
      maxWorkouts,
      avgDaysBetween,
      perfectWeeks,
      bestMonth,
      mandatoryRate,
      topExercise,
      cantPercent,
      wontPercent: 100 - cantPercent,
      recoveryRate,
      calendar28,
      consistencyScore,
      daysSinceLastWorkout,
    });
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const countPerfectWeeks = () => {
    let perfectWeeks = 0;
    const sortedHistory = [...history].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    for (let i = 0; i < sortedHistory.length - 6; i++) {
      const weekStart = new Date(sortedHistory[i].date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekWorkouts = sortedHistory.filter((w) => {
        const date = new Date(w.date);
        return date >= weekStart && date <= weekEnd;
      });

      if (weekWorkouts.length === 7) perfectWeeks++;
    }

    return perfectWeeks;
  };

  const getBestMonth = () => {
    if (history.length === 0) return null;

    const monthCounts = {};
    history.forEach((w) => {
      const date = new Date(w.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    });

    const best = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0];
    if (!best) return null;

    const [year, month] = best[0].split("-");
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return {
      name: `${monthNames[parseInt(month)]} ${year}`,
      count: best[1],
    };
  };

  const calculateRecoveryRate = () => {
    if (history.length < 2) return 0;

    const breaks = [];
    const sortedHistory = [...history].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    for (let i = 0; i < sortedHistory.length - 1; i++) {
      const current = new Date(sortedHistory[i].date);
      const next = new Date(sortedHistory[i + 1].date);
      const daysDiff = Math.floor((next - current) / (1000 * 60 * 60 * 24));

      if (daysDiff > 2) {
        breaks.push(daysDiff);
      }
    }

    return breaks.length > 0
      ? Math.round((breaks.reduce((a, b) => a + b, 0) / breaks.length) * 10) /
          10
      : 0;
  };

  const getLast28DaysCalendar = (workoutHistory) => {
    const calendar = [];
    for (let i = 27; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();

      const workout = workoutHistory.find(
        (w) => new Date(w.date).toDateString() === dateStr
      );

      let status = "none";
      if (workout) {
        if (workout.skippedReason === "wont") status = "broke";
        else if (workout.wasFullyCompleted) status = "full";
        else if (workout.completedExercises?.some((e) => e.completed))
          status = "partial";
      }

      calendar.push({ date, status });
    }
    return calendar;
  };

  const calculateConsistencyScore = (
    completionRate,
    weeklyDays,
    cantPercent
  ) => {
    const streakScore =
      stats.longestStreak > 0
        ? (stats.currentStreak / stats.longestStreak) * 40
        : 0;
    const completionScore = (completionRate / 100) * 30;
    const frequencyScore = (weeklyDays / 7) * 20;
    const disciplineScore = (cantPercent / 100) * 10;

    return Math.round(
      streakScore + completionScore + frequencyScore + disciplineScore
    );
  };

  const getMotivationalMessage = () => {
    if (!stats || !calculatedStats) return null;

    // Usuário novo sem treinos
    if (isEmpty) {
      return {
        icon: "🌱",
        title: "Sua jornada começa aqui!",
        text: "Você ainda não tem treinos registrados. Crie seu primeiro ciclo e comece a construir sua constância real. Cada grande jornada começa com um único passo.",
      };
    }

    const { currentStreak, longestStreak, totalWorkouts } = stats;
    const {
      completionRate,
      daysSinceLastWorkout,
      cantPercent,
      consistencyScore,
    } = calculatedStats;

    // Treinou hoje
    if (daysSinceLastWorkout === 0) {
      return {
        icon: "💪",
        title: "Mais um dia vencido!",
        text: "Enquanto outros procrastinam, você age. Seu eu de amanhã agradece por não ter desistido hoje.",
      };
    }

    // Novo recorde de streak
    if (currentStreak === longestStreak && currentStreak > 7) {
      return {
        icon: "🏆",
        title: "NOVO RECORDE PESSOAL!",
        text: `${currentStreak} dias é seu melhor resultado até agora. Você está evoluindo, e isso não é sorte — é trabalho.`,
      };
    }

    // Streak alto
    if (currentStreak > 14) {
      return {
        icon: "🔥",
        title: "Você está em chamas!",
        text: `${currentStreak} dias seguidos é coisa de quem leva a sério. Continue assim e você vai quebrar seu próprio recorde de ${longestStreak} dias.`,
      };
    }

    // Alta conclusão
    if (completionRate > 85) {
      return {
        icon: "⭐",
        title: "Disciplina exemplar!",
        text: `${completionRate}% de conclusão não mente. Você não está só fazendo treinos, você está construindo disciplina real. Parabéns!`,
      };
    }

    // Recomeçando
    if (currentStreak < 3 && longestStreak > 20) {
      return {
        icon: "🌱",
        title: "Recomeçar é parte da jornada",
        text: `Você já provou que consegue (${longestStreak} dias!), agora é só voltar ao ritmo. Um dia de cada vez.`,
      };
    }

    // Parado há dias
    if (daysSinceLastWorkout >= 3) {
      return {
        icon: "⏰",
        title: "Sentimos sua falta!",
        text: `Já faz ${daysSinceLastWorkout} dias... Que tal começar pequeno hoje? Até 10 minutos conta. O importante é não deixar virar hábito de parar.`,
      };
    }

    // Muitos "não posso"
    if (cantPercent > 70 && totalWorkouts > 10) {
      return {
        icon: "🎯",
        title: "Você tem vontade!",
        text: `${cantPercent}% dos seus skips são por motivo real (não posso). Isso mostra que você tem disciplina — só precisava da oportunidade. Continue assim!`,
      };
    }

    // Consistency alto
    if (consistencyScore > 80) {
      return {
        icon: "💎",
        title: "Consistência de diamante!",
        text: `Score de ${consistencyScore}/100. Você não está brincando de treinar, você está construindo um estilo de vida. Inspirador!`,
      };
    }

    // Mensagem padrão
    return {
      icon: "💪",
      title: "Continue sua jornada!",
      text: `${totalWorkouts} treinos completos. Cada um deles te trouxe até aqui. Continue, a constância é seu superpoder.`,
    };
  };

  const getScoreEmoji = (score) => {
    if (score >= 90) return "💎";
    if (score >= 80) return "⭐";
    if (score >= 70) return "🔥";
    if (score >= 60) return "👍";
    if (score >= 50) return "💪";
    return "🌱";
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "Lendário!";
    if (score >= 80) return "Excelente!";
    if (score >= 70) return "Muito bom!";
    if (score >= 60) return "Bom!";
    if (score >= 50) return "No caminho!";
    return "Começando!";
  };

  const getBadges = () => {
    if (!stats || isEmpty) return [];

    const badges = [];
    const { currentStreak, longestStreak, totalWorkouts, level } = stats;
    const { completionRate, perfectWeeks, totalExercises } = calculatedStats;

    if (totalWorkouts >= 1)
      badges.push({
        icon: "🏆",
        title: "Primeiro Treino",
        desc: "A jornada começou",
      });
    if (currentStreak >= 7 || longestStreak >= 7)
      badges.push({
        icon: "🔥",
        title: "Streak de 7",
        desc: "Uma semana seguida",
      });
    if (currentStreak >= 30 || longestStreak >= 30)
      badges.push({
        icon: "💪",
        title: "Streak de 30",
        desc: "Um mês de fogo",
      });
    if (perfectWeeks > 0)
      badges.push({
        icon: "🌟",
        title: "Semana Perfeita",
        desc: "7/7 dias completos",
      });
    if (totalWorkouts >= 50)
      badges.push({
        icon: "⭐",
        title: "50 Treinos",
        desc: "Metade do caminho",
      });
    if (totalWorkouts >= 100)
      badges.push({
        icon: "🚀",
        title: "100 Treinos",
        desc: "Centena alcançada",
      });
    if (level >= 10)
      badges.push({ icon: "🎯", title: "Level 10+", desc: "Nível avançado" });
    if (completionRate >= 90)
      badges.push({
        icon: "💎",
        title: "Taxa 90%+",
        desc: "Conclusão exemplar",
      });
    if (totalExercises >= 500)
      badges.push({ icon: "🦾", title: "500 Exercícios", desc: "Meio milhar" });
    if (currentStreak >= 100 || longestStreak >= 100)
      badges.push({
        icon: "👑",
        title: "Streak 100",
        desc: "Cem dias de glória",
      });

    return badges;
  };

  if (loading || !calculatedStats) {
    return (
      <div className="stats-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando suas estatísticas...</p>
        </div>
      </div>
    );
  }

  // Empty state para usuários sem treinos
  if (isEmpty) {
    return (
      <div className="stats-page">
        <header className="stats-header">
          <button className="btn-back" onClick={() => navigate("/")}>
            ← Voltar
          </button>
          <div className="header-info">
            <h1>Suas Estatísticas</h1>
            <p className="subtitle">Comece sua jornada para ver seus dados</p>
          </div>
        </header>

        <div className="stats-empty-state">
          <div className="empty-icon">📊</div>
          <h2>Ainda não há dados para mostrar</h2>
          <p>
            Você ainda não registrou nenhum treino. Crie seu primeiro ciclo e
            comece a treinar para ver suas estatísticas aparecerem aqui!
          </p>
          <button className="btn-create" onClick={() => navigate("/")}>
            Ir para o Dashboard
          </button>
        </div>
      </div>
    );
  }

  const motivationalMsg = getMotivationalMessage();
  const weekdayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const badges = getBadges();

  return (
    <div className="stats-page">
      <header className="stats-header">
        <button className="btn-back" onClick={() => navigate("/")}>
          ← Voltar
        </button>
        <div className="header-info">
          <h1>Suas Estatísticas</h1>
          <p className="subtitle">
            Acompanhe sua evolução e celebre suas conquistas
          </p>
        </div>
      </header>

      {motivationalMsg && (
        <div className="motivational-hero">
          <div className="hero-icon">{motivationalMsg.icon}</div>
          <h2>{motivationalMsg.title}</h2>
          <p>{motivationalMsg.text}</p>
        </div>
      )}

      <div className="stats-main-grid">
        <div className="stat-card big">
          <div className="card-header">
            <span className="card-icon">🔥</span>
            <span className="card-label">Streak Atual</span>
          </div>
          <div className="card-value">{stats.currentStreak}</div>
          <div className="card-footer">dias seguidos</div>
        </div>

        <div className="stat-card big">
          <div className="card-header">
            <span className="card-icon">🏆</span>
            <span className="card-label">Recorde</span>
          </div>
          <div className="card-value">{stats.longestStreak}</div>
          <div className="card-footer">melhor streak</div>
        </div>

        <div className="stat-card big">
          <div className="card-header">
            <span className="card-icon">💪</span>
            <span className="card-label">Treinos</span>
          </div>
          <div className="card-value">{stats.totalWorkouts}</div>
          <div className="card-footer">completos</div>
        </div>

        <div className="stat-card big completion">
          <div className="card-header">
            <span className="card-icon">✅</span>
            <span className="card-label">Conclusão</span>
          </div>
          <div className="completion-chart">
            <svg viewBox="0 0 100 100" className="donut-chart">
              <circle cx="50" cy="50" r="40" className="donut-bg" />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="donut-fill"
                strokeDasharray={`${calculatedStats.completionRate * 2.51} 251`}
              />
            </svg>
            <div className="completion-value">
              {calculatedStats.completionRate}%
            </div>
          </div>
        </div>
      </div>

      <div className="respiro-message">
        <p>💫 Constância sem culpa. Cada treino é uma vitória.</p>
      </div>

      <div className="stats-advanced-grid">
        <div className="stat-card">
          <div className="card-header">
            <span className="card-icon">📅</span>
            <span className="card-label">Últimos 7 Dias</span>
          </div>
          <div className="week-progress">
            {calculatedStats.weekProgress.map((status, i) => (
              <div
                key={i}
                className={`day-dot ${status}`}
                title={weekdayNames[(new Date().getDay() - 6 + i + 7) % 7]}
              >
                <span className="day-label">
                  {weekdayNames[(new Date().getDay() - 6 + i + 7) % 7]}
                </span>
              </div>
            ))}
          </div>
          <div className="card-footer">
            {calculatedStats.weekProgress.filter((d) => d !== "none").length}/7
            dias esta semana
          </div>
        </div>

        <div className="stat-card">
          <div className="card-header">
            <span className="card-icon">⭐</span>
            <span className="card-label">XP & Level</span>
          </div>
          <div className="level-display">
            <div className="level-number">Level {stats.level}</div>
            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{ width: `${stats.xp % 100}%` }}
              ></div>
            </div>
            <div className="xp-text">{stats.xp % 100}/100 XP</div>
          </div>
          <div className="card-footer">
            Faltam {100 - (stats.xp % 100)} XP para Level {stats.level + 1}
          </div>
        </div>

        <div className="stat-card">
          <div className="card-header">
            <span className="card-icon">🏋️</span>
            <span className="card-label">Total de Exercícios</span>
          </div>
          <div className="card-value small">
            {calculatedStats.totalExercises}
          </div>
          <div className="card-footer">exercícios completados</div>
        </div>

        <div className="stat-card">
          <div className="card-header">
            <span className="card-icon">⏱️</span>
            <span className="card-label">Frequência</span>
          </div>
          <div className="card-value small">
            {calculatedStats.avgDaysBetween}
          </div>
          <div className="card-footer">dias entre treinos</div>
        </div>

        <div className="stat-card">
          <div className="card-header">
            <span className="card-icon">🌟</span>
            <span className="card-label">Semanas Perfeitas</span>
          </div>
          <div className="card-value small">{calculatedStats.perfectWeeks}</div>
          <div className="card-footer">7/7 dias completos</div>
        </div>

        {calculatedStats.bestMonth && (
          <div className="stat-card">
            <div className="card-header">
              <span className="card-icon">📅</span>
              <span className="card-label">Melhor Mês</span>
            </div>
            <div className="best-month">
              <div className="month-name">{calculatedStats.bestMonth.name}</div>
              <div className="month-count">
                {calculatedStats.bestMonth.count} treinos
              </div>
            </div>
          </div>
        )}

        <div className="stat-card">
          <div className="card-header">
            <span className="card-icon">🎯</span>
            <span className="card-label">Dias Obrigatórios</span>
          </div>
          <div className="card-value small">
            {calculatedStats.mandatoryRate}%
          </div>
          <div className="card-footer">cumprimento</div>
        </div>

        {calculatedStats.topExercise && (
          <div className="stat-card">
            <div className="card-header">
              <span className="card-icon">🔝</span>
              <span className="card-label">Exercício Top</span>
            </div>
            <div className="top-exercise">
              <div className="exercise-name">
                {calculatedStats.topExercise[0]}
              </div>
              <div className="exercise-count">
                {calculatedStats.topExercise[1]}× realizado
              </div>
            </div>
          </div>
        )}

        <div className="stat-card">
          <div className="card-header">
            <span className="card-icon">⚖️</span>
            <span className="card-label">Motivos de Skip</span>
          </div>
          <div className="skip-breakdown">
            <div className="skip-item">
              <span className="skip-label">Não posso</span>
              <span className="skip-value">{calculatedStats.cantPercent}%</span>
            </div>
            <div className="skip-item">
              <span className="skip-label">Não quero</span>
              <span className="skip-value">{calculatedStats.wontPercent}%</span>
            </div>
          </div>
        </div>

        {calculatedStats.recoveryRate > 0 && (
          <div className="stat-card">
            <div className="card-header">
              <span className="card-icon">🔄</span>
              <span className="card-label">Recuperação</span>
            </div>
            <div className="card-value small">
              {calculatedStats.recoveryRate}
            </div>
            <div className="card-footer">dias pra voltar após parar</div>
          </div>
        )}
      </div>

      <div className="calendar-section">
        <h3>
          <span className="section-icon">🗓️</span>
          Últimos 28 Dias
        </h3>
        <div className="calendar-grid">
          {calculatedStats.calendar28.map((day, i) => (
            <div
              key={i}
              className={`calendar-day ${day.status}`}
              title={day.date.toLocaleDateString("pt-BR")}
            />
          ))}
        </div>
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-dot full"></div>
            <span>Completo</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot partial"></div>
            <span>Parcial</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot none"></div>
            <span>Não treinou</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot broke"></div>
            <span>Quebrou streak</span>
          </div>
        </div>
      </div>

      <div className="weekday-chart-section">
        <h3>
          <span className="section-icon">📊</span>
          Dias da Semana Mais Ativos
        </h3>
        <div className="weekday-bars">
          {weekdayNames.map((day, i) => (
            <div key={i} className="weekday-item">
              <div className="weekday-label">{day}</div>
              <div className="weekday-bar-container">
                <div
                  className="weekday-bar"
                  style={{
                    width: `${
                      (calculatedStats.weekdayCounts[i] /
                        calculatedStats.maxWorkouts) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="weekday-count">
                {calculatedStats.weekdayCounts[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="respiro-message">
        <p>🎯 Progresso {">"} Perfeição. Continue no seu ritmo.</p>
      </div>

      <div className="consistency-section">
        <div className="consistency-card">
          <div className="consistency-icon">
            {getScoreEmoji(calculatedStats.consistencyScore)}
          </div>
          <h3>Consistency Score</h3>
          <div className="consistency-value">
            {calculatedStats.consistencyScore}/100
          </div>
          <div className="consistency-label">
            {getScoreLabel(calculatedStats.consistencyScore)}
          </div>
          <div className="consistency-bar">
            <div
              className="consistency-fill"
              style={{ width: `${calculatedStats.consistencyScore}%` }}
            />
          </div>
        </div>
      </div>

      {badges.length > 0 && (
        <div className="badges-section">
          <h3>
            <span className="section-icon">🏆</span>
            Conquistas Desbloqueadas
          </h3>
          <div className="badges-grid">
            {badges.map((badge, i) => (
              <div key={i} className="badge-card">
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-title">{badge.title}</div>
                <div className="badge-desc">{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="closing-message">
        <p>💪 Continue assim! Seu próximo treino te espera. Vamos nessa?</p>
        <button className="btn-primary" onClick={() => navigate("/")}>
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
};

export default Stats;
