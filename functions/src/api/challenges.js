// functions/src/api/challenges.js
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// ✅ REMOVIDO: const db = getFirestore();

/**
 * Configuração de Tiers
 */
const TIER_ORDER = [
  "semRanking",
  "cobre",
  "ferro",
  "bronze",
  "prata",
  "ouro",
  "platina",
  "esmeralda",
  "rubi",
  "diamante",
  "diamanteAzul",
];

/**
 * Definição de Desafios
 */
const CHALLENGES = {
  constanciaReal: {
    thresholds: {
      semRanking: 0,
      cobre: 1,
      ferro: 5,
      bronze: 15,
      prata: 30,
      ouro: 50,
      platina: 80,
      esmeralda: 120,
      rubi: 200,
      diamante: 350,
      diamanteAzul: 500,
    },
  },
  sequenciasDeFogo: {
    thresholds: {
      semRanking: 0,
      cobre: 1,
      ferro: 3,
      bronze: 7,
      prata: 10,
      ouro: 15,
      platina: 25,
      esmeralda: 40,
      rubi: 60,
      diamante: 100,
      diamanteAzul: 150,
    },
  },
  volumeBruto: {
    thresholds: {
      semRanking: 0,
      cobre: 25,
      ferro: 100,
      bronze: 300,
      prata: 600,
      ouro: 1000,
      platina: 2000,
      esmeralda: 4000,
      rubi: 7000,
      diamante: 12000,
      diamanteAzul: 20000,
    },
  },
  perfeccionista: {
    thresholds: {
      semRanking: 0,
      cobre: 40,
      ferro: 50,
      bronze: 60,
      prata: 65,
      ouro: 70,
      platina: 75,
      esmeralda: 80,
      rubi: 85,
      diamante: 90,
      diamanteAzul: 95,
    },
  },
  semanasImpecareis: {
    thresholds: {
      semRanking: 0,
      cobre: 1,
      ferro: 2,
      bronze: 3,
      prata: 5,
      ouro: 7,
      platina: 10,
      esmeralda: 15,
      rubi: 22,
      diamante: 30,
      diamanteAzul: 50,
    },
  },
  inabalavel: {
    thresholds: {
      semRanking: 0,
      cobre: 3,
      ferro: 7,
      bronze: 14,
      prata: 21,
      ouro: 30,
      platina: 50,
      esmeralda: 75,
      rubi: 120,
      diamante: 180,
      diamanteAzul: 365,
    },
  },
  veterania: {
    thresholds: {
      semRanking: 0,
      cobre: 1,
      ferro: 7,
      bronze: 14,
      prata: 30,
      ouro: 60,
      platina: 90,
      esmeralda: 180,
      rubi: 270,
      diamante: 365,
      diamanteAzul: 730,
    },
  },
};

/**
 * Calcula tier baseado no valor
 */
const calculateTier = (challengeId, value) => {
  const challenge = CHALLENGES[challengeId];
  if (!challenge) return "semRanking";

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
 * Calcula todos os challenges
 */
const calculateAllChallenges = (workouts, stats, userCreatedAt) => {
  const challenges = {};

  // 1. CONSTÂNCIA REAL
  const totalWorkouts = workouts.filter(
    (w) => w.wasFullyCompleted || w.completedExercises?.some((e) => e.completed)
  ).length;
  challenges.constanciaReal = {
    currentValue: totalWorkouts,
    currentTier: calculateTier("constanciaReal", totalWorkouts),
  };

  // 2. SEQUÊNCIAS DE FOGO
  const longestStreak = stats.longestStreak || 0;
  challenges.sequenciasDeFogo = {
    currentValue: longestStreak,
    currentTier: calculateTier("sequenciasDeFogo", longestStreak),
  };

  // 3. VOLUME BRUTO
  const totalExercises = workouts.reduce((sum, w) => {
    return sum + (w.completedExercises?.filter((e) => e.completed).length || 0);
  }, 0);
  challenges.volumeBruto = {
    currentValue: totalExercises,
    currentTier: calculateTier("volumeBruto", totalExercises),
  };

  // 4. PERFECCIONISTA
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

  // 5. SEMANAS IMPECÁVEIS
  const perfectWeeks = countPerfectWeeks(workouts);
  challenges.semanasImpecareis = {
    currentValue: perfectWeeks,
    currentTier: calculateTier("semanasImpecareis", perfectWeeks),
  };

  // 6. INABALÁVEL
  const daysWithoutWont = calculateDaysWithoutWont(workouts);
  challenges.inabalavel = {
    currentValue: daysWithoutWont,
    currentTier: calculateTier("inabalavel", daysWithoutWont),
  };

  // 7. VETERANIA
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
 * Conta semanas perfeitas
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

    if (weekWorkouts.length === 7) {
      const allComplete = weekWorkouts.every(
        (w) =>
          w.wasFullyCompleted || w.completedExercises?.some((e) => e.completed)
      );
      if (allComplete) perfectWeeks++;
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
    if (workout.skippedReason === "wont" && workout.wasMandatory) {
      break;
    }
    currentStreak++;
  }

  return currentStreak;
};

/**
 * Detecta tier ups
 */
const detectTierUps = (oldChallenges, newChallenges) => {
  const tierUps = [];

  for (const challengeId in newChallenges) {
    const oldTier = oldChallenges[challengeId]?.currentTier || "semRanking";
    const newTier = newChallenges[challengeId].currentTier;

    const oldIndex = TIER_ORDER.indexOf(oldTier);
    const newIndex = TIER_ORDER.indexOf(newTier);

    if (newIndex > oldIndex) {
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
 * Obter challenges do usuário
 */
export const getUserChallenges = onCall(
  {
    cors: true,
  },
  async (request) => {
    const db = getFirestore(); // ✅ ADICIONADO AQUI

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const userId = request.auth.uid;

    try {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new HttpsError("not-found", "Usuário não encontrado");
      }

      const userData = userDoc.data();
      const workouts = userData.workouts || [];
      const stats = userData.stats || {};
      const userCreatedAt = userData.createdAt || new Date().toISOString();

      // Calcular challenges
      const calculatedChallenges = calculateAllChallenges(
        workouts,
        stats,
        userCreatedAt
      );

      // Mesclar com histórico existente
      const existingChallenges = userData.challenges || {};
      const mergedChallenges = {};

      for (const challengeId in calculatedChallenges) {
        const existing = existingChallenges[challengeId] || {};
        mergedChallenges[challengeId] = {
          ...calculatedChallenges[challengeId],
          tierHistory: existing.tierHistory || [],
        };
      }

      // Contar não visualizados
      let unviewedCount = 0;
      for (const challengeId in mergedChallenges) {
        const history = mergedChallenges[challengeId].tierHistory || [];
        unviewedCount += history.filter((t) => !t.viewed).length;
      }

      return {
        challenges: mergedChallenges,
        unviewedCount,
      };
    } catch (error) {
      console.error("Error getting challenges:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Erro ao buscar challenges");
    }
  }
);

/**
 * Marcar achievements como visualizados
 */
export const markAchievementsAsViewed = onCall(
  {
    cors: true,
  },
  async (request) => {
    const db = getFirestore(); // ✅ ADICIONADO AQUI

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado");
    }

    const userId = request.auth.uid;

    try {
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new HttpsError("not-found", "Usuário não encontrado");
      }

      const userData = userDoc.data();
      const challenges = userData.challenges || {};

      // Marcar todos como viewed
      const updatedChallenges = {};
      for (const challengeId in challenges) {
        updatedChallenges[challengeId] = {
          ...challenges[challengeId],
          tierHistory: (challenges[challengeId].tierHistory || []).map((t) => ({
            ...t,
            viewed: true,
          })),
        };
      }

      await userRef.update({
        challenges: updatedChallenges,
        unviewedAchievements: 0,
      });

      return { success: true };
    } catch (error) {
      console.error("Error marking as viewed:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Erro ao marcar como visualizado");
    }
  }
);

/**
 * Atualizar challenges após workout
 * (Chamado internamente por logWorkout)
 */
export const updateChallengesAfterWorkout = async (userId) => {
  const db = getFirestore(); // ✅ ADICIONADO AQUI

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) return [];

    const userData = userDoc.data();
    const workouts = userData.workouts || [];
    const stats = userData.stats || {};
    const userCreatedAt = userData.createdAt || new Date().toISOString();

    // Calcular novos challenges
    const newChallenges = calculateAllChallenges(
      workouts,
      stats,
      userCreatedAt
    );

    // Comparar com challenges antigos
    const oldChallenges = userData.challenges || {};
    const tierUps = detectTierUps(oldChallenges, newChallenges);

    // Se houve tier ups, atualizar
    if (tierUps.length > 0) {
      const updatedChallenges = { ...oldChallenges };

      for (const tierUp of tierUps) {
        if (!updatedChallenges[tierUp.challengeId]) {
          updatedChallenges[tierUp.challengeId] = {
            currentTier: tierUp.tier,
            currentValue: tierUp.value,
            tierHistory: [],
          };
        }

        updatedChallenges[tierUp.challengeId].currentTier = tierUp.tier;
        updatedChallenges[tierUp.challengeId].currentValue = tierUp.value;

        if (!updatedChallenges[tierUp.challengeId].tierHistory) {
          updatedChallenges[tierUp.challengeId].tierHistory = [];
        }

        updatedChallenges[tierUp.challengeId].tierHistory.push({
          tier: tierUp.tier,
          unlockedAt: tierUp.unlockedAt,
          viewed: false,
        });
      }

      await userRef.update({
        challenges: updatedChallenges,
        unviewedAchievements: FieldValue.increment(tierUps.length),
      });
    }

    return tierUps;
  } catch (error) {
    console.error("Error updating challenges:", error);
    return [];
  }
};
