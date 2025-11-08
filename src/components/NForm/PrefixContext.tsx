// @/components/NForm/PrefixContext.tsx
import React, { createContext, useContext } from 'react';

const PrefixContext = createContext<string | number | undefined>(undefined);

export const PrefixProvider: React.FC<{ prefix?: string | number; children: React.ReactNode }> = ({ 
  prefix, 
  children 
}) => {
  return <PrefixContext.Provider value={prefix}>{children}</PrefixContext.Provider>;
};

export const usePrefix = (): string | number | undefined => {
  return useContext(PrefixContext);
};