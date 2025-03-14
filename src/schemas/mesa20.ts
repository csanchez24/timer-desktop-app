export type Mesa20 = {
  codigo_proyecto: string;
  detalle_proyecto: string;
};

export type RespuestaProjects = {
  data: {
    codpro: Mesa20[];
  };
  flag: boolean;
  msg: string;
};
