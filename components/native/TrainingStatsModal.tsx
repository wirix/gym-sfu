// components/DateTrainingModal.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useExercisesStore } from '@/lib/zustand/exercisesStore';
import { useIndividualTrainingStore } from '@/lib/zustand/individualTraining';
import { useTrainingStore } from '@/lib/zustand/trainingСalendar';
import { formatDuration } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ExerciseList } from './ExerciseList';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

interface DateTrainingModalProps {
  date: Date;
  onClose: () => void;
  isOpen: boolean;
  onStartTraining: (trainingId: string) => void;
}

export const TrainingStatsModal = ({
  date,
  onClose,
  isOpen,
  onStartTraining,
}: DateTrainingModalProps) => {
  // Хранилища
  const { calendar } = useTrainingStore();
  const { trainings, templates, addTraining, removeTraining, getTrainingsByDate, addTemplate } =
    useIndividualTrainingStore();
  const { exercises: allExercises } = useExercisesStore();

  // Состояния для создания тренировки
  const [trainingName, setTrainingName] = useState('Моя тренировка');
  const [trainingDescription, setTrainingDescription] = useState('');
  const [isExerciseListVisible, setIsExerciseListVisible] = useState(false);
  const [isTemplateListVisible, setIsTemplateListVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'create' | 'templates'>('stats');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen) return null;
  if (!isMounted) return null;

  // Получаем тренировки для выбранной даты
  const getTrainingsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Завершенные тренировки
    const monthTrainings = calendar.years[year]?.[month] || [];
    const completedTrainings = monthTrainings.filter((training) => {
      const trainingDate = new Date(training.date);
      return (
        trainingDate.getFullYear() === year &&
        trainingDate.getMonth() === month &&
        trainingDate.getDate() === day
      );
    });

    // Запланированные тренировки
    const plannedTrainings = trainings.filter((training) => {
      const trainingDate = new Date(training.date);
      return (
        trainingDate.getFullYear() === year &&
        trainingDate.getMonth() === month &&
        trainingDate.getDate() === day
      );
    });

    return { completedTrainings, plannedTrainings };
  };

  const { completedTrainings, plannedTrainings } = getTrainingsForDate(date);

  // Функции для работы с тренировками
  const calculateExerciseVolume = (exercise: any) => {
    return exercise.approaches.reduce((total: number, approach: any) => {
      const weight = approach.wt !== undefined ? approach.wt : approach.weight;
      const reps = approach.reps || 0;
      return total + (weight || 0) * reps;
    }, 0);
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = allExercises.find((ex) => ex.id === exerciseId);
    return exercise ? exercise.title : exerciseId;
  };

  const handleAddTraining = (exerciseIds: string[]) => {
    if (!trainingName.trim()) {
      alert('Пожалуйста, введите название тренировки');
      return;
    }
    addTraining(date, trainingName, exerciseIds, trainingDescription);
    setIsExerciseListVisible(false);
    setTrainingName('Моя тренировка');
    setTrainingDescription('');
    setActiveTab('stats');
  };

  const handleAddTrainingFromTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    addTraining(
      date,
      template.description,
      template.exerciseIds,
      `Создано из шаблона: ${template.description}`,
    );
    setIsTemplateListVisible(false);
    setActiveTab('stats');
  };

  const handleRemoveTraining = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту тренировку?')) {
      removeTraining(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {activeTab === 'stats'
            ? 'Статистика'
            : activeTab === 'create'
            ? 'Создать тренировку'
            : 'Шаблоны'}{' '}
          за {date.toLocaleDateString('ru-RU')}
        </h2>

        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('stats')}>
            Статистика
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}>
            Создать новую
          </Button>
          <Button
            variant={activeTab === 'templates' ? 'default' : 'outline'}
            onClick={() => setActiveTab('templates')}>
            Шаблоны
          </Button>
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Завершенные тренировки */}
            {completedTrainings.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Выполненные тренировки</h3>
                {completedTrainings.map((training) => (
                  <div key={training.id} className="mb-6 border-b pb-4">
                    <h4 className="text-lg font-medium mb-2">
                      {training.description || 'Тренировка'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <span className="text-gray-600">Длительность:</span>
                      <span>{formatDuration(training.runtime || 0)}</span>
                      <span className="text-gray-600">Вес:</span>
                      <span>{training.wt ? `${training.wt} кг` : '-'}</span>
                    </div>

                    <h5 className="font-medium mt-3 mb-2">Упражнения:</h5>
                    <ul className="space-y-3">
                      {training.exercises.map((exercise) => {
                        const totalVolume = calculateExerciseVolume(exercise);
                        const totalReps = exercise.approaches.reduce(
                          (sum, approach) => sum + (approach.reps || 0),
                          0,
                        );

                        return (
                          <li
                            key={exercise.id}
                            className="pl-4 border-l-4 border-blue-500 bg-gray-50 p-3 rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-lg">{exercise.title}</div>
                                <div className="flex gap-4 mt-1 text-sm">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Подходы: {exercise.approaches.length}
                                  </span>
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Повторения: {totalReps}
                                  </span>
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    Тоннаж: {totalVolume} кг
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">Средний вес</div>
                                <div className="font-bold">
                                  {Math.round(
                                    exercise.approaches.reduce(
                                      (sum, a) => sum + (a.wt !== undefined ? a.wt : a.weight || 0),
                                      0,
                                    ) / exercise.approaches.length,
                                  )}{' '}
                                  кг
                                </div>
                              </div>
                            </div>

                            <div className="mt-2 text-xs text-gray-500">
                              {exercise.approaches.map((approach, index) => (
                                <div key={index}>
                                  Подход {index + 1}: {approach.wt || approach.weight || 0}кг ×{' '}
                                  {approach.reps || 0}
                                </div>
                              ))}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Запланированные тренировки */}
            {plannedTrainings.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Запланированные тренировки</h3>
                {plannedTrainings.map((training) => (
                  <div key={training.id} className="mb-4 border-b pb-4">
                    <h4 className="text-lg font-medium mb-2">{training.name}</h4>
                    <p className="text-gray-600 mb-2">{training.description || 'Без описания'}</p>
                    <h5 className="font-medium mt-3 mb-2">Упражнения:</h5>
                    <ul className="space-y-2">
                      {training.exerciseIds.map((id) => (
                        <li key={id} className="pl-4 border-l-2 border-gray-200">
                          {getExerciseName(id)}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (training.exerciseIds.length === 0) {
                            alert('Добавьте упражнения в тренировку перед началом');
                            return;
                          }
                          onStartTraining(training.id);
                          onClose();
                        }}>
                        Начать
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveTraining(training.id)}>
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {completedTrainings.length === 0 && plannedTrainings.length === 0 && (
              <p className="text-gray-500 text-center py-4">Нет тренировок на эту дату</p>
            )}
          </div>
        )}

        {activeTab === 'create' && (
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
            {isExerciseListVisible ? (
              <ExerciseList exercises={allExercises} onSelectExercises={handleAddTraining} />
            ) : (
              <Button onClick={() => setIsExerciseListVisible(true)} className="w-full">
                Выбрать упражнения
              </Button>
            )}
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <Button
              onClick={() => setIsCreateTemplateModalOpen(true)}
              className="mb-4 bg-green-500 hover:bg-green-600 text-white">
              + Создать новый шаблон
            </Button>

            {templates.length > 0 ? (
              <ul className="space-y-2">
                {templates.map((template) => (
                  <li key={template.id} className="p-2 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{template.description}</p>
                        <ul className="list-disc pl-5 mt-1 text-sm text-gray-600">
                          {template.exerciseIds.map((id) => (
                            <li key={id}>{getExerciseName(id)}</li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTrainingFromTemplate(template.id)}>
                        Выбрать
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">Нет доступных шаблонов</p>
            )}
          </div>
        )}

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

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Закрыть</Button>
        </div>
      </div>
    </div>
  );
};
