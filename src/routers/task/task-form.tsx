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
import { Mesa02 } from '@/schemas/mesa02';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const formSchema = z.object({
  nota: z.string().min(2, {
    message: 'Nota debe ser al menos 2 letras.',
  }),
});

export function TaskForm({ task }: { task?: Mesa02 }) {
  const navigate = useNavigate();
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
          estado: task.estado === 'EN PROCESO' ? 'E' : 'A',
          nota: values.nota,
          area: task.codigo_area,
          usuario: task.usuario_mesa,
          descripcion: task.descripcion,
        });
        navigate('/daily');
        return;
      } catch (e) {
        toast('Error Iniciando la tarea');
      }
    },
    [task, navigate, startTimer, toast, navigate]
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
        <Button type="submit">Empezar Caso</Button>
      </form>
    </Form>
  );
}
