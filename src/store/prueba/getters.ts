import { IPrueba } from '../../interfaces/prueba.interface';

export default {
  obtenerPrueba(state: IPrueba) {
    return state;
  },
  obtenerPruebaGuid(state: IPrueba) {
    return state.pruebaId;
  },
  obtenerPruebaCodigo(state: IPrueba) {
    return state.codigo;
  }
}