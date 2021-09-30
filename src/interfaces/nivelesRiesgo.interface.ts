export interface INivelRiesgo {
  name: string;
  data: number[];
}

export interface INivelesRiesgo {
  listaVerificacionId?: string;
  nivelesRiesgoId?: string;
  nombre: string;
  extMinimo: string;
  extMaximo: string;
}