import { IPrueba } from '../../interfaces/prueba.interface';
import { setState } from '../../utils/vueState';

export default {
  guardarPrueba(state: IPrueba, payload: IPrueba) {
    setState(state, payload);
  },
  actulizarGuidPruebaModule(state: IPrueba, payload: any) {
    state.pruebaId = payload.guid;
  }
}