export interface AsyncButtonProps {
  icon?: string;
  text?: string;
  loading: boolean;
  className?: string;
  onClick?: () => void;
  form?: string;
  loadingText: string;
  collapsed?: boolean;
  variant?: 'default' | 'destructive' | 'secondary' | 'outline' |'tertiary';
  children?: React.ReactNode;
  disabled?: boolean;
}

export interface GoogleAuthProps {
  openGoogleAuth: () => void;
  loading: boolean;
  className?: string;
}

export interface ButtonProps {
  onClick?: () => void;
  loading: boolean;
  className?: string;
  form?: string;
  confirmText?: string;
  variant?: string;
}