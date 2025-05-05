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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDailyTask } from '@/hooks/daily';
import { DailyTask } from '@/schemas/daily-task';
import { formatTime } from '@/utils/format-time';
import { BookA, Pause, Pencil, Play, ShieldQuestion } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AutoGestionForm } from './auto-gestion-form';
import { StartForm } from './startForm';
import { GarantiaForm } from './garantia-form';
import { EditTask } from './editTask';

export default function Daily() {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useDailyTask();
  const { time, pauseTimer, cleanTimer } = useTimer();

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

  const [openedGarantia, setOpenedGarantia] = useState(false);
  const handleGarantiaChange = useCallback(
    (open: boolean) => {
      if (open === false) {
        setTask(undefined);
      }
      setOpenedGarantia(open);
    },
    [setTask, setOpenedGarantia]
  );

  const [openedEdit, setOpenedEdit] = useState(false);
  const handleEditChange = useCallback(
    (open: boolean) => {
      if (open === false) {
        setTask(undefined);
      }
      setOpenedEdit(open);
    },
    [setTask, setOpenedEdit]
  );

  const [openedAutoDialog, setOpenedAutoDialog] = useState(false);
  const handleAutoDialogChange = useCallback(
    (open: boolean) => {
      setOpenedAutoDialog(open);
    },
    [setOpenedAutoDialog]
  );

  const timeAcc = useMemo(() => {
    if (!data) return;
    const total = data?.reduce((pre, acc) => pre + parseInt(acc.tiempo ?? '0'), 0);

    return formatTime(total + time);
  }, [data, time]);

  const onSuccessAuto = useCallback(() => {
    refetch();
    setOpenedAutoDialog(false);
  }, [refetch, setOpenedAutoDialog]);

  const pauseTask = useCallback(async () => {
    await pauseTimer();
    refetch();
  }, [pauseTimer, refetch]);

  const clean = useCallback(async () => {
    await cleanTimer();
    refetch();
  }, [cleanTimer, refetch]);

  const goToFinishPage = useCallback(async () => {
    await pauseTimer();
    navigate('/finish');
  }, [pauseTimer, navigate]);

  const onEditTask = useCallback(
    async (task: DailyTask) => {
      if (!task) return;
      setTask(task);
      setOpenedEdit(true);
    },
    [setTask, setOpenedEdit]
  );

  const onStartTime = useCallback(
    async (task: DailyTask) => {
      if (!task) return;
      setTask(task);
      setOpenedDialog(true);
    },
    [setTask, setOpenedDialog]
  );

  const onModifyGarantia = useCallback(
    async (task: DailyTask) => {
      if (!task) return;
      setTask(task);
      setOpenedGarantia(true);
    },
    [setTask, setOpenedDialog]
  );

  return (
    <div className="container">
      <div className="mb-4 flex items-center justify-end gap-3">
        <p>Total: {timeAcc}</p>
        <p>Tiempo: {formatTime(time)}</p>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg">Caso Activo</h1>
        </div>
        <div className="flex gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Borrar Historial</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Esta seguro de borrar el historial de tiempo?</AlertDialogTitle>
                <AlertDialogDescription>Esta accion borrara los tiempos.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white hover:bg-red-500 hover:text-white hover:opacity-80"
                  onClick={() => {
                    clean();
                  }}
                >
                  Borrar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Sheet open={openedAutoDialog} onOpenChange={handleAutoDialogChange}>
            <SheetTrigger asChild>
              <Button>
                Autogestion <BookA />
              </Button>
            </SheetTrigger>
            <SheetContent className="">
              <SheetHeader>
                <SheetTitle>Crear Caso de Auto Gestion</SheetTitle>
                <SheetDescription>
                  Esta accion creara un caso de autogestion y lo iniciara inmediatamente.
                </SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <AutoGestionForm onSuccess={onSuccessAuto} />
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
            <div className="relative block rounded-xl border p-4 shadow">
              <div className="absolute top-0 right-0">
                <div className="flex gap-1">
                  <div>
                    <Button variant="ghost" onClick={() => onEditTask(daily)}>
                      <Pencil className="" />
                    </Button>
                  </div>
                  <div>
                    <Button variant="ghost" onClick={() => onModifyGarantia(daily)}>
                      <ShieldQuestion className="" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 text-sm">
                  <p>
                    {daily.marca} - {daily.documento}
                  </p>
                  <p className="mb-2">
                    {daily.area} - {daily.usuario}
                  </p>
                  <p className="mb-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left">
                          {daily.descripcion.substring(0, 80)}...
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-96 text-left">{daily.descripcion}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </p>
                  <p>{daily.nota}</p>
                  {daily.tiempo_estimado && <p className="">Estimado: {daily.tiempo_estimado}</p>}
                  <p className="mb-2">Acumulado: {daily.tiempo_acumulado}</p>
                </div>
                <div className="text-secondary flex items-center gap-1 text-sm font-bold">
                  <div>{formatTime(time)}</div>
                  <div>
                    <Button variant="ghost" onClick={() => pauseTask()}>
                      <Pause className="" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div>
        <h2 className="mb-4 text-lg">Casos Inactivos</h2>
        <div className="flex flex-col gap-3">
          {data
            ?.filter((d) => d.horfin)
            .map((daily) => (
              <div className="relative block rounded-xl border p-4 shadow">
                <div className="absolute top-0 right-0">
                  <div className="flex gap-1">
                    <div>
                      <Button variant="ghost" onClick={() => onEditTask(daily)}>
                        <Pencil className="" />
                      </Button>
                    </div>
                    <div>
                      <Button variant="ghost" onClick={() => onModifyGarantia(daily)}>
                        <ShieldQuestion className="" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-2">
                  <div className="flex-1 text-sm">
                    <p>
                      {daily.marca} - {daily.documento}
                    </p>
                    <p className="mb-2">
                      {daily.area} - {daily.usuario}
                    </p>
                    <p className="mb-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            {daily.descripcion.substring(0, 80)}...
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-96 text-left">{daily.descripcion}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </p>
                    <p>{daily.nota}</p>
                    {daily.tiempo_estimado && <p className="">Estimado: {daily.tiempo_estimado}</p>}
                    <p className="mb-2">Acumulado: {daily.tiempo_acumulado}</p>
                  </div>
                  <div className="text-secondary flex items-center gap-2 text-sm font-bold">
                    <div className="text-secondary text-sm font-bold">
                      {formatTime(parseInt(daily.tiempo ?? '0'))}
                    </div>
                    <Button variant="ghost" onClick={() => onStartTime(daily)}>
                      <Play className="" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Dialog open={openedEdit} onOpenChange={handleEditChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modificar la Nota</DialogTitle>
            <DialogDescription>esta opcion modificara la nota</DialogDescription>
          </DialogHeader>
          <EditTask
            task={task}
            onSuccess={() => {
              setTask(undefined);
              setOpenedEdit(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openedDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Volver a Iniciar el Caso</DialogTitle>
            <DialogDescription>
              esta opcion volvera a empezar otro tiempo para este caso.
            </DialogDescription>
          </DialogHeader>
          <StartForm
            task={task}
            onSuccess={() => {
              setOpenedDialog(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
      <Sheet open={openedGarantia} onOpenChange={handleGarantiaChange}>
        <SheetContent className="">
          <SheetHeader>
            <SheetTitle>Motificar la garantia</SheetTitle>
            <SheetDescription>Esta accion modifica la garantia del caso</SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <GarantiaForm
              task={task}
              onSuccess={() => {
                setTask(undefined);
                setOpenedGarantia(false);
                refetch();
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
