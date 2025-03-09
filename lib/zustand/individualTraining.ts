import { create } from 'zustand';

interface IndividualTraining {
  id: string; // Уникальный ID тренировки
  date: Date; // Дата тренировки
  exerciseIds: string[]; // Массив ID упражнений
}

interface TrainingTemplate {
  id: string; // Уникальный ID шаблона
  description: string; // Описание шаблона
  exerciseIds: string[]; // Массив ID упражнений
}

interface IndividualTrainingStore {
  trainings: IndividualTraining[]; // Список всех тренировок
  templates: TrainingTemplate[]; // Список шаблонов тренировок
  addTraining: (date: Date, exerciseIds: string[]) => void; // Добавить тренировку
  addTemplate: (description: string, exerciseIds: string[]) => void; // Добавить шаблон
  updateTraining: (id: string, exerciseIds: string[]) => void; // Обновить тренировку
  removeTraining: (id: string) => void; // Удалить тренировку
  removeTemplate: (id: string) => void; // Удалить шаблон
  getTrainingsByDate: (date: Date) => IndividualTraining[]; // Получить тренировки по дате
  getTemplateById: (id: string) => TrainingTemplate | undefined; // Получить шаблон по ID
}

export const useIndividualTrainingStore = create<IndividualTrainingStore>((set, get) => ({
  trainings: [], // Начальное состояние — пустой список тренировок
  templates: [{ id: '1', description: '', exerciseIds: ['1', '2'] }], // Начальное состояние — пустой список шаблонов

  // Добавить тренировку
  addTraining: (date, exerciseIds) => {
    const newTraining: IndividualTraining = {
      id: Math.random().toString(36).substring(2, 9), // Генерация уникального ID
      date,
      exerciseIds,
    };
    set((state) => ({ trainings: [...state.trainings, newTraining] }));
  },

  // Добавить шаблон тренировки
  addTemplate: (description, exerciseIds) => {
    const newTemplate: TrainingTemplate = {
      id: Math.random().toString(36).substring(2, 9), // Генерация уникального ID
      description,
      exerciseIds,
    };
    set((state) => ({ templates: [...state.templates, newTemplate] }));
  },

  // Обновить тренировку
  updateTraining: (id, exerciseIds) => {
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
    return get().trainings.filter(
      (training) => training.date.toDateString() === date.toDateString(),
    );
  },

  // Получить шаблон по ID
  getTemplateById: (id) => {
    return get().templates.find((template) => template.id === id);
  },
}));
