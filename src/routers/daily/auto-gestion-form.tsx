'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Icons } from '@/components/icons';
import { useTimer } from '@/components/timer-context';
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
import { useProjects } from '@/hooks/basics';
import { useAutoTask } from '@/hooks/tasks';
import { useCallback } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  subare: z.string(),
  nota: z.string().min(2, {
    message: 'Nota debe ser al menos 2 letras.',
  }),
});

export function AutoGestionForm({
  onSuccess,
  onError,
}: { onSuccess?(): void; onError?(): void } = {}) {
  const { data: projects } = useProjects();
  const { mutateAsync: create, isPending } = useAutoTask();
  const { startTimer } = useTimer();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subare: '',
      nota: '',
    },
  });

  const onSubmit = useCallback(
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
        const task = await create({
          subare: values.subare,
          nota: values.nota,
        });
        await startTimer({
          marca: task?.marca ?? '',
          documento: task?.documento ?? '',
          estado: 'E',
          nota: values.nota,
          area: task?.codigo_area ?? '',
          descripcion: task?.descripcion ?? '',
          usuario: task?.usuario_mesa ?? '',
        });
        onSuccess?.();
        toast('Se creo caso con exito.');
      } catch (e) {
        onError?.();
        toast('Error creando caso');
        console.log(e);
      }
    },
    [startTimer, create, toast, onSuccess, onError]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="subare"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projecto</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full max-w-[350px]">
                    <SelectValue placeholder="Seleccione un projecto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects?.data &&
                    projects.data.codpro.map((pro) => (
                      <SelectItem value={pro.codigo_subarea}>{pro.detalle_subarea}</SelectItem>
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
        <Button type="submit">
          {isPending && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
          Crear Caso
        </Button>
      </form>
    </Form>
  );
}
