import { IListaVerificacion } from '../../interfaces/listaVerificacion.interface';
import { setState } from '../../utils/vueState';

export default {
  guardarListaVerificacion(state: IListaVerificacion, payload: IListaVerificacion) {
    setState(state, payload);
  }
}