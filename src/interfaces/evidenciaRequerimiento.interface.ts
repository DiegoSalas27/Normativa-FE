import { IEvidencia } from './evidencia.interface';
export interface IEvidenciaRequerimiento {
  evidenciaId?: string;
  evidencia?: IEvidencia;
  requerimientoId?: string;
  criterioDescripcion?: string;
  accionMitigacionId?: string;
  pruebaId?: string;
  pruebaPorcentajeCumplimiento?: number;
  justificacion: string;
  respuestaItem: 1 | 0.5 | 0 | null | 'null';
  recomendacion?: string;
  tratamientoId?: string;
  tratamientoCodigo?: string;
  accionMigitagcion?: boolean;
}