import { StoreOptions } from 'vuex';
import { emptyEvaluacion } from '../../utils/initializer';
import evaluacionActions from './actions';
import evaluacionGetters from './getters';
import evaluacionMutation from './mutations';

export default {
  namespaced: true,
  state() {
    return {
      ...emptyEvaluacion()
    };
  },
  mutations: evaluacionMutation,
  actions: evaluacionActions,  
  getters: evaluacionGetters,
} as StoreOptions<any>