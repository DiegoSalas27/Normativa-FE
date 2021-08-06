import { StoreOptions } from 'vuex';
import { emptyPrueba } from '../../utils/initializer';
import pruebaActions from './actions';
import pruebaGetters from './getters';
import pruebaMutation from './mutations';

export default {
  namespaced: true,
  state() {
    return {
      ...emptyPrueba()
    };
  },
  mutations: pruebaMutation,
  actions: pruebaActions,  
  getters: pruebaGetters,
} as StoreOptions<any>