// app/src/utils/challengeCalculator.js

import {
  CHALLENGES,
  TIER_ORDER,
  TIER_CONFIG,
  TIER_MESSAGES,
} from "../constants/challenges";

/**
 * Calcula o tier atual baseado no valor
 */
export const calculateTier = (challengeId, value) => {
  const challenge = CHALLENGES[challengeId];
  if (!challenge) return "semRanking";

  // Percorrer tiers de trás pra frente (do maior pro menor)
  for (let i = TIER_ORDER.length - 1; i >= 0; i--) {
    const tier = TIER_ORDER[i];
    const threshold = challenge.thresholds[tier];

    if (value >= threshold) {
      return tier;
    }
  }

  return "semRanking";
};

/**
 * Calcula o próximo tier e valor necessário
 */
export const getNextTier = (challengeId, currentTier) => {
  const currentIndex = TIER_ORDER.indexOf(currentTier);

  // Se já é o último tier
  if (currentIndex === TIER_ORDER.length - 1) {
    return null;
  }

  const nextTier = TIER_ORDER[currentIndex + 1];
  const challenge = CHALLENGES[challengeId];
  const nextValue = challenge.thresholds[nextTier];

  return {
    tier: nextTier,
    value: nextValue,
  };
};

/**
 * Calcula progresso percentual até próximo tier
 */
export const calculateProgress = (challengeId, currentValue, currentTier) => {
  const challenge = CHALLENGES[challengeId];
  const currentThreshold = challenge.thresholds[currentTier];
  const nextTier = getNextTier(challengeId, currentTier);

  if (!nextTier) {
    return 100; // Já está no máximo
  }

  const nextThreshold = nextTier.value;
  const progress =
    ((currentValue - currentThreshold) / (nextThreshold - currentThreshold)) *
    100;

  return Math.min(Math.max(progress, 0), 100);
};

/**
 * Calcula todos os desafios baseado nas estatísticas do usuário
 */
export const calculateAllChallenges = (workouts, stats, userCreatedAt) => {
  const challenges = {};

  // 1. CONSTÂNCIA REAL (total de treinos)
  const totalWorkouts = workouts.filter(
    (w) => w.wasFullyCompleted || w.completedExercises?.some((e) => e.completed)
  ).length;

  challenges.constanciaReal = {
    currentValue: totalWorkouts,
    currentTier: calculateTier("constanciaReal", totalWorkouts),
  };

  // 2. SEQUÊNCIAS DE FOGO (melhor streak)
  const longestStreak = stats.longestStreak || 0;
  challenges.sequenciasDeFogo = {
    currentValue: longestStreak,
    currentTier: calculateTier("sequenciasDeFogo", longestStreak),
  };

  // 3. VOLUME BRUTO (total de exercícios)
  const totalExercises = workouts.reduce((sum, w) => {
    return sum + (w.completedExercises?.filter((e) => e.completed).length || 0);
  }, 0);

  challenges.volumeBruto = {
    currentValue: totalExercises,
    currentTier: calculateTier("volumeBruto", totalExercises),
  };

  // 4. PERFECCIONISTA (taxa de conclusão - últimos 30 treinos)
  const last30Workouts = workouts.slice(0, 30);
  const completedLast30 = last30Workouts.filter(
    (w) => w.wasFullyCompleted
  ).length;
  const completionRate =
    last30Workouts.length > 0
      ? (completedLast30 / last30Workouts.length) * 100
      : 0;

  challenges.perfeccionista = {
    currentValue: Math.round(completionRate),
    currentTier: calculateTier("perfeccionista", completionRate),
  };

  // 5. SEMANAS IMPECÁVEIS (semanas 7/7)
  const perfectWeeks = countPerfectWeeks(workouts);
  challenges.semanasImpecareis = {
    currentValue: perfectWeeks,
    currentTier: calculateTier("semanasImpecareis", perfectWeeks),
  };

  // 6. INABALÁVEL (dias consecutivos sem "não quero")
  const daysWithoutWont = calculateDaysWithoutWont(workouts);
  challenges.inabalavel = {
    currentValue: daysWithoutWont,
    currentTier: calculateTier("inabalavel", daysWithoutWont),
  };

  // 7. VETERANIA (dias desde criação da conta)
  const daysSinceCreation = Math.floor(
    (new Date() - new Date(userCreatedAt)) / (1000 * 60 * 60 * 24)
  );

  challenges.veterania = {
    currentValue: daysSinceCreation,
    currentTier: calculateTier("veterania", daysSinceCreation),
  };

  return challenges;
};

/**
 * Conta semanas perfeitas (7/7 dias completos)
 */
const countPerfectWeeks = (workouts) => {
  let perfectWeeks = 0;
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  for (let i = 0; i < sortedWorkouts.length - 6; i++) {
    const weekStart = new Date(sortedWorkouts[i].date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekWorkouts = sortedWorkouts.filter((w) => {
      const date = new Date(w.date);
      return date >= weekStart && date <= weekEnd;
    });

    // Verificar se tem 7 dias consecutivos completos
    if (weekWorkouts.length === 7) {
      const allComplete = weekWorkouts.every(
        (w) =>
          w.wasFullyCompleted || w.completedExercises?.some((e) => e.completed)
      );
      if (allComplete) {
        perfectWeeks++;
      }
    }
  }

  return perfectWeeks;
};

/**
 * Calcula dias consecutivos sem "não quero"
 */
const calculateDaysWithoutWont = (workouts) => {
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  let currentStreak = 0;

  for (const workout of sortedWorkouts) {
    // Se pulou por "não quero" em dia obrigatório, quebra streak
    if (workout.skippedReason === "wont" && workout.wasMandatory) {
      break;
    }

    // Conta dia
    currentStreak++;
  }

  return currentStreak;
};

/**
 * Compara dois estados de challenges e retorna tier ups
 */
export const detectTierUps = (oldChallenges, newChallenges) => {
  const tierUps = [];

  for (const challengeId in newChallenges) {
    const oldTier = oldChallenges[challengeId]?.currentTier || "semRanking";
    const newTier = newChallenges[challengeId].currentTier;

    const oldIndex = TIER_ORDER.indexOf(oldTier);
    const newIndex = TIER_ORDER.indexOf(newTier);

    // Se subiu de tier
    if (newIndex > oldIndex) {
      // Adicionar TODOS os tiers intermediários
      for (let i = oldIndex + 1; i <= newIndex; i++) {
        tierUps.push({
          challengeId,
          tier: TIER_ORDER[i],
          previousTier: TIER_ORDER[i - 1],
          value: newChallenges[challengeId].currentValue,
          unlockedAt: new Date().toISOString(),
          viewed: false,
        });
      }
    }
  }

  return tierUps;
};

/**
 * Formata valor do desafio (adiciona % se necessário)
 */
export const formatChallengeValue = (challengeId, value) => {
  const challenge = CHALLENGES[challengeId];

  if (challenge.isPercentage) {
    return `${value}%`;
  }

  return value.toLocaleString("pt-BR");
};

/**
 * Retorna mensagem de celebração aleatória para o tier
 */
export const getTierMessage = (tier) => {
  const messages = TIER_MESSAGES[tier] || ["Parabéns!"];
  return messages[Math.floor(Math.random() * messages.length)];
};
