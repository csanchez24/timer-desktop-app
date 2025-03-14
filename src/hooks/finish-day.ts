import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetch } from '@tauri-apps/plugin-http';

export const useFinishDay = ({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) => {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('', {
        method: 'POST',
      });
      if (!res.ok) {
        return null;
      }
      const data = await res.json();
      return data;
    },
    async onSuccess() {
      toast('bien', { description: 'bien' });
      onSuccess?.();
    },
    onError(e) {
      toast('mal', { description: e.message });
      onError?.();
    },
  });
};
