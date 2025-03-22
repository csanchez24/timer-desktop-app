import { useCallback, useEffect, useState } from 'react';
import SettingForm from './form';
import { initDB } from '@/db';
import type { Settings } from '@/schemas/settings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const db = await initDB();
        const [result] = (await db.select('SELECT * FROM settings')) as Settings[];
        if (result) {
          setSettings(result);
        }
      } catch (error) {
        console.error('Database error:', error);
      }
    }

    fetchSettings();
  }, []);

  const onSave = useCallback((settings: Settings) => {
    setSettings(settings);
  }, []);

  return (
    <main className="container">
      <div>
        <SettingForm settings={settings} onSave={onSave} />
      </div>
    </main>
  );
}
