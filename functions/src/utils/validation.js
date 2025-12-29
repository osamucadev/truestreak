// functions\src\utils
function validateCycleName(name) {
  if (!name || typeof name !== "string" || !name.trim()) {
    return { valid: false, error: "Nome do ciclo é obrigatório" };
  }

  if (name.length > 100) {
    return { valid: false, error: "Nome muito longo (máximo 100 caracteres)" };
  }

  return { valid: true };
}

function validateExercise(exercise) {
  if (
    !exercise.name ||
    typeof exercise.name !== "string" ||
    !exercise.name.trim()
  ) {
    return { valid: false, error: "Nome do exercício é obrigatório" };
  }

  if (exercise.name.length > 200) {
    return {
      valid: false,
      error: "Nome do exercício muito longo (máx 200 caracteres)",
    };
  }

  if (
    !exercise.setsReps ||
    typeof exercise.setsReps !== "string" ||
    !exercise.setsReps.trim()
  ) {
    return { valid: false, error: "Séries/repetições é obrigatório" };
  }

  if (exercise.setsReps && exercise.setsReps.length > 50) {
    return {
      valid: false,
      error: "Séries/repetições muito longo (máx 50 caracteres)",
    };
  }

  if (exercise.notes && exercise.notes.length > 500) {
    return { valid: false, error: "Notas muito longas (máx 500 caracteres)" };
  }

  // Validar steps (array opcional)
  if (exercise.steps && !Array.isArray(exercise.steps)) {
    return { valid: false, error: "Steps deve ser um array" };
  }

  if (exercise.steps && exercise.steps.length > 20) {
    return { valid: false, error: "Máximo 20 passos por exercício" };
  }

  if (exercise.steps) {
    for (const step of exercise.steps) {
      if (typeof step !== "string") {
        return { valid: false, error: "Cada passo deve ser texto" };
      }
      if (step.length > 500) {
        return {
          valid: false,
          error: "Passo muito longo (máx 500 caracteres)",
        };
      }
    }
  }

  // Validar tips (array opcional)
  if (exercise.tips && !Array.isArray(exercise.tips)) {
    return { valid: false, error: "Tips deve ser um array" };
  }

  if (exercise.tips && exercise.tips.length > 20) {
    return { valid: false, error: "Máximo 20 dicas por exercício" };
  }

  if (exercise.tips) {
    for (const tip of exercise.tips) {
      if (typeof tip !== "string") {
        return { valid: false, error: "Cada dica deve ser texto" };
      }
      if (tip.length > 500) {
        return { valid: false, error: "Dica muito longa (máx 500 caracteres)" };
      }
    }
  }

  return { valid: true };
}

function validateDays(days) {
  if (!Array.isArray(days) || days.length === 0) {
    return { valid: false, error: "Ciclo deve ter pelo menos um dia" };
  }

  for (const day of days) {
    if (!day.name || typeof day.name !== "string" || !day.name.trim()) {
      return { valid: false, error: "Todos os dias devem ter nome" };
    }

    if (day.name.length > 50) {
      return {
        valid: false,
        error: "Nome do dia muito longo (máximo 50 caracteres)",
      };
    }

    if (!Array.isArray(day.exercises)) {
      return { valid: false, error: "Formato inválido de exercícios" };
    }

    for (const exercise of day.exercises) {
      const exerciseValidation = validateExercise(exercise);
      if (!exerciseValidation.valid) {
        return exerciseValidation;
      }
    }
  }

  return { valid: true };
}

function sanitizeCycleData(data) {
  return {
    name: data.name.trim(),
    days: data.days.map((day, index) => ({
      id: day.id || `day-${Date.now()}-${index}`,
      position: index,
      name: day.name.trim(),
      isMandatory: day.isMandatory ?? true,
      exercises: day.exercises.map((ex, exIndex) => ({
        id: ex.id || `ex-${Date.now()}-${exIndex}`,
        name: ex.name.trim(),
        setsReps: (ex.setsReps || "").trim(),
        notes: (ex.notes || "").trim(),
        steps: ex.steps || [],
        tips: ex.tips || [],
      })),
    })),
  };
}

export { validateCycleName, validateDays, sanitizeCycleData, validateExercise };
