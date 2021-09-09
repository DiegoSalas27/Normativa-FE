import { PruebaList } from './prueba.interface';
export interface ITratamiento {
  tratamientoId?: string;
  evaluacionId: string;
  usuarioId?: string | null;
  estadosTratamientoId?: string | null;
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

export interface IStatisticsTratamientoResultDto {
  pieChartSeries: number[]
  pieChartLabels: string[]
}

export interface IStatisticsTratamientoResultListaDto {
  pieChartSeriesLista: number[]
  pieChartLabelsLista: string[]
}

export interface IStatisticsTratamientoResultAnalistasDto {
  stackedBarSeries: StackedBarSeries[]
  xAxisCategoriesStacked: string[];
}

interface StackedBarSeries {
  name: string;
  data: number[];
}