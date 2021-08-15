import { IObra } from './obra.interface';
import { IListaVerificacion } from './listaVerificacion.interface';
import { IPruebaDetalleLista } from './prueba.interface';

export interface IEvaluacion {
  evaluacionId?: string;
  obra?: IObra;
  tratamiento?: any;
  listaVerificacion?: IListaVerificacion;
  codigo?: string;
  nombre?: string;
  porcentajeFinal?: number;
  estado?: 'pendiente' | 'tratada';
  visibilidad?: boolean;
  fechaCreacion?: any;
  pruebaList?: any;
}

export interface IEvaluacionDetalle {
  evaluacionId: string;
  codigo: string;
  estado: string;
  nombre: string;
  visibilidad: boolean;
  fechaCreacion: any;
  listaVerificacionId: string;
  codigoObra: string;
  codigoConcatenadoObra: string;
  obraId: string;
  codigoListaVerificacion: string;
  codigoConcatenadoListaVerificacion: string;
  listaVerificacionFechaCreacion: any;
  requerimientosCount: number;
  pruebaList: IPruebaDetalleLista[];
}

export interface IEvaluacionListado {
  evaluacionId: string;
  codigo: string;
  nombre: string;
  tieneTratamiento?: string;
  visbilidad: boolean;
  pruebaList: IPruebaDetalleLista[];
}