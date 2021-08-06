import { StoreOptions } from 'vuex';
import listaVerificacionMutation from './mutations';
import listaVerificacionActions from './actions';
import listaVerificacionGetters from './getters';
import { emptyVerificationList } from '../../utils/initializer';

export default {
  namespaced: true,
  state() {
    return {
      ...emptyVerificationList()
    };
  },
  mutations: listaVerificacionMutation,
  actions: listaVerificacionActions,  
  getters: listaVerificacionGetters,
} as StoreOptions<any>