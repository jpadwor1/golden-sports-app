import { ReactNode } from 'react';

export default function MarginWidthWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className='flex flex-col md:ml-[240px] sm:border-r sm:border-gray-700 min-h-screen'>
      {children}
    </div>
  );
}
