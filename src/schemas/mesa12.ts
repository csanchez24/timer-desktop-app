export type Mesa12 = {
  codigo: string;
  detalle_motivo: string;
};

export type RespuestaSuspence = {
  data: {
    motsus: Mesa12[];
  };
  flag: boolean;
  msg: string;
};
