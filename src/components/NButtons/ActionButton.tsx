import { FC } from 'react';
import { AsyncButton, AsyncButtonIcon, AsyncButtonText } from './AsyncButton';
import { AsyncButtonProps } from './type';
import { cn } from '@/lib/utils';

const ActionButton: FC<AsyncButtonProps> = ({
  onClick,
  loading,
  text,
  variant,
  className,
  icon = 'check',
  loadingText = 'Processing...',
  disabled = false,
  form,
  ...props
}) => {
  return (
    <AsyncButton
      loading={loading}
      onClick={onClick}
      loadingText={loadingText}
      className={cn("flex justify-center items-center w-full [&_svg]:size-5", className)}
      variant={variant}
      disabled={loading || disabled}
      form={form}
      {...props}
    >
      <AsyncButtonIcon Licon={icon} />
      <AsyncButtonText>{text}</AsyncButtonText>
    </AsyncButton>
  );
};

export default ActionButton;