export type Gener02 = {
  codigo_usuario: string;
  nombre_usuario: string;
};

export type RespuestaGener02 = {
  data: {
    usuarios: Gener02[];
  };
  flag: boolean;
  msg: string;
};
