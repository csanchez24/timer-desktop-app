'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { initDB } from '@/db';
import { Settings } from '@/schemas/settings';
import { toast } from 'sonner';
import { useCallback } from 'react';

const formSchema = z.object({
  token: z.string().min(2, {
    message: 'Digite el token',
  }),
});

export default function SettingForm({
  settings,
  onSave,
}: {
  settings?: Settings;
  onSave: (settings: Settings) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      token: settings?.token ?? '',
    },
  });

  const onSubmit = useCallback(
    async function onSubmit(values: z.infer<typeof formSchema>) {
      const db = await initDB();
      if (!settings) {
        await db.execute('INSERT INTO settings (token) VALUES ($1)', [values.token]);
      } else {
        await db.execute('UPDATE settings SET token=$1', [values.token]);
      }
      onSave?.(values);
      toast('se actualizo con exito.');
    },
    [toast, initDB, settings, onSave]
  );

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => {
              const { ref, ...rest } = field;
              return (
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <FormControl>
                    <Input placeholder="Token" {...rest} />
                  </FormControl>
                  <FormDescription>Token dado de la mesa de ayuda.</FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit">Guardar</Button>
        </form>
      </Form>
    </div>
  );
}
