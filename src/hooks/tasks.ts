import { BASEURL } from '@/constants';
import { Mesa02, RespuestaTask, RespuestaTasks } from '@/schemas/mesa02';
import { getSettings } from '@/utils/get-settings';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';
import { toast } from 'sonner';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const settings = await getSettings();
      const res = await fetch(`${BASEURL}/casos`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
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
      const settings = await getSettings();
      const formData = new FormData(); // Collect form data
      formData.set('marca', marca ?? '');
      formData.set('documento', documento ?? '');

      const res = await fetch(`${BASEURL}/caso`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
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
      marca,
      documento,
      motivo,
      nota,
    }: {
      marca: string;
      documento: string;
      motivo: string;
      nota: string;
    }) => {
      const settings = await getSettings();
      const formData = new FormData();
      formData.set('marca', marca ?? '');
      formData.set('documento', documento ?? '');
      formData.set('motivo', motivo ?? '');
      formData.set('nota', nota ?? '');
      const res = await fetch(`${BASEURL}/suspenderCaso`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
      });
      if (!res.ok) {
        throw new Error();
      }
      const data = await res.json();
      return data;
    },
    async onSuccess() {
      onSuccess?.();
    },
    onError(e) {
      toast('mal', { description: e.message });
      onError?.();
    },
  });
};

export const useDeclineTask = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  return useMutation({
    mutationFn: async ({
      marca,
      documento,
      motivo,
      nota,
    }: {
      marca: string;
      documento: string;
      motivo: string;
      nota: string;
    }) => {
      const settings = await getSettings();
      const formData = new FormData();
      formData.set('marca', marca ?? '');
      formData.set('documento', documento ?? '');
      formData.set('motivo', motivo ?? '');
      formData.set('nota', nota ?? '');
      const res = await fetch(`${BASEURL}/rechazarCaso`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
      });
      if (!res.ok) {
        throw new Error();
      }
      const data = await res.json();
      return data;
    },
    async onSuccess() {
      onSuccess?.();
    },
    onError(e) {
      toast('mal', { description: e.message });
      onError?.();
    },
  });
};

export const useAutoTask = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  return useMutation({
    mutationFn: async ({ subare, nota }: { subare: string; nota: string }) => {
      const settings = await getSettings();
      const formData = new FormData();
      formData.set('subarea', subare ?? '');
      formData.set('nota', nota ?? '');
      const res = await fetch(`${BASEURL}/autogestionCaso`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
      });
      if (!res.ok) {
        throw new Error();
      }
      const data = (await res.json()) as { caso: Mesa02 };
      return data.caso;
    },
    async onSuccess() {
      onSuccess?.();
    },
    onError(e) {
      toast('mal', { description: e.message });
      onError?.();
    },
  });
};
