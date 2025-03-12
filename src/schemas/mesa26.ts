export type Mesa26 = {
  numero: number;
  fecha: string; // DATE format, could be "YYYY-MM-DD"
  marca: string; // CHAR(2), UTF-8 encoded
  documento: string; // CHAR(7), UTF-8 encoded
  estado: string; // CHAR(1), UTF-8 encoded
  estnue: string; // CHAR(1), UTF-8 encoded
  horini: string; // CHAR(5), time format "HH:MM"
  horfin?: string; // CHAR(5), nullable, time format "HH:MM"
  nota: string; // TEXT, a long string
  esttra: 'A' | 'S'; // ENUM, only 'A' or 'S'
  tiempo?: string; // CHAR(6), nullable, time format "HH:MM"
};
