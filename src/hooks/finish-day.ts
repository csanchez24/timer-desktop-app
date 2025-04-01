import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetch } from '@tauri-apps/plugin-http';
import { DailyTask } from '@/schemas/daily-task';
import { BASEURL } from '@/constants';
import { getSettings } from '@/utils/get-settings';
import { formatTime } from '@/utils/format-time';

export const useFinishDay = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  return useMutation({
    mutationFn: async ({
      tasks,
      date,
      horini,
      horfin,
      tiempo,
      nota,
      timeWorked,
    }: {
      tasks: DailyTask[];
      date: string;
      timeWorked: number;
      horini: string;
      horfin: string;
      tiempo: string;
      nota: string;
    }) => {
      const settings = await getSettings();
      const formData = new FormData();
      const casos = tasks.map((task) => {
        return { ...task, tieseg: task.tiempo, tiempo: formatTime(parseInt(task.tiempo + '')) };
      });
      console.log(casos);
      formData.set('casos', JSON.stringify(casos));
      formData.set('fecha', date);
      formData.set('horini', horini);
      formData.set('horfin', horfin);
      formData.set('tiempo', tiempo);
      formData.set('tiempoTrabajado', formatTime(timeWorked));
      formData.set('nota', nota);

      const res = await fetch(`${BASEURL}/cerrarDia`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error();
      }
      return data;
    },
    async onSuccess() {
      onSuccess?.();
    },
    onError(e) {
      console.log('error', e);
      toast('mal', { description: e.message });
      onError?.();
    },
  });
};
