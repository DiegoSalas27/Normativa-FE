import { setState } from '../../utils/vueState';
import { IObra } from '../../interfaces/obra.interface';

export default {
  guardarObra(state: IObra, payload: IObra) {
    setState(state, payload);
  }
}