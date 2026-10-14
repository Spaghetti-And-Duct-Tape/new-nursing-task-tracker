import { createContext, useContext, useEffect, useState } from "react";
import { minuteMs } from "../utils/utils";

const DateContext = createContext<Date | null> (null);

export function DateProvider({children}: {children: React.ReactNode}) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, minuteMs);

    return () => clearInterval(interval);
  }, []);

  return (
    <DateContext.Provider value={now}>
      {children}
    </DateContext.Provider>
  )
};

export function useCurrentDate(): Date {
  const context = useContext(DateContext);

  if (context === null) 
    throw new Error("useCurrentDate must be use within a DateProvider");

  return context;
};