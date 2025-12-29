// app/src/utils/cycleUtils.js

export const createEmptyDay = (position) => {
  return {
    id: `day-${Date.now()}-${Math.random()}`,
    name: "",
    position: position,
    isMandatory: true,
    exercises: [],
  };
};

export const createEmptyExercise = () => {
  return {
    id: `ex-${Date.now()}-${Math.random()}`,
    name: "",
    setsReps: "",
    notes: "",
    steps: [],
    tips: [],
  };
};
