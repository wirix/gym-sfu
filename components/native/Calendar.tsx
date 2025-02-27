// components/Calendar.tsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export const MyCalendar: React.FC = () => {
  const [date, setDate] = useState<Value>(new Date());
  const [workoutDays, setWorkoutDays] = useState<Date[]>([]);

  const onChange = (newDate: Value) => {
    setDate(newDate);
  };

  const markWorkoutDay = (day: Date) => {
    setWorkoutDays((prev) => [...prev, day]);
  };

  const getWorkoutsThisMonth = () => {
    const currentMonth = new Date().getMonth();
    return workoutDays.filter((day) => day.getMonth() === currentMonth).length;
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && workoutDays.some((d) => d.toDateString() === date.toDateString())) {
      return <div className="workout-day">💪</div>;
    }
    return null;
  };

  return (
    <div>
      <Calendar onChange={onChange} value={date} tileContent={tileContent} />
      <button onClick={() => markWorkoutDay(new Date())}>Отметить тренировку</button>
      <div>Тренировок в этом месяце: {getWorkoutsThisMonth()}</div>
    </div>
  );
};
