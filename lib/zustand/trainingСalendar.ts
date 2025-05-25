import { create } from 'zustand';

interface Approach {
  id: string;
  wt: number | null;
  reps: number | null;
  feeling: 1 | 2 | 3 | 4 | 5 | null;
}

interface Exercise {
  id: string;
  title: string;
  runtime: number;
  approaches: Approach[];
}

interface Training {
  id: string;
  date: Date;
  description: string;
  runtime: number;
  wt: number | null;
  exercises: Exercise[];
  isCompleted: boolean; // Добавляем флаг завершенности
}

interface Month {
  [month: number]: Training[];
}

interface TrainingCalendar {
  years: {
    [year: number]: Month;
  };
}

interface TrainingStore {
  calendar: TrainingCalendar;
  addTraining: (year: number, month: number, training: Training) => void;
  updateTraining: (year: number, month: number, updatedTraining: Training) => void;
  removeTraining: (year: number, month: number, trainingId: string) => void;
  findTrainingByDate: (date: Date) => Training | undefined;
}

export const useTrainingStore = create<TrainingStore>((set, get) => ({
  calendar: {
    years: {
      2025: {
        2: [
          {
            id: '0',
            date: new Date(2025, 2, 9),
            description: '',
            runtime: 0,
            wt: null,
            isCompleted: false,
            exercises: [
              {
                id: '0',
                title: '',
                runtime: 0,
                approaches: [{ id: '0', wt: null, reps: null, feeling: null }],
              },
            ],
          },
          {
            id: '1',
            date: new Date(2025, 2, 11),
            description: '',
            runtime: 0,
            isCompleted: false,
            wt: null,
            exercises: [
              {
                id: '0',
                title: '',
                runtime: 0,
                approaches: [{ id: '0', wt: null, reps: null, feeling: null }],
              },
            ],
          },
        ],
      },
    },
  },

  // Добавление тренировки
  addTraining: (year, month, training) => {
    set((state) => {
      const years = { ...state.calendar.years };
      if (!years[year]) {
        years[year] = {};
      }
      if (!years[year][month]) {
        years[year][month] = [];
      }
      years[year][month].push(training);
      return { calendar: { years } };
    });
  },

  // Обновление тренировки
  updateTraining: (year, month, updatedTraining) => {
    set((state) => {
      const years = { ...state.calendar.years };
      if (years[year] && years[year][month]) {
        const index = years[year][month].findIndex((t) => t.id === updatedTraining.id);
        if (index !== -1) {
          years[year][month][index] = updatedTraining;
        }
      }
      return { calendar: { years } };
    });
  },

  // Удаление тренировки
  removeTraining: (year, month, trainingId) => {
    set((state) => {
      const years = { ...state.calendar.years };
      if (years[year] && years[year][month]) {
        years[year][month] = years[year][month].filter((t) => t.id !== trainingId);
      }
      return { calendar: { years } };
    });
  },

  // Поиск тренировки по дате
  findTrainingByDate: (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const trainings = get().calendar.years[year]?.[month] || [];
    return trainings.find((t) => t.date.toDateString() === date.toDateString());
  },
}));
