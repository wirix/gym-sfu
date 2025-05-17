'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTrainingStore } from '@/lib/zustand/trainingСalendar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const VolumeChart = () => {
  const { calendar } = useTrainingStore();

  // Собираем данные о тоннаже
  const volumeData = [];
  const labels = [];

  for (const year in calendar.years) {
    for (const month in calendar.years[year]) {
      calendar.years[year][month].forEach((training) => {
        let totalVolume = 0;
        training.exercises.forEach((exercise) => {
          exercise.approaches.forEach((approach) => {
            if (approach.wt && approach.reps) {
              totalVolume += approach.wt * approach.reps;
            }
          });
        });

        if (totalVolume > 0) {
          labels.push(training.date.toLocaleDateString());
          volumeData.push(totalVolume);
        }
      });
    }
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Тоннаж (кг)',
        data: volumeData,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
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
        text: 'Динамика тренировочного тоннажа',
      },
    },
  };

  return <Bar options={options} data={data} />;
};
