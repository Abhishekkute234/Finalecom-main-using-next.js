// app/home/page.tsx
import { Suspense } from 'react';
import HomeServer from './home/HomeServer';


export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full w-12 h-12"></div>
    </div>}>
      <HomeServer />
    </Suspense>
  );
}
