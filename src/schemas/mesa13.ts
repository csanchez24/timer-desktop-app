export type Mesa13 = {
  marca: string; // CHAR(2)
  documento: string; // CHAR(7)
  item: number; // INT
  estado: string; // CHAR(1)
  usuario: number; // INT
  fecha: string; // DATE (ISO format: YYYY-MM-DD)
  hora: string; // CHAR(8) (HH:MM:SS)
  tiempo: string; // CHAR(8) (HH:MM:SS)
  nota: string; // TEXT
  soporte?: string | null; // CHAR(1) (nullable)
};
