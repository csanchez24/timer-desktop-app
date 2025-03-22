'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useTimer } from '@/components/timer-context';
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

const formSchema = z.object({
  nota: z.string().min(2, {
    message: 'Nota debe ser al menos 2 letras.',
  }),
});

export function StartForm({ task, onSuccess }: { task?: DailyTask; onSuccess?(): void }) {
  const { startTimer } = useTimer();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nota: '',
    },
  });

  const onSubmit = useCallback(
    async function onSubmit(values: z.infer<typeof formSchema>) {
      if (!task) return;
      try {
        await startTimer({
          marca: task.marca,
          documento: task.documento,
          estado: task.estado,
          nota: values.nota,
          area: task.area,
          usuario: task.usuario,
          descripcion: task.descripcion,
        });
        onSuccess?.();
        return;
      } catch (e) {
        toast('Error Iniciando la tarea');
      }
    },
    [task, startTimer, onSuccess]
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
        <Button type="submit">Empezar</Button>
      </form>
    </Form>
  );
}
