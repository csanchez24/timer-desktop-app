export type Mesa20 = {
  codigo_subarea: string;
  detalle_subarea: string;
};

export type RespuestaProjects = {
  data: {
    codpro: Mesa20[];
  };
  flag: boolean;
  msg: string;
};
