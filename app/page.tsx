'use client';

import { MyCalendar } from '@/components/native/Calendar';
import { VolumeChart } from '@/components/native/VolumeChart';
import { WeightChart } from '@/components/native/WeightChart';
import { useState } from 'react';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen px-24 py-12">
      <MyCalendar />
      <h2 onClick={() => setIsOpen(!isOpen)} className='cursor-pointer'>Графики ({isOpen ? 'Скрыть' : 'Показать'} )</h2>
      {isOpen && (
        <div className="grid grid-cols-1 gap-8">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">График веса</h3>
            <div>
              <WeightChart />
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">График тоннажа</h3>
            <div>
              <VolumeChart />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
