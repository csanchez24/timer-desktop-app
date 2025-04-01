'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { useGuarantees } from '@/hooks/basics';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { initDB } from '@/db';
import { DailyTask } from '@/schemas/daily-task';

const formSchema = z.object({
  codgar: z.string().min(1, { message: 'Seleccione' }),
  garantia: z.string().min(1, { message: 'Seleccione' }),
});

export function GarantiaForm({
  task,
  onSuccess,
  onError,
}: { task?: DailyTask; onSuccess?(): void; onError?(): void } = {}) {
  const { data: garantias } = useGuarantees();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codgar: '',
      garantia: '',
    },
  });

  const onSubmit = useCallback(
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        if (!task) return;
        const db = await initDB();
        await db.execute('UPDATE daily SET garantia = ?,codgar = ? WHERE numero = ?', [
          values.garantia,
          values.codgar,
          task.numero,
        ]);
        onSuccess?.();
        toast('Se modifico el caso con exito.');
      } catch (e) {
        onError?.();
        toast('Error modificando el caso');
        console.log(e);
      }
    },
    [task, toast, initDB, onSuccess, onError]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="garantia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Garantia ?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full max-w-[350px]">
                    <SelectValue placeholder="Seleccione un projecto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="S">SI</SelectItem>
                  <SelectItem value="N">NO</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="codgar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full max-w-[350px]">
                    <SelectValue placeholder="Seleccione un projecto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {garantias?.data &&
                    garantias.data.codgar.map((cod) => (
                      <SelectItem value={cod.codigo_garantia}>{cod.detalle_garantia}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Modificar</Button>
      </form>
    </Form>
  );
}
