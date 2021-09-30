import { ICriterio } from './criterio.interface';
import { IEvidenciaRequerimiento } from './evidenciaRequerimiento.interface';

export interface IRequerimiento {
  requerimientoId?: string;
  descripcion: string;
  criterio?: ICriterio;
  posicion?: number;
  recomendacion?: string;
  criterioId?: string;
  listaVerificacionId?: string;
}

export interface IRequerimientoResultado {
  criterio: ICriterio;
  descripcion: string;
  evidenciaPruebaLink: IEvidenciaRequerimiento;
  requerimientoId?: string;
}