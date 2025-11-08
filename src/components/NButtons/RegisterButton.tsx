import { FC } from 'react';
import { AsyncButton, AsyncButtonIcon, AsyncButtonText } from './AsyncButton';
import { ButtonProps } from './type';
import { cn } from '@/lib/utils';

const RegisterButton: FC<ButtonProps> = ({ onClick, loading, className, ...props }) => {

   return (
      <AsyncButton
         loading={loading}
         onClick={onClick}
         loadingText="Registering..."
         className={cn("flex justify-center items-center w-full [&_svg]:size-5 ", className)}
         variant="default"
         disabled={loading}
         {...props}
      >
         <AsyncButtonIcon Licon="user-round-plus"/>
         <AsyncButtonText>Register</AsyncButtonText>
      </AsyncButton>
   );
};

export default RegisterButton