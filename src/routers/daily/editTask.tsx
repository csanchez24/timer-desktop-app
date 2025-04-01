'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Textarea } from '@/components/ui/textarea';
import { DailyTask } from '@/schemas/daily-task';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { initDB } from '@/db';

const formSchema = z.object({
  nota: z.string().min(2, {
    message: 'Nota debe ser al menos 2 letras.',
  }),
});

export function EditTask({ task, onSuccess }: { task?: DailyTask; onSuccess?(): void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nota: task?.nota ?? '',
    },
  });

  const onSubmit = useCallback(
    async function onSubmit(values: z.infer<typeof formSchema>) {
      if (!task) return;
      try {
        if (!task) return;
        const db = await initDB();
        await db.execute('UPDATE daily SET nota = ? WHERE numero = ?', [values.nota, task.numero]);
        onSuccess?.();
        return;
      } catch (e) {
        toast('Error editando el caso');
      }
    },
    [task, initDB, onSuccess]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nota"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nota</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>Nota que sera publicada en la mesa de ayuda.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Modificar</Button>
      </form>
    </Form>
  );
}
