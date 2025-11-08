
import React from 'react';
import Image from 'next/image';
import intro from '@/assets/images/loginBackground.png'
import logo from '@/assets/images/logo.png'
import { Toaster } from '@/components/ui/sonner';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';
import { Label } from '@/components/ui/label';

const AuthLayout = ({ children }) => {

    return (
         <div 
            className='flex h-full w-full overflow-hidden relative'
            style={{
                backgroundImage: `url(${intro.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'left',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className='flex flex-col h-full flex-1 justify-center items-center'>
                <Image src={logo} width={120} height={120} alt='noauth' />
                {children}
                <Toaster richColors/>
                <ForgotPasswordDialog />
                <Label className='mt-24 text-muted-foreground'>@2025 all rights reserved</Label>
            </div>
            <div className='h-full w-1/2 hidden lg:flex'>
            </div>
        </div>
    )
}

export default AuthLayout