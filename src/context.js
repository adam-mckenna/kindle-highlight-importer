'use client';

import { createContext, useContext, useState } from "react";

export const HighlightsContext = createContext({});

export const HighlightsContextProvider = ({ children }) => {
    const [highlights, setHighlights] = useState("");
    
    return <HighlightsContext.Provider value={{ highlights, setHighlights }}>
        {children}
    </HighlightsContext.Provider>
}

export const useHighlightsContext = () => useContext(HighlightsContext);
