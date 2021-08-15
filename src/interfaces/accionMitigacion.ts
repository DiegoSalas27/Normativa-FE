import { IEvidencia } from './evidencia.interface';
import { IComentarioLista } from './comentario.interface';
export interface IAccionMitigacion {
  accionMitigacionId: string;
  tratamientoId: string;
  descripcion: string;
  estado: boolean;
  fechaInicio: any;
  fechaFin: any;
  tieneMensaje?: boolean;
}

export interface IEvidenciaRequerimientoAccionMitigacion {
  justificacion: string;
  recomendacion: string;
  requerimientoDescripcion: string;
  criterioDescripcion: string;
  respuestaItem: number;
  estadoAccionMitigacion: boolean;
  evidencia: IEvidencia;
  comentarioLista: IComentarioLista[];
}