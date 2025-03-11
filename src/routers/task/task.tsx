import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';
import { NavLink } from 'react-router';

function InfoBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3 text-sm">
      <div className="text-foreground text-xs leading-7 font-medium uppercase">{label}</div>
      <div className="text-muted-foreground capitalize">{value}</div>
    </div>
  );
}

const task = {
  marca: 'AB',
  documento: '1234567',
  fecha: '2025-03-10',
  hora: '14:35:20',
  usuario: 10234,
  codare: 'XZ',
  codpro: 56789,
  usuare: 20345,
  codmod: 'M1',
  accsol: 'A2',
  nivimp: 'H',
  horext: 'S',
  url: 'https://example.com/file.pdf',
  nomarc: 'document.pdf',
  garantia: 'N',
  estado: 'A',
  fecest: '2025-03-10',
  usures: 30456,
  accgen: 'B12',
  tiempo: '00:45',
  presu: '012345',
  soporte: 'Y',
  testin: 'Initial system test completed successfully.',
  mesa08: [
    {
      id: 1,
      descripcion: 'Mesa08 test entry',
    },
  ],
  mesa13: [
    {
      id: 2,
      detalle: 'Mesa13 test entry',
    },
  ],
};

export default function Task() {
  const data = [
    { label: 'Marca', value: task.marca },
    { label: 'Documento', value: task.marca },
    { label: 'Fecha', value: task.fecha },
    { label: 'Hora', value: task.hora },
    { label: 'Usuario', value: task.usuario },
    { label: 'Area', value: task.codare },
    { label: 'SubArea', value: task.codpro },
    { label: 'Usuario Area', value: task.usuare },
    { label: 'Modalidad', value: task.codmod },
    { label: 'Accion', value: task.accgen },
    { label: 'Nivel', value: task.nivimp },
    { label: 'Hora Extra', value: task.horext },
    { label: 'Url', value: task.url },
    { label: 'Archivo', value: task.nomarc },
    { label: 'Garantia', value: task.garantia },
    { label: 'Estado', value: task.estado },
    { label: 'Fecha Estado', value: task.fecest },
    { label: 'Responsable', value: task.usures },
    { label: 'Accion', value: task.accgen },
    { label: 'Tiempo', value: task.tiempo },
    { label: 'Soporte', value: task.soporte },
  ];

  return (
    <div className="container">
      <div className="mb-4 flex justify-between">
        <div>
          <div className="flex gap-2">
            <NavLink to="/">
              <ArrowLeft />
            </NavLink>
            <h1 className="text-lg">Tasks</h1>
          </div>
        </div>
        <div>
          <Button>
            Iniciar <Play />
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2">
        {data.map((d) => (
          <InfoBlock key={d.label} {...d} />
        ))}
      </div>
    </div>
  );
}
