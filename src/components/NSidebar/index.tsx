'use client'
import React, { useState } from 'react';
import SidebarTrigger from './SidebarTrigger';
import SidebarHeader from './SidebarHeader';
import SidebarContent from './SidebarContent';
import SidebarFooter from './SidebarFooter';
import { Card } from '@/components/ui/card';
import { useSidebarResponsive } from '@/hooks/useSidebarResponsive';
import useSidebarStore from '@/stores/SidebarStore';

const Sidebar = () => {
  const { isMobile } = useSidebarResponsive();
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Get mobile state from Zustand store
  const { isMobileMenuOpen, closeMobileMenu, toggleMobileMenu } = useSidebarStore();
  
  const toggleSidebar = () => {
    if (isMobile) {
      toggleMobileMenu();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden h-full pb-4"
          onClick={closeMobileMenu}
        />
      )}

      <div className={`
        ${isMobile 
          ? `fixed  left-4 z-50 transition-transform h-full duration-300 pb-8 ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-80'
            }`
          : ''
        }
      `}>
        <Card className={`relative text-sidebar-primary-foreground h-full flex flex-col bg-sidebar ${isExpanded ? 'w-44' : 'w-14'} transition-all duration-300 h-full  p-2 justify-between `}>
          <SidebarTrigger isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
          <SidebarHeader isExpanded={isExpanded} />
          <SidebarContent isExpanded={isExpanded} />
          <SidebarFooter isExpanded={isExpanded} />
        </Card>
      </div>
    </>
  );
};

export default Sidebar;