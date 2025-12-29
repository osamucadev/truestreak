// functions/src/api/dev.js
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

/**
 * DEVELOPER TOOL: Popular workouts de teste
 */
export const devPopulateWorkouts = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Usuário não autenticado");
  }

  const userId = request.auth.uid;
  const { scenario } = request.data;

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError("not-found", "Usuário não encontrado");
    }

    const userData = userDoc.data();
    const existingWorkouts = userData.workouts || [];
    const existingCycles = userData.cycles || [];
    const today = new Date();

    // CRIAR CICLO MOCK SE NÃO EXISTIR
    let mockCycleId = "mock-cycle-id";
    const hasMockCycle = existingCycles.some((c) => c.id === mockCycleId);

    if (!hasMockCycle) {
      const mockCycle = {
        id: mockCycleId,
        name: "Ciclo de Teste (Dev)",
        isActive: true,
        startedAt: new Date(
          today.getTime() - 150 * 24 * 60 * 60 * 1000
        ).toISOString(), // 150 dias atrás
        endedAt: null,
        currentPosition: 0,
        days: [
          {
            id: "mock-day-id",
            position: 0,
            name: "Treino Full Body",
            isMandatory: true,
            exercises: [
              {
                id: "ex1",
                name: "Supino Reto",
                setsReps: "3x12",
                notes: "Exercício mock",
                steps: [],
                tips: [],
              },
              {
                id: "ex2",
                name: "Agachamento",
                setsReps: "3x15",
                notes: "Exercício mock",
                steps: [],
                tips: [],
              },
              {
                id: "ex3",
                name: "Remada",
                setsReps: "3x12",
                notes: "Exercício mock",
                steps: [],
                tips: [],
              },
            ],
          },
        ],
      };

      existingCycles.push(mockCycle);
    }

    let newWorkouts = [];

    switch (scenario) {
      case "streak-alto":
        // 30 dias seguidos
        newWorkouts = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (29 - i));
          return {
            id: `workout-${Date.now()}-${i}`,
            cycleId: mockCycleId,
            dayId: "mock-day-id",
            dayName: "Treino Full Body",
            dayPosition: 0,
            date: date.toISOString(),
            completedExercises: [
              {
                exerciseId: "ex1",
                exerciseName: "Supino Reto",
                completed: true,
              },
              {
                exerciseId: "ex2",
                exerciseName: "Agachamento",
                completed: true,
              },
              { exerciseId: "ex3", exerciseName: "Remada", completed: true },
            ],
            wasFullyCompleted: true,
            wasMandatory: true,
            skippedReason: null,
            notes: "Treino completo!",
          };
        });
        break;

      case "streak-quebrado":
        // 15 dias + quebra + 5 dias
        newWorkouts = Array.from({ length: 15 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (25 - i));
          return {
            id: `workout-${Date.now()}-${i}`,
            cycleId: mockCycleId,
            dayId: "mock-day-id",
            dayName: "Treino Full Body",
            dayPosition: 0,
            date: date.toISOString(),
            completedExercises: [
              {
                exerciseId: "ex1",
                exerciseName: "Supino Reto",
                completed: true,
              },
              {
                exerciseId: "ex2",
                exerciseName: "Agachamento",
                completed: true,
              },
            ],
            wasFullyCompleted: true,
            wasMandatory: true,
            skippedReason: null,
            notes: "",
          };
        });

        // Quebra
        const breakDate = new Date(today);
        breakDate.setDate(breakDate.getDate() - 9);
        newWorkouts.push({
          id: `workout-${Date.now()}-break`,
          cycleId: mockCycleId,
          dayId: "mock-day-id",
          dayName: "Treino Full Body",
          dayPosition: 0,
          date: breakDate.toISOString(),
          completedExercises: [],
          wasFullyCompleted: false,
          wasMandatory: true,
          skippedReason: "wont",
          notes: "Quebrei o streak",
        });

        // Mais 5 dias
        newWorkouts.push(
          ...Array.from({ length: 5 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (4 - i));
            return {
              id: `workout-${Date.now()}-recovery-${i}`,
              cycleId: mockCycleId,
              dayId: "mock-day-id",
              dayName: "Treino Full Body",
              dayPosition: 0,
              date: date.toISOString(),
              completedExercises: [
                {
                  exerciseId: "ex1",
                  exerciseName: "Supino Reto",
                  completed: true,
                },
              ],
              wasFullyCompleted: true,
              wasMandatory: true,
              skippedReason: null,
              notes: "",
            };
          })
        );
        break;

      case "irregular":
        // 37 treinos esparsos
        const irregularDays = [
          0, 2, 3, 7, 10, 14, 15, 16, 20, 25, 28, 30, 35, 40, 42, 45, 50, 55,
          60, 63, 65, 70, 75, 77, 80, 85, 90, 92, 95, 100, 105, 107, 110, 112,
          115, 118, 119,
        ];
        newWorkouts = irregularDays.map((daysAgo, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - daysAgo);
          return {
            id: `workout-${Date.now()}-${i}`,
            cycleId: mockCycleId,
            dayId: "mock-day-id",
            dayName: "Treino Full Body",
            dayPosition: 0,
            date: date.toISOString(),
            completedExercises: [
              {
                exerciseId: "ex1",
                exerciseName: "Supino Reto",
                completed: true,
              },
              {
                exerciseId: "ex2",
                exerciseName: "Agachamento",
                completed: Math.random() > 0.3,
              },
              {
                exerciseId: "ex3",
                exerciseName: "Remada",
                completed: Math.random() > 0.5,
              },
            ],
            wasFullyCompleted: Math.random() > 0.3,
            wasMandatory: Math.random() > 0.2,
            skippedReason: null,
            notes: "",
          };
        });
        break;

      case "muitos-skips":
        // 60 dias com muitos skips
        newWorkouts = Array.from({ length: 60 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (59 - i));

          const shouldSkip = Math.random() > 0.5;

          if (shouldSkip) {
            return {
              id: `workout-${Date.now()}-${i}`,
              cycleId: mockCycleId,
              dayId: "mock-day-id",
              dayName: "Treino Full Body",
              dayPosition: 0,
              date: date.toISOString(),
              completedExercises: [],
              wasFullyCompleted: false,
              wasMandatory: true,
              skippedReason: Math.random() > 0.3 ? "cant" : "wont",
              notes: "Não deu pra ir",
            };
          }

          return {
            id: `workout-${Date.now()}-${i}`,
            cycleId: mockCycleId,
            dayId: "mock-day-id",
            dayName: "Treino Full Body",
            dayPosition: 0,
            date: date.toISOString(),
            completedExercises: [
              {
                exerciseId: "ex1",
                exerciseName: "Supino Reto",
                completed: true,
              },
              {
                exerciseId: "ex2",
                exerciseName: "Agachamento",
                completed: true,
              },
            ],
            wasFullyCompleted: true,
            wasMandatory: true,
            skippedReason: null,
            notes: "",
          };
        });
        break;

      case "semana-perfeita":
        // 7 dias seguidos + esparsos
        newWorkouts = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (6 - i));
          return {
            id: `workout-${Date.now()}-${i}`,
            cycleId: mockCycleId,
            dayId: "mock-day-id",
            dayName: "Treino Full Body",
            dayPosition: 0,
            date: date.toISOString(),
            completedExercises: [
              {
                exerciseId: "ex1",
                exerciseName: "Supino Reto",
                completed: true,
              },
              {
                exerciseId: "ex2",
                exerciseName: "Agachamento",
                completed: true,
              },
              { exerciseId: "ex3", exerciseName: "Remada", completed: true },
              {
                exerciseId: "ex4",
                exerciseName: "Desenvolvimento",
                completed: true,
              },
            ],
            wasFullyCompleted: true,
            wasMandatory: true,
            skippedReason: null,
            notes: "",
          };
        });

        // Adicionar treinos esparsos
        [10, 15, 20, 25, 30].forEach((daysAgo, idx) => {
          const date = new Date(today);
          date.setDate(date.getDate() - daysAgo);
          newWorkouts.push({
            id: `workout-${Date.now()}-sparse-${idx}`,
            cycleId: mockCycleId,
            dayId: "mock-day-id",
            dayName: "Treino Full Body",
            dayPosition: 0,
            date: date.toISOString(),
            completedExercises: [
              {
                exerciseId: "ex1",
                exerciseName: "Supino Reto",
                completed: true,
              },
              {
                exerciseId: "ex2",
                exerciseName: "Agachamento",
                completed: true,
              },
            ],
            wasFullyCompleted: true,
            wasMandatory: true,
            skippedReason: null,
            notes: "",
          });
        });
        break;

      case "exercicios-variados":
        // 40 treinos com exercícios variados
        const exercises = [
          "Supino Reto",
          "Supino Inclinado",
          "Agachamento",
          "Leg Press",
          "Remada Curvada",
          "Remada Cavalinho",
          "Desenvolvimento",
          "Elevação Lateral",
          "Rosca Direta",
          "Rosca Martelo",
          "Tríceps Testa",
          "Tríceps Corda",
          "Stiff",
          "Mesa Flexora",
          "Panturrilha",
          "Abdominal",
        ];

        newWorkouts = Array.from({ length: 40 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - (39 - i));

          const numExercises = 3 + Math.floor(Math.random() * 3);
          const selectedExercises = [];

          for (let j = 0; j < numExercises; j++) {
            const exercise =
              exercises[Math.floor(Math.random() * exercises.length)];
            selectedExercises.push({
              exerciseId: `ex${j}`,
              exerciseName: exercise,
              completed: Math.random() > 0.2,
            });
          }

          return {
            id: `workout-${Date.now()}-${i}`,
            cycleId: mockCycleId,
            dayId: "mock-day-id",
            dayName: "Treino Full Body",
            dayPosition: 0,
            date: date.toISOString(),
            completedExercises: selectedExercises,
            wasFullyCompleted: selectedExercises.every((e) => e.completed),
            wasMandatory: Math.random() > 0.3,
            skippedReason: null,
            notes: "",
          };
        });
        break;

      case "massivo":
        // 100 treinos em 150 dias
        newWorkouts = Array.from({ length: 100 }, (_, i) => {
          const date = new Date(today);
          const daysAgo = Math.floor((149 - i) * 1.5);
          date.setDate(date.getDate() - daysAgo);

          return {
            id: `workout-${Date.now()}-${i}`,
            cycleId: mockCycleId,
            dayId: "mock-day-id",
            dayName: "Treino Full Body",
            dayPosition: 0,
            date: date.toISOString(),
            completedExercises: [
              {
                exerciseId: "ex1",
                exerciseName: "Supino Reto",
                completed: true,
              },
              {
                exerciseId: "ex2",
                exerciseName: "Agachamento",
                completed: Math.random() > 0.2,
              },
              {
                exerciseId: "ex3",
                exerciseName: "Remada",
                completed: Math.random() > 0.3,
              },
            ],
            wasFullyCompleted: Math.random() > 0.2,
            wasMandatory: Math.random() > 0.3,
            skippedReason: null,
            notes: "",
          };
        });
        break;

      default:
        throw new HttpsError("invalid-argument", "Cenário inválido");
    }

    // Combinar com existentes
    const allWorkouts = [...existingWorkouts, ...newWorkouts];

    // ATUALIZAR CYCLES E WORKOUTS
    await userRef.update({
      cycles: existingCycles,
      workouts: allWorkouts,
    });

    return { success: true, count: newWorkouts.length };
  } catch (error) {
    console.error("Error populating workouts:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Erro ao popular workouts");
  }
});

/**
 * DEVELOPER TOOL: Limpar todos os workouts
 */
export const devClearWorkouts = onCall(async (request) => {
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
    const count = (userData.workouts || []).length;

    // Limpar workouts e resetar stats
    await userRef.update({
      workouts: [],
      stats: {
        currentStreak: 0,
        longestStreak: 0,
        totalWorkouts: 0,
        xp: 0,
        level: 1,
        lastWorkoutDate: null,
        nextDayPosition: 0,
      },
    });

    return { success: true, count };
  } catch (error) {
    console.error("Error clearing workouts:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Erro ao limpar workouts");
  }
});
