import { RespuestaSuspence } from '@/schemas/mesa12';
import { RespuestaProjects } from '@/schemas/mesa20';
import { useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';

export const useSuspensions = () => {
  return useQuery({
    queryKey: ['suspensions'],
    queryFn: async () => {
      const res = await fetch(
        'https://soporte.syseu.com.co/MesaAyuda/webservice/motivosSuspender',
        {
          method: 'GET',
        }
      );
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
      const res = await fetch('https://soporte.syseu.com.co/MesaAyuda/webservice/subareasSYS', {
        method: 'GET',
      });
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as RespuestaProjects;
      return data;
    },
  });
};
