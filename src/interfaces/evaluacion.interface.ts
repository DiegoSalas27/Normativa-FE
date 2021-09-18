import { IObra } from './obra.interface';
import { IListaVerificacion } from './listaVerificacion.interface';
import { IPruebaDetalleLista } from './prueba.interface';
import { INivelRiesgo } from './nivelesRiesgo.interface';
import { IComentarioLista } from './comentario.interface';

export interface IEvaluacion {
  evaluacionId?: string;
  obra?: IObra;
  tratamiento?: any;
  listaVerificacion?: IListaVerificacion;
  codigo?: string;
  nombre?: string;
  porcentajeFinal?: number;
  estado?: 'Pendiente' | 'Aprobado' | 'Rechazado' | '';
  visibilidad?: boolean;
  fechaCreacion?: any;
  observacionLista?: IComentarioLista[],
  pruebaList?: any;
  action?: "registrar" | "editar" | "visualizar";
}

export interface IEvaluacionDetalle {
  evaluacionId: string;
  codigo: string;
  estadoEvaluacionId: string;
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
  observacionLista?: IComentarioLista[],
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

export interface IStatisticsEvaluacionResult {
  series: INivelRiesgo[];
  xAxisCategories: string[];
}

export interface IStatisticsEvaluacionCumplimiento {
  gaugeSeries: number[];
}

export interface IStatisticsEvaluacionCumplimientoPrueba {
  gaugeSeries2: number[];
}

export interface IStatisticsEvaluacionCumplimientoPruebaLista{
  
  stackedBarSeriesPrueba: StackedBarSeriesPrueba[];
  xAxisPruebaStacked: string[];

}

interface StackedBarSeriesPrueba {
  name: string;
  data: number[];
}