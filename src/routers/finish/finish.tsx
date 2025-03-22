import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { initDB } from '@/db';
import { useDailyTask } from '@/hooks/daily';
import { formatTime } from '@/utils/format-time';
import { useMemo } from 'react';
import { FinishForm } from './finish-form';
import { differenceInSeconds, parse } from 'date-fns';

export default function Finish() {
  const { data, isLoading, refetch } = useDailyTask();

  const date = useMemo(() => {
    if (!data) return;
    return data.at(0)?.fecha;
  }, [data]);

  const startTime = useMemo(() => {
    if (!data) return;
    return data.at(0)?.horini;
  }, [data]);

  const endTime = useMemo(() => {
    if (!data) return;
    return data.at(-1)?.horfin;
  }, [data]);

  const time = useMemo(() => {
    if (!data) return;
    const total = data?.reduce((pre, acc) => pre + parseInt(acc.tiempo ?? '0'), 0);

    return formatTime(total);
  }, [data]);

  const timeWorked = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const time1 = parse(startTime, 'HH:mm:ss', new Date());
    const time2 = parse(endTime, 'HH:mm:ss', new Date());
    return differenceInSeconds(time2, time1);
  }, [startTime, endTime]);

  const markedChecked = async (checked: boolean, numero: number) => {
    const db = await initDB();
    await db.execute('UPDATE daily SET cerrar = ? WHERE numero = ?', [checked ? 'S' : 'N', numero]);
    refetch();
    return;
  };

  return (
    <div className="container">
      <h1 className="mb-4 text-lg">Finish</h1>
      {isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      )}
      <div className="mb-4 flex flex-col gap-2">
        {data?.map((daily) => (
          <div className="block rounded-xl border p-4 shadow">
            <div className="flex items-center justify-between">
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
                <p className="mb-2">{daily.nota}</p>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={daily.cerrar === 'S'}
                    onCheckedChange={(checked) => markedChecked(checked, daily.numero)}
                  />
                  <Label>Cerrar Caso</Label>
                </div>
              </div>
              <div className="text-primary text-lg font-bold">
                {formatTime(parseInt(daily.tiempo + ''))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap justify-between gap-2">
        <p>Hora Inicial: {startTime}</p>
        <p>Hora Final: {endTime}</p>
        <p>Tiempo: {time}</p>
      </div>
      <div>
        <FinishForm
          tasks={data ?? []}
          timeWorked={timeWorked ?? 0}
          date={date ?? ''}
          horini={startTime ?? ''}
          horfin={endTime ?? ''}
          tiempo={time ?? ''}
        />
      </div>
    </div>
  );
}
