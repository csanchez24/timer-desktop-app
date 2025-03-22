export type DailyTask = {
  numero: number;
  fecha: string; // DATE format, could be "YYYY-MM-DD"
  marca: string; // CHAR(2), UTF-8 encoded
  documento: string; // CHAR(7), UTF-8 encoded
  estado: string; // CHAR(1), UTF-8 encoded
  estnue: string; // CHAR(1), UTF-8 encoded
  horini: string; // CHAR(5), time format "HH:MM"
  horfin?: string; // CHAR(5), nullable, time format "HH:MM"
  nota: string; // TEXT, a long string
  tiempo?: string; // CHAR(6), nullable, time format "HH:MM"
  cerrar: 'S' | 'N'; // ENUM, only 'S' or 'N'
  area: string; // CHAR(2), UTF-8 encoded
  usuario: string; // CHAR(2), UTF-8 encoded
  descripcion: string; // CHAR(2), UTF-8 encoded
};
