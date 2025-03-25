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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSuspensions } from '@/hooks/basics';
import { useSuspendTask } from '@/hooks/tasks';
import { Mesa02 } from '@/schemas/mesa02';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const formSchema = z.object({
  codsus: z.string().min(1, { message: 'Seleccione un Motivo' }),
  nota: z.string().min(2, {
    message: 'Nota debe ser al menos 2 letras.',
  }),
});

export function SuspenceForm({ task, onSuccess }: { task?: Mesa02; onSuccess?(): void }) {
  const navigate = useNavigate();
  const { data: suspensions } = useSuspensions();
  const { mutateAsync: suspended, isPending } = useSuspendTask();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codsus: '',
      nota: '',
    },
  });

  const onSubmit = useCallback(
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        if (!task) return;
        await suspended({
          marca: task.marca,
          documento: task.documento,
          motivo: values.codsus,
          nota: values.nota,
        });
        onSuccess?.();
        toast('Se suspendio con exito.');
        navigate('/');
      } catch (e) {
        toast('Error Suspendiendo');
        console.log(e);
      }
    },
    [task, suspended, onSuccess, toast, navigate]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="codsus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full max-w-[350px]">
                    <SelectValue placeholder="Seleccione un motivo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suspensions?.data &&
                    suspensions.data.motsus.map((sus) => (
                      <SelectItem value={sus.codigo}>{sus.detalle_motivo}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nota"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nota</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit">
          {isPending && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Suspender Caso
        </Button>
      </form>
    </Form>
  );
}
