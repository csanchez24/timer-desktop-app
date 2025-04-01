import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useTask } from '@/hooks/tasks';
import { ArrowLeft, ArrowRightLeft, CircleStop, Play } from 'lucide-react';
import { createElement, ReactNode } from 'react';
import { NavLink, useParams } from 'react-router';
import { SuspenceForm } from './suspence-form';
import { TaskForm } from './task-form';
import { DeclineForm } from './decline-form';
import { ReassignForm } from './reassign-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  const Link = task?.data?.mesa02?.archivo_adjunto ? (
    <NavLink to={`${task.data.mesa02.archivo_adjunto}`} target="_blank" rel="noopener noreferrer">
      Click Here
    </NavLink>
  ) : null;

  const data = [
    { label: 'Marca', value: task?.data?.mesa02.marca },
    { label: 'Documento', value: task?.data?.mesa02.documento },
    { label: 'Fecha', value: task?.data?.mesa02.fecha_creacion },
    { label: 'Hora', value: task?.data?.mesa02.hora_creacion },
    { label: 'Usuario', value: task?.data?.mesa02.usuario_mesa },
    { label: 'Area', value: task?.data?.mesa02.codigo_area },
    { label: 'SubArea', value: task?.data?.mesa02.codigo_proyecto },
    { label: 'Modulo', value: task?.data?.mesa02.codigo_modulo },
    { label: 'Accion', value: task?.data?.mesa02.accion_solicitada },
    { label: 'Nivel', value: task?.data?.mesa02.nivel_importancia },
    { label: 'Hora Extra', value: task?.data?.mesa02.horas_extras },
    { label: 'Garantia', value: task?.data?.mesa02.garantia },
    { label: 'Estado', value: task?.data?.mesa02.estado },
    { label: 'Fecha Estado', value: task?.data?.mesa02.fecha_estado },
    { label: 'Motivo Garantia', value: task?.data?.mesa02.motivo_garantia },
    { label: 'Archivo', value: Link },
    { label: 'Responsable', value: task?.data.mesa02.usuario_responsable },
    { label: 'Tiempo Estimado', value: task?.data?.mesa02.tiempo_estimado },
    { label: 'Tiempo Acumulado', value: task?.data?.mesa02.tiempo_acumulado },
    { label: 'Aprueba Tiempo ?', value: task?.data?.mesa02.aprueba_tiempo },
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
            <h1 className="text-lg">Caso</h1>
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
                <SheetTitle>Iniciar el caso</SheetTitle>
                <SheetDescription>
                  Esta accion iniciara el caso y empezara a contar el tiempo.
                </SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <TaskForm task={task?.data?.mesa02} />
              </div>
            </SheetContent>
          </Sheet>

          {task?.data?.mesa02?.estado === 'ASIGNADO' && (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="destructive">
                    Suspender <CircleStop />
                  </Button>
                </SheetTrigger>
                <SheetContent className="">
                  <SheetHeader>
                    <SheetTitle>Suspender el Caso</SheetTitle>
                    <SheetDescription>Esta accion suspendera el Caso</SheetDescription>
                  </SheetHeader>
                  <div className="px-4">
                    <SuspenceForm task={task?.data?.mesa02} />
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="destructive">
                    Rechazar <CircleStop />
                  </Button>
                </SheetTrigger>
                <SheetContent className="">
                  <SheetHeader>
                    <SheetTitle>Rechazar el Caso</SheetTitle>
                    <SheetDescription>Esta accion rechazara el Caso</SheetDescription>
                  </SheetHeader>
                  <div className="px-4">
                    <DeclineForm task={task?.data?.mesa02} />
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
          {(task?.data?.mesa02?.estado === 'ASIGNADO' ||
            task?.data?.mesa02?.estado === 'EN PROCESO') && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="destructive">
                  Reasignar <ArrowRightLeft />
                </Button>
              </SheetTrigger>
              <SheetContent className="">
                <SheetHeader>
                  <SheetTitle>Reasignar el Caso</SheetTitle>
                  <SheetDescription>Esta accion Reasignara el Caso a un usuario.</SheetDescription>
                </SheetHeader>
                <div className="px-4">
                  <ReassignForm task={task?.data?.mesa02} />
                </div>
              </SheetContent>
            </Sheet>
          )}
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
      <div>
        <h2 className="mb-4">
          Historial de Tiempo y Notas (Tiempo acumulado: {task?.data?.mesa02.tiempo_acumulado} )
        </h2>
        <Table className="max-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Tiempo</TableHead>
              <TableHead>Nota</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {task?.data?.mesa02?.mesa13?.map((d) => (
              <TableRow>
                <TableCell>
                  {d.fecha} {d.hora}
                </TableCell>
                <TableCell>{d.usuario}</TableCell>
                <TableCell>{d.tiempo}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-left">
                        {d.nota.substring(0, 40)}...
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-96 text-left">{d.nota}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
