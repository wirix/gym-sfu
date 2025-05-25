import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface IndividualTraining {
  id: string;
  date: Date;
  name: string; // Добавляем название
  exerciseIds: string[];
  description?: string;
}

interface TrainingTemplate {
  id: string; // Уникальный ID шаблона
  description: string; // Описание шаблона
  exerciseIds: string[]; // Массив ID упражнений
}

interface IndividualTrainingStore {
  trainings: IndividualTraining[];
  templates: TrainingTemplate[];
  addTraining: (date: Date, name: string, exerciseIds: string[], description?: string) => void;
  updateTraining: (id: string, name: string, exerciseIds: string[], description?: string) => void;
  addTemplate: (description: string, exerciseIds: string[]) => void; // Добавить шаблон
  removeTraining: (id: string) => void; // Удалить тренировку
  removeTemplate: (id: string) => void; // Удалить шаблон
  getTemplateById: (id: string) => TrainingTemplate | undefined; // Получить шаблон по ID
  updateTemplate: (id: string, exerciseIds: string[]) => void;
  getTrainingsByDate: (date: Date) => IndividualTraining[];
}

export const useIndividualTrainingStore = create<IndividualTrainingStore>()(
  persist<IndividualTrainingStore>(
    (set, get) => ({
      trainings: [], // Начальное состояние — пустой список тренировок
      templates: [{ id: '1', description: 'Тяги', exerciseIds: ['1', '2'] }], // Начальное состояние — пустой список шаблонов

      // Добавить тренировку
      addTraining: (date, name, exerciseIds, description = '') => {
        const newTraining: IndividualTraining = {
          id: Math.random().toString(36).substring(2, 9),
          date, // Сохраняем объект Date
          name,
          exerciseIds,
          description,
        };
        set((state) => ({ trainings: [...state.trainings, newTraining] }));
      },

      // Добавить шаблон тренировки
      addTemplate: (description, exerciseIds) => {
        const newTemplate: TrainingTemplate = {
          id: Math.random().toString(36).substring(2, 9),
          description,
          exerciseIds,
        };
        set((state) => ({ templates: [...state.templates, newTemplate] }));
      },

      // Обновить тренировку
      updateTraining: (id, exerciseIds) => {
        // @ts-ignore
        set((state) => ({
          trainings: state.trainings.map((training) =>
            training.id === id ? { ...training, exerciseIds } : training,
          ),
        }));
      },

      // Удалить тренировку
      removeTraining: (id) => {
        set((state) => ({
          trainings: state.trainings.filter((training) => training.id !== id),
        }));
      },

      // Удалить шаблон
      removeTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }));
      },

      // Получить тренировки по дате
      getTrainingsByDate: (date) => {
        return get().trainings.filter((training) => {
          // Преобразуем дату, если это строка
          const trainingDate =
            typeof training.date === 'string' ? new Date(training.date) : training.date;

          return trainingDate.toDateString() === date.toDateString();
        });
      },

      // Получить шаблон по ID
      getTemplateById: (id) => {
        return get().templates.find((template) => template.id === id);
      },

      updateTemplate: (id, exerciseIds) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id ? { ...template, exerciseIds } : template,
          ),
        }));
      },
    }),
    {
      name: 'individual-training-storage',
      storage: createJSONStorage(() => localStorage),
      // Добавляем преобразование при загрузке из хранилища
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.trainings = state.trainings.map((training) => ({
            ...training,
            date: new Date(training.date), // Преобразуем строку в Date
          }));
        }
      },
    },
  ),
);
