import { FC } from 'react';
import { AsyncButton, AsyncButtonIcon, AsyncButtonText } from './AsyncButton';
import { ButtonProps } from './type';
import { cn } from '@/lib/utils';

const LoginButton: FC<ButtonProps> = ({ onClick, loading, className, ...props }) => {

   return (
      <AsyncButton
         loading={loading}
         onClick={onClick}
         loadingText="Logging in..."
         className={cn("flex justify-center items-center w-full [&_svg]:size-5", className)}
         variant="default"
         disabled={loading}
         {...props}
      >
         <AsyncButtonIcon Licon="log-in" />
         <AsyncButtonText>Login</AsyncButtonText>
      </AsyncButton>
   );

};

export default LoginButton