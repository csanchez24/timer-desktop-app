import { Mesa08 } from './mesa08';
import { Mesa13 } from './mesa13';

export type Mesa02 = {
  marca: string; // CHAR(2)
  documento: string; // CHAR(7)
  fecha: string; // DATE (ISO format: YYYY-MM-DD)
  hora: string; // CHAR(8) (HH:MM:SS)
  usuario: number; // INT
  codare: string; // CHAR(2)
  codpro: number; // INT
  usuare: number; // INT
  codmod: string; // CHAR(2)
  accsol: string; // CHAR(2)
  nivimp: string; // CHAR(1)
  horext: 'S' | 'N'; // ENUM('S', 'N')
  url?: string | null; // CHAR(100) (nullable)
  nomarc?: string | null; // CHAR(100) (nullable)
  garantia: 'S' | 'N'; // ENUM('S', 'N')
  estado: string; // CHAR(1)
  fecest: string; // DATE (ISO format: YYYY-MM-DD)
  usures?: number | null; // INT (nullable)
  accgen?: string | null; // CHAR(3) (nullable)
  tiempo?: string | null; // CHAR(6) (nullable)
  presu?: string | null; // CHAR(6) (nullable)
  soporte?: string | null; // CHAR(1) (nullable)
  testin?: string | null; // CHAR(100) (nullable)
  mesa08?: Mesa08[];
  mesa13?: Mesa13[];
};
