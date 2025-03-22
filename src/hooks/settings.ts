import { initDB } from '@/db';
import { Settings } from '@/schemas/settings';
import { useQuery } from '@tanstack/react-query';

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const db = await initDB();
      const [res] = (await db.select('SELECT * FROM settings')) as Settings[];
      return res;
    },
  });
};
