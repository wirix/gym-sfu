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
  name: string;
  startTime: Date;
  description?: string;
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
  const { exercises } = useExercisesStore(); // Добавляем этот хук
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
        {exercises.map(
          (
            exercise, // Используем exercises из хранилища
          ) => (
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
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{exercise.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{exercise.description}</p>
                </div>
              </div>
            </div>
          ),
        )}
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

  const [isExerciseListVisible, setIsExerciseListVisible] = useState(false);
  const [isTemplateListVisible, setIsTemplateListVisible] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [activeTraining, setActiveTraining] = useState<ActiveTraining | null>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');
  const [trainingDescription, setTrainingDescription] = useState('');
  const [trainingName, setTrainingName] = useState('Моя тренировка');
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const { addTemplate } = useIndividualTrainingStore();

  const trainingsForDate = getTrainingsByDate(selectedDate);
  const editingTemplate = templates.find((t) => t.id === editingTemplateId);

  const handleSaveTemplate = (updatedExerciseIds: string[]) => {
    if (editingTemplateId) {
      updateTemplate(editingTemplateId, updatedExerciseIds);
      setEditingTemplateId(null);
    }
  };

  const handleAddTraining = (exerciseIds: string[]) => {
    if (!trainingName.trim()) {
      alert('Пожалуйста, введите название тренировки');
      return;
    }
    addTraining(selectedDate, trainingName, exerciseIds, trainingDescription);
    setIsExerciseListVisible(false);
    setTrainingName('Моя тренировка');
    setTrainingDescription('');
  };

  const handleAddTrainingFromTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    addTraining(
      selectedDate,
      template.description, // Используем описание шаблона как название тренировки
      template.exerciseIds,
      `Создано из шаблона: ${template.description}`,
    );
    setIsTemplateListVisible(false);
  };

  const removeTemplate = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот шаблон?')) {
      useIndividualTrainingStore.getState().removeTemplate(id);
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
      name: training.name, // Передаем название
      startTime: new Date(),
      description: training.description,
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
    // @ts-ignore
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
                <p className="font-semibold text-lg">{training.name}</p>
                <p className="text-sm text-gray-500">{training.date.toLocaleDateString('ru-RU')}</p>
                {training.description && (
                  <p className="text-sm text-gray-600 mt-1">{training.description}</p>
                )}
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
      {isTemplateListVisible && (
        <div>
          <h3 className="text-lg font-bold mb-2">Шаблоны тренировок:</h3>

          {/* Кнопка создания шаблона */}
          <Button
            onClick={() => setIsCreateTemplateModalOpen(true)}
            className="mb-4 bg-green-500 hover:bg-green-600 text-white">
            + Создать новый шаблон
          </Button>

          {/* Список шаблонов */}
          <ul className="space-y-2">
            {templates.map((template) => (
              <li key={template.id} className="p-2 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{template.description}</p>
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
                      Редактировать
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Удалить этот шаблон?')) {
                          removeTemplate(template.id);
                        }
                      }}>
                      Удалить
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Кнопка назад */}
          <Button onClick={() => setIsTemplateListVisible(false)} className="mt-4">
            Назад
          </Button>

          {/* Модальное окно создания шаблона */}
          {isCreateTemplateModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Создать новый шаблон</h3>
                <Input
                  placeholder="Название шаблона*"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="mb-4"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateTemplateModalOpen(false);
                      setNewTemplateName('');
                    }}
                    className="flex-1">
                    Отмена
                  </Button>
                  <Button
                    onClick={() => {
                      if (newTemplateName.trim()) {
                        addTemplate(newTemplateName.trim(), []);
                        setIsCreateTemplateModalOpen(false);
                        setNewTemplateName('');
                      }
                    }}
                    disabled={!newTemplateName.trim()}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                    Создать
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {isExerciseListVisible ? (
        <div className="space-y-4">
          <Input
            placeholder="Название тренировки*"
            value={trainingName}
            onChange={(e) => setTrainingName(e.target.value)}
            className="mb-2"
            required
          />
          <Textarea
            placeholder="Описание тренировки (необязательно)"
            value={trainingDescription}
            onChange={(e) => setTrainingDescription(e.target.value)}
            className="mb-4"
          />
          <ExerciseList exercises={exercises} onSelectExercises={handleAddTraining} />
        </div>
      ) : isTemplateListVisible ? (
        editingTemplateId && (
          <EditTemplateExercises
            initialExerciseIds={editingTemplate?.exerciseIds || []}
            onSave={handleSaveTemplate}
            onCancel={() => setEditingTemplateId(null)}
          />
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
