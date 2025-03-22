import { initDB } from '@/db';
import { DailyTask } from '@/schemas/daily-task';
import { useQuery } from '@tanstack/react-query';

export const useDailyTask = () => {
  return useQuery({
    queryKey: ['dailyTask'],
    queryFn: async () => {
      const db = await initDB();
      const res = (await db.select('SELECT * FROM daily ORDER BY numero DESC')) as DailyTask[];
      return res;
    },
  });
};
