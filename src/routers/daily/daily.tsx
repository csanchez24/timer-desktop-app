import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/db';
import { DailyTask } from '@/schemas/daily-task';
import { Play } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function Daily() {
  const [data, setData] = useState<DailyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = (await db.select('SELECT * FROM daily')) as DailyTask[];
        setData(res);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToFinishPage = useCallback(async () => {
    //await db.execute('UPDATE daily set horfin where horfin is null');
    navigate('/finish');
  }, []);

  return (
    <div className="container">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg">Tareas Activas</h1>
        </div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Finalizar Dia</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Esta seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta accion finalizara los tiempos y lo llevara a finalizar el dia.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    goToFinishPage();
                  }}
                >
                  Finalizar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      )}
      <div className="flex flex-col gap-3">
        {data?.map((daily) => (
          <div className="block rounded-xl border p-4 shadow">
            <div className="flex justify-between">
              <div className="text-sm">
                <p>
                  {daily.marca} - {daily.documento}
                </p>
                <p>{daily.nota}</p>
              </div>
              <div className="text-secondary text-sm font-bold">
                <Button variant="ghost">
                  <Play className="text-black" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
