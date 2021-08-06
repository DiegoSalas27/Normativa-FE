import { createStore } from "vuex";
import listaVerificacionModule from "./lista-verificacion";
import obraModule from "./obra";
import evaluacionModule from "./evaluacion";
import pruebaModule from './prueba';

const store = createStore({
  modules: {
    listaVerificacionModule,
    obraModule,
    evaluacionModule,
    pruebaModule
  },
  state() {
    return {};
  },
  mutations: {},
  actions: {},
  getters: {},
});

export default store;
