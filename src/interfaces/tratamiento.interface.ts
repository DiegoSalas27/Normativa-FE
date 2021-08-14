import { PruebaList } from './prueba.interface';
export interface ITratamiento {
  tratamientoId?: string;
  evaluacionId: string;
  usuarioId: string;
  nombre: string;
  codigo: string;
  fechaInicio?: any;
  fechaFin?: any;
  porcentajeAvance?: number;
}

export interface IObtenerTratamiento {
  tratamientoId: string;
  evaluacionId: string;
  codigo: string;
  fechaInicio: any;
  fechaFin: any;
  nombre: string;
  usuarioId: string;
  porcentajeAvance: number;
  codigoEvaluacion: string;
  listaVerificacionCodigo: string;
  pruebas: PruebaList[];
}