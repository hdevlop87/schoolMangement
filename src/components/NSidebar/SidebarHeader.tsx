import React from 'react'
import logo from '@/assets/images/logo.png';
import Image from 'next/image';
import { Label } from '../ui/label';

type HeaderProps = {
   isExpanded: boolean;
}

const SidebarHeader: React.FC<HeaderProps> = () => {
   return (
      <div className='flex justify-center items-center gap-2'>
         <Image src={logo} alt='logo' className='min-w-12 w-10 h-10'/>
         {/* <Label className='font-bold text-2xl'>JHL</Label> */}
      </div>
   )
}

export default SidebarHeader