import { ReactNode } from 'react';

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-col pt-2 px-6 space-y-2 bg-gray-100 flex-grow pb-4'>
      {children}
    </div>
  );
}
