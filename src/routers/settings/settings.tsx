import { useCallback } from 'react';
import SettingForm from './form';
import { useSettings } from '@/hooks/settings';

export default function SettingsPage() {
  const { data: settings, refetch } = useSettings();

  const onSave = useCallback(() => {
    refetch();
  }, []);

  return (
    <main className="container">
      <div>
        <SettingForm settings={settings} onSave={onSave} />
      </div>
    </main>
  );
}
