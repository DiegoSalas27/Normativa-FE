import { IRequerimiento } from "./listaRequerimiento.interface";
import { INivelesRiesgo } from './nivelesRiesgo.interface';

export interface IListaVerificacion {
	listaVerificacionId?: string;
	codigo?: string;
	nombre?: string;
	fechaCreacion?: any;
  requerimientosCount?: number;
	requerimientos: IRequerimiento[];
	nivelesRiesgos: INivelesRiesgo[];
}

export interface IStatisticsListaVerificacion{
  
	stackedBarSeriesListaVerificacion: StackedBarSeriesListaVerificacion[];
	xAxisListaVerificacionStacked: any;
	stackedBarListas:any;

  
  }
  
  interface StackedBarSeriesListaVerificacion {
	name: string;
	data: number[];
  }
