import { Icons } from '@/components/icons';
import { useTimer } from '@/components/timer-context';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useMesa01 } from '@/hooks/basics';
import { useTasks } from '@/hooks/tasks';
import { Mesa02 } from '@/schemas/mesa02';
import { formatTime } from '@/utils/format-time';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { DeclineForm } from '../task/decline-form';
import { SuspenceForm } from '../task/suspence-form';
import { TaskForm } from '../task/task-form';

export default function Tasks() {
  const { data: tasks, isLoading, refetch } = useTasks();
  const { data: mesa01 } = useMesa01();
  const { time, isRunning } = useTimer();

  const [toggle, setToggle] = useState<string>('todos');
  const [mesa02, setMesa02] = useState<Mesa02>();
  const [openStartTaskDialog, setStartTaskDialog] = useState(false);
  const [openSuspenceTaskDialog, setSuspenceTaskDialog] = useState(false);
  const [openDeclineTaskDialog, setDeclineTaskDialog] = useState(false);

  const [searchText, setSearchText] = useState<string | undefined>('');
  const onSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }, []);

  const filterTasks = useMemo(() => {
    if (!searchText && !toggle) return tasks?.data.casusu;

    return tasks?.data.casusu.filter((task) => {
      const textFilter = searchText
        ? task.marca.toLowerCase().includes(searchText.toLowerCase()) ||
          task.documento.toLowerCase().includes(searchText.toLowerCase()) ||
          task.descripcion.toLowerCase().includes(searchText.toLowerCase())
        : true;
      const toggleFilter = toggle === 'todos' || toggle === 'internos' || task.estado === toggle;
      const marcaFilter =
        toggle === 'internos' ? task.marca === mesa01?.data?.mesa01?.codigo_area : true;
      return textFilter && toggleFilter && marcaFilter;
    });
  }, [tasks, searchText, toggle, mesa01]);

  return (
    <div className="container">
      <div className="flex justify-between">
        <div>
          <h1 className="mb-4 text-lg">Casos</h1>
        </div>
        <div className="flex gap-3">
          <div>
            <p className="">Total Casos: {tasks?.data?.casusu?.length ?? 0}</p>
          </div>
          {isRunning && (
            <div>
              <p className="">Tiempo: {formatTime(time)}</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="mb-4">
          <form>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Filtrar Casos"
                className="pl-8"
                value={searchText}
                onChange={onSearch}
              />
            </div>
          </form>
        </div>
        <div className="mb-4 flex gap-3">
          <ToggleGroup
            variant="outline"
            size="lg"
            type="single"
            defaultValue={toggle}
            value={toggle}
            onValueChange={(value) => setToggle(value)}
          >
            <ToggleGroupItem value="todos" aria-label="Toggle bold">
              Todos <Badge variant="default">{tasks?.data?.casusu?.length ?? 0}</Badge>
            </ToggleGroupItem>
            <ToggleGroupItem value="ASIGNADO" aria-label="Toggle bold">
              Asignados
              <Badge variant="default">
                {tasks?.data?.casusu?.filter((task) => task.estado === 'ASIGNADO').length ?? 0}
              </Badge>
            </ToggleGroupItem>
            <ToggleGroupItem value="EN PROCESO" aria-label="Toggle italic">
              En Proceso
              <Badge variant="default">
                {tasks?.data?.casusu?.filter((task) => task.estado === 'EN PROCESO').length ?? 0}
              </Badge>
            </ToggleGroupItem>
            <ToggleGroupItem value="internos" aria-label="Toggle underline">
              Internos
              <Badge variant="default">
                {tasks?.data?.casusu?.filter(
                  (task) => task.marca === mesa01?.data?.mesa01?.codigo_area
                ).length ?? 0}
              </Badge>
            </ToggleGroupItem>
          </ToggleGroup>
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
        {!isLoading && filterTasks?.length === 0 && (
          <p className="fond-bold text-xl">No hay Casos pendientes</p>
        )}

        <div className="flex flex-col gap-3">
          {filterTasks?.map((task) => (
            <NavLink
              to={`/tasks/${task.marca}/${task.documento}`}
              className="block rounded-xl border p-4 shadow"
              key={`task-${task.marca}-${task.documento}`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">
                    {task.marca} - {task.documento}
                  </p>
                  <p className="mb-2 text-sm">
                    {task.codigo_area} - {task.usuario_mesa}
                  </p>
                  <p className="mb-2 text-sm">{task.descripcion}</p>
                  <p className="flex items-center gap-2 text-sm">
                    {task.estado} {format(task.fecha_creacion, 'yyyy-MM-dd')}{' '}
                    <Badge>{formatDistanceToNowStrict(task.fecha_creacion)}</Badge>
                  </p>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border-none">
                      <Icons.EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={async (e) => {
                          e.stopPropagation();
                          setMesa02(task);
                          setStartTaskDialog(true);
                        }}
                      >
                        Iniciar
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={async (e) => {
                          e.stopPropagation();
                          setMesa02(task);
                          setSuspenceTaskDialog(true);
                        }}
                        className="text-red-500"
                      >
                        Suspender
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async (e) => {
                          e.stopPropagation();
                          setMesa02(task);
                          setDeclineTaskDialog(true);
                        }}
                        className="text-red-500"
                      >
                        Rechazar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <Sheet
        open={openStartTaskDialog}
        onOpenChange={(open) => {
          setMesa02(undefined);
          setStartTaskDialog(open);
        }}
      >
        <SheetContent className="">
          <SheetHeader>
            <SheetTitle>Arrancar el caso</SheetTitle>
            <SheetDescription>Esta accion iniciar el caso y su tiempo</SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <TaskForm task={mesa02} />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={openSuspenceTaskDialog}
        onOpenChange={(open) => {
          setMesa02(undefined);
          setSuspenceTaskDialog(open);
        }}
      >
        <SheetContent className="">
          <SheetHeader>
            <SheetTitle>Suspender el caso</SheetTitle>
            <SheetDescription>Esta accion suspendera el caso</SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <SuspenceForm
              task={mesa02}
              onSuccess={() => {
                setMesa02(undefined);
                setSuspenceTaskDialog(false);
                refetch();
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={openDeclineTaskDialog}
        onOpenChange={(open) => {
          setMesa02(undefined);
          setDeclineTaskDialog(open);
        }}
      >
        <SheetContent className="">
          <SheetHeader>
            <SheetTitle>Rechazar el caso</SheetTitle>
            <SheetDescription>Esta accion rechazara el caso.</SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <DeclineForm
              task={mesa02}
              onSuccess={() => {
                setMesa02(undefined);
                setDeclineTaskDialog(false);
                refetch();
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
