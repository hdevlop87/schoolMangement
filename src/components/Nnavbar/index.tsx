"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Icon from '@/components/NIcon';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import screenfull from 'screenfull';
import { Label } from '../ui/label';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation, useUpdateLang } from '@/hooks/useLanguage';
import NavbarSidebarTrigger from '../NSidebar/NavbarSidebarTrigger';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { updateLang, isLoading: isUpdatingLang } = useUpdateLang();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getPageTitle = () => {
    const pageName = pathname.split('/')[1] || 'dashboard';
    return capitalizeFirstLetter(t(`navigation.${pageName}`));
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  const handleLanguageChange = async (lang) => {
    try {
      await updateLang(lang);
    } catch (error) {
      console.error('Failed to update language:', error);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const themeIcon = mounted ? (theme === 'dark' ? 'sun' : 'moon') : 'sun';
  const pageTitle = getPageTitle();


  return (
    <Card className='flex flex-row justify-between items-center w-full h-12 px-4  border-none shadow-none'>

      <div className='flex justify-center items-center gap-2'>

        <NavbarSidebarTrigger />
        <Label className='text-lg font-semibold'>{pageTitle}</Label>
      </div>

      <div className='flex items-center gap-2'>
        <button className='p-2 rounded-full hover:bg-primary hidden md:flex' onClick={toggleFullscreen}>
          <Icon icon="fullscreen" size={22} className='text-card-foreground' />
        </button>

        <button
          className='p-2 rounded-full hover:bg-primary transition-colors'
          onClick={toggleTheme}>
          <Icon icon={themeIcon} size={22} className='text-card-foreground' />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className='p-2 rounded-full hover:bg-primary transition-colors flex items-center gap-1'
              disabled={isUpdatingLang}
            >
              <Icon
                icon={isUpdatingLang ? "loading" : "translate"}
                size={22}
                className='text-card-foreground'
              />

            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-2`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>

              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}

export default Navbar