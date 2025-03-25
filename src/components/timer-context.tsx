import { initDB } from '@/db';
import { DailyTask } from '@/schemas/daily-task';
import { getDate } from '@/utils/get-date';
import { getTime } from '@/utils/get-time';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { differenceInSeconds } from 'date-fns';
import { listen } from '@tauri-apps/api/event';

interface TimerContextType {
  time: number;
  isRunning: boolean;
  startTimer: ({
    marca,
    documento,
    estado,
    nota,
    area,
    usuario,
    descripcion,
    cerrar,
    tiempoAcumulado,
    tiempoEstimado,
  }: {
    marca: string;
    documento: string;
    estado: string;
    nota: string;
    area: string;
    usuario: string;
    descripcion: string;
    cerrar?: 'S' | 'N';
    tiempoAcumulado: string;
    tiempoEstimado?: string;
  }) => Promise<void>;
  pauseTimer: () => Promise<void>;
}

export const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(true);

  useEffect(() => {
    const unlisten = listen('tauri://focus', () => {
      setRefresh(true);
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await initDB();
        const [res] = (await db.select('SELECT * FROM daily WHERE horfin is null')) as DailyTask[];
        if (res) {
          const now = new Date();
          const [hours, minutes, seconds] = res.horini.split(':').map(Number);
          const pastTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes,
            seconds
          );
          const diffSeconds = differenceInSeconds(now, pastTime);
          setTime(diffSeconds > 0 ? diffSeconds : 0);
          setIsRunning(true);
          setRefresh(false);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (refresh) {
      fetchData();
    }
  }, [refresh]);

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

  const startTimer = async ({
    marca,
    documento,
    nota,
    estado,
    area,
    usuario,
    descripcion,
    cerrar = 'N',
    tiempoEstimado,
    tiempoAcumulado,
  }: {
    marca: string;
    documento: string;
    estado: string;
    nota: string;
    area: string;
    usuario: string;
    descripcion: string;
    cerrar?: 'S' | 'N';
    tiempoAcumulado: string;
    tiempoEstimado?: string;
  }) => {
    const db = await initDB();
    const finalTime = getTime();
    await db.execute('UPDATE daily SET horfin=$1,tiempo=$2 WHERE horfin is null', [
      finalTime,
      time,
    ]);
    const date = getDate();
    await db.execute(
      'INSERT into daily (fecha, marca,documento,estado,estnue,horini,nota,tiempo,cerrar,area,usuario,descripcion,tiempo_acumulado,tiempo_estimado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12,$13,$14)',
      [
        date,
        marca,
        documento,
        estado,
        'E',
        finalTime,
        nota,
        0,
        cerrar,
        area,
        usuario,
        descripcion,
        tiempoAcumulado,
        tiempoEstimado,
      ]
    );
    setTime(0);
    setIsRunning(true);
  };
  const pauseTimer = async () => {
    const db = await initDB();
    const finalTime = getTime();
    await db.execute('UPDATE daily SET horfin=$1,tiempo=$2 WHERE horfin IS NULL', [
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

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error(
      'useTimer must be used within a TimerProvider. Wrap your component tree with TimerProvider to access the timer context.'
    );
  }
  return context;
};
