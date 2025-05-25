// components/StatsChartsModal.tsx
'use client';

import { VolumeChart } from './VolumeChart';
import { WeightChart } from './WeightChart';
import { Button } from '../ui/button';

interface StatsChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsChartsModal = ({ isOpen, onClose }: StatsChartsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Графики тренировок</h2>

        <div className="grid grid-cols-1 gap-8">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">График веса</h3>
            <div className="h-64">
              <WeightChart />
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">График тоннажа</h3>
            <div className="h-64">
              <VolumeChart />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Закрыть</Button>
        </div>
      </div>
    </div>
  );
};
