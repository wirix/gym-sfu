import { useTrainingStore } from '@/lib/zustand/trainingСalendar';
import { useState } from 'react';

export function FinishTrainingForm() {
  const [notes, setNotes] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const { activeTraining, finishTraining } = useTrainingStore();

  const handleFinish = () => {
    if (!activeTraining) return;

    const date = activeTraining.date;
    const exercises = activeTraining.exercises;

    finishTraining(date, notes, parseFloat(bodyWeight), exercises);
  };

  return (
    <div className="p-4 border rounded space-y-4">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Заметка к тренировке"
        className="w-full border p-2"
      />
      <input
        type="number"
        value={bodyWeight}
        onChange={(e) => setBodyWeight(e.target.value)}
        placeholder="Текущий вес (кг)"
        className="w-full border p-2"
      />
      <button onClick={handleFinish} className="px-4 py-2 bg-green-500 text-white rounded">
        Завершить тренировку
      </button>
    </div>
  );
}
