import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ArrowLeft, CircleStop, Play } from 'lucide-react';
import { NavLink, useParams } from 'react-router';
import { TaskForm } from './task-form';
import { useTask } from '@/hooks/tasks';
import { Skeleton } from '@/components/ui/skeleton';
import { SuspenceForm } from './suspence-form';
import { createElement, ReactNode } from 'react';

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value?: ReactNode | string | number | null;
}) {
  return (
    <div className="p-3 text-sm">
      <div className="text-foreground text-xs leading-7 font-medium uppercase">{label}</div>
      <div className="text-muted-foreground capitalize">
        {typeof value === 'function' ? createElement(value) : value}
      </div>
    </div>
  );
}

export default function Task() {
  const { marca, documento } = useParams();

  const { data: task, isLoading } = useTask(marca, documento);

  const Link = task?.data?.mesa02?.usuario_responsable ? (
    <NavLink to={`${task.data.mesa02.archivo_adjunto}`} target="_blank" rel="noopener noreferrer">
      Click Here
    </NavLink>
  ) : null;

  const data = [
    { label: 'Marca', value: task?.data?.mesa02.marca },
    { label: 'Documento', value: task?.data?.mesa02.marca },
    { label: 'Fecha', value: task?.data?.mesa02.fecha_creacion },
    { label: 'Hora', value: task?.data?.mesa02.hora_creacion },
    { label: 'Usuario', value: task?.data?.mesa02.usuario_mesa },
    { label: 'Area', value: task?.data?.mesa02.codigo_area },
    { label: 'SubArea', value: task?.data?.mesa02.codigo_proyecto },
    { label: 'Modalidad', value: task?.data?.mesa02.codigo_modulo },
    { label: 'Accion', value: task?.data?.mesa02.accion_solicitada },
    { label: 'Nivel', value: task?.data?.mesa02.nivel_importancia },
    { label: 'Hora Extra', value: task?.data?.mesa02.horas_extras },
    { label: 'Garantia', value: task?.data?.mesa02.garantia },
    { label: 'Estado', value: task?.data?.mesa02.estado },
    { label: 'Fecha Estado', value: task?.data?.mesa02.fecha_estado },
    { label: 'Motivo Garantia', value: task?.data?.mesa02.motivo_garantia },
    { label: 'Archivo', value: Link },
    { label: 'Responsable', value: task?.data.mesa02.usuario_responsable },
    { label: 'Timpo Estimado', value: task?.data?.mesa02.tiempo_estimado },
    { label: 'Descripcion', value: task?.data?.mesa02.descripcion },
  ];

  return (
    <div className="container">
      <div className="mb-4 flex justify-between">
        <div>
          <div className="flex gap-2">
            <NavLink to="/">
              <ArrowLeft />
            </NavLink>
            <h1 className="text-lg">Tasks</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                Iniciar <Play />
              </Button>
            </SheetTrigger>
            <SheetContent className="">
              <SheetHeader>
                <SheetTitle>Arrancar la tarea</SheetTitle>
                <SheetDescription>Esta accion iniciar la tarea y su tiempo</SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <TaskForm task={task?.data?.mesa02} />
              </div>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                Suspender <CircleStop />
              </Button>
            </SheetTrigger>
            <SheetContent className="">
              <SheetHeader>
                <SheetTitle>Suspender la tarea</SheetTitle>
                <SheetDescription>Esta accion suspendera la tarea</SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <SuspenceForm />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2">
        {isLoading && (
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        )}
        {data.map((d) => (
          <InfoBlock key={d.label} {...d} />
        ))}
      </div>
    </div>
  );
}
