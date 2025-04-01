export type Mesa25 = {
  codigo_garantia: string;
  detalle_garantia: string;
};

export type RespuestaGarantias = {
  data: {
    codgar: Mesa25[];
  };
  flag: boolean;
  msg: string;
};
