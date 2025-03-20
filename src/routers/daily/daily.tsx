import { useTimer } from '@/components/timer-context';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/db';
import { DailyTask } from '@/schemas/daily-task';
import { formatTime } from '@/utils/format-time';
import { BookA, Play } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { StartForm } from './startForm';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AutoGestionForm } from './auto-gestion-form';

export default function Daily() {
  const [data, setData] = useState<DailyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const navigate = useNavigate();
  const { time, pauseTimer } = useTimer();

  const [task, setTask] = useState<DailyTask>();
  const [openedDialog, setOpenedDialog] = useState(false);
  const handleDialogChange = useCallback(
    (open: boolean) => {
      if (open === false) {
        setTask(undefined);
      }
      setOpenedDialog(open);
    },
    [setTask, setOpenedDialog]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = (await db.select('SELECT * FROM daily ORDER BY numero DESC')) as DailyTask[];
        setData(res);
        setRefresh(false);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    if (refresh) {
      fetchData();
    }
  }, [refresh]);

  const goToFinishPage = useCallback(async () => {
    await pauseTimer();
    navigate('/finish');
  }, []);

  const onStartTime = useCallback(
    async function onStartTime(task: DailyTask) {
      if (!task) return;
      setTask(task);
      setOpenedDialog(true);
    },
    [setTask, setOpenedDialog]
  );

  return (
    <div className="container">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg">Tarea Activa</h1>
        </div>
        <div className="flex gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                Autogestion <BookA />
              </Button>
            </SheetTrigger>
            <SheetContent className="">
              <SheetHeader>
                <SheetTitle>Arrancar la tarea</SheetTitle>
                <SheetDescription>Esta accion iniciar la tarea y su tiempo</SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <AutoGestionForm />
              </div>
            </SheetContent>
          </Sheet>
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
      <div className="mb-8 flex flex-col gap-3">
        {data
          ?.filter((d) => !d.horfin)
          .map((daily) => (
            <div className="block rounded-xl border p-4 shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p>
                    {daily.marca} - {daily.documento}
                  </p>
                  <p>{daily.nota}</p>
                </div>
                <div className="text-secondary text-sm font-bold">{formatTime(time)}</div>
              </div>
            </div>
          ))}
      </div>
      <div>
        <h2 className="mb-4 text-lg">Tareas Inactivas</h2>
        <div className="flex flex-col gap-3">
          {data
            ?.filter((d) => d.horfin)
            .map((daily) => (
              <div className="block rounded-xl border p-4 shadow">
                <div className="flex justify-between">
                  <div className="text-sm">
                    <p>
                      {daily.marca} - {daily.documento}
                    </p>
                    <p>{daily.nota}</p>
                  </div>
                  <div className="text-secondary flex items-center text-sm font-bold">
                    <div className="text-secondary text-sm font-bold">
                      {formatTime(parseInt(daily.tiempo ?? '0'))}
                    </div>
                    <Button variant="ghost" onClick={() => onStartTime(daily)}>
                      <Play className="text-black" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Dialog open={openedDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Arrancar la tarea</DialogTitle>
            <DialogDescription>
              esta opcion volvera a empezar otro tiempo para este tarea
            </DialogDescription>
          </DialogHeader>
          <StartForm
            task={task}
            onSuccess={() => {
              setOpenedDialog(false);
              setRefresh(true);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
