import { IEvaluacion } from '../interfaces/evaluacion.interface';
import { IObra } from '../interfaces/obra.interface';
import { IListaVerificacion } from '../interfaces/listaVerificacion.interface';
import { IPruebaDetalleLista } from '../interfaces/prueba.interface';
import { INivelRiesgo } from '../interfaces/nivelesRiesgo.interface';
import { IComentarioLista } from'../interfaces/comentario.interface';

export default class Evaluacion implements IEvaluacion {
    constructor(

        public valuacionId?: string | undefined,
        public obra?: IObra,
        public tratamiento?: any,
        public listaVerificacion?: IListaVerificacion,
        public codigo?: string | undefined,
        public nombre?: string | undefined,
        public porcentajeFinal?: number | undefined,
        public estado?: any,
        public visibilidad?: boolean | undefined,
        public fechaCreacion?: any,
        public observacionLista?: IComentarioLista[],
        public pruebaList?: any,
        public action?: any,




        ) {}
  
    }
    