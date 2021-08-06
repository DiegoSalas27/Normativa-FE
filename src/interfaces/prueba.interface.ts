import { IEvaluacion } from "./evaluacion.interface";
import { IEvidenciaRequerimiento } from "./evidenciaRequerimiento.interface";
import { IRequerimientoResultado } from './listaRequerimiento.interface';
import { ICriterioResultado } from './criterio.interface';

export interface IPrueba {
  pruebaId: string;
  codigo: string;
  evaluacionId: string;
  porcentajeCumplimiento: number;
  evaluacion?: IEvaluacion;
  evidenciaRequerimientoLink: IEvidenciaRequerimiento[];
}

export interface IPruebaResultados {
  criteriosResultado: ICriterioResultado[];
  nivelDeRiesgo: string,
  porcentajeCumplimientoTotal: number,
  pruebaId: string,
  requerimientosResultado: IRequerimientoResultado[],
}

export interface IPruebaDetalleLista {
  pruebaId: string;
  codigo: string;
  fechaCreacion: any;
  visibilidad: boolean;
}