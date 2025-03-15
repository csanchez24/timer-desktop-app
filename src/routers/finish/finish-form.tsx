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
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useFinishDay } from '@/hooks/finish-day';
import { DailyTask } from '@/schemas/daily-task';
import { Icons } from '@/components/icons';

const formSchema = z.object({
  nota: z.string().min(2, {
    message: 'Nota debe ser al menos 2 letras.',
  }),
});

export function FinishForm({
  tasks,
  horini,
  horfin,
  tiempo,
}: {
  tasks?: DailyTask[];
  horini: string;
  horfin: string;
  tiempo: string;
}) {
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
        await finishDay({ tasks, horini, horfin, tiempo, nota: values.nota });
        await db.execute('DELETE FROM daily');
        return;
      } catch (e) {
        toast('Error Finanlizando dia');
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
