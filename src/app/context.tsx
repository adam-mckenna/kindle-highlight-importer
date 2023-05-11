"use client";

import { createContext, useContext, useState } from "react";

type HighlightContextType = {
  highlights: string;
  setHighlights: (highlights: string) => void;
};

export const HighlightsContext = createContext<HighlightContextType>({
  highlights: "",
  setHighlights: () => null,
});

export const HighlightsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [highlights, setHighlights] = useState<string>("");

  return (
    <HighlightsContext.Provider value={{ highlights, setHighlights }}>
      {children}
    </HighlightsContext.Provider>
  );
};

export const useHighlightsContext = () => useContext(HighlightsContext);
