'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Icons } from '@/components/icons';
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
import { initDB } from '@/db';
import { useFinishDay } from '@/hooks/finish-day';
import { DailyTask } from '@/schemas/daily-task';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const formSchema = z.object({
  nota: z.string().min(2, {
    message: 'Nota debe ser al menos 2 letras.',
  }),
});

export function FinishForm({
  tasks,
  date,
  horini,
  horfin,
  tiempo,
}: {
  tasks?: DailyTask[];
  date: string;
  horini: string;
  horfin: string;
  tiempo: string;
}) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nota: '',
    },
  });

  const { mutateAsync: finishDay, isPending } = useFinishDay();

  const onSubmit = useCallback(
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        if (!tasks) return;
        await finishDay({ date, tasks, horini, horfin, tiempo, nota: values.nota });
        toast('Cierre del dia finalizado con exito.');
        const db = await initDB();
        await db.execute('DELETE FROM daily');
        navigate('/');
        return;
      } catch (e) {
        toast('Error Finanlizando dia');
        console.log(e);
      }
    },
    [tasks, horini, horfin, tiempo]
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
              <FormDescription>Nota para finalizar el dia.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          {isPending && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Finalizar Dia
        </Button>
      </form>
    </Form>
  );
}
