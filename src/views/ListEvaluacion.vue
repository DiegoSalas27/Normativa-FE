<template>
  <confirmation-modal
    :error="null"
    :show="showModalConfirmation"
    :title="modalTitle"
    :massiveDelete="massiveDelete"
    @cancel="closeModal"
  ></confirmation-modal>
  <modal
    :show="!!message"
    :title="message"
    @close="handleError"
    :error="error"
    :loading="loading"
  ></modal>
  <section id="main" :class="{ expand: expand }">
    <h1>REPORTE DE EVALUACIONES</h1>
  <br>
   
      <span>Escriba la obra que desea buscar: </span>
      <input type="text" name="txtobra" id="txtobra" v-model="filtro_obra" >
      <br>
      <br>
      <span>Seleccione la lista que desea buscar : </span>
      <a-select default-value="TODOS" style="width: 300px"  @change="changeFiltroListaVerificacion"  >
      <a-select-option  v-for="(item,index) in itemsListaVerificacion" :key="index" :value="item.nombre" >{{item.nombre}}</a-select-option>
      </a-select>
   

    <grid
      :dataSource="dataSource"
      :columns="columns"
      :actions="actions"
      :rows="5"
      @movePage="movePage"
      @selectedList="selectedList"
    ></grid>
  </section>
</template>

<script lang="ts">
import {
  actions,
  BASE_URL,
  columnsEvaluacionesList,
  entity,
} from "@/common/constants";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import Grid from "@/components/ui/Grid.vue";
import { IEvaluacion } from "@/interfaces/evaluacion.interface";
import { defineComponent } from "@vue/runtime-core";
import Modal from "../components/ui/Modal.vue";
import { IDataSource } from "../interfaces/dataSource";
import { emptyDataSource } from "../utils/initializer";
var clearSetTime='' as any;

export default defineComponent({
  components: {
    Grid,
    ConfirmationModal,
    Modal,
  },
  computed: {
    evaluacion(): IEvaluacion {
      return this.$store.getters["evaluacionModule/obtenerEvaluacion"];
    },
  },
  data() {
    return {
      dataSource: emptyDataSource() as IDataSource<IEvaluacion>,
      // dataSource: emptyDataSource() as IDataSource<IUser>,
      columns: columnsEvaluacionesList,
      // columns: columnsRolList,
      // config: {
      //   deleteEntity: "",
      //   entity: entity.USER,
      // },
      actions: [{ icon: "fas fa-eye", type: actions.EDIT, method: this.edit }],
      filtro_obra:'',
      filtro_lista_verificacion:'',
      itemsListaVerificacion:[{id:'',nombre:'TODOS'},{id:1,nombre:'ISO 45002'},{id:1,nombre:'LEY Nº 29783  Ley de Seguridad y Salud en el Trabajo'}],
      modalTitle: "",
      showModalConfirmation: false,
      id: "",
      entity: "",
      message: null as unknown as string | null,
      loading: false,
      error: false,
      entityList: [] as string[],
      massiveDelete: false,
      expand: false,
      page: 1,
      quantity: 5,
    };
  },
  watch:{
    filtro_obra(v){
      if(v){
        if(clearSetTime){
          clearTimeout(clearSetTime);
        }
        clearSetTime = setTimeout(() => {
            this.listEvaluaciones();
        }, 500);
      }
    }
  },
  
  methods: {

    changeFiltroListaVerificacion(value=''){
      this.filtro_lista_verificacion = value;
      this.listEvaluaciones();
    },
    
    movePage(pageNumber: number) {
      this.page = pageNumber;
      this.listEvaluaciones();
    },
    expandMain(value: boolean): void {
      this.expand = !value;
    },
    selectedList(entityList: string[]): void {
      this.entityList = entityList;
    },
    handleError(): void {
      this.message = null;
    },
    closeModal(): void {
      this.showModalConfirmation = false;
    },
    async listEvaluaciones(): Promise<void> {
      try {
        const response = await fetch(
         `${BASE_URL}evaluacion/listado?page=${this.page}&quantity=${this.quantity}&obra=${this.filtro_obra}&listVerif=${this.filtro_lista_verificacion}`,
          // `${BASE_URL}usuario/listar/ANALISTAS?page=${this.page}&quantity=${this.quantity}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.dataSource = (await response.json()) as IDataSource<IEvaluacion>;
        // this.dataSource = (await response.json()) as IDataSource<IUser>;
        console.log("this.dataSource");
        console.log(this.dataSource);
      } catch (error) {
        console.log(error);
      }
    },
    edit(_: number, codigo: string, _2: string): void {
      this.evaluacion.action = "visualizar";
      this.$router.push(`/evaluacion/${codigo}`);
    },
  },
  mounted() {
    (async () => {
      await this.listEvaluaciones();
    })();
  },
});
</script>

<style>
.action-button {
  position: absolute;
  top: 95px;
  right: 30px;
}

.massive {
  top: 95px;
  right: 200px;
  width: 220px;
}
</style>