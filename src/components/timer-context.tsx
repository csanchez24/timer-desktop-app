import { db } from '@/db';
import { Mesa02 } from '@/schemas/mesa02';
import { getDate } from '@/utils/get-date';
import { getTime } from '@/utils/get-time';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TimerContextType {
  time: number;
  isRunning: boolean;
  startTimer: (task: Mesa02, nota: string) => Promise<void>;
  pauseTimer: () => Promise<void>;
}

export const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const startTimer = async (task: Mesa02, nota: string) => {
    const finalTime = getTime();
    await db.execute('UPDATE daily SET horfin=$1,tiempo=$2 WHERE horfin is null', [
      finalTime,
      time,
    ]);
    const date = getDate();
    await db.execute(
      'INSERT into daily (fecha, marca,documento,estado,estnue,horini,nota,tiempo,cerrar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [date, task.marca, task.documento, task.estado, 'E', finalTime, nota, 0, 'N']
    );
    setTime(0);
    setIsRunning(true);
  };
  const pauseTimer = async () => {
    const finalTime = getTime();
    await db.execute('UPDATE daily SET horfin=$1,tiempo=$2 WHERE horfin is null', [
      finalTime,
      time,
    ]);
    setIsRunning(false);
  };

  return (
    <TimerContext.Provider value={{ time, isRunning, startTimer, pauseTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

// Custom hook to use the timer in any component
export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error(
      'useTimer must be used within a TimerProvider. Wrap your component tree with TimerProvider to access the timer context.'
    );
  }
  return context;
};
