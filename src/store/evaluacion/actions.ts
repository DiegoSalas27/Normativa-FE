import { ActionContext } from 'vuex';
import { IEvaluacion } from '../../interfaces/evaluacion.interface';

export default {
  guardarEvaluacion(context: ActionContext<IEvaluacion, any>, payload: IEvaluacion) {
    context.commit('guardarEvaluacion', payload);
  },
  actulizarGuidEvaluacionModule(context: ActionContext<IEvaluacion, any>, payload: any) {
    context.commit('actulizarGuidEvaluacionModule', payload);
  }
}