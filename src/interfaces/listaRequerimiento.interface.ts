import { ICriterio, ICriterioResultado } from './criterio.interface';
import { IEvidenciaRequerimiento } from './evidenciaRequerimiento.interface';

export interface IRequerimiento {
  requerimientoId: string;
  descripcion: string;
  criterio: ICriterio;
  posicion?: number;
}

export interface IRequerimientoResultado {
  criterio: ICriterio;
  descripcion: string;
  evidenciaPruebaLink: IEvidenciaRequerimiento;
  requerimientoId?: string;
}