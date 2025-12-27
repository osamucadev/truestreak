/**
 * Validações compartilhadas para Cycles e Workouts
 */

/**
 * Valida se um nome de ciclo é válido
 */
export const validateCycleName = (name) => {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Nome do ciclo é obrigatório" };
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Nome do ciclo não pode ser vazio" };
  }

  if (trimmed.length > 100) {
    return {
      valid: false,
      error: "Nome do ciclo muito longo (máx 100 caracteres)",
    };
  }

  return { valid: true };
};

/**
 * Valida estrutura de um dia de treino
 */
export const validateDay = (day, position) => {
  if (!day || typeof day !== "object") {
    return { valid: false, error: `Dia ${position + 1} inválido` };
  }

  // Validar nome do dia
  if (
    !day.name ||
    typeof day.name !== "string" ||
    day.name.trim().length === 0
  ) {
    return { valid: false, error: `Dia ${position + 1}: nome é obrigatório` };
  }

  if (day.name.trim().length > 100) {
    return { valid: false, error: `Dia ${position + 1}: nome muito longo` };
  }

  // Validar isMandatory
  if (typeof day.isMandatory !== "boolean") {
    return {
      valid: false,
      error: `Dia ${position + 1}: tipo (obrigatório/livre) inválido`,
    };
  }

  // Validar exercises (pode ser vazio)
  if (!Array.isArray(day.exercises)) {
    return {
      valid: false,
      error: `Dia ${position + 1}: lista de exercícios inválida`,
    };
  }

  // Validar cada exercício
  for (let i = 0; i < day.exercises.length; i++) {
    const exerciseValidation = validateExercise(day.exercises[i], position, i);
    if (!exerciseValidation.valid) {
      return exerciseValidation;
    }
  }

  return { valid: true };
};

/**
 * Valida estrutura de um exercício
 */
export const validateExercise = (exercise, dayPosition, exercisePosition) => {
  if (!exercise || typeof exercise !== "object") {
    return {
      valid: false,
      error: `Dia ${dayPosition + 1}, Exercício ${
        exercisePosition + 1
      }: inválido`,
    };
  }

  // Validar nome
  if (
    !exercise.name ||
    typeof exercise.name !== "string" ||
    exercise.name.trim().length === 0
  ) {
    return {
      valid: false,
      error: `Dia ${dayPosition + 1}, Exercício ${
        exercisePosition + 1
      }: nome é obrigatório`,
    };
  }

  if (exercise.name.trim().length > 200) {
    return {
      valid: false,
      error: `Dia ${dayPosition + 1}, Exercício ${
        exercisePosition + 1
      }: nome muito longo`,
    };
  }

  // Validar setsReps (opcional)
  if (exercise.setsReps && typeof exercise.setsReps !== "string") {
    return {
      valid: false,
      error: `Dia ${dayPosition + 1}, Exercício ${
        exercisePosition + 1
      }: séries/reps inválido`,
    };
  }

  // Validar notes (opcional)
  if (exercise.notes && typeof exercise.notes !== "string") {
    return {
      valid: false,
      error: `Dia ${dayPosition + 1}, Exercício ${
        exercisePosition + 1
      }: notas inválidas`,
    };
  }

  return { valid: true };
};

/**
 * Valida array de dias completo
 */
export const validateDays = (days) => {
  if (!Array.isArray(days)) {
    return { valid: false, error: "Lista de dias inválida" };
  }

  if (days.length === 0) {
    return { valid: false, error: "Ciclo precisa ter pelo menos 1 dia" };
  }

  if (days.length > 14) {
    return { valid: false, error: "Ciclo não pode ter mais de 14 dias" };
  }

  // Validar cada dia
  for (let i = 0; i < days.length; i++) {
    const dayValidation = validateDay(days[i], i);
    if (!dayValidation.valid) {
      return dayValidation;
    }
  }

  return { valid: true };
};

/**
 * Sanitiza e normaliza dados de um ciclo
 */
export const sanitizeCycleData = (data) => {
  return {
    name: data.name.trim(),
    days: data.days.map((day, dayIndex) => ({
      id: day.id || `day-${Date.now()}-${dayIndex}`,
      position: dayIndex,
      name: day.name.trim(),
      isMandatory: Boolean(day.isMandatory),
      exercises: day.exercises.map((ex, exIndex) => ({
        id: ex.id || `ex-${Date.now()}-${exIndex}`,
        name: ex.name.trim(),
        setsReps: ex.setsReps?.trim() || "",
        notes: ex.notes?.trim() || "",
      })),
    })),
  };
};
