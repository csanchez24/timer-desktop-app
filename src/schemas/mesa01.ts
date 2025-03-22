export type Mesa01 = {
  codigo_aplicativo: string;
  email: string;
  usuario_mesa: string;
  codigo_area: string;
};

export type RespuestaMesa01 = {
  data: {
    mesa01: Mesa01;
  };
  flag: boolean;
  msg: string;
};
