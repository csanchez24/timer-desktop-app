import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { initDB } from '@/db';
import { formatTime } from '@/utils/format-time';
import { useMemo } from 'react';
import { FinishForm } from './finish-form';
import { useDailyTask } from '@/hooks/daily';

export default function Finish() {
  const { data, isLoading, refetch } = useDailyTask();

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
          <div className="block rounded-xl border p-3 shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="mb-1">
                  {daily.marca} - {daily.documento}
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
          horini={startTime ?? ''}
          horfin={endTime ?? ''}
          tiempo={time ?? ''}
        />
      </div>
    </div>
  );
}
