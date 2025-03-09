'use client';

import { useTrainingStore } from '@/lib/zustand/trainingСalendar';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { CreateTraining } from './ExerciseList';
import { Button } from '../ui/button';
import { useIndividualTrainingStore } from '@/lib/zustand/individualTraining';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const MyCalendar: React.FC = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [isOpenCreateTraining, setIsOpenCreateTraining] = useState(false);

  const { calendar } = useTrainingStore();
  const { trainings: individualTrainings } = useIndividualTrainingStore();

  // Обработчик изменения даты в календаре
  const onChange = (newDate: Value) => {
    setDate(newDate);
  };

  // Форматирование даты для отображения в кнопке
  const formatDate = (date: Date | null) => {
    if (!date) return 'сегодня';
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  // Получить тренировки для текущего месяца из useTrainingStore
  const getTrainingsForMonth = (year: number, month: number) => {
    const monthTrainings = calendar.years[year]?.[month] || [];
    return monthTrainings;
  };

  // Получить тренировки для выбранной даты из обоих хранилищ
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

  // Функция для отображения маркера на днях с тренировками
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

  return (
    <div className="flex">
      <div className="w-60">
        <Calendar onChange={onChange} value={date} tileContent={tileContent} />
      </div>
      <div className="flex flex-col gap-4 mx-4">
        <Button onClick={() => setIsOpenCreateTraining((prev) => !prev)}>
          {isOpenCreateTraining
            ? 'Скрыть тренировки'
            : 'Добавить тренировку на ' + formatDate(date as Date)}
        </Button>
        <Button>Начать тренировку на {formatDate(date as Date)}</Button>
      </div>
      {isOpenCreateTraining && date instanceof Date && <CreateTraining selectedDate={date} />}
    </div>
  );
};
