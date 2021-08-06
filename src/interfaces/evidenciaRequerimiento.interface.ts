import { IEvidencia } from './evidencia.interface';
export interface IEvidenciaRequerimiento {
  evidenciaId?: string;
  evidencia?: IEvidencia;
  requerimientoId?: string;
  criterioDescripcion?: string;
  pruebaId?: string;
  justificacion: string;
  respuestaItem: 1 | 0.5 | 0 | null | 'null';
  recomendacion?: string;
}