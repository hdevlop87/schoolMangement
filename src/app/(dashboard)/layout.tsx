'use client';

import DashboardLoader from '@/components/Loader/DashboardLoader';
import Navbar from '@/components/Nnavbar';
import Sidebar from '@/components/NSidebar';
import { useSession } from '@/hooks/useSession';


const DashboardLayout = ({ children }) => {

  const { sessionLoading, isAuthenticated } = useSession('/login');

  if (sessionLoading) {
    return <DashboardLoader />;
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className='flex h-full w-full p-2 pr-4 gap-4 bg-background'>
      <Sidebar />
      <div className='flex flex-col flex-1 gap-2'>
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;