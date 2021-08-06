import { IEvaluacion } from '../../interfaces/evaluacion.interface';
import { setState } from '../../utils/vueState';

export default {
  guardarEvaluacion(state: IEvaluacion, payload: IEvaluacion) {
    setState(state, payload);
  },
  actulizarGuidEvaluacionModule(state: IEvaluacion, payload: any) {
    state.evaluacionId = payload.guid;
  }
}