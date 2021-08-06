import { IEvaluacion } from '../../interfaces/evaluacion.interface';

export default {
  obtenerEvaluacion(state: IEvaluacion) {
    return state;
  },
  obtenerEvaluacionGuid(state: IEvaluacion) {
    return state.evaluacionId;
  },
  obtenerEvaluacionCodigo(state: IEvaluacion) {
    return state.codigo;
  },
}