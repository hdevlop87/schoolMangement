'use client'
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useSidebarStore from '@/stores/SidebarStore';
import { useSidebarResponsive } from '@/hooks/useSidebarResponsive';
import logo from '@/assets/images/logo.png';

const NavbarSidebarTrigger = () => {
  const { isMobile } = useSidebarResponsive();
  const {  toggleMobileMenu } = useSidebarStore();

  // Only show on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <Image 
      src={logo} 
      alt='logo' 
      className='min-w-11 w-11 h-11 cursor-pointer'
      onClick={toggleMobileMenu}
    />
  );
};

export default NavbarSidebarTrigger;