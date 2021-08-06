import { ActionContext } from 'vuex';
import { IObra } from '../../interfaces/obra.interface';

export default {
  guardarObra(context: ActionContext<IObra, any>, payload: IObra) {
    context.commit('guardarObra', payload);
  }
}