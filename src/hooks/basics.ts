import { BASEURL } from '@/constants';
import { RespuestaGener02 } from '@/schemas/gener02';
import { RespuestaMesa01 } from '@/schemas/mesa01';
import { RespuestaSuspence } from '@/schemas/mesa12';
import { RespuestaDecline } from '@/schemas/mesa12Decline';
import { RespuestaProjects } from '@/schemas/mesa20';
import { RespuestaGarantias } from '@/schemas/mesa25';
import { getSettings } from '@/utils/get-settings';
import { useQuery } from '@tanstack/react-query';
import { fetch } from '@tauri-apps/plugin-http';

export const useMesa01 = () => {
  return useQuery({
    queryKey: ['mesa01'],
    queryFn: async () => {
      const settings = await getSettings();
      const res = await fetch(`${BASEURL}/mesa01`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
      });
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as RespuestaMesa01;
      return data;
    },
  });
};

export const useDecline = () => {
  return useQuery({
    queryKey: ['declines'],
    queryFn: async () => {
      const settings = await getSettings();
      const res = await fetch(`${BASEURL}/motivosRechazar`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
      });
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as RespuestaDecline;
      return data;
    },
  });
};

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

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const settings = await getSettings();
      const res = await fetch(`${BASEURL}/usuariosSYS`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
      });
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as RespuestaGener02;
      return data;
    },
  });
};

export const useGuarantees = () => {
  return useQuery({
    queryKey: ['guarantees'],
    queryFn: async () => {
      const settings = await getSettings();
      const res = await fetch(`${BASEURL}/motivosGarantia`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${settings.token}`,
        },
      });
      if (!res.ok) {
        return null;
      }
      const data = (await res.json()) as RespuestaGarantias;
      return data;
    },
  });
};
