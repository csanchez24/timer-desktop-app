import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const mesa26Data = [
  {
    numero: 1,
    fecha: '2025-03-11',
    marca: 'AB',
    documento: '1234567',
    estado: 'A',
    estnue: 'S',
    horini: '08:00',
    horfin: '12:00',
    nota: 'Meeting with client.',
    esttra: 'A',
    tiempo: '04:00',
  },
  {
    numero: 2,
    fecha: '2025-03-12',
    marca: 'XY',
    documento: '7654321',
    estado: 'S',
    estnue: 'A',
    horini: '09:00',
    horfin: null,
    nota: 'Product discussion.',
    esttra: 'S',
    tiempo: null,
  },
  {
    numero: 3,
    fecha: '2025-03-13',
    marca: 'CD',
    documento: '9876543',
    estado: 'A',
    estnue: 'A',
    horini: '10:00',
    horfin: '14:00',
    nota: 'Team meeting and planning.',
    esttra: 'A',
    tiempo: '04:00',
  },
];

export default function Daily() {
  return (
    <div className="container">
      <h1 className="mb-4 text-lg">Tareas Activas</h1>
      <div className="flex flex-col gap-3">
        {mesa26Data.map((mesa26) => (
          <div className="block rounded-xl border p-4 shadow">
            <div className="flex justify-between">
              <div className="text-sm">
                <p>
                  {mesa26.marca} - {mesa26.documento}
                </p>
                <p>{mesa26.nota}</p>
              </div>
              <div className="text-secondary text-sm font-bold">
                <Button variant="ghost">
                  <Play className="text-black" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
