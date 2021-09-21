<template>
  <nav-bar
    :name="userInfoJson?.nombres"
    :lastName="userInfoJson?.apellidos"
  ></nav-bar>
  <confirmation-modal
    :error="null"
    :show="showModalConfirmation"
    :title="modalTitle"
    :massiveDelete="massiveDelete"
    @confirm="deleteAccion"
    @confirmMassive="confirmMassiveDelete"
    @cancel="closeModal"
  ></confirmation-modal>
  <!-- modal for user validation -->
  <modal
    :show="!!(loading && !userValidated)"
    :title="message"
    @close="() => {}"
    :error="error"
    :loading="loading"
  ></modal>
  <!-- generic modal -->
  <modal
    :show="!!message"
    :title="message"
    @close="handleError"
    :error="error"
    :loading="loading"
  ></modal>
  <section v-if="userValidated" id="main">
    <h1>{{ displayTitlePage }}</h1>
    <button
      :class="
        $route.params.tr_codigo ? 'action-button' : 'action-button blocked'
      "
      @click="register()"
    >
      {{ displayButtonText }}
    </button>
    <!-- <button
      v-if="tratamientoInfoJson.porcentajeAvance == 100"
      class="action-button"
      style="top: 140px"
      @click="register()"
    >
      Generar informe
    </button> -->
    <div class="grid-container">
      <div class="grid-item">
        <h4>Código de tratamiento:</h4>
        <img src="../assets/images/llave.png" alt="codeva" class="imgIcon" />
        <span
          v-if="
            ($route.params.tr_codigo && !canEdit) ||
            ($route.params.tr_codigo && canEdit && !update)
          "
          >{{ tratamientoInfoJson.codigo }}</span
        >
        <input
          v-if="(update || !$route.params.tr_codigo) && canEdit"
          type="text"
          disabled="true"
          :placeholder="tratamientoInfoJson.codigo"
        />
      </div>
      <div class="grid-item">
        <h4>Código de evaluación:</h4>
        <img src="../assets/images/llave.png" alt="codeva" class="imgIcon" />
        <span
          v-if="
            ($route.params.tr_codigo && !canEdit) ||
            ($route.params.tr_codigo && canEdit && !update)
          "
          >{{ codigoEvaluacion }}</span
        >
        <a-select
          v-if="(update || !$route.params.tr_codigo) && canEdit"
          v-model:value="tratamientoInfoJson.evaluacionId"
          optionFilterProp="label"
          show-search
          placeholder="Buscar por código"
          style="
            border: 1px solid var(--placeholder);
            border-radius: 4px;
            outline: none;
          "
          :options="selectCodigoEvaluacionList"
        ></a-select>
        <!-- @change="selectEvaluacion(evaluacion)" -->

        <!-- <input
          v-if="(update || !$route.params.tr_codigo) && canEdit"
          type="text"
          placeholder="Buscar por código"
          @keyup="searchCodigoEvaluacion"
          v-model.trim="codigoEvaluacion"
        /> -->

        <!-- <div style="position: absolute">
          <p
            class="dropdownSelect"
            v-for="evaluacion in evaluacionList"
            :key="evaluacion.evaluacionId"
            @click="selectEvaluacion(evaluacion)"
          >
            {{ evaluacion.codigo + "-" + evaluacion.nombre }}
          </p>
        </div> -->
        <p class="error" v-if="validationForm.evaluacionId">
          {{ validationForm.evaluacionId }}
        </p>
      </div>
      <div class="grid-item">
        <h4>Código de prueba:</h4>
        <img src="../assets/images/llave.png" alt="codeva" class="imgIcon" />
        <!-- para volver label inneditable-->

        <!-- para volver label inneditable-->
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
        <span
          v-if="
            ($route.params.tr_codigo && !canEdit) ||
            ($route.params.tr_codigo && canEdit && !update)
          "
          >{{ tratamientoInfoJson.nombre }}</span
        >
        <input
          v-if="(update || !$route.params.tr_codigo) && canEdit"
          type="text"
          placeholder="Plan de tratamiento-nombre"
          v-model.trim="tratamientoInfoJson.nombre"
        />
        <p class="error" v-if="validationForm.nombre">
          {{ validationForm.nombre }}
        </p>
      </div>
      <div class="grid-item">
        <h4>Estado:</h4>
        <img src="../assets/images/estado.png" alt="codeva" class="imgIcon" />
        <span v-if="$route.params.tr_codigo && !update">{{
          estadoCalc()
        }}</span>
        <select
          v-if="update || !$route.params.tr_codigo"
          class="select"
          v-model="tratamientoInfoJson.estadosTratamientoId"
          @change="changedEstado"
          name="estado"
        >
          <option
            v-for="estado in estadoList"
            :key="estado.estadosTratamientoId"
            :value="estado.estadosTratamientoId"
          >
            {{ estado.nombre }}
          </option>
        </select>
      </div>
      <div v-if="asignadoSeleccionado" class="grid-item">
        <h4>Responsable:</h4>
        <img src="../assets/images/user.png" alt="codeva" class="imgIcon" />
        <span
          v-if="
            ($route.params.tr_codigo && !canEdit) ||
            ($route.params.tr_codigo && canEdit && !update)
          "
          >{{ analistaCalc() }}</span
        >
        <select
          v-if="(update || !$route.params.tr_codigo) && canEdit"
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
      </div>
      <div class="grid-item" style="margin-top: 50px">
        <h4>
          <strong
            >Porcentaje de avance:
            {{ tratamientoInfoJson?.porcentajeAvance?.toFixed(2) }} %</strong
          >
        </h4>
      </div>
    </div>
    <section id="acciones-mitigacion" v-if="showAccionesMitigacion">
      <h4>Acciones de mitigación</h4>
      <br />
      <div v-if="update && canEdit" class="flex-row table-options">
        <div>
          <i class="fas fa-plus-circle" @click="goToTestSummary"></i
          >&nbsp;&nbsp;&nbsp;<span
            style="text-decoration: underline; cursor: pointer"
            @click="goToTestSummary"
            >Añadir nueva acción</span
          >
        </div>
        <div>
          <button class="action-button table" @click="deleteMassive()">
            Eliminación massiva
          </button>
        </div>
      </div>
      <table class="grid">
        <thead class="header-grid">
          <tr>
            <th v-if="update && accionesMitigacion.length > 0 && canEdit">
              <input type="checkbox" id="checkbox" v-model="massiveCheck" />
            </th>
            <th style="width: 60%">Acciones de mitigación</th>
            <th style="width: 12.5%">Fecha de inicio</th>
            <th style="width: 12.5%">Fecha de fin</th>
            <th v-if="update"></th>
            <th v-if="update && canEdit"></th>
            <th style="width: 15%">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="accion in accionesMitigacion"
            :key="accion.accionMitigacionId"
          >
            <td v-if="update && canEdit">
              <input
                type="checkbox"
                :id="accion.accionMitigacionId"
                :value="accion.accionMitigacionId"
                v-model="checkedEntities"
              />
            </td>
            <td style="width: 60%; text-align: left">
              <div>
                <span
                  v-if="
                    ($route.params.tr_codigo && !canEdit) ||
                    (canEdit && !update)
                  "
                  style="width: 90%"
                  >{{ accion.descripcion }}</span
                >
                <input
                  v-if="update && canEdit"
                  type="text"
                  style="width: 90%; margin-left: 5px"
                  v-model="accion.descripcion"
                />
                <i v-if="accion.tieneMensaje" class="far fa-envelope"></i>
              </div>
            </td>
            <td style="width: 12.5%">
              <span v-if="$route.params.tr_codigo && !update">{{
                accion.fechaInicio
                  ? new Date(accion.fechaInicio).toISOString().substr(0, 10)
                  : new Date().toISOString().substr(0, 10)
              }}</span>
              <input
                v-if="update"
                type="date"
                @change="(e) => (accion.fechaInicio = e.target.value)"
                :value="
                  userInfoJson && accion.fechaInicio
                    ? new Date(accion.fechaInicio).toISOString().substr(0, 10)
                    : null
                "
              />
            </td>
            <td style="width: 12.5%">
              <span v-if="$route.params.tr_codigo && !update">{{
                accion.fechaFin
                  ? new Date(accion.fechaFin).toISOString().substr(0, 10)
                  : new Date().toISOString().substr(0, 10)
              }}</span>
              <input
                v-if="update"
                type="date"
                @change="(e) => (accion.fechaFin = e.target.value)"
                :value="
                  userInfoJson && accion.fechaFin
                    ? new Date(accion.fechaFin).toISOString().substr(0, 10)
                    : null
                "
              />
            </td>
            <td v-if="update" @click="editAccion(accion)">
              <i class="fas fa-edit"></i>
            </td>
            <td v-if="update && canEdit" @click="deleteConfirm(accion)">
              <i class="fas fa-trash-alt" style="color: red"></i>
            </td>
            <td style="width: 15%">
              <p :class="accion.estado ? 'label success' : 'label error'">
                {{ accion.estado ? "Terminado" : "En Proceso" }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </section>
</template>

<script lang="ts">
import NavBar from "@/components/layout/NavBar.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import { IDataSource } from "@/interfaces/dataSource";
import { getUsuario } from "@/services/authService";
import {
  emptyDataSource,
  emptyTratamiento,
  emptyUser,
} from "@/utils/initializer";
import { defineComponent, ref } from "@vue/runtime-core";
import { BASE_URL, rol } from "../common/constants";
import {
  handleErrors,
  propertiesSubSet,
  validateNotEmpty,
} from "../common/utils";
import Modal from "../components/ui/Modal.vue";
import { IAccionMitigacion } from "../interfaces/accionMitigacion";
import { IEstadoTratamiento } from "../interfaces/estadoTratamiento";
import {
  IEvaluacion,
  IEvaluacionListado,
} from "../interfaces/evaluacion.interface";
import { PruebaList } from "../interfaces/prueba.interface";
import {
  IObtenerTratamiento,
  ITratamiento,
} from "../interfaces/tratamiento.interface";
import { IUser, IUsuarioLista } from "../interfaces/user.interface";

export default defineComponent({
  components: {
    NavBar,
    ConfirmationModal,
    Modal,
  },
  computed: {
    evaluacion(): IEvaluacion {
      return this.$store.getters["evaluacionModule/obtenerEvaluacion"];
    },
    displayButtonText(): string {
      if (this.$route.params.tr_codigo) {
        if (this.update) {
          return "Guardar";
        }

        return "Editar";
      }
      return "Registrar";
    },
    displayTitlePage(): string {
      if (!this.$route.params.tr_codigo) {
        return "Registrar plan de tratamiento";
      } else {
        if (this.update) {
          return "Editar plan de tratamiento";
        }
        return "Visualizar plan de tratamiento";
      }
    },
  },
  data() {
    return {
      selectCodigoEvaluacionList: [] as any,
      userInfoJson: emptyUser() as IUser,
      codigoEvaluacion: "",
      codigoPrueba: "",
      codigoListaVerificacion: "",
      timeout: undefined as number | undefined,
      evaluacionList: [] as IEvaluacion[],
      analistaList: [] as IUsuarioLista[],
      estadoList: [] as IEstadoTratamiento[],
      pruebas: [] as PruebaList[],
      showAccionesMitigacion: false,
      validationForm: {} as ITratamiento,
      tratamientoInfoJson: emptyTratamiento() as ITratamiento,
      massiveCheck: false,
      checkedEntities: [] as string[],
      accionesMitigacion: [] as IAccionMitigacion[],
      accionSelected: "",
      esAltaGerencia: false,
      message: null as string | null,
      loading: false,
      error: false,
      update: false,
      modalTitle: "",
      showModalConfirmation: false,
      massiveDelete: false,
      canEdit: false,
      asignadoSeleccionado: false,
      hasTouchedEstado: false,
      userValidated: false,
    };
  },
  watch: {
    async codigoPrueba() {
      if (this.$route.params.tr_codigo) await this.fetchAccionesMitigacion();
    },
    massiveCheck(): void {
      if (this.massiveCheck) {
        this.checkedEntities = this.accionesMitigacion.map(
          (acm) => acm.accionMitigacionId
        );
      } else {
        this.checkedEntities = [];
      }
    },
  },
  methods: {
    async changedEstado(event: { target: HTMLInputElement }) {
      this.hasTouchedEstado = true;
      const estado = this.estadoList.find(
        (el) => el.estadosTratamientoId == event.target.value
      );
      if (
        estado &&
        (estado.nombre == "Asignado" || estado.nombre == "En proceso")
      ) {
        this.asignadoSeleccionado = true;
      } else {
        this.asignadoSeleccionado = false;
      }
    },
    estadoCalc(): string {
      const estado = this.estadoList.find(
        (es) =>
          es.estadosTratamientoId ==
          this.tratamientoInfoJson.estadosTratamientoId
      );
      if (estado) {
        if (estado.nombre == "Asignado" || estado.nombre == "En proceso") {
          this.asignadoSeleccionado = true;
        }
        return estado.nombre;
      } else return "";
    },
    analistaCalc(): string {
      const analista = this.analistaList.find(
        (an) => an.usuarioId == this.tratamientoInfoJson.usuarioId
      );
      if (analista) {
        return (
          analista.codigo + "-" + analista.nombres + " " + analista.apellidos
        );
      } else return "";
    },
    handleError() {
      this.message = null;
    },
    closeModal(): void {
      this.showModalConfirmation = false;
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
    async fetchEvaluaciones() {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/lista?page=1&quantity=200`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.evaluacionList = (await response.json()) as IEvaluacion[];

        this.evaluacionList.forEach((eva) => {
          this.selectCodigoEvaluacionList.push({
            value: eva.evaluacionId,
            label: eva.codigo + "-" + eva.nombre,
          });
        });

        console.log("this.selectEvaluacionList");
        console.log(this.selectCodigoEvaluacionList);
      } catch (err) {
        console.log(err);
      }
    },
    async fetchAnalista() {
      try {
        const response = await fetch(`${BASE_URL}usuario/lista/Analistas`, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        });

        this.analistaList = (await response.json()) as IUsuarioLista[];

        this.tratamientoInfoJson.usuarioId == null &&
          (this.tratamientoInfoJson.usuarioId = this.analistaList[0].usuarioId);
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
    deleteConfirm(accion: IAccionMitigacion): void {
      this.accionSelected = accion.accionMitigacionId;
      this.modalTitle =
        "Está seguro que desea eliminar la acción de mitigación?";
      this.showModalConfirmation = true;
    },
    deleteMassive(): void {
      if (this.checkedEntities.length > 0) {
        this.massiveDelete = true;
        this.showModalConfirmation = true;
        this.modalTitle =
          "Está seguro que desea eliminar las " +
          "acciones de mitigación" +
          " seleccionadas ?";
      } else {
        this.message = "Debe seleccionar al menos una acción de mitigación";
        this.error = true;
      }
    },
    async register(): Promise<void> {
      if (this.$route.params.tr_codigo && !this.update) {
        this.update = true;
        return;
      }

      this.validationForm = {} as ITratamiento;
      const validateArray = ["evaluacionId", "nombre"];
      const jsonToValidate = propertiesSubSet(
        validateArray,
        this.tratamientoInfoJson
      );

      let isValid = validateNotEmpty(jsonToValidate, this.validationForm);

      const estado = this.estadoList.find(
        (el) =>
          el.estadosTratamientoId ==
          this.tratamientoInfoJson.estadosTratamientoId
      );

      if (
        this.userInfoJson.rol == "Jefe de riesgos" &&
        estado?.nombre == "En proceso" &&
        this.hasTouchedEstado
      ) {
        this.error = true;
        this.message =
          "Este estado solo puede ser seleccionado por un analista";
        return;
      }

      if (isValid) {
        if (!this.$route.params.tr_codigo) {
          try {
            const response = await fetch(`${BASE_URL}plantratamiento`, {
              method: "POST",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
              body: JSON.stringify(this.tratamientoInfoJson),
            });

            await handleErrors(response);

            const tratamientoCodigo = await response.json();

            this.$router.replace(
              `/plan-tratamiento/${tratamientoCodigo.codigo}`
            );

            this.showAccionesMitigacion = true;

            this.loading = false;

            this.error = false;
            this.message =
              "¡El plan de tratamiento ha sido registrado exitósamente!";

            setTimeout(async () => {
              this.message = "";
              await this.fetchTratamiento();
            }, 1500);
          } catch (error) {
            console.log(error);
          }
        } else {
          const body = {
            ...this.tratamientoInfoJson,
            AccionMitigacionList: this.accionesMitigacion,
          };
          try {
            const response = await fetch(
              `${BASE_URL}plantratamiento/${this.$route.params.tr_codigo}`,
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

            this.loading = false;

            this.error = false;
            this.message =
              "¡El plan de tratamiento ha sido actualizado exitósamente!";
            location.reload();

            setTimeout(async () => {
              this.message = "";
            }, 1500);
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    goToTestSummary() {
      this.$router.push(
        `/lista-verificacion/${this.codigoListaVerificacion}/prueba/${this.codigoPrueba}/resumen`
      );
    },
    async fetchTratamientoEstados(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}estadotratamiento/lista?rolUsuario=${this.userInfoJson.rol}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.estadoList = (await response.json()) as IEstadoTratamiento[];

        if (!this.$route.params.tr_codigo) {
          this.estadoList = this.estadoList.filter(
            (e) => e.nombre == "Sin asignar" || e.nombre == "Asignado"
          );
        }

        (this.tratamientoInfoJson.estadosTratamientoId == null ||
          this.tratamientoInfoJson.estadosTratamientoId == undefined) &&
          (this.tratamientoInfoJson.estadosTratamientoId =
            this.estadoList[0].estadosTratamientoId);
      } catch (err) {
        console.log(err);
      }
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

        const tratamientoObtenido =
          (await response.json()) as IObtenerTratamiento;

        const validateArray = Object.keys(this.tratamientoInfoJson);

        this.tratamientoInfoJson = propertiesSubSet<ITratamiento>(
          validateArray,
          tratamientoObtenido
        );

        if (
          this.userInfoJson.rol == rol.ANALISTA &&
          this.tratamientoInfoJson.usuarioId !== this.userInfoJson.id
        ) {
          this.loading = false;
          this.$router.replace(`/dashboard`);
        }

        this.codigoEvaluacion = tratamientoObtenido.codigoEvaluacion;
        this.pruebas = tratamientoObtenido.pruebas.filter(
          (pr) => pr.visibilidad
        );
        this.codigoPrueba = this.pruebas[0].codigo;
        this.codigoListaVerificacion =
          tratamientoObtenido.listaVerificacionCodigo;
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

        this.accionesMitigacion =
          (await response.json()) as IAccionMitigacion[];

        if (this.accionesMitigacion.length > 0) {
          const total = this.accionesMitigacion.length;
          const done = this.accionesMitigacion.filter(
            (acm) => acm.estado == true
          ).length;
          this.tratamientoInfoJson.porcentajeAvance = (done / total) * 100;
        } else {
          this.tratamientoInfoJson.porcentajeAvance = 0;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async editAccion(accion: IAccionMitigacion): Promise<void> {
      this.$router.push(
        `/accion-mitigacion/edicion/${accion.accionMitigacionId}`
      );
    },
    async deleteAccion(actionId?: string): Promise<void> {
      this.closeModal();
      console.log("SelectedAccion", this.accionSelected);
      console.log("eachAction", actionId);
      const selectedActionId = actionId ? actionId : this.accionSelected;
      try {
        const response = await fetch(
          `${BASE_URL}accionmitigacion/${selectedActionId}`,
          {
            method: "DELETE",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        await handleErrors(response);

        if (!actionId) {
          this.message = "¡Se ha eliminado accion exitósamente!";

          setTimeout(async () => {
            this.message = "";
            await this.fetchAccionesMitigacion();
          }, 1000);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async confirmMassiveDelete(): Promise<void> {
      await Promise.all(
        this.checkedEntities.map(async (accion) => {
          try {
            const response = await this.deleteAccion(accion);
            console.log(response);
          } catch (error) {
            console.log(error);
          }
        })
      );

      this.massiveDelete = false;
      this.showModalConfirmation = false;
      this.modalTitle = "";

      this.message =
        "¡Se ha eliminado las acciones de mitigacion exitósamente!";

      setTimeout(async () => {
        await this.fetchAccionesMitigacion();
        this.message = null;
      }, 1000);
    },
  },
  mounted() {
    this.loading = true;
    (async () => {
      this.userInfoJson = await getUsuario();
      if (
        this.userInfoJson.rol !== rol.JEFE_DE_RIESGOS &&
        this.userInfoJson.rol !== rol.ANALISTA &&
        this.userInfoJson.rol !== rol.ALTA_GERENCIA
      ) {
        this.loading = false;
        this.$router.replace(`/dashboard`);
      }

      if (this.userInfoJson.rol == rol.JEFE_DE_RIESGOS) {
        await this.fetchEvaluaciones();
        this.canEdit = true;
      } else this.canEdit = false;
      if (this.userInfoJson.rol == rol.ALTA_GERENCIA) {
        this.esAltaGerencia = true;
      }
      await this.fetchAnalista();

      if (!this.$route.params.tr_codigo) {
        try {
          const response = await fetch(
            `${BASE_URL}plantratamiento/ultimoCodigo`,
            {
              method: "GET",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            }
          );

          const { codigo } = (await response.json()) as { codigo: string };

          this.tratamientoInfoJson.codigo = codigo;
        } catch (err) {
          console.log(err);
        }
      } else {
        this.showAccionesMitigacion = true;
        await this.fetchTratamiento();
        await this.fetchAccionesMitigacion();
      }

      await this.fetchTratamientoEstados();
      this.loading = false;
      this.userValidated = true;
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
.far.fa-envelope {
  position: relative;
  margin-left: 10px;
}
.fa-envelope::after {
  content: "";
  z-index: 1000;
  position: absolute;
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
  right: -3px;
  bottom: 9px;
}

@media only screen and (max-width: 1179px) {
  .dropdownSelect {
    left: 0px;
  }
}
</style>
