import { StoreOptions } from "vuex";
import { emptyObra } from "../../utils/initializer";
import obraActions from "./actions";
import obraGetters from "./getters";
import obraMutation from "./mutations";

export default {
  namespaced: true,
  state() {
    return {
      ...emptyObra(),
    };
  },
  mutations: obraMutation,
  actions: obraActions,
  getters: obraGetters,
} as StoreOptions<any>;
