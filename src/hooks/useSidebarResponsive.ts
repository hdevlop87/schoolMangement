
import { useEffect } from 'react';
import useSidebarStore from '@/stores/SidebarStore';
import { useMediaQuery } from 'react-responsive';

export const useIsMobile = () => {
  return useMediaQuery({ maxWidth: 767 });
};

export const useIsTablet = () => {
  return useMediaQuery({ minWidth: 768, maxWidth: 1023 });
};

export const useIsDesktop = () => {
  return useMediaQuery({ minWidth: 1024 });
};

export const useSidebarResponsive = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  
  const { isMobileMenuOpen, closeMobileMenu } = useSidebarStore();
  
  // Auto-close mobile menu when switching to desktop
  useEffect(() => {
    if (isDesktop && isMobileMenuOpen) {
      closeMobileMenu();
    }
  }, [isDesktop, isMobileMenuOpen, closeMobileMenu]);

  return {
    isMobile,
    isTablet, 
    isDesktop,
    shouldShowDesktopSidebar: isDesktop || isTablet,
    shouldShowMobileSidebar: isMobile,
  };
};