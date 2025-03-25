'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePresuTask } from '@/hooks/tasks';
import { Mesa02 } from '@/schemas/mesa02';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const formSchema = z.object({
  tiempo: z.coerce.number().min(1, { message: 'debe ser mayor a cero.' }),
});

export function PresuForm({ task, onSuccess }: { task?: Mesa02; onSuccess?(): void }) {
  const navigate = useNavigate();
  const { mutateAsync: presu, isPending } = usePresuTask();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tiempo: 0,
    },
  });

  const onSubmit = useCallback(
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        if (!task) return;
        await presu({
          marca: task.marca,
          documento: task.documento,
          tiempo: values.tiempo,
        });
        onSuccess?.();
        toast('Se presupuesto con exito.');
        navigate('/');
      } catch (e) {
        toast('Error presupuestando');
        console.log(e);
      }
    },
    [task, presu, onSuccess, toast, navigate]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="tiempo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiempo en minutos</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          {isPending && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Presupuestar Caso
        </Button>
      </form>
    </Form>
  );
}
