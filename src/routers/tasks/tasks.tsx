import { NavLink } from 'react-router';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useTasks } from '@/hooks/tasks';
import { Skeleton } from '@/components/ui/skeleton';

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();

  const [searchText, setSearchText] = useState<string | undefined>('');
  const onSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }, []);

  const filterTasks = useMemo(() => {
    if (!searchText) return tasks?.data.casusu;
    return tasks?.data.casusu.filter(
      (task) =>
        task.marca.toLowerCase().includes(searchText.toLowerCase()) ||
        task.documento.toLowerCase().includes(searchText.toLowerCase()) ||
        task.descripcion.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [tasks, searchText]);

  return (
    <div className="container">
      <h1 className="mb-4 text-lg">Tasks</h1>
      <div>
        <div className="mb-4">
          <form>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Filtrar"
                className="pl-8"
                value={searchText}
                onChange={onSearch}
              />
            </div>
          </form>
        </div>
        <div className="flex flex-col gap-3">
          {isLoading && (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          )}
          {filterTasks?.map((task) => (
            <NavLink
              to={`/tasks/${task.marca}/${task.documento}`}
              className="block rounded-xl border p-4 shadow"
              key={`task-${task.marca}-${task.documento}`}
            >
              <div className="flex justify-between">
                <div className="text-sm">{task.usuario_mesa}</div>
                <div className="text-secondary text-sm font-bold">
                  {task.marca} - {task.documento}
                </div>
              </div>
              <div className="text-sm">{task.codigo_area}</div>
              <div className="text-sm">{task.descripcion}</div>
              <div className="text-sm">{format(task.fecha_creacion, 'yyyy-MM-dd')}</div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
