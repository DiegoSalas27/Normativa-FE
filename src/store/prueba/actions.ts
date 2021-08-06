import { ActionContext } from 'vuex';
import { IPrueba } from '../../interfaces/prueba.interface';

export default {
  guardarPrueba(context: ActionContext<IPrueba, any>, payload: IPrueba) {
    context.commit('guardarPrueba', payload);
  },
  actulizarGuidPruebaModule(context: ActionContext<IPrueba, any>, payload: any) {
    context.commit('actulizarGuidPruebaModule', payload);
  }
}