'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { exercises } from '@/lib/mock/db-exercises';
import Image from 'next/image';
import { useIndividualTrainingStore } from '@/lib/zustand/individualTraining';
import { TrainingScreen } from './TrainingScreen';
import { useTrainingStore } from '@/lib/zustand/trainingСalendar';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { useExercisesStore } from '@/lib/zustand/exercisesStore';

interface CreateTrainingProps {
  selectedDate: Date;
}

interface EditTemplateExercisesProps {
  initialExerciseIds: string[];
  onSave: (updatedExerciseIds: string[]) => void;
  onCancel: () => void;
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

export interface ActiveTraining {
  id: string;
  startTime: Date;
  exercises: {
    id: string;
    title: string;
    approaches: {
      id: string;
      weight: number | null;
      reps: number | null;
      feeling: 1 | 2 | 3 | 4 | 5 | null;
    }[];
  }[];
}

export const ExerciseList: React.FC<ExerciseListProps> = ({ onSelectExercises }) => {
  const { exercises, addExercise } = useExercisesStore();
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newExercise, setNewExercise] = useState({
    title: '',
    img: '',
    description: '',
  });

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId],
    );
  };

  const handleConfirmSelection = () => {
    onSelectExercises(selectedExercises);
    setSelectedExercises([]);
  };

  const handleAddCustomExercise = () => {
    if (newExercise.title.trim()) {
      addExercise({
        title: newExercise.title,
        img: newExercise.img || '/default-exercise.jpg',
        description: newExercise.description,
      });
      setNewExercise({ title: '', img: '', description: '' });
      setIsAddingCustom(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Выберите упражнения для тренировки</h2>

      {isAddingCustom ? (
        <div className="space-y-4 mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">Добавить свое упражнение</h3>
          <Input
            placeholder="Название упражнения"
            value={newExercise.title}
            onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })}
          />
          <Input
            placeholder="URL изображения (необязательно)"
            value={newExercise.img}
            onChange={(e) => setNewExercise({ ...newExercise, img: e.target.value })}
          />
          <Textarea
            placeholder="Описание упражнения"
            value={newExercise.description}
            onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAddingCustom(false)} className="flex-1">
              Отмена
            </Button>
            <Button
              onClick={handleAddCustomExercise}
              disabled={!newExercise.title.trim()}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white">
              Добавить
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsAddingCustom(true)} variant="outline" className="w-full mb-6">
          + Добавить свое упражнение
        </Button>
      )}

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
                <Image
                  src={exercise.img || '/default-exercise.jpg'}
                  alt={exercise.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-exercise.jpg';
                  }}
                />
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

export const EditTemplateExercises: React.FC<EditTemplateExercisesProps> = ({
  initialExerciseIds,
  onSave,
  onCancel,
}) => {
  const [selectedExercises, setSelectedExercises] = useState<string[]>(initialExerciseIds);

  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId],
    );
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto mt-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Редактирование шаблона</h2>
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
      <div className="flex gap-4 mt-6">
        <Button
          onClick={() => onSave(selectedExercises)}
          className="bg-blue-500 hover:bg-blue-600 text-white">
          Сохранить изменения
        </Button>
        <Button onClick={onCancel} variant="outline">
          Отмена
        </Button>
      </div>
    </div>
  );
};

export const CreateTraining: React.FC<CreateTrainingProps> = ({ selectedDate }) => {
  const { trainings, templates, addTraining, updateTemplate, removeTraining, getTrainingsByDate } =
    useIndividualTrainingStore();
  console.log('🚀 ~ trainings:', trainings); //

  const [isExerciseListVisible, setIsExerciseListVisible] = useState(false);
  const [isTemplateListVisible, setIsTemplateListVisible] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [activeTraining, setActiveTraining] = useState<ActiveTraining | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');

  const trainingsForDate = getTrainingsByDate(selectedDate);
  const editingTemplate = templates.find((t) => t.id === editingTemplateId);

  const handleSaveTemplate = (updatedExerciseIds: string[]) => {
    if (editingTemplateId) {
      updateTemplate(editingTemplateId, updatedExerciseIds);
      setEditingTemplateId(null);
    }
  };

  const handleAddTraining = (exerciseIds: string[]) => {
    addTraining(selectedDate, exerciseIds);
    setIsExerciseListVisible(false);
  };

  const handleAddTrainingFromTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      addTraining(selectedDate, template.exerciseIds);
      setIsTemplateListVisible(false);
    }
  };

  const handleRemoveTraining = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту тренировку?')) {
      removeTraining(id);
    }
  };

  const handleStartTraining = (trainingId: string) => {
    const training = trainings.find((t) => t.id === trainingId);
    if (!training) return;

    setActiveTraining({
      id: training.id,
      startTime: new Date(),
      exercises: training.exerciseIds.map((exId) => ({
        id: exId,
        title: exercises.find((e) => e.id === exId)?.title || exId,
        approaches: [{ id: Date.now().toString(), weight: null, reps: null, feeling: null }],
      })),
    });
  };

  const handleFinishTraining = (updatedExercises: ActiveTraining['exercises']) => {
    if (!activeTraining) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeTraining.startTime.getTime()) / 1000);

    const calendarTraining = {
      id: activeTraining.id,
      date: selectedDate,
      description: description, // используем состояние из CreateTraining
      runtime: duration,
      wt: currentWeight, // используем состояние из CreateTraining
      exercises: updatedExercises.map((exercise) => ({
        id: exercise.id,
        title: exercise.title,
        approaches: exercise.approaches.map((approach) => ({
          id: approach.id,
          wt: approach.weight,
          reps: approach.reps,
          feeling: approach.feeling,
        })),
      })),
    };

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    useTrainingStore.getState().addTraining(year, month, calendarTraining);

    setActiveTraining(null);
    setCurrentWeight(null);
    setDescription('');
  };

  if (activeTraining) {
    return (
      <TrainingScreen
        training={activeTraining}
        onFinish={handleFinishTraining}
        currentWeight={currentWeight}
        onWeightChange={setCurrentWeight}
        description={description}
        onDescriptionChange={setDescription}
      />
    );
  }

  return (
    <div className="ml-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Тренировки на {selectedDate.toLocaleDateString('ru-RU')}:
      </h2>
      <ul className="space-y-2 mb-4">
        {trainingsForDate.map((training) => (
          <li key={training.id} className="p-2 border rounded-lg group hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  Тренировка от {training.date.toLocaleDateString('ru-RU')}
                </p>
                {/* Измененная часть - список упражнений */}
                <ul className="list-disc pl-5 mt-1">
                  {training.exerciseIds.map((id) => {
                    const exercise = exercises.find((ex) => ex.id === id);
                    return (
                      <li key={id} className="text-sm">
                        {exercise?.title || id}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleStartTraining(training.id)}>
                  Начать
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveTraining(training.id)}>
                  Удалить
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {isExerciseListVisible ? (
        <ExerciseList exercises={exercises} onSelectExercises={handleAddTraining} />
      ) : isTemplateListVisible ? (
        editingTemplateId ? (
          <EditTemplateExercises
            initialExerciseIds={editingTemplate?.exerciseIds || []}
            onSave={handleSaveTemplate}
            onCancel={() => setEditingTemplateId(null)}
          />
        ) : (
          <div>
            <h3 className="text-lg font-bold mb-2">
              {editingTemplateId ? 'Редактирование шаблона' : 'Выберите шаблон тренировки:'}
            </h3>

            {editingTemplateId ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-2">Текущие упражнения:</h4>
                  <ul className="list-disc pl-5">
                    {editingTemplate?.exerciseIds.map((id) => {
                      const exercise = exercises.find((ex) => ex.id === id);
                      return <li key={id}>{exercise?.title || id}</li>;
                    })}
                  </ul>
                </div>

                <ExerciseList
                  exercises={exercises}
                  onSelectExercises={(selectedIds) => {
                    if (editingTemplateId) {
                      updateTemplate(editingTemplateId, selectedIds);
                      setEditingTemplateId(null);
                    }
                  }}
                />

                <Button
                  variant="outline"
                  onClick={() => setEditingTemplateId(null)}
                  className="w-full">
                  Отменить редактирование
                </Button>
              </div>
            ) : (
              <>
                <ul className="space-y-2">
                  {templates.map((template) => (
                    <li key={template.id} className="p-2 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{template.description || 'Без названия'}</p>
                          <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                            {template.exerciseIds.map((id) => {
                              const exercise = exercises.find((ex) => ex.id === id);
                              return <li key={id}>{exercise?.title || id}</li>;
                            })}
                          </ul>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddTrainingFromTemplate(template.id);
                            }}>
                            Выбрать
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTemplateId(template.id);
                            }}>
                            Изменить
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button onClick={() => setIsTemplateListVisible(false)} className="mt-4">
                  Назад
                </Button>
              </>
            )}
          </div>
        )
      ) : (
        <div className="flex gap-4">
          <Button onClick={() => setIsExerciseListVisible(true)}>Создать новую тренировку</Button>
          <Button onClick={() => setIsTemplateListVisible(true)}>Выбрать из шаблонов</Button>
        </div>
      )}
    </div>
  );
};
