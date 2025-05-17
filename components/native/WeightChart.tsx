'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTrainingStore } from '@/lib/zustand/trainingСalendar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const WeightChart = () => {
  const { calendar } = useTrainingStore();

  // Собираем данные о весе из всех тренировок
  const weightData = [];
  const labels = [];

  // Проходим по всем годам и месяцам
  for (const year in calendar.years) {
    for (const month in calendar.years[year]) {
      calendar.years[year][month].forEach((training) => {
        if (training.wt !== null) {
          labels.push(training.date.toLocaleDateString());
          weightData.push(training.wt);
        }
      });
    }
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Вес (кг)',
        data: weightData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Динамика изменения веса',
      },
    },
  };

  return <Line options={options} data={data} />;
};
