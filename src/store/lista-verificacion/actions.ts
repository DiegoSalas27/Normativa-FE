import { ActionContext } from 'vuex';
import { IListaVerificacion } from '../../interfaces/listaVerificacion.interface';

export default {
  guardarListaVerificacion(context: ActionContext<IListaVerificacion, any>, payload: IListaVerificacion) {
    context.commit('guardarListaVerificacion', payload);
  }
}