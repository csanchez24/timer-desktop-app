import Database from '@tauri-apps/plugin-sql';

export async function initDB() {
  return await Database.load('sqlite:timer.db');
}
