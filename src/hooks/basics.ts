import { BASEURL } from '@/constants';
import { RespuestaSuspence } from '@/schemas/mesa12';
import { RespuestaProjects } from '@/schemas/mesa20';
import { getSettings } from '@/utils/get-settings';
import { useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';

export const useSuspensions = () => {
  return useQuery({
    queryKey: ['suspensions'],
    queryFn: async () => {
      const settings = await getSettings();
      const res = await fetch(`${BASEURL}/motivosSuspender`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
      });
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as RespuestaSuspence;
      return data;
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const settings = await getSettings();
      const res = await fetch(`${BASEURL}/subareasSYS`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
      });
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as RespuestaProjects;
      return data;
    },
  });
};
