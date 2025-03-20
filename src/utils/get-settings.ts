import { db } from '@/db';
import { Settings } from '@/schemas/settings';

export async function getSettings() {
  const [res] = (await db.select('SELECT * FROM settings')) as Settings[];
  return res;
}
