export type Mesa12Decline = {
  codigo: string;
  detalle_motivo: string;
};

export type RespuestaDecline = {
  data: {
    motrec: Mesa12Decline[];
  };
  flag: boolean;
  msg: string;
};
