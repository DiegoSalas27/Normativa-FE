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
    <section id="main" :class="{ expand: expand }">
      <h3 class="back" @click="goBack">
        <i class="fas fa-chevron-left"></i> Salir
      </h3>
      <h2>REPORTE DE {{ calculateReport() }}</h2>
      <br>
      <span v-if="isEvaluaciones">
      <span>Escriba la obra que desea buscar: </span>
      <input type="text" name="txtobra" id="txtobra" v-model="filtro_obra" >
      <br>
      <br>
      <span>Seleccione la lista que desea buscar : </span>
      <a-select default-value="TODOS" style="width: 300px"  @change="changeFiltroListaVerificacion"  >
      <a-select-option  v-for="(item,index) in itemsListaVerificacion" :key="index" :value="item.nombre" >{{item.nombre}}</a-select-option>
      </a-select>
      </span>

      <span v-if="isPlantamientos">
      <span>Escriba el plan que desea buscar: </span>
      <input type="text" name="txtplan" id="txtplan" v-model="filtro_plan" >
      <br>
      <br>
      <span>Seleccione el estado que desea buscar: </span>
      <a-select default-value="TODOS" style="width: 300px"  @change="changeFiltroEstado"  >
      <a-select-option  v-for="(item,index) in itemsEstado" :key="index" :value="item.nombre" >{{item.nombre}}</a-select-option>
      </a-select>
      </span>

      <span v-if="isRiesgos">
      <span>Escriba la evaluación que desea buscar: </span>
      <input type="text" name="txtevaluacion" id="txtevaluacion" v-model="filtro_evaluacion" >
      <br>  
      <br>
      <span>Seleccione la lista que desea buscar : </span>
      <a-select default-value="TODOS" style="width: 300px"  @change="changeFiltroListaVerificacion"  >
      <a-select-option  v-for="(item,index) in itemsListaVerificacion" :key="index" :value="item.nombre" >{{item.nombre}}</a-select-option>
      </a-select>      
      
      
      </span>
      
      <span v-if="isListas">
      <span>Escriba la lista que desea buscar: </span>
      <input type="text" name="txtlistaVerif" id="txtlistaVerif" v-model="filtro_listas_verificaciones" >
      <br>
      </span>               

      
      <!--select name="selectobra" id="selectobra" v-model="filtro_lista_verificacion" @change="listEvaluacion">
        <option v-for="(item,index) in itemsListaVerificacion" :key="index" :value="item.nombre" >{{item.nombre}}</option>
      </select-->

      <div class="buttons">
        <button
          v-if="isAnalista || isJefeRiesgos || isEspecialista"
          class="action-button"
          @click="deleteMassive()"
        >
          Eliminación masiva
        </button>
      </div>

      <grid
        :dataSource="dataSource"
        :columns="columns"
        :config="config"
        :actions="actions"
        :rows="5"
        @movePage="movePage"
        @selectedList="selectedList"
      ></grid>
    </section>
  </div>
</template>

<script lang="ts">
import Grid from "@/components/ui/Grid.vue";
import { defineComponent } from "@vue/runtime-core";
import { getUsuario } from "@/services/authService";
import {
  columnsPlanesTratamientoList,
  columnsRiesgoNormativaList,
  columnsEvaluacionesList,
  columnsListaVerificacionDiegoSalas,
} from "../common/constants";
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
import {
  DataSourceListasVerificacion,
  DataSourcetratamiento,
} from "../common/mockdata";
import { DataSourceEvaluaciones } from "../common/mockdata";
import { DataSourceRiesgo } from "../common/mockdata";
var clearSetTime='' as any;
export default defineComponent({
  components: {
    Grid,
    ConfirmationModal,
    Modal,
  },
  data() {
    return {
      filtro_obra:'',
      filtro_lista_verificacion:'',
      filtro_evaluacion:'',
      filtro_listas_verificaciones:'',
      itemsListaVerificacion:[{id:'',nombre:'TODOS'},{id:1,nombre:'ISO 45002'},{id:1,nombre:'LEY Nº 29783  Ley de Seguridad y Salud en el Trabajo'},{id:1,nombre:'Proyecto A'},{id:1,nombre:'Checklist SST-V2021-3'}],
      itemsEstado:[{id:'',nombre:'TODOS'},{id:1,nombre:'Asignado'},{id:1,nombre:'Sin asignar'}],
      filtro_plan:'',
      filtro_estado_plan:'',
      userInfoJson: emptyUser() as IUser,
      columns: {} as any,
      dataSource: emptyDataSource() as IDataSource<any>,
      isAnalista: false,
      isJefeRiesgos: false,
      isEvaluaciones: false,
      isPlantamientos: false,
      isRiesgos: false,
      isListas: false,
      isEspecialista: false,
      config: {
        deleteEntity: "",
        entity: entity.EVALUACION,
      },
      actions: [
        {
          icon: "fas fa-trash-alt",
          type: actions.DELETE,
          method: this.delete,
        },
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
      type: "",
    };
  },
  watch:{
    filtro_obra(v){
      if(v){
        if(clearSetTime){
          clearTimeout(clearSetTime);
        }
        clearSetTime = setTimeout(() => {
            this.listEvaluacion();
        }, 500);
      }
    },
    filtro_plan(v){
      if(v){
        if(clearSetTime){
          clearTimeout(clearSetTime);
        }
        clearSetTime = setTimeout(() => {
            this.listPlanTratamiento();
        }, 500);
      }
    },
    filtro_evaluacion(v){
      if(v){
        if(clearSetTime){
          clearTimeout(clearSetTime);
        }
        clearSetTime = setTimeout(() => {
            this.listRiesgoNormativa();
        }, 500);
      }
    },
      filtro_listas_verificaciones(v){
      if(v){
        if(clearSetTime){
          clearTimeout(clearSetTime);
        }
        clearSetTime = setTimeout(() => {
            this.listListaVerificacion();
        }, 500);
      }
    }      
  },
  
  mounted() {
    this.type = this.$route.params.type as string;
    
    (async () => {
      // on page reload this.$route.params.type is undefined so...

      if (!this.$route.params.type) {
        switch (this.$route.path) {
          case "/dashboard/listas-verificacion":
            this.type = "ListasVerificacion";
            break;
          // default:
          //   this.$route.params.type = "ListasVerificacion";
          //   type = "ListasVerificacion";
          //   break;
        }
      }
     
      this.userInfoJson = await getUsuario();
      switch (this.type) {
        case "ListasVerificacion":
          if (this.userInfoJson.rol == rol.ESPECIALISTA) {
            this.isEspecialista = true;
          }
          this.isListas=true;
          this.columns = columnsListaVerificacionDiegoSalas;
          this.url = "listas-verificacion";
          this.$router.replace(this.url); // se crea url dinamica para un mismo componente

          this.actions = [
            {
              icon: "fas fa-trash-alt",
              type: actions.DELETE,
              method: this.delete,
            },
            {
              icon: "fas fa-pen",
              type: actions.EDIT,
              method: this.edit,
            },
          ];
          await this.listListaVerificacion();
          break;
        case "PlanesTratamiento":
          this.isPlantamientos = true;          
          this.columns = columnsPlanesTratamientoList;
          this.dataSource = {
            listaRecords: DataSourcetratamiento,
            numeroPaginas: 0,
            totalRecords: 0,
          };
          this.url = "/plan-tratamiento/";
          this.userInfoJson = await getUsuario();
          if (this.userInfoJson.rol == rol.JEFE_DE_RIESGOS) {
            this.isJefeRiesgos = true;
            this.actions = [
              {
                icon: "fas fa-trash-alt",
                type: actions.DELETE,
                method: this.delete,
              },
              {
                icon: "fas fa-eye",
                type: actions.EDIT,
                method: this.editEvaluaciones,
              },
            ];
          } else {
            this.actions = [
              //  { icon: "fas fa-trash-alt", type: actions.DELETE, method: this.deleteEvaluaciones },
              {
                icon: "fas fa-eye",
                type: actions.EDIT,
                method: this.editEvaluaciones,
              },
            ];
          }
          await this.listPlanTratamiento();
          break;
        case "RiesgoNormativa":
          this.isRiesgos = true;              
          this.columns = columnsRiesgoNormativaList;
          this.dataSource = {
            listaRecords: DataSourceRiesgo,
            numeroPaginas: 0,
            totalRecords: 0,
          };
          this.url = "/evaluacion/";
          this.actions = [
            {
              icon: "fas fa-eye",
              type: actions.EDIT,
              method: this.editRiesgoNormativa,
            },
          ];
          await this.listRiesgoNormativa();
          break;
        case "Evaluacion":
          this.isEvaluaciones = true;
          this.columns = columnsEvaluacionesList;
          this.dataSource = {
            listaRecords: DataSourceEvaluaciones,
            numeroPaginas: 0,
            totalRecords: 0,
          };
          this.url = "/evaluacion/";
          this.userInfoJson = await getUsuario();
          if (this.userInfoJson.rol == rol.ANALISTA) {
            this.isAnalista = true;
            this.actions = [
              {
                icon: "fas fa-trash-alt",
                type: actions.DELETE,
                method: this.delete,
              },
              {
                icon: "fas fa-eye",
                type: actions.EDIT,
                method: this.editEvaluaciones,
              },
            ];
          } else {
            this.actions = [
              //  { icon: "fas fa-trash-alt", type: actions.DELETE, method: this.deleteEvaluaciones },
              {
                icon: "fas fa-eye",
                type: actions.EDIT,
                method: this.editEvaluaciones,
              },
            ];
          }
          await this.listEvaluacion();
          break;
        default:
          this.columns = columnsPlanesTratamientoList;
          this.actions = [
            {
              icon: "fas fa-eye",
              type: actions.EDIT,
              method: this.editPlanTratamiento,
            },
          ];
          await this.listPlanTratamiento();
          break;
      }
    })();
  },
  methods: {
    changeFiltroListaVerificacion(value=''){
      this.filtro_lista_verificacion = value;
      this.listEvaluacion();
    },
    changeFiltroEstado(value=''){
      this.filtro_estado_plan=value;
      this.listPlanTratamiento();
    },
    movePage(pageNumber: number) {
      this.page = pageNumber;
      switch (this.type) {
        case "PlanesTratamiento":
          this.listPlanTratamiento();
          break;
        case "Evaluacion":
          this.listEvaluacion();
          break;
        case "RiesgoNormativa":
          this.listRiesgoNormativa();
          break;
        case "ListasVerificacion":
          this.listListaVerificacion();
          break;
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

    calculateReport(): any {
      if (!this.$route.params.type) {
        // add other routes
        switch (this.$route.path) {
          case "/dashboard/listas-verificacion":
            this.type = "ListasVerificacion";
            break;
          // default:
          //   type = "ListasVerificacion";
          //   break;
        }
      }

      switch (this.type) {
        case "PlanesTratamiento":
          return "PLANES DE TRATAMIENTO";
        case "RiesgoNormativa":
          return "CUMPLIMIENTO POR LISTA DE VERIFICACIÓN";
        case "Evaluacion":
          return "RESULTADOS DE EVALUACIONES";
        case "ListasVerificacion":
          return "LISTAS DE VERIFICACIÓN";
      }
    },

    editPlanTratamiento(id: string, codigo: string, entidad: string): void {
      this.$router.push(this.url + codigo);
    },
    deleteRiesgoNormativa(): void {
      console.log("deleteRiesgoNormativa");
    },
    editRiesgoNormativa(id: string, codigo: string, entidad: string): void {
      console.log("editRiesgoNormativa");
      this.$router.push(this.url + codigo);
      //TODO: corregir
    },
    deleteEvaluaciones(): void {
      console.log("deleteEvaluaciones");
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
    edit(id: string, codigo: string, entity: string): void {
      this.$router.push("/dashboard" + "/" + this.url + "/" + codigo);
    },
    delete(id: string, codigo: string, entity: string): void {
      this.id = id;
      switch (this.type) {
        case "PlanesTratamiento":
          this.modalTitle = "¿Está seguro que desea eliminar el tratamiento ?";
          break;
        case "Evaluacion":
          this.modalTitle = "¿Está seguro que desea eliminar la evaluación ?";
          break;
        case "ListasVerificacion":
          this.modalTitle = "¿Está seguro que desea eliminar la lista de verificación?";
          break;
      }
      this.entity = entity;

      this.showModalConfirmation = true;
      this.page = 1;
    },

    editEvaluaciones(id: string, codigo: string, entidad: string): void {
      console.log("editEvaluaciones");
      this.$router.push(this.url + codigo);
    },
    async confirmMassiveDelete(): Promise<void> {
      console.log(this.type);
      debugger
      switch (this.type) {
        case "PlanesTratamiento":
          console.log(this.entityList);
          await Promise.all(
            this.entityList.map(async (id: string) => {
              try {
                const response = await fetch(
                  `${BASE_URL}plantratamiento/${id}`,
                  {
                    method: "DELETE",
                    headers: new Headers({
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    }),
                  }
                );
              } catch (error) {
                console.log(error);
              }
            })
          );
          break;
        case "Evaluacion":
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
        case "ListasVerificacion":
          await Promise.all(
            this.entityList.map(async (id: string) => {
              try {
                const response = await fetch(`${BASE_URL}listaverificaciones/${id}`, {
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
      }

      this.massiveDelete = false;
      this.showModalConfirmation = false;
      this.modalTitle = "";

      switch (this.type) {
        case "PlanesTratamiento":
          this.message = `Los tratamientos  fueron eliminados`;
          break;
        case "Evaluacion":
          this.message = `Las evaluaciones  fueron eliminadas`;
          break;
        case "ListasVerificacion":
          this.message = `Las listas de verificación fueron eliminadas`;
          break;
      }

      setTimeout(async () => {
        switch (this.type) {
          case "PlanesTratamiento":
            await this.listPlanTratamiento();
            break;
          case "Evaluacion":
            await this.listEvaluacion();
            break;
          case "ListasVerificacion":
            await this.listListaVerificacion();
            break;
        }
        this.message = null;
      }, 2000);
    },
    async listListaVerificacion(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}listaverificaciones/listar?page=${this.page}&quantity=${this.quantity}&listaVerif=${this.filtro_listas_verificaciones}`,
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

    async listPlanTratamiento(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}plantratamiento/lista?page=${this.page}&quantity=${this.quantity}&plan=${this.filtro_plan}&estadoPlan=${this.filtro_estado_plan}`,
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
          `${BASE_URL}evaluacion/listado?page=${this.page}&quantity=${this.quantity}&obra=${this.filtro_obra}&listVerif=${this.filtro_lista_verificacion}&evaluacion=${this.filtro_evaluacion}`,
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
      switch (this.type) {
        case "PlanesTratamiento":
          try {
            const response = await fetch(
              `${BASE_URL}plantratamiento/${this.id}`,
              {
                method: "DELETE",
                headers: new Headers({
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                }),
              }
            );

            this.message = `El tratamiento fue eliminado`;
            this.id = "";
            this.entity = "";

            // const result = await response.json();

            setTimeout(async () => {
              await this.listPlanTratamiento();
              this.message = null;
            }, 2000);
          } catch (error) {
            console.log(error);
          }
          break;
        case "Evaluacion":
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
          } catch (error) {
            console.log(error);
          }
          break;
        case "ListasVerificacion":
          try {
            const response = await fetch(`${BASE_URL}listaverificaciones/${this.id}`, {
              method: "DELETE",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              })
            });

            this.message = `La lista de verificación fue eliminada`;
            this.id = "";
            this.entity = "";

            // const result = await response.json();

            setTimeout(async () => {
              await this.listListaVerificacion();
              this.message = null;
            }, 2000);
          } catch (error) {
            console.log(error);
          }
          break;
      }
    },

    async listEvaluacion(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/listado?page=${this.page}&quantity=${this.quantity}&obra=${this.filtro_obra}&listVerif=${this.filtro_lista_verificacion}&evaluacion=${this.filtro_evaluacion}`,
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
  margin-right: 15px;
}
.back {
  position: absolute;
  top: 100px;
  left: 260px;
  cursor: pointer;
}
@media (max-width: 1250px) {
  .buttons {
    text-align: center;
  }
}
</style>