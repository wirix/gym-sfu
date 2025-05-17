import { create } from 'zustand';

interface Approach {
  weight: number | null;
  reps: number | null;
  feeling: number | null;
}

interface LastExercise {
  id: string;
  approaches: Approach[];
}

interface LastExercisesStore {
  exercises: Record<string, LastExercise>; // key: exerciseId
  updateExercise: (exerciseId: string, approaches: Approach[]) => void;
  getExercise: (exerciseId: string) => LastExercise | undefined;
}

export const useLastExercisesStore = create<LastExercisesStore>((set, get) => ({
  exercises: {},
  updateExercise: (exerciseId, approaches) => {
    set((state) => ({
      exercises: {
        ...state.exercises,
        [exerciseId]: {
          id: exerciseId,
          approaches: approaches,
        },
      },
    }));
  },
  getExercise: (exerciseId) => {
    return get().exercises[exerciseId];
  },
}));
