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
  <section id="main">
    <h1>
      {{
        action == "registrar"
          ? "Registrar evaluación de obra"
          : action == "editar"
          ? "Editar evaluación"
          : "Visualizar evaluación"
      }}
    </h1>
    <button
      v-if="!esAltaGerencia && !isJefeRiesgos"
      :class="$route.params.id ? 'action-button' : 'action-button blocked'"
      :disabled="!$route.params.id && !verifyPruebaCompleta"
      @click="submit"
    >
      {{ displayButtonAction }}
    </button>
    <button
      v-if="
        isJefeRiesgos &&
        evaluacion.visibilidad == true &&
        evaluacion.estado == 'Aprobado'
      "
      :class="$route.params.id ? 'action-button' : 'action-button blocked'"
      @click="downloadPDF"
    >
      Generar Informe
    </button>
    <div class="flex-row">
      <div class="flex-col">
        <div class="">
          <h3>Código de evaluación</h3>
          <img src="../assets/images/llave.png" alt="codeva" class="imgIcon" />
          <div v-if="action != 'visualizar'" class="non-editable">
            {{ evaluacion.codigo }}
          </div>
          <span class="Spanvisualizar" v-if="action == 'visualizar'">{{
            evaluacion.codigo
          }}</span>
        </div>
        <div v-if="action == 'registrar'">
          <br /><br />
          <h3>Seleccione lista de verificación</h3>
          <img
            src="../assets/images/listav.png"
            alt="listave"
            class="imgIcon"
          />
          <a-select
            :disabled="$route.params.id != '' && $route.params.id != undefined"
            v-model.trim="codigoListaVerificacion"
            v-model:value="value"
            show-search
            placeholder="Ingrese lista de verificacion"
            style="
              border: 1px solid var(--placeholder);
              border-radius: 4px;
              outline: none;
            "
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :options="selectListListaVerificacion"
            @search="handleSearch"
            @change="handleChange"
          ></a-select>

          <!-- <input
            type="text"
            placeholder="Ingrese lista de verificación"
            :disabled="$route.params.id != '' && $route.params.id != undefined"
            @keyup="searchListaVerificacion"
            v-model.trim="codigoListaVerificacion"
          />
          <p
            class="dropdownSelect tamaño"
            v-for="listaVerificacion in listasVerificacion"
            :key="listaVerificacion.listaVerificacionId"
            @click="selectListaVerificacion(listaVerificacion)"
          >
            {{ listaVerificacion.codigo + "-" + listaVerificacion.nombre }}
          </p> -->
          <div v-if="selectedListaVerificacion.fechaCreacion">
            <br />
            <span style="font-weight: bold">Fecha de creación: </span>
            <span>{{
              new Date(
                selectedListaVerificacion.fechaCreacion
              )?.toLocaleDateString()
            }}</span>
            <br />
            <p>
              <span style="font-weight: bold">Requerimientos: </span
              >{{ selectedListaVerificacion.requerimientosCount }}
            </p>
            <br />
          </div>
        </div>
        <div>
          <br /><br />
          <h3>Código de obra</h3>
          <img src="../assets/images/llave.png" alt="codobra" class="imgIcon" />
          <input
            v-if="action != 'visualizar'"
            type="text"
            placeholder="Ingrese código o nombre de obra"
            :disabled="$route.params.id != '' && $route.params.id != undefined"
            @keyup="searchObra"
            v-model.trim="codigoObra"
          />
          <p
            class="dropdownSelectobras tamaño"
            v-for="obra in obras"
            :key="obra.obraId"
            @click="SelectObra(obra)"
          >
            {{ obra.codigo + "-" + obra.nombre }}
          </p>
          <span class="Spanvisualizar" v-if="action == 'visualizar'">{{
            codigoObra
          }}</span>
        </div>
        <div>
          <br /><br />
          <h3>Nombre</h3>
          <img
            src="../assets/images/carduser.png"
            alt="nombre"
            class="imgIcon"
          />
          <input
            v-if="action != 'visualizar'"
            type="text"
            :placeholder="evaluacion.nombre"
            v-model.trim="evaluacion.nombre"
          />
          <span class="Spanvisualizar" v-if="action == 'visualizar'">{{
            evaluacion.nombre
          }}</span>
        </div>
        <div>
          <br />
          <br />
          <h3>Fecha de creación</h3>
          <img src="../assets/images/date.png" alt="fecha" class="imgIcon" />
          <div v-if="action != 'visualizar'" class="non-editable">
            {{ evaluacion.fechaCreacion }}
          </div>
          <span class="Spanvisualizar" v-if="action == 'visualizar'">{{
            evaluacion.fechaCreacion
          }}</span>
        </div>
      </div>
      <div class="flex-col">
        <div v-if="action != 'visualizar'">
          <h3>Estado</h3>

          <img src="../assets/images/check.png" alt="estado" class="imgIcon" />
          <div v-if="action != 'editar' || isAnalista">
            <div class="non-editable transformacion">
              {{ evaluacion.estado ? evaluacion.estado : "Pendiente" }}
            </div>
          </div>
          <div v-else>
            <select class="select" v-model="estadoSelected" name="prueba">
              <option
                v-for="estado in estadoList"
                :key="estado.estadosEvaluacionId"
                :value="estado.estadosEvaluacionId"
              >
                {{ estado.nombre }}
              </option>
            </select>
          </div>
          <br />
          <br />
        </div>
        <div v-if="action == 'visualizar'">
          <h3>Estado</h3>
          <img src="../assets/images/check.png" alt="estado" class="imgIcon" />
          <span class="Spanvisualizar">
            {{ evaluacion.estado }}
          </span>
          <br />
          <br />
        </div>
        <div>
          <div v-if="action != 'visualizar' && isAnalista">
            <img
              src="../assets/images/prueba.png"
              alt="prueba"
              class="imgIcon"
            />
            <button
              class="link"
              @click="startQuiz()"
              :disabled="
                ((!selectedObra.obraId ||
                  !selectedListaVerificacion.listaVerificacionId) &&
                  !$route.params.id) ||
                blockRealizarPrueba
              "
            >
              Realizar prueba
            </button>
            <button
              v-if="pruebas.listaRecords.length > 0 && isAnalista"
              class="action-button massive evaluacion"
              @click="deleteMassive()"
            >
              Eliminación masiva
            </button>
          </div>
          <grid
            :dataSource="pruebas"
            :columns="columns"
            :config="config"
            :actions="actions"
            :rows="rows"
            :rowHeaderStyle="'thin'"
            :rowBodyStyle="'thin'"
            @movePage="() => {}"
            @selectedList="selectedList"
          ></grid>
        </div>
        <div v-if="action != 'registrar' && !esAltaGerencia && !isJefeRiesgos">
          <div id="comentarios">
            <br />
            <h3>Observaciones</h3>
            <div v-if="action == 'editar' && isEspecialista">
              <br />
              <div style="display: flex; gap: 1vw">
                <input
                  class="comentario-box"
                  type="text"
                  v-model="comentarioInput"
                  placeholder="Escribe tu comentario"
                />
                <button
                  class="action-button blocked comentario-button"
                  @click="sendMessage"
                >
                  Enviar
                </button>
              </div>
              <br />
            </div>
            <div v-if="observaciones.length != 0" class="comentario-lista">
              <div
                v-for="(observacion, index) in observaciones"
                :key="observacion.descripcion"
              >
                <div class="card">
                  <div style="display: flex; gap: 1vw">
                    <!-- <img
                      :src="require('@/assets/images/adminImg.png')"
                      alt="userImage"
                      class="userImage"
                    /> -->
                    <div class="iconHolder">
                      <p>
                        {{ observacion.nombreUsuario[0] }}
                      </p>
                    </div>
                    <div>
                      <h4>
                        {{ observacion.nombreUsuario }}
                        {{ "(" + observacion.usuarioRol + ")" }}
                      </h4>
                    </div>
                    <!-- <p>{{ calculateTimeFromNow(observacion.fechaCreacion) }}</p> -->
                    <p>{{ observacion.fechaCreacion }}</p>
                    <p v-if="index == 0" style="color: #7aadff">
                      Último mensaje
                    </p>
                  </div>
                  <p class="comentario">{{ observacion.descripcion }}</p>
                </div>
              </div>
            </div>
            <div v-else>
              <h4>No hay observaciones</h4>
            </div>
          </div>
        </div>
      </div>
      <div>
        <img src="../assets/images/obra.png" alt="obra" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import NavBar from "@/components/layout/NavBar.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import Grid from "@/components/ui/Grid.vue";
import { emptyUser } from "@/utils/initializer";
import { defineComponent } from "@vue/runtime-core";
import moment from "moment";
import {
  actions,
  BASE_URL,
  columnsPruebaLista,
  entity,
  rol,
} from "../common/constants";
import { fechaCreacionPruebaVacia } from "../common/mockdata";
import Modal from "../components/ui/Modal.vue";
import { IDataSource } from "../interfaces/dataSource";
import {
  IEvaluacion,
  IEvaluacionDetalle,
} from "../interfaces/evaluacion.interface";
import { IListaVerificacion } from "../interfaces/listaVerificacion.interface";
import { IObra } from "../interfaces/obra.interface";
import { IUser } from "../interfaces/user.interface";
import { getUsuario } from "../services/authService";
import { IEstadoEvaluacion } from "../interfaces/estadoEvaluacion.interface";
import {
  emptyEvaluacion,
  emptyObra,
  emptyPrueba,
  emptyVerificationList,
} from "../utils/initializer";
import { IComentarioLista } from "../interfaces/comentario.interface";
import { handleErrors } from "../common/utils";

export default defineComponent({
  components: {
    NavBar,
    Grid,
    ConfirmationModal,
    Modal,
  },
  computed: {
    verifyPruebaCompleta(): boolean {
      return this.pruebas.listaRecords.some((pr) => (pr.estado = "Completa"));
    },

    selectedListaVerificacion(): IListaVerificacion {
      return this.$store.getters[
        "listaVerificacionModule/selectedListaVerificacion"
      ];
    },
    selectedObra(): IObra {
      return this.$store.getters["obraModule/selectedObra"];
    },
    evaluacion(): IEvaluacion {
      return this.$store.getters["evaluacionModule/obtenerEvaluacion"];
    },
    displayButtonAction(): string {
      switch (this.action) {
        case "visualizar":
          return "Editar";
        case "registrar":
          return "Guardar";
        case "editar":
          return "Guardar";
        default:
          return "Editar";
      }
    },
  },
  data() {
    return {
      selectListListaVerificacion: [] as any,
      estadoList: [] as IEstadoEvaluacion[],
      observaciones: [] as IComentarioLista[],
      estadoSelected: "",
      comentarioInput: "",
      userInfoJson: emptyUser() as IUser,
      action: "visualizar" as "visualizar" | "registrar" | "editar",
      pruebas: fechaCreacionPruebaVacia as IDataSource<{
        id: number;
        fechaCreacion: string;
        estado: "Pendiente" | "Completa";
        pruebaId: string;
        codigo: string;
      }>,
      columns: columnsPruebaLista,
      esAltaGerencia: false,
      isAnalista: false,
      isJefeRiesgos: false,
      isEspecialista: false,
      config: {
        deleteEntity: "",
        entity: entity.PRUEBA,
      },
      actions: [
        { icon: "fas fa-trash-alt", type: actions.DELETE, method: this.delete },
        { icon: "fas fa-eye", type: actions.EDIT, method: this.edit },
      ],
      rows: 1,
      codigoListaVerificacion: "",
      codigoObra: "",
      obras: [] as IObra[],
      listasVerificacion: [] as IListaVerificacion[],
      timeout: undefined as number | undefined,
      id: "",
      modalTitle: "",
      showModalConfirmation: false,
      entityList: [] as string[],
      massiveDelete: false,
      message: null as unknown as string | null,
      loading: false,
      error: false,
      blockRealizarPrueba: false,
    };
  },
  methods: {
    async downloadPDF(): Promise<void> {
      // works in local, but not in prod
      try {
        fetch(`${BASE_URL}evaluacion/informe/${this.evaluacion.codigo}`, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "arraybuffer",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        })
          .then((response) => response.blob())
          .then((blob) => {
            var file = new Blob([blob], { type: "application/pdf" });
            var fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          });
      } catch (err) {
        console.log(err);
      }
    },
    async sendMessage(): Promise<void> {
      const body = {
        Descripcion: this.comentarioInput,
        UsuarioId: this.userInfoJson.id,
        EvaluacionId: this.evaluacion.evaluacionId,
      };
      try {
        const response = await fetch(`${BASE_URL}observaciones`, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
          body: JSON.stringify(body),
        });

        await handleErrors(response);

        this.observaciones.unshift({
          nombreUsuario:
            this.userInfoJson.nombres + " " + this.userInfoJson.apellidos,
          fechaCreacion: new Date(),
          descripcion: this.comentarioInput,
          usuarioRol: this.userInfoJson.rol as string,
        });

        this.comentarioInput = "";
      } catch (error) {
        console.log(error);
      }
    },
    calculateTimeFromNow(date: Date) {
      moment.tz.setDefault("America/Lima");
      return moment(date).locale("es").fromNow();
    },
    delete(id: string): void {
      this.id = id;
      this.modalTitle = "Está seguro que desea eliminar la prueba " + id + "?";
      this.showModalConfirmation = true;
    },
    async confirmMassiveDelete(): Promise<void> {
      await Promise.all(
        this.entityList.map(async (el) => {
          const foundTest = this.pruebas.listaRecords.find(
            (pr) => pr.id == +el
          );
          if (foundTest) {
            try {
              const response = await fetch(
                `${BASE_URL}prueba/${foundTest.pruebaId}`,
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
          }
        })
      );

      this.massiveDelete = false;
      this.showModalConfirmation = false;
      this.modalTitle = "";

      this.message = `Los pruebas fueron eliminadas`;

      setTimeout(async () => {
        await this.fetchEvaluacion();
        this.message = null;
      }, 2000);
    },
    edit(id: string): void {
      const selectedPrueba = this.pruebas.listaRecords.find(
        (pr) => pr.id == Number(id)
      );

      if (selectedPrueba?.estado == "Pendiente") {
        this.$router.push(
          `/evaluacion/${this.evaluacion.codigo}/prueba/${selectedPrueba.codigo}`
        );
      } else {
        this.$router.push(
          `/lista-verificacion/${this.selectedListaVerificacion.codigo}/prueba/${selectedPrueba?.codigo}/resumen`
        );
      }
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
    deleteMassive(): void {
      if (this.entityList.length > 0) {
        this.massiveDelete = true;
        this.showModalConfirmation = true;
        this.modalTitle =
          "Está seguro que desea eliminar las " +
          "pruebas" +
          "s seleccionadas ?";
      } else {
        this.message = "Debe seleccionar al menos una prueba";
        this.error = true;
      }
    },
    async confirmDelete(): Promise<void> {
      this.closeModal();
      const selectedPrueba = this.pruebas.listaRecords.find(
        (pr) => pr.id == Number(this.id)
      );
      try {
        const response = await fetch(
          `${BASE_URL}prueba/${selectedPrueba?.pruebaId}`,
          {
            method: "DELETE",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.message = `La prueba fue eliminada`;
        this.id = "";

        setTimeout(async () => {
          await this.fetchEvaluacion();
          this.message = null;
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    },
    searchObra() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => {
        try {
          const response = await fetch(
            `${BASE_URL}obras/lista?filter=${this.codigoObra}`,
            {
              method: "GET",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            }
          );

          this.obras = (await response.json()) as IObra[];
        } catch (err) {
          console.log(err);
        }
      }, 1000);
    },
    async fetchListaVerificacionPorCodigo() {
      try {
        const response = await fetch(
          `${BASE_URL}listaverificaciones/lista?filter=${this.codigoListaVerificacion}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.listasVerificacion =
          (await response.json()) as IListaVerificacion[];
      } catch (err) {
        console.log(err);
      }
    },
    async fetchListListaVerificacion() {
      try {
        const response = await fetch(`${BASE_URL}listaverificaciones/lista`, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        });
        this.listasVerificacion =
          (await response.json()) as IListaVerificacion[];

        this.listasVerificacion.forEach((lv) => {
          this.selectListListaVerificacion.push({
            value: lv.codigo,
            label: lv.codigo + "-" + lv.nombre,
          });
          console.log(lv.codigo);
        });
      } catch (err) {
        console.log(err);
      }
    },
    searchListaVerificacion() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => {
        await this.fetchListaVerificacionPorCodigo();
      }, 1000);
    },
    SelectObra(obra: IObra) {
      this.$store.dispatch("obraModule/guardarObra", {
        ...obra,
      });
      this.obras = [];
      this.codigoObra = obra.codigo + "-" + obra.nombre;
    },

    selectListaVerificacion(listaVerificacion: IListaVerificacion) {
      this.$store.dispatch("listaVerificacionModule/guardarListaVerificacion", {
        ...listaVerificacion,
      });
      this.listasVerificacion = [];
      this.codigoListaVerificacion =
        listaVerificacion.codigo + "-" + listaVerificacion.nombre;
    },
    async startQuiz(): Promise<void> {
      const body = {
        EvaluacionCodigo: this.evaluacion.codigo,
        EstadoEvaluacion: this.evaluacion.estado,
        EvaluacionNombre: this.evaluacion.nombre,
        ObraId: this.selectedObra.obraId,
        ListaVerificacionId: this.selectedListaVerificacion.listaVerificacionId,
        UsuarioId: this.userInfoJson.id,
      };

      // Guardar evaluacion
      console.log(body);

      try {
        await fetch(`${BASE_URL}evaluacion`, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
          body: JSON.stringify(body),
        });
      } catch (err) {
        console.log(err);
      }

      this.$router.push(`/evaluacion/${this.evaluacion.codigo}/prueba/nuevo`);
    },
    preloadFormValues(): void {
      if (this.selectedListaVerificacion.fechaCreacion) {
        this.codigoListaVerificacion =
          this.selectedListaVerificacion.codigo +
          "-" +
          this.selectedListaVerificacion.nombre;
      }

      if (this.selectedObra.codigo) {
        this.codigoObra =
          this.selectedObra.codigo + "-" + this.selectedObra.nombre;
      }
    },
    submit(): void {
      // la evaluacion se crea automaticamente, aqui solo la activamos al guardar
      if (this.action === "registrar") {
        (async () => {
          try {
            await fetch(
              `${BASE_URL}evaluacion/activar/${this.evaluacion.evaluacionId}`,
              {
                method: "PUT",
                headers: new Headers({
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                }),
              }
            );
          } catch (err) {
            console.log(err);
          }
          this.$router.push("/dashboard");
        })();
      } else if (this.action === "visualizar") {
        // se modifica la interfaz a modo edificion
        this.action = "editar";
      } else {
        // estamos en modo edicion: aqui se actualiza la tabla evaluacion

        (async () => {
          const body = {
            nombre: this.evaluacion.nombre,
            estado: this.estadoSelected,
            codigoEspecialista: this.isEspecialista
              ? this.userInfoJson.id
              : null,
          };
          try {
            await fetch(
              `${BASE_URL}evaluacion/${this.evaluacion.evaluacionId}`,
              {
                method: "PUT",
                headers: new Headers({
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                }),
                body: JSON.stringify(body),
              }
            );
          } catch (err) {
            console.log(err);
          }
          this.$router.push("/dashboard");
        })();
      }
    },
    async fetchEvaluacion(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/${this.$route.params.id}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        const evaluacionDetalle = (await response.json()) as IEvaluacionDetalle;
        this.estadoSelected = evaluacionDetalle.estadoEvaluacionId;

        if (evaluacionDetalle.observacionLista) {
          this.observaciones = evaluacionDetalle.observacionLista.filter(
            (cml) => cml.nombreUsuario != null
          );
        } else {
          this.observaciones = [];
        }

        this.codigoListaVerificacion =
          evaluacionDetalle.codigoConcatenadoListaVerificacion;
        this.codigoObra = evaluacionDetalle.codigoConcatenadoObra;
        this.pruebas.numeroPaginas = 1;
        this.pruebas.totalRecords = 1;
        this.selectedListaVerificacion.fechaCreacion =
          evaluacionDetalle.listaVerificacionFechaCreacion;
        this.selectedListaVerificacion.requerimientosCount =
          evaluacionDetalle.requerimientosCount;
        this.selectedListaVerificacion.codigo =
          evaluacionDetalle.codigoListaVerificacion;
        this.selectedListaVerificacion.listaVerificacionId =
          evaluacionDetalle.listaVerificacionId;
        this.selectedObra.obraId = evaluacionDetalle.obraId;

        this.pruebas.listaRecords = [];

        evaluacionDetalle.pruebaList.forEach((prueba, index) => {
          this.pruebas.listaRecords.push({
            id: index + 1,
            fechaCreacion: new Date(prueba.fechaCreacion).toLocaleDateString(),
            estado: prueba.visibilidad ? "Completa" : "Pendiente",
            pruebaId: prueba.pruebaId,
            codigo: prueba.codigo,
          });
        });

        this.blockRealizarPrueba = this.pruebas.listaRecords.some(
          (pr) => pr.estado == "Pendiente"
        );

        this.rows = this.pruebas.listaRecords.length;

        this.$store.dispatch("evaluacionModule/guardarEvaluacion", {
          ...this.evaluacion,
          evaluacionId: evaluacionDetalle.evaluacionId,
          codigo: evaluacionDetalle.codigo,
          nombre: evaluacionDetalle.nombre,
          estado: evaluacionDetalle.estado,
          visibilidad: evaluacionDetalle.visibilidad,
          fechaCreacion: new Date(
            evaluacionDetalle.fechaCreacion
          ).toLocaleDateString(),
        });
      } catch (err) {
        console.log(err);
      }
    },
    async fetchEvaluacionEstados(): Promise<void> {
      try {
        const response = await fetch(`${BASE_URL}estadoevaluacion/lista`, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        });

        this.estadoList = (await response.json()) as IEstadoEvaluacion[];
      } catch (err) {
        console.log(err);
      }
    },
  },
  unmounted() {
    this.$store.dispatch("obraModule/guardarObra", emptyObra());
    this.$store.dispatch(
      "listaVerificacionModule/guardarListaVerificacion",
      emptyVerificationList()
    );
    this.$store.dispatch(
      "evaluacionModule/guardarEvaluacion",
      emptyEvaluacion()
    );
    this.$store.dispatch("pruebaModule/guardarPrueba", emptyPrueba());
  },
  mounted() {
    (async () => {
      this.userInfoJson = await getUsuario();
      // se actualiza la evaluacion en vuex desde la vista anterior y se pasa este nuevo estado al action

      if (this.userInfoJson.rol == rol.ALTA_GERENCIA) {
        this.esAltaGerencia = true;
      }

      if (this.userInfoJson.rol == rol.ANALISTA) {
        this.isAnalista = true;
        this.evaluacion.action = "registrar";
      }

      if (this.userInfoJson.rol == rol.JEFE_DE_RIESGOS) {
        this.isJefeRiesgos = true;
      }

      if (this.userInfoJson.rol == rol.ESPECIALISTA) {
        this.isEspecialista = true;
      }

      if (this.userInfoJson.rol !== rol.ANALISTA) {
        this.actions = [
          { icon: "fas fa-eye", type: actions.EDIT, method: this.edit },
        ];
      }

      if (this.action == "registrar") {
        this.fetchListListaVerificacion();
        console.log("listasVerificacion");
        console.log(this.listasVerificacion);
      }
      this.evaluacion.action && (this.action = this.evaluacion.action);

      if (!this.$route.params.id) {
        this.pruebas = {
          listaRecords: [],
          numeroPaginas: 1,
          totalRecords: 0,
        };

        try {
          const response = await fetch(`${BASE_URL}evaluacion/ultimoCodigo`, {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          });

          const { codigo } = (await response.json()) as { codigo: string };

          this.$store.dispatch("evaluacionModule/guardarEvaluacion", {
            ...this.evaluacion,
            codigo: codigo,
            fechaCreacion: new Date().toLocaleDateString(),
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        await this.fetchEvaluacionEstados();
        await this.fetchEvaluacion();
      }
    })();
  },
});
</script> 

<style scoped>
.card {
  background-color: ghostwhite;
  cursor: pointer;
  border: 1px solid var(--placeholder);
  border-radius: 12px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px;
  /* height: 120px; */
  box-shadow: 0 2px 8px var(--box-shadow);
  transition: all 0.2s linear;
}

.card .comentario {
  margin: 10px;
}

.comentario-lista {
  padding: 5px;
  height: 40vh;
  overflow-y: scroll;
}

.comentario-lista img {
  position: relative;
  width: 53px;
  height: 60px;
}

.comentario-lista .flex-row {
  border: 2px solid #dadada;
  align-items: center;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  margin-left: 10px;
}

.link {
  margin-top: -30px;
  margin-left: 41px;
  text-decoration: underline;
  cursor: pointer;
  background: white;
}
input,
select,
.link {
  display: block;
  margin-top: -34px;
  margin-left: 41px;
  width: 165px;
  height: 30px;
}
.Spanvisualizar {
  display: block;
  margin-top: -30px;
  margin-left: 41px;
  width: 165px;
  height: 30px;
}
button.link {
  width: 100px;
}

input.comentario-box {
  display: block;
  margin-top: 0px;
  margin-left: 0px;
  width: 75%;
  height: 37px;
}

.flex-row {
  margin-top: 50px;
  min-width: 800px;
}
.flex-col {
  margin-right: 50px;
  width: 400px;
}
.action-button {
  position: absolute;
  top: 10 0px;
  right: 50px;
}

.action-button.comentario-button {
  position: static;
}

.action-button.blocked {
  background: var(--accent);
  cursor: auto;
}
.action-button.massive {
  position: relative;
  top: 10px;
  right: 0px;
  width: 240px;
}

.action-button.massive.evaluacion {
  position: relative;
  top: 10px;
  right: -35px;
  width: 200px;
}

#main {
  text-align: left;
  margin-left: 100px;
}

.transformacion {
  text-transform: capitalize;
}

.tamaño {
  font-size: 10pt;
}
.iconHolder {
  position: relative;
  flex-shrink: 0;
  margin: 5px 1px !important;
  height: 40px !important;
  width: 40px !important;
  border-radius: 100%;
  background-color: black;
}

.iconHolder p {
  position: absolute;
  top: -1px;
  left: 10px;
  text-transform: uppercase;
  color: #d6bd8f !important;
  letter-spacing: -4px;
  font-family: "Merriweather", serif;
  font-weight: 900;
  font-size: 25px;
  text-align: center;
  vertical-align: middle;
  line-height: 45px;
  color: black;
}
</style>
