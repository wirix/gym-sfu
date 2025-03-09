'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { exercises } from '@/lib/mock/db-exercises'; // Импортируем моковые данные
import Image from 'next/image';
import { useIndividualTrainingStore } from '@/lib/zustand/individualTraining';

interface CreateTrainingProps {
  selectedDate: Date;
}

interface Exercise {
  id: string;
  title: string;
  img: string;
  description: string;
}

interface ExerciseListProps {
  exercises: Exercise[];
  onSelectExercises: (selectedExercises: string[]) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onSelectExercises }) => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId],
    );
  };

  const handleConfirmSelection = () => {
    onSelectExercises(selectedExercises);
    setSelectedExercises([]);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Выберите упражнения для тренировки</h2>
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedExercises.includes(exercise.id)
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 hover:shadow-md'
            }`}
            onClick={() => handleSelectExercise(exercise.id)}>
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={exercise.img} alt={exercise.title} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{exercise.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{exercise.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleConfirmSelection}
        disabled={selectedExercises.length === 0}
        className={`mt-6 w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
          selectedExercises.length === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}>
        Подтвердить выбор ({selectedExercises.length})
      </button>
    </div>
  );
};

export const CreateTraining: React.FC<CreateTrainingProps> = ({ selectedDate }) => {
  const { trainings, templates, addTraining, getTrainingsByDate } = useIndividualTrainingStore();
  console.log('🚀 ~ trainings:', trainings);
  const [isExerciseListVisible, setIsExerciseListVisible] = useState(false);
  const [isTemplateListVisible, setIsTemplateListVisible] = useState(false);

  // Получить тренировки для выбранной даты
  const trainingsForDate = getTrainingsByDate(selectedDate);

  // Обработчик добавления тренировки
  const handleAddTraining = (exerciseIds: string[]) => {
    addTraining(selectedDate, exerciseIds);
    setIsExerciseListVisible(false); // Закрыть список упражнений после добавления
  };

  // Обработчик добавления тренировки из шаблона
  const handleAddTrainingFromTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      addTraining(selectedDate, template.exerciseIds);
      setIsTemplateListVisible(false); // Закрыть список шаблонов после добавления
    }
  };

  return (
    <div className="ml-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Тренировки на {selectedDate.toLocaleDateString('ru-RU')}:
      </h2>
      <ul className="space-y-2 mb-4">
        {trainingsForDate.map((training) => (
          <li key={training.id} className="p-2 border rounded-lg">
            <p className="font-semibold">
              Тренировка от {training.date.toLocaleDateString('ru-RU')}
            </p>
            <p>Упражнения: {training.exerciseIds.join(', ')}</p>
          </li>
        ))}
      </ul>
      {isExerciseListVisible ? (
        <ExerciseList exercises={exercises} onSelectExercises={handleAddTraining} />
      ) : isTemplateListVisible ? (
        <div>
          <h3 className="text-lg font-bold mb-2">Выберите шаблон тренировки:</h3>
          <ul className="space-y-2">
            {templates.map((template) => (
              <li
                key={template.id}
                className="p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handleAddTrainingFromTemplate(template.id)}>
                <p className="font-semibold">{template.description}</p>
                <p>Упражнения: {template.exerciseIds.join(', ')}</p>
              </li>
            ))}
          </ul>
          <Button onClick={() => setIsTemplateListVisible(false)} className="mt-4">
            Назад
          </Button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Button onClick={() => setIsExerciseListVisible(true)}>Создать новую тренировку</Button>
          <Button onClick={() => setIsTemplateListVisible(true)}>Выбрать из шаблонов</Button>
        </div>
      )}
    </div>
  );
};
