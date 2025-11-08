// @/components/NForm/PrefixedForm.tsx
import { PrefixProvider } from './PrefixContext';

const PrefixedForm: React.FC<{ prefix: string; children: React.ReactNode }> = ({ 
  prefix, 
  children 
}) => {
  return <PrefixProvider prefix={prefix}>{children}</PrefixProvider>;
};

export default PrefixedForm;