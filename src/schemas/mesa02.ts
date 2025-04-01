type Mesa13 = {
  fecha: string;
  hora: string;
  usuario: string;
  tiempo: string;
  nota: string;
};
export type Mesa02 = {
  marca: string;
  documento: string;
  fecha_creacion: string;
  hora_creacion: string;
  usuario_mesa: string;
  codigo_area: string;
  codigo_proyecto: string;
  usuario_solicita: string;
  codigo_modulo: string;
  accion_solicitada: string;
  nivel_importancia: string;
  horas_extras: string;
  estado: string;
  fecha_estado: string;
  descripcion: string;
  garantia: string;
  motivo_garantia: string;
  url_caso: string | null;
  archivo_adjunto: string | null;
  usuario_responsable: string;
  tiempo: string | null;
  minutos_soporte: string;
  valor_soporte: string;
  valor_cobro: string;
  aprueba_tiempo: 'S' | 'N';
  tiempo_presupuestado?: string;
  tiempo_acumulado: string;
  tiempo_estimado?: string;
  mesa13?: Mesa13[];
};

export type RespuestaTasks = {
  data: {
    casusu: Mesa02[];
  };
  flag: boolean;
  msg: string;
};

export type RespuestaTask = {
  data: {
    mesa02: Mesa02;
  };
  flag: boolean;
  msg: string;
};
