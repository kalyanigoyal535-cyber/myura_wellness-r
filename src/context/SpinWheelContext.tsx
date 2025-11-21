import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface SpinWheelContextValue {
  isOpen: boolean;
  openSpinWheel: () => void;
  closeSpinWheel: () => void;
}

const SpinWheelContext = createContext<SpinWheelContextValue | undefined>(undefined);

export const useSpinWheel = (): SpinWheelContextValue => {
  const context = useContext(SpinWheelContext);
  if (!context) {
    throw new Error('useSpinWheel must be used within SpinWheelProvider');
  }
  return context;
};

export const SpinWheelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSpinWheel = () => setIsOpen(true);
  const closeSpinWheel = () => setIsOpen(false);

  return (
    <SpinWheelContext.Provider value={{ isOpen, openSpinWheel, closeSpinWheel }}>
      {children}
    </SpinWheelContext.Provider>
  );
};

