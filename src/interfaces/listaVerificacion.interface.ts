import { IRequerimiento } from "./listaRequerimiento.interface";

export interface IListaVerificacion {
	listaVerificacionId?: string;
	codigo?: string;
	nombre?: string;
	fechaCreacion?: any;
  requerimientosCount?: number;
	requerimientos: IRequerimiento[];

}

export interface IStatisticsListaVerificacion{
  
	stackedBarSeriesListaVerificacion: StackedBarSeriesListaVerificacion[];
	xAxisListaVerificacionStacked: any;
  
  }
  
  interface StackedBarSeriesListaVerificacion {
	name: string;
	data: number[];
  }
