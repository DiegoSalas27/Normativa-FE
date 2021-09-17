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
import { getUsuario } from "@/services/authService";
import { columnsPlanesTratamientoList, columnsRiesgoNormativaList, columnsEvaluacionesList } from "../common/constants";
import { ITratamiento } from "../interfaces/tratamiento.interface";
import { IDataSource } from "../interfaces/dataSource";
import { emptyDataSource, emptyUser } from "../utils/initializer";
import { actions, BASE_URL, entity, rol } from "@/common/constants";
import moment from "moment";
import { IUser } from "../interfaces/user.interface";
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
      userInfoJson: emptyUser() as IUser,
      columns: {} as any,
      dataSource: emptyDataSource() as IDataSource<any>,
      config: {
        deleteEntity: "",
        entity: entity.USER,
      },
      actions: [] as any,
      page: 1,
      url: "",
      quantity: 5,
      entityList: [] as string[],
    };
  },
  mounted() {
    let type = this.$route.params.type;
    (async () => {
      this.userInfoJson = await getUsuario();
        switch (type) {
            case 'PlanesTratamiento':
                this.columns = columnsPlanesTratamientoList;
                this.dataSource={
                  listaRecords:DataSourcetratamiento,
                  numeroPaginas: 0,
                  totalRecords: 0,
                };
                this.url="/plan-tratamiento/";
                this.userInfoJson = await getUsuario();
                if (this.userInfoJson.rol == rol.ALTA_GERENCIA) {
                  this.url="/plan-tratamiento/";
                }
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
                this.url="/evaluacion/";
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
    editPlanTratamiento(id: string,codigo:string, entidad: string): void {
        this.$router.push(this.url + codigo);
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
     editEvaluaciones(id: string,codigo:string, entidad: string): void {
        console.log('editEvaluaciones')
        this.$router.push(this.url + codigo);
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