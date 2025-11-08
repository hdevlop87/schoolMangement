import React from 'react';
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import NIcon from '../NIcon';
import { AsyncButtonProps } from './type';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

//================================================================//
//================ AsyncButtonIcon Component =====================//

export const AsyncButtonIcon = ({ Licon, ...props }) => (
  <NIcon icon={Licon} {...props} />
);
AsyncButtonIcon.displayName = "AsyncButtonIcon";

//================================================================//
//================= AsyncButtonText Component ====================//

export const AsyncButtonText: React.FC<{ 
  children: React.ReactNode; 
  collapsed?: boolean; 
}> = ({
  children,
  collapsed
}) => {
  return (
    <p className={`transition-opacity duration-200 ease-in-out ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
      {children}
    </p>
  );
};
AsyncButtonText.displayName = "AsyncButtonText";

//================================================================//
//================ Main LoadingButton Component ==================//

export const AsyncButton: React.FC<AsyncButtonProps> = ({
  loading = false,
  className,
  onClick,
  loadingText,
  collapsed,
  variant = 'default',
  disabled = false,
  children,
  form,
  ...props
}) => {
  const buttonType = form ? 'submit' : 'button';

  return (
    <Button
      onClick={onClick}
      type={buttonType}
      className={cn('cursor-pointer',className)}
      variant={variant}
      disabled={disabled}
      form={form}
      {...props}
    >
      {
        loading ? (
          <>
            <ReloadIcon className="h-5 w-5 animate-spin shrink-0" />
            {!collapsed && <Label className='ml-2'>{loadingText}</Label>}
          </>
        ) : children
      }
    </Button>
  );
};
AsyncButton.displayName = "AsyncButton";