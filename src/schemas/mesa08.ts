export type Mesa08 = {
  marca: string; // CHAR(2)
  documento: string; // CHAR(7)
  estado: string; // CHAR(1)
  item: number; // INT
  codest?: string; // CHAR(2) (nullable)
  fecest: string; // DATE (ISO format: YYYY-MM-DD)
  hora: string; // CHAR(8) (HH:MM:SS)
  tiempo?: string; // CHAR(8) (nullable, HH:MM:SS)
  usuario: number; // INT
  nota: string; // TEXT
};
