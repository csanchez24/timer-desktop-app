import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetch } from '@tauri-apps/plugin-http';
import { DailyTask } from '@/schemas/daily-task';

export const useFinishDay = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  return useMutation({
    mutationFn: async ({
      tasks,
      horini,
      horfin,
      tiempo,
      nota,
    }: {
      tasks: DailyTask[];
      horini: string;
      horfin: string;
      tiempo: string;
      nota: string;
    }) => {
      const formData = new FormData(); // Collect form data
      formData.set('tasks', JSON.stringify(tasks));
      formData.set('horini', horini);
      formData.set('horfin', horfin);
      formData.set('tiempo', tiempo);
      formData.set('nota', nota);
      const res = await fetch('', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        return null;
      }
      const data = await res.json();
      return data;
    },
    async onSuccess() {
      toast('bien', { description: 'bien' });
      onSuccess?.();
    },
    onError(e) {
      toast('mal', { description: e.message });
      onError?.();
    },
  });
};
