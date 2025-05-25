'use client';

import { useTrainingStore } from '@/lib/zustand/trainingСalendar';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from '../ui/button';
import { useIndividualTrainingStore } from '@/lib/zustand/individualTraining';
import { StatsModal } from './StatsModal';
import { TrainingStatsModal } from './TrainingStatsModal';
import { ActiveTraining, CreateTraining } from './ExerciseList';
import { TrainingScreen } from './TrainingScreen';
import { useExercisesStore } from '@/lib/zustand/exercisesStore';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const MyCalendar: React.FC = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [activeTraining, setActiveTraining] = useState<ActiveTraining | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');

  const { calendar } = useTrainingStore();
  const { exercises } = useExercisesStore();
  const { trainings: individualTrainings } = useIndividualTrainingStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Обработчики событий
  const handleDateClick = (value: Date) => {
    setSelectedDate(value);
    setShowTrainingModal(true); // Показываем модалку с тренировками
    setShowStatsModal(false); // Убедимся, что графики скрыты
  };

  const handleOpenStats = () => {
    setShowStatsModal(true); // Показываем графики
    setShowTrainingModal(false); // Убедимся, что тренировки скрыты
  };

  const getTrainingsForMonth = (year: number, month: number) => {
    return calendar.years[year]?.[month] || [];
  };

  const getTrainingsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Тренировки из useTrainingStore
    const monthTrainings = getTrainingsForMonth(year, month);
    const trainingsFromStore = monthTrainings.filter((training) => {
      const trainingDate = new Date(training.date);
      return (
        trainingDate.getFullYear() === year &&
        trainingDate.getMonth() === month &&
        trainingDate.getDate() === day
      );
    });

    // Тренировки из useIndividualTrainingStore
    const trainingsFromIndividualStore = individualTrainings.filter((training) => {
      const trainingDate = new Date(training.date);
      return (
        trainingDate.getFullYear() === year &&
        trainingDate.getMonth() === month &&
        trainingDate.getDate() === day
      );
    });

    return [...trainingsFromStore, ...trainingsFromIndividualStore];
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const trainings = getTrainingsForDate(date);
      if (trainings.length > 0) {
        return (
          <div className="flex justify-center items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  const handleStartTraining = (trainingId: string) => {
    let training = individualTrainings.find((t) => t.id === trainingId);

    // Если не нашли, ищем в завершенных
    if (!training) {
      const allCompleted = Object.values(calendar.years).flatMap((year) =>
        Object.values(year).flatMap((month) => month),
      );
      training = allCompleted.find((t) => t.id === trainingId);
    }

    if (!training) return;

    setActiveTraining({
      id: training.id,
      name: training.name,
      startTime: new Date(),
      description: training.description,
      exercises: training.exerciseIds.map((exId) => ({
        id: exId,
        title: exercises.find((e) => e.id === exId)?.title || exId,
        approaches: [{ id: Date.now().toString(), weight: null, reps: null, feeling: null }],
      })),
    });
  };

  if (!isClient) {
    return null; // или лоадер
  }

  if (activeTraining) {
    return (
      <TrainingScreen
        training={activeTraining}
        onFinish={(updatedExercises) => {
          // Получаем текущую дату или используем selectedDate
          const trainingDate = selectedDate || new Date();
          const year = trainingDate.getFullYear();
          const month = trainingDate.getMonth();

          // Создаем объект завершенной тренировки
          const completedTraining = {
            id: activeTraining.id,
            date: trainingDate,
            name: activeTraining.name,
            description: activeTraining.description,
            runtime: Math.floor((new Date().getTime() - activeTraining.startTime.getTime()) / 1000),
            wt: currentWeight,
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
            isCompleted: true,
          };

          // Сохраняем в хранилище
          useTrainingStore.getState().addTraining(year, month, completedTraining);

          // Сбрасываем состояние
          setActiveTraining(null);
          setCurrentWeight(null);
          setDescription('');
        }}
        currentWeight={currentWeight}
        onWeightChange={(weight) => setCurrentWeight(weight)}
        description={description}
        onDescriptionChange={(desc) => setDescription(desc)}
      />
    );
  }

  return (
    <div className="flex">
      <div className="w-60">
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          onClickDay={handleDateClick}
          className="w-full"
        />
        <div className="flex flex-col gap-4 w-full">
          <Button onClick={handleOpenStats} className="w-full rounded-none">
            Открыть статистику
          </Button>
        </div>
      </div>

      {/* Модальное окно статистики (графики) */}
      <StatsModal isOpen={showStatsModal} onClose={() => setShowStatsModal(false)} />

      {/* Модальное окно тренировок */}
      {selectedDate && (
        <TrainingStatsModal
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            setShowTrainingModal(false);
          }}
          isOpen={showTrainingModal}
          onStartTraining={handleStartTraining}
        />
      )}

      {/* Компонент создания тренировки */}
      {date instanceof Date && <CreateTraining selectedDate={date} />}
      
    </div>
  );
};
