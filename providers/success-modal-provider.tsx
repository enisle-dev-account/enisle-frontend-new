"use client";

import { SuccessModal } from "@/components/success-modal";
import React, { createContext, useContext, useState, useCallback } from "react";

interface SuccessModalContextType {
  showSuccess: (message?: string) => void;
}

const SuccessModalContext = createContext<SuccessModalContextType | undefined>(undefined);

export function SuccessModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const showSuccess = useCallback((msg?: string) => {
    setMessage(msg);
    setIsOpen(true);
  }, []);

  return (
    <SuccessModalContext.Provider value={{ showSuccess }}>
      {children}
      <SuccessModal 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        message={message} 
      />
    </SuccessModalContext.Provider>
  );
}

export function useSuccessModal() {
  const context = useContext(SuccessModalContext);
  if (!context) {
    throw new Error("useSuccessModal must be used within a SuccessModalProvider");
  }
  return context;
}