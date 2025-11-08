import { FC } from 'react';
import { AsyncButton, AsyncButtonIcon, AsyncButtonText } from './AsyncButton';
import { ButtonProps } from './type';
import { cn } from '@/lib/utils';

const SubmitButton: FC<ButtonProps> = ({ onClick, loading,confirmText,variant, className, ...props }) => {
    return (
      <AsyncButton
         loading={loading}
         onClick={onClick}
         loadingText="Submitting..."
         className={cn("flex justify-center items-center w-full [&_svg]:size-5", className)}
         variant={variant}
         disabled={loading}
         {...props}
      >
         <AsyncButtonIcon Licon="check" />
         <AsyncButtonText>{confirmText}</AsyncButtonText>
      </AsyncButton>
   );
};

export default SubmitButton;