<template>
  <nav-bar
    :name="userInfoJson?.nombres"
    :lastName="userInfoJson?.apellidos"
  ></nav-bar>
  <modal
    :show="!!message"
    :title="message"
    @close="handleError"
    :error="error"
    :loading="loading"
  ></modal>
  <section id="main">
    <h1>Registrar plan de tratamiento</h1>
    <button
      :class="
        $route.params.tr_codigo ? 'action-button' : 'action-button blocked'
      "
      @click="register()"
    >
      Registrar
    </button>
    <div class="grid-container">
      <div class="grid-item">
        <h4>Código de tratamiento:</h4>
        <img src="../assets/images/llave.png" alt="codeva" class="imgIcon" />
        <input
          type="text"
          disabled="true"
          :placeholder="tratamientoInfoJson.codigo"
        />
      </div>
      <div class="grid-item">
        <h4>Código de evaluación:</h4>
        <img src="../assets/images/llave.png" alt="codeva" class="imgIcon" />
        <input
          type="text"
          placeholder="Buscar por código"
          @keyup="searchCodigoEvaluacion"
          v-model.trim="codigoEvaluacion"
        />
        <div style="position: absolute">
          <p
            class="dropdownSelect"
            v-for="evaluacion in evaluacionList"
            :key="evaluacion.evaluacionId"
            @click="selectEvaluacion(evaluacion)"
          >
            {{ evaluacion.codigo + "-" + evaluacion.nombre }}
          </p>
        </div>
        <p class="error" v-if="validationForm.evaluacionId">
          {{ validationForm.evaluacionId }}
        </p>
      </div>
      <div class="grid-item">
        <h4>Código de prueba:</h4>
        <img src="../assets/images/llave.png" alt="codeva" class="imgIcon" />
        <select class="select" v-model="codigoPrueba" name="prueba">
          <option
            v-for="prueba in pruebas"
            :key="prueba.pruebaId"
            :value="prueba.codigo"
          >
            {{ prueba.codigo }}
          </option>
        </select>
      </div>
      <div class="grid-item">
        <h4>Nombre del plan de tratamiento:</h4>
        <img src="../assets/images/listav.png" alt="codeva" class="imgIcon" />
        <input
          type="text"
          placeholder="Plan de tratamiento-nombre"
          v-model.trim="tratamientoInfoJson.nombre"
        />
        <p class="error" v-if="validationForm.nombre">
          {{ validationForm.nombre }}
        </p>
      </div>
      <div class="grid-item">
        <h4>Responsable:</h4>
        <img src="../assets/images/user.png" alt="codeva" class="imgIcon" />
        <select
          class="select"
          v-model="tratamientoInfoJson.usuarioId"
          name="analista"
        >
          <option
            v-for="analista in analistaList"
            :key="analista.usuarioId"
            :value="analista.usuarioId"
          >
            {{
              analista.codigo +
              "-" +
              analista.nombres +
              " " +
              analista.apellidos
            }}
          </option>
        </select>
        <p class="error" v-if="validationForm.usuarioId">
          {{ validationForm.usuarioId }}
        </p>
      </div>
      <div class="grid-item" style="margin-top: 50px">
        <h4><strong>Porcentaje de avance: {{ tratamientoInfoJson.porcentajeAvance }} %</strong></h4>
      </div>
    </div>
    <section id="acciones-mitigacion" v-if="showAccionesMitigacion">
      <h4>Acciones de mitigación</h4>
      <br />
      <div class="flex-row table-options">
        <div>
          <i class="fas fa-plus-circle" @click="goToTestSummary"></i
          >&nbsp;&nbsp;&nbsp;<span
            style="text-decoration: underline; cursor: pointer"
            @click="goToTestSummary"
            >Añadir nueva acción</span
          >
        </div>
        <div>
          <button class="action-button table">Eliminación massiva</button>
        </div>
      </div>
      <table class="grid">
        <thead class="header-grid">
          <tr>
            <th>
              <input type="checkbox" id="checkbox" v-model="massiveCheck" />
            </th>
            <th style="width: 60%">Acciones de mitigación</th>
            <th>Fecha de inicio</th>
            <th>Fecha de fin</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="accion in accionesMitigacion" :key="accion.accionMitigacionId">
            <td>
              <input
                type="checkbox"
                :id="accion.accionMitigacionId"
                :value="accion.accionMitigacionId"
                v-model="checkedEntities"
              />
            </td>
            <td style="width: 60%">
              <input 
                type="text"
                style="width: 100%; margin-left: 5px;"
                v-model="accion.descripcion"
              />
            </td>
            <td>
              <input 
                type="date"
                @change="(e) => accion.fechaInicio = e.target.value"
                :value="
                userInfoJson && accion.fechaInicio
                  ? new Date(accion.fechaInicio)
                      .toISOString()
                      .substr(0, 10)
                      : null"
              />
            </td>
            <td>
              <input 
                type="date"
                @change="(e) => accion.fechaFin = e.target.value"
                :value="
                userInfoJson && accion.fechaFin
                  ? new Date(accion.fechaFin)
                      .toISOString()
                      .substr(0, 10)
                      : null"
              />
            </td>
            <td @click="editAccion(accion)">
              <i class="fas fa-edit"></i>
            </td>
            <td>
              <i class="fas fa-times-circle" style="color: red"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </section>
</template>

<script lang="ts">
import Modal from "../components/ui/Modal.vue";
import { getUsuario } from "@/services/authService";
import { emptyTratamiento, emptyUser } from "@/utils/initializer";
import { defineComponent } from "@vue/runtime-core";
import { IUser, IUsuarioLista } from "../interfaces/user.interface";
import NavBar from "@/components/layout/NavBar.vue";
import {
  IEvaluacion,
  IEvaluacionListado,
} from "../interfaces/evaluacion.interface";
import { IPruebaDetalleLista, PruebaList } from "../interfaces/prueba.interface";
import {
  handleErrors,
  propertiesSubSet,
  validateNotEmpty,
} from "../common/utils";
import { IObtenerTratamiento, ITratamiento } from "../interfaces/tratamiento.interface";
import { IAccionMitigacion } from '../interfaces/accionMitigacion';
import { BASE_URL } from "../common/constants";

export default defineComponent({
  components: {
    NavBar,
    Modal
  },
  computed: {
    evaluacion(): IEvaluacion {
      return this.$store.getters["evaluacionModule/obtenerEvaluacion"];
    },
  },
  watch: {
    async codigoPrueba(){
      await this.fetchAccionesMitigacion();
    }
  },
  data() {
    return {
      userInfoJson: emptyUser() as IUser,
      codigoEvaluacion: "",
      codigoPrueba: "",
      codigoListaVerificacion: "",
      timeout: undefined as number | undefined,
      evaluacionList: [] as IEvaluacionListado[],
      analistaList: [] as IUsuarioLista[],
      pruebas: [] as PruebaList[],
      showAccionesMitigacion: false,
      validationForm: {} as ITratamiento,
      tratamientoInfoJson: emptyTratamiento() as ITratamiento,
      massiveCheck: false,
      checkedEntities: [] as string[],
      accionesMitigacion: [] as IAccionMitigacion[],
      message: null as string | null,
      loading: false,
      error: false,
    };
  },
  methods: {
    handleError() {
      this.message = null;
    },
    searchCodigoEvaluacion() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => {
        await this.fetchEvaluacion();
      }, 1000);
    },
    async fetchEvaluacion() {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/lista?filter=${this.codigoEvaluacion}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.evaluacionList = (await response.json()) as IEvaluacionListado[];
      } catch (err) {
        console.log(err);
      }
    },
    async fetchAnalista() {
      try {
        const response = await fetch(
          `${BASE_URL}usuario/lista/Analistas`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.analistaList = (await response.json()) as IUsuarioLista[];
      } catch (err) {
        console.log(err);
      }
    },
    selectEvaluacion(evaluacion: IEvaluacionListado) {
      this.tratamientoInfoJson.evaluacionId = evaluacion.evaluacionId;
      this.evaluacionList = [];
      this.codigoEvaluacion = evaluacion.codigo + "-" + evaluacion.nombre;
      this.pruebas = evaluacion.pruebaList;
    },
    async register(): Promise<void> {
      this.validationForm = {} as ITratamiento;
      const validateArray = ["evaluacionId", "usuarioId", "nombre"];
      const jsonToValidate = propertiesSubSet(
        validateArray,
        this.tratamientoInfoJson
      );

      let isValid = validateNotEmpty(jsonToValidate, this.validationForm);

      if (isValid) {
        try {
          const response = await fetch(
            `${BASE_URL}plantratamiento`,
            {
              method: "POST",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
              body: JSON.stringify(this.tratamientoInfoJson),
            }
          );

          await handleErrors(response);

          const tratamientoCodigo = await response.json();

          this.$router.replace(`/plan-tratamiento/${tratamientoCodigo.codigo}`);

          this.showAccionesMitigacion = true;

          // this.loading = false;

          // this.error = false;
          // this.message = "¡El usuario ha sido registrado exitósamente!";
        } catch (error) {
          console.log(error);
          // this.error = true;
          // isValid = false;
          // const errorObj = JSON.parse(error.message);
          // this.validationForm.email = errorObj.errores.mensaje;
        }
      }
    },
    goToTestSummary() {
      this.$router.push(`/lista-verificacion/${this.codigoListaVerificacion}/prueba/${this.codigoPrueba}/resumen`);
    },
    async fetchTratamiento(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}plantratamiento/${this.$route.params.tr_codigo}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        const tratamientoObtenido = (await response.json()) as IObtenerTratamiento;

        const validateArray = Object.keys(this.tratamientoInfoJson);
        this.tratamientoInfoJson = propertiesSubSet<ITratamiento>(
          validateArray,
          tratamientoObtenido
        );

        this.codigoEvaluacion = tratamientoObtenido.codigoEvaluacion;
        this.pruebas = tratamientoObtenido.pruebas.filter(pr => pr.visibilidad);
        this.codigoPrueba = this.pruebas[0].codigo;
        this.codigoListaVerificacion = tratamientoObtenido.listaVerificacionCodigo;

      } catch (err) {
        console.log(err);
      }
    },
    async fetchAccionesMitigacion(): Promise<void> {
       try {
        const response = await fetch(
          `${BASE_URL}accionmitigacion/${this.tratamientoInfoJson.tratamientoId}/${this.codigoPrueba}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.accionesMitigacion = (await response.json()) as IAccionMitigacion[];

      } catch (err) {
        console.log(err);
      }
    },
    async editAccion(accion: IAccionMitigacion): Promise<void> {
      const body = {
        Descripcion: accion.descripcion,
        FechaInicio: accion.fechaInicio,
        FechaFin: accion.fechaFin
      }

      try {
        const response = await fetch(
          `${BASE_URL}accionmitigacion/${accion.accionMitigacionId}`,
          {
            method: "PUT",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
            body: JSON.stringify(body),
          }
        );

        await handleErrors(response);

        this.message = "¡Se ha editado accion exitósamente!";
        
        setTimeout(() => {
          this.message = '';
        }, 1500);
      } catch (error) {
        console.log(error);
      }
    }
  },
  mounted() {
    (async () => {
      this.userInfoJson = await getUsuario();
      await this.fetchAnalista();

      if (!this.$route.params.tr_codigo) {
        try {
          const response = await fetch(
            `${BASE_URL}plantratamiento/count`,
            {
              method: "GET",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            }
          );

          const number: number = await response.json();
          let zeros = "";

          if (number > 10) {
            zeros = "0";
          } else {
            zeros = "00";
          }

          this.tratamientoInfoJson.codigo =
            "TR" + zeros + (number + 1).toString();
        } catch (err) {
          console.log(err);
        }
      } else {
        this.showAccionesMitigacion = true;
        await this.fetchTratamiento();
        await this.fetchAccionesMitigacion();
      }
    })();
  },
});
</script>

<style scoped>
#main {
  margin-left: 0px;
}
.grid-container {
  display: grid;
  gap: 30px;
  gap: 30px;
  grid-template-columns: auto auto auto;
  padding: 10px;
  margin: 40px 100px;
}

.grid-item {
  text-align: left;
}

h4 {
  text-align: left;
}

.imgIcon {
  margin-right: 20px;
}
.action-button {
  position: absolute;
  top: 95px;
  right: 30px;
}
.dropdownSelect {
  left: 50px;
}
select {
  width: 250px;
  height: 35px;
}
#acciones-mitigacion {
  margin: 40px 100px;
  padding: 10px;
}
.action-options {
  display: flex;
  justify-content: space-evenly;
}

.action-options i {
  padding-top: 7px;
  color: red;
}
i:hover {
  cursor: pointer;
}
.table-options {
  position: relative;
  line-height: 35px;
}
.grid {
  width: 100%;
}
.header-grid tr th {
  height: 21px;
  padding: 5px 0;
  background-color: #ecf3ff;
}
input[type="checkbox"] {
  width: 12px;
  height: 12px;
}
.action-button.table {
  position: relative;
  width: 200px;
  padding: 10px 20px;
  top: 0;
  right: 0;
}
@media only screen and (max-width: 1179px) {
  .dropdownSelect {
    left: 0px;
  }
}
</style>
