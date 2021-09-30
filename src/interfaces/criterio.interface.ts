export interface ICriterio {
  criterioId?: string;
  descripcion: string;
  peso: number;
}

export interface ICriterioResultado {
  cantidadPreguntas: number;
  descripcion: string;
  normalizedPuntaje: string;
  peso: number;
  porcentajeCumplimiento: number;
  puntaje: number;
}