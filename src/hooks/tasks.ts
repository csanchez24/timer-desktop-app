import { RespuestaTask, RespuestaTasks } from '@/schemas/mesa02';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';
import { toast } from 'sonner';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('https://soporte.syseu.com.co/MesaAyuda/webservice/casosUsuario', {
        method: 'GET',
      });
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as RespuestaTasks;
      return data;
    },
  });
};

export const useTask = (marca?: string, documento?: string) => {
  return useQuery({
    queryKey: ['task', `${marca}-${documento}`],
    enabled: !!marca && !!documento,
    queryFn: async () => {
      const formData = new FormData(); // Collect form data
      formData.set('marca', marca ?? '');
      formData.set('documento', documento ?? '');

      const res = await fetch('https://soporte.syseu.com.co/MesaAyuda/webservice/mesa02', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as RespuestaTask;
      return data;
    },
  });
};

export const useSuspendTask = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  return useMutation({
    mutationFn: async ({
      ...body
    }: {
      marca: string;
      documento: string;
      codanu: string;
      note: string;
    }) => {
      const res = await fetch('', {
        method: 'POST',
        body: JSON.stringify(body),
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
