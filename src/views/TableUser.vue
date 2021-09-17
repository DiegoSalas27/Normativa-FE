<template>
  <div>
    
      <section id="main" :class="{expand: expand}">
        <h2>REPORTE DE {{ calculateReport() }}</h2>
        <grid
        :dataSource="dataSource"
        :columns="columns"
        :config="config"
        :actions="actions"
        @movePage="movePage"
        @selectedList="selectedList"        
        :rows="5" 
        ></grid>
      </section>
    <!--  <button class="btn-table" @click="goTo('TableUser', { type: 'RiesgoNormativa' })">NIVEL DE RIESGO POR NORMATIVA</button>-->
  </div>
</template>

<script lang="ts">
import Grid from "@/components/ui/Grid.vue";
import { defineComponent } from "@vue/runtime-core"; 
import { columnsPlanesTratamientoList, columnsRiesgoNormativaList, columnsEvaluacionesList } from "../common/constants";
import { ITratamiento } from "../interfaces/tratamiento.interface";
import { IDataSource } from "../interfaces/dataSource";
import { emptyDataSource } from "../utils/initializer";
import { actions, BASE_URL, entity } from "@/common/constants";
import moment from "moment";
import { IEvaluacion } from "@/interfaces/evaluacion.interface";
import { IColumnsGrid } from "@/interfaces/grid.interface";
import {DataSourcetratamiento} from '../common/mockdata';
import {DataSourceEvaluaciones} from '../common/mockdata';
import {DataSourceRiesgo} from '../common/mockdata';

export default defineComponent({
  components: {
    Grid,
  },
  data() {
    return {
      columns: {} as any,
      dataSource: emptyDataSource() as IDataSource<any>,
      config: {
        deleteEntity: "",
        entity: entity.USER,
      },
      actions: [] as any,
      page: 1,
      quantity: 5,
      entityList: [] as string[],
    };
  },
  mounted() {
    let type = this.$route.params.type;
    (async () => {
        switch (type) {
            case 'PlanesTratamiento':
                this.columns = columnsPlanesTratamientoList;
                this.dataSource={
                  listaRecords:DataSourcetratamiento,
                  numeroPaginas: 0,
                  totalRecords: 0,
                };
                this.actions = [
                    { icon: "fas fa-eye", type: actions.EDIT, method: this.editPlanTratamiento },
                ]
                await this.listPlanTratamiento();
                break;
            case 'RiesgoNormativa':
                this.columns = columnsRiesgoNormativaList;
                this.dataSource={
                  listaRecords:DataSourceRiesgo,
                  numeroPaginas: 0,
                  totalRecords: 0,
                };                                  
                this.actions = [
                    { icon: "fas fa-eye", type: actions.EDIT, method: this.editRiesgoNormativa },
                ]
                await this.listRiesgoNormativa();
                break;
            case 'Evaluacion':
                this.columns = columnsEvaluacionesList;
                this.dataSource={
                  listaRecords:DataSourceEvaluaciones,
                  numeroPaginas: 0,
                  totalRecords: 0,
                };                                
                this.actions = [
                    { icon: "fas fa-eye", type: actions.EDIT, method: this.editEvaluaciones },
                ]
                await this.listEvaluacion();
                break;
            default:
                this.columns = columnsPlanesTratamientoList;
                this.actions = [
                    { icon: "fas fa-eye", type: actions.EDIT, method: this.editPlanTratamiento },
                ]
                await this.listPlanTratamiento();
                break;

        }
    })();
  },
  methods: {
    movePage(pageNumber: number) {
      this.page = pageNumber;
      this.listEvaluacion();
    },
    selectedList(entityList: string[]): void {
      this.entityList = entityList;
    },
   calculateReport(): any{
    let type = this.$route.params.type;
    switch (type) {
      case 'PlanesTratamiento':
        return "PLANES DE TRATAMIENTO"
      case 'RiesgoNormativa':
        return "CUMPLIMIENTO POR LISTA DE VERIFICACIÓN"
      case 'Evaluacion':
        return "RESULTADOS DE EVALUACIONES"
}
 },  
    editPlanTratamiento(): void {
        console.log('edit plan tratmiento')
    },
    deleteRiesgoNormativa(): void {
        console.log('deleteRiesgoNormativa')
    },
    editRiesgoNormativa(): void {
        console.log('editRiesgoNormativa')
    },
    deleteEvaluaciones(): void {
        console.log('deleteEvaluaciones')
    },
     editEvaluaciones(): void {
        console.log('editEvaluaciones')
    },
    async listPlanTratamiento(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}plantratamiento/lista?page=${this.page}&quantity=${this.quantity}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );
     
        this.dataSource = (await response.json()) as IDataSource<any>;
        
      } catch (error) {
        console.log(error);
      }
     
    },
    async listRiesgoNormativa(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/lista?page=${this.page}&quantity=${this.quantity}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );
     
        this.dataSource = (await response.json()) as IDataSource<any>;
        
      } catch (error) {
        console.log(error);
      }
     
    },



    async listEvaluacion(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/lista?page=${this.page}&quantity=${this.quantity}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );
     
        this.dataSource = (await response.json()) as IDataSource<any>;
        
      } catch (error) {
        console.log(error);
      }
     
    },

  },
});
</script>