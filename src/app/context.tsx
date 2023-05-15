"use client";
import { createContext, useContext, useState } from "react";

type ClippingsContextType = {
  rawClippings: string;
  setRawClippings: (clippings: string) => void;
};

export const ClippingsContext = createContext<ClippingsContextType>({
  rawClippings: "",
  setRawClippings: () => null,
});

export const ClippingsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [rawClippings, setRawClippings] = useState<string>("");

  return (
    <ClippingsContext.Provider value={{ rawClippings, setRawClippings }}>
      {children}
    </ClippingsContext.Provider>
  );
};

export const useClippingsContext = () => useContext(ClippingsContext);
