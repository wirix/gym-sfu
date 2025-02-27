'use client';

import { MyCalendar } from '@/components/native/Calendar';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MyCalendar />
    </main>
  );
}
