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
import { db } from '@/db';
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
        const now = new Date();

        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
        const day = now.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const time = `${hours}:${minutes}:${seconds}`;

        await db.execute(
          'INSERT into daily (fecha, marca,documento,estado,estnue,horini,nota,tiempo,cerrar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [formattedDate, task.marca, task.documento, task.estado, 'E', time, values.nota, 0, 'N']
        );
        navigate('/daily');
        return;
      } catch (e) {
        toast('Error Iniciando la tarea');
      }
    },
    [task, navigate]
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
