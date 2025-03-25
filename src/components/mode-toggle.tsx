import { useTheme } from '@/components/theme-provider';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
      <div className="text-center">
        <Label htmlFor="Dark Mode" className="text-xs">
          Dark Mode
        </Label>
      </div>
    </div>
  );
}
