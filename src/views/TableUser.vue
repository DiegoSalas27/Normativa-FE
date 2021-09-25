<template>
  <div>
  <confirmation-modal
    :error="null"
    :show="showModalConfirmation"
    :title="modalTitle"
    :massiveDelete="massiveDelete"
    @confirm="confirmDelete"
    @confirmMassive="confirmMassiveDelete"
    @cancel="closeModal"
  ></confirmation-modal>
  <modal
    :show="!!message"
    :title="message"
    @close="handleError"
    :error="error"
    :loading="loading"
  ></modal>    
      <section id="main" :class="{expand: expand}">
        <h3 class="back" @click="goBack">
          <i class="fas fa-chevron-left"></i> Salir
        </h3>
        <h2>REPORTE DE {{ calculateReport() }}</h2>
        <button v-if="isAnalista || isJefeRiesgos" class="action-button" @click="deleteMassive()"> Eliminación masiva </button>        
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
    
  </div>
</template>

<script lang="ts">
import Grid from "@/components/ui/Grid.vue";
import { defineComponent } from "@vue/runtime-core"; 
import { getUsuario } from "@/services/authService";
import { columnsPlanesTratamientoList, columnsRiesgoNormativaList, columnsEvaluacionesList } from "../common/constants";
import { ITratamiento } from "../interfaces/tratamiento.interface";
import { IDataSource } from "../interfaces/dataSource";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import Modal from "../components/ui/Modal.vue";
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
    ConfirmationModal,
    Modal,    
  },
  data() {
    return {
      userInfoJson: emptyUser() as IUser,
      columns: {} as any,
      dataSource: emptyDataSource() as IDataSource<any>,
      isAnalista: false,
      isJefeRiesgos: false,      
      config: {
        deleteEntity: "",
        entity: entity.EVALUACION,
      },
       actions: [
        { icon: "fas fa-trash-alt", type: actions.DELETE, method: this.delete() },
        { icon: "fas fa-eye", type: actions.EDIT, method: this.edit },
      ],
      modalTitle: "",
      showModalConfirmation: false,
      id: "",
      entity: "",
      message: null as unknown as string | null,
      loading: false,
      error: false,
      massiveDelete: false,
      expand: false,  
      url: "",
      page: 1,      
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
                if (this.userInfoJson.rol == rol.JEFE_DE_RIESGOS) {
                  this.isJefeRiesgos=true;
                  this.actions = [
                  { icon: "fas fa-trash-alt", type: actions.DELETE, method: this.delete },
                   { icon: "fas fa-eye", type: actions.EDIT, method: this.editEvaluaciones }
                  ]
                }else{
                this.actions = [
                //  { icon: "fas fa-trash-alt", type: actions.DELETE, method: this.deleteEvaluaciones },
                    { icon: "fas fa-eye", type: actions.EDIT, method: this.editEvaluaciones },
                ]
                }
                await this.listPlanTratamiento();
                break;
            case 'RiesgoNormativa':
                this.columns = columnsRiesgoNormativaList;
                this.dataSource={
                  listaRecords:DataSourceRiesgo,
                  numeroPaginas: 0,
                  totalRecords: 0,
                };
                this.url="/evaluacion/";
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
                this.userInfoJson = await getUsuario();
                if (this.userInfoJson.rol == rol.ANALISTA) {
                  this.isAnalista=true;
                  this.actions = [
                  { icon: "fas fa-trash-alt", type: actions.DELETE, method: this.delete},
                   { icon: "fas fa-eye", type: actions.EDIT, method: this.editEvaluaciones }
                  ]
                }else{
                this.actions = [
                //  { icon: "fas fa-trash-alt", type: actions.DELETE, method: this.deleteEvaluaciones },
                    { icon: "fas fa-eye", type: actions.EDIT, method: this.editEvaluaciones },
                ]
                }
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
       let type = this.$route.params.type;
      switch (type) {
        case 'PlanesTratamiento':
          this.listPlanTratamiento();
          break;
        case 'Evaluacion':
          this.listEvaluacion();
      }

    },
    goBack(): void {
      this.$router.back();
    },
    selectedList(entityList: string[]): void {
      this.entityList = entityList;
    },
    
    expandMain(value: boolean): void {
      this.expand = !value;
    },    
    handleError(): void {
      this.message = null;
    },
    closeModal(): void {
      this.showModalConfirmation = false;
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
    editRiesgoNormativa(id: string,codigo:string, entidad: string): void {
        console.log('editRiesgoNormativa')
        this.$router.push(this.url + codigo);
        //TODO: corregir
    },
    deleteEvaluaciones(): void {
        console.log('deleteEvaluaciones')
    },
    deleteMassive(): void {
      if (this.entityList.length > 0) {
        this.massiveDelete = true;
        this.showModalConfirmation = true;
        this.modalTitle =
          "Esta acción eliminara las dependencias " +
          "de los items seleccionados," +
          "¿continuar?";
      } else {
        this.message = "Debe seleccionar al menos un item";
        this.error = true;
      }
      this.page = 1;
    },    
    delete(id: string,codigo:string, entity: string): void {
      this.id = id;
  let type = this.$route.params.type;
      switch (type) {
        case 'PlanesTratamiento':
         this.modalTitle = "¿Está seguro que desea eliminar el tratamiento ?";
          break;
        case 'Evaluacion':
         this.modalTitle = "¿Está seguro que desea eliminar la evaluación ?";
         break;
      }
      this.entity = entity;
      
      this.showModalConfirmation = true;
      this.page = 1;
    },

     editEvaluaciones(id: string,codigo:string, entidad: string): void {
        console.log('editEvaluaciones')
        this.$router.push(this.url + codigo);
    },
    async confirmMassiveDelete(): Promise<void> {
       let type = this.$route.params.type;
      switch (type) {
        case 'PlanesTratamiento':
                console.log(this.entityList);
      await Promise.all(
        this.entityList.map(async (id: string) => {
          try {
            const response = await fetch(`${BASE_URL}plantratamiento/${id}`, {
              method: "DELETE",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            });
          } catch (error) {
            console.log(error);
          }
        })
      );
          break;
        case 'Evaluacion':
                console.log(this.entityList);
      await Promise.all(
        this.entityList.map(async (id: string) => {
          try {
            const response = await fetch(`${BASE_URL}evaluacion/${id}`, {
              method: "DELETE",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            });
          } catch (error) {
            console.log(error);
          }
        })
      ); 
      break;
      }



      this.massiveDelete = false;
      this.showModalConfirmation = false;
      this.modalTitle = "";

 switch (type) {
        case 'PlanesTratamiento':
      this.message = `Los tratamientos  fueron eliminados`;
          break;
        case 'Evaluacion':
      this.message = `Las evaluaciones  fueron eliminadas`;          

 }

      setTimeout(async () => {
        let type = this.$route.params.type;
      switch (type) {
        case 'PlanesTratamiento':
          await this.listPlanTratamiento();
          break;
        case 'Evaluacion':
          await this.listEvaluacion();
          break;
      }
        this.message = null;
      }, 2000);

      
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
          `${BASE_URL}evaluacion/listado?page=${this.page}&quantity=${this.quantity}`,
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

    async confirmDelete(): Promise<void> {


      this.closeModal();
       let type = this.$route.params.type;
      switch (type) {
        case 'PlanesTratamiento':
               try {

        const response = await fetch(`${BASE_URL}plantratamiento/${this.id}`, {
          method: "DELETE",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        });

        this.message = `El tratamiento fue eliminado`;
        this.id = "";
        this.entity = "";

        // const result = await response.json();

        setTimeout(async () => {
          await this.listPlanTratamiento();
          this.message = null;
        }, 2000);
      }
      
      catch (error) {
        console.log(error);
      }
          break;
        case 'Evaluacion':
             try {

        const response = await fetch(`${BASE_URL}evaluacion/${this.id}`, {
          method: "DELETE",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        });

        this.message = `La evaluación fue eliminada`;
        this.id = "";
        this.entity = "";

        // const result = await response.json();

        setTimeout(async () => {
          await this.listEvaluacion();
          this.message = null;
        }, 2000);
      }
      
      catch (error) {
        console.log(error);
      }
          break;
      }




    },

    async listEvaluacion(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/listado?page=${this.page}&quantity=${this.quantity}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );
             console.log("this.dataSource");
        console.log(this.dataSource);
        this.dataSource = (await response.json()) as IDataSource<any>;
                console.log("this.dataSource");
        console.log(this.dataSource);
      } catch (error) {
        console.log(error);
      }
     

     
    },



  },
});
</script>

<style scoped>
.buttons {
  margin-top: 15px;
  margin-bottom: 5px;
  text-align: right;
}
.action-button {
  position: relative;
  width: 220px;
  margin-right: -1400px;
}
.back {
  position: absolute;
  top: 100px;
  left: 260px;
  cursor: pointer;
}
@media (max-width : 1250px){
  .buttons {
  text-align: center;
}
}

</style>