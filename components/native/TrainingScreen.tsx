/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ActiveTraining } from './ExerciseList';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Textarea } from '../ui/textarea';
import { useLastExercisesStore } from '@/lib/zustand/lastExercisesStore';

interface TrainingScreenProps {
  training: ActiveTraining;
  onFinish: (updatedExercises: ActiveTraining['exercises']) => void;
  currentWeight: number | null;
  onWeightChange: (weight: number | null) => void;
  description: string;
  onDescriptionChange: (desc: string) => void;
}

export const TrainingScreen: React.FC<TrainingScreenProps> = ({
  training,
  onFinish,
  
  currentWeight,
  onWeightChange,
  description,
  onDescriptionChange,
}) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [currentExercises, setCurrentExercises] = useState(training.exercises);
  const { getExercise, updateExercise } = useLastExercisesStore();

  // Секундомер
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);
  // При завершении тренировки сохраняем результаты
  const handleFinish = () => {
    // Сохраняем последние подходы для каждого упражнения
    currentExercises.forEach((exercise) => {
      if (exercise.approaches.length > 0) {
        updateExercise(
          exercise.id,
          exercise.approaches.map((approach) => ({
            weight: approach.weight,
            reps: approach.reps,
            feeling: approach.feeling,
          })),
        );
      }
    });

    onFinish(currentExercises);
  };

  const handleAddApproach = (exerciseId: string) => {
    setCurrentExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              approaches: [
                ...ex.approaches,
                { id: Date.now().toString(), weight: null, reps: null, feeling: null },
              ],
            }
          : ex,
      ),
    );
  };

  const handleValueChange = (exerciseId: string, approachId: string, field: string, value: any) => {
    setCurrentExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              approaches: ex.approaches.map((app) =>
                app.id === approachId ? { ...app, [field]: value } : app,
              ),
            }
          : ex,
      ),
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen pb-24">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{training.name}</h2>
        <div className="mb-4">
          <Textarea
            value={currentWeight || ''}
            onChange={(e) => onWeightChange(e.target.value ? Number(e.target.value) : null)}
            placeholder="Введите ваш текущий вес"
          />
        </div>
        <div className="space-y-8">
          {currentExercises.map((exercise) => {
            const lastExercise = getExercise(exercise.id);

            return (
              <div key={exercise.id} className="border rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4">{exercise.title}</h3>

                <div className="space-y-4">
                  {exercise.approaches.map((approach, idx) => {
                    const lastApproach = lastExercise?.approaches[idx];

                    return (
                      <div
                        key={approach.id}
                        className="grid grid-cols-3 gap-4 items-center relative">
                        <div>
                          <p className="text-sm text-gray-500">Подход {idx + 1}</p>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="Вес (кг)"
                              value={approach.weight ?? ''}
                              onChange={(e) =>
                                handleValueChange(
                                  exercise.id,
                                  approach.id,
                                  'weight',
                                  e.target.value === '' ? null : Number(e.target.value),
                                )
                              }
                            />
                            {lastApproach?.weight && (
                              <span className="absolute right-2 top-2 text-xs text-gray-400">
                                ({lastApproach.weight} кг)
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Повторения</p>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="Кол-во"
                              value={approach.reps || ''}
                              onChange={(e) =>
                                handleValueChange(
                                  exercise.id,
                                  approach.id,
                                  'reps',
                                  Number(e.target.value),
                                )
                              }
                            />
                            {lastApproach?.reps && (
                              <span className="absolute right-2 top-2 text-xs text-gray-400">
                                ({lastApproach.reps})
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ощущения</p>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[approach.feeling ?? 3]}
                            onValueChange={(val) =>
                              handleValueChange(exercise.id, approach.id, 'feeling', val[0])
                            }
                            className="w-full max-w-[200px]"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Сложно</span>
                            <span>Нормально</span>
                            <span>Легко</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleAddApproach(exercise.id)}>
                  + Добавить подход
                </Button>
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">Заметки к тренировке</label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Запишите свои заметки о тренировке..."
            className="min-h-[100px]"
          />
        </div>

        <Button className="mt-8 w-full" onClick={handleFinish}>
          Завершить тренировку
        </Button>
      </div>

      {/* Секундомер (фиксированный внизу) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Button
            variant={isRunning ? 'outline' : 'default'}
            onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Пауза' : 'Продолжить'}
          </Button>
          <div className="text-2xl font-mono">{formatTime(time)}</div>
          <Button variant="ghost" onClick={handleFinish}>
            Завершить
          </Button>
        </div>
      </div>
    </div>
  );
};
