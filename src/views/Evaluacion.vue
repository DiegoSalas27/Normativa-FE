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
      :class="$route.params.id ? 'action-button' : 'action-button blocked'"
      :disabled="!$route.params.id && !verifyPruebaCompleta"
      @click="submit"
    >
      {{ action == "registrar" ? "Guardar" : "Editar" }}
    </button>
    <div class="flex-row">
      <div class="flex-col">
        <div class="">
          <h3>Código de evaluación</h3>
          <img src="../assets/images/llave.png" alt="codeva" class="imgIcon" />
          <div class="non-editable">{{ evaluacion.codigo }}</div>
        </div>
        <div v-if="action == 'registrar'">
          <br /><br />
          <h3>Seleccione lista de verificación</h3>
          <img
            src="../assets/images/listav.png"
            alt="listave"
            class="imgIcon"
          />
          <input
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
          </p>
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
            type="text"
            :placeholder="evaluacion.nombre"
            :disabled="action == 'visualizar'"
            v-model.trim="evaluacion.nombre"
          />
        </div>
        <div>
          <br />
          <br />
          <h3>Fecha de creación</h3>
          <img src="../assets/images/date.png" alt="fecha" class="imgIcon" />
          <div class="non-editable">{{ evaluacion.fechaCreacion }}</div>
        </div>
      </div>
      <div class="flex-col">
        <div>
          <h3>Estado</h3>

          <img src="../assets/images/check.png" alt="estado" class="imgIcon" />
          <div v-if="action != 'editar'">
            <div class="non-editable transformacion">
              {{ evaluacion.estado }}
            </div>
          </div>
          <div v-else>
            <select class="select" v-model="estadoSelected" name="prueba">
              <option
                v-for="estado in estados"
                :key="estado.estadoId"
                :value="estado.estado"
              >
                {{ estado.estado }}
              </option>
            </select>
          </div>
          <br />
          <br />
        </div>
        <div>
          <div v-if="action != 'visualizar'">
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
              v-if="pruebas.listaRecords.length > 0"
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
        <div v-if="action != 'registrar'">
          <div id="comentarios">
            <br />
            <h3>Comentarios</h3>
            <div v-if="action == 'editar'">
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
            <div v-if="comentarioLista.length != 0">
              <div
                class="comentario-lista"
                v-for="(comentario, index) in comentarioLista"
                :key="comentario.descripcion"
              >
                <div class="card" style="display: flex; gap: 1vw">
                  <img
                    :src="require('@/assets/images/adminImg.png')"
                    alt="userImage"
                    class="userImage"
                  />
                  <div>
                    <h4>
                      {{ comentario.nombreUsuario }}
                      {{ "(" + comentario.usuarioRol + ")" }}
                    </h4>
                    <p>{{ comentario.descripcion }}</p>
                  </div>
                  <!-- <p>{{ calculateTimeFromNow(comentario.fechaCreacion) }}</p> -->
                  <p>{{ comentario.fechaCreacion }}</p>
                  <p v-if="index == 0" style="color: #7aadff">Último mensaje</p>
                </div>
              </div>
            </div>
            <div v-else>
              <h4>No hay registros</h4>
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
import Grid from "@/components/ui/Grid.vue";
import { emptyUser } from "@/utils/initializer";
import { defineComponent } from "@vue/runtime-core";
import {
  actions,
  BASE_URL,
  columnsPruebaLista,
  entity,
} from "../common/constants";
import { fechaCreacionPruebaVacia } from "../common/mockdata";
import { IDataSource } from "../interfaces/dataSource";
import {
  IEvaluacion,
  IEvaluacionDetalle,
} from "../interfaces/evaluacion.interface";
import { IListaVerificacion } from "../interfaces/listaVerificacion.interface";
import { IObra } from "../interfaces/obra.interface";
import { IUser } from "../interfaces/user.interface";
import { getUsuario } from "../services/authService";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import Modal from "../components/ui/Modal.vue";
import {
  emptyObra,
  emptyVerificationList,
  emptyEvaluacion,
  emptyPrueba,
} from "../utils/initializer";
import { IEvidenciaRequerimientoAccionMitigacion } from "@/interfaces/accionMitigacion";
import { IComentarioLista } from "@/interfaces/comentario.interface";
import moment from "moment";

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
  },
  data() {
    return {
      estados: [
        {
          estado: "Pendiente",
          estadoId: 1,
        },
        {
          estado: "Aprobado",
          estadoId: 2,
        },
        {
          estado: "Rechazado",
          estadoId: 3,
        },
      ],
      comentarioLista: [
        {
          nombreUsuario: "nombre",
          fechaCreacion: new Date().toISOString().slice(0, 10),
          descripcion: "asdasdasdasdasdasd",
          usuarioRol: "rol",
        },
        {
          nombreUsuario: "nombre",
          fechaCreacion: new Date().toISOString().slice(0, 10),
          descripcion: "asdasdasdasdasdasd",
          usuarioRol: "rol",
        },
      ],
      estadoSelected: "",
      comentarioInput: "",
      userInfoJson: emptyUser() as IUser,
      action: "",
      pruebas: fechaCreacionPruebaVacia as IDataSource<{
        id: number;
        fechaCreacion: string;
        estado: "Pendiente" | "Completa";
        pruebaId: string;
        codigo: string;
      }>,
      columns: columnsPruebaLista,
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
      sendMessage: null,
    };
  },
  methods: {
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
          // `/lista-verificacion/${this.selectedListaVerificacion.codigo}/prueba/${selectedPrueba?.codigo}/resumen`
          `/evaluacion/${this.evaluacion.codigo}/prueba/${selectedPrueba?.codigo}?req=end`
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
    async fetchListListaVerificacion() {
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
    searchListaVerificacion() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => {
        await this.fetchListListaVerificacion();
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
      //this.action == visualizar significa que esta en http://localhost:8080/evaluacion/EV007
      //else significa que esta en http://localhost:8080/evaluacion/EV007/editar

      // if (this.action == visualizar) {
      if (this.evaluacion.visibilidad) {
        (async () => {
          const body: Partial<IEvaluacion> = {
            nombre: this.evaluacion.nombre,
          };

          try {
            console.log(this.evaluacion.evaluacionId);
            console.log("this.evaluacion.evaluacionId");
            await fetch(
              // `${BASE_URL}evaluacion/${this.evaluacion.evaluacionId}`, //POR MIENTRAS LA URL SERA CON /REGISTRAR. SE CAMBIARA EN SEM5.
              `${BASE_URL}evaluacion/${this.evaluacion.evaluacionId}/registrar`,
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
          // this.$router.push(`/evaluacion/${this.evaluacion.codigo}/editar`);
          this.$router.push("/dashboard");
        })();
      } else {
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
          // this.$router.push(`/evaluacion/${this.evaluacion.codigo}`);
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
    console.log("comentarioLista");
    console.log(this.comentarioLista);

    //action: visualizar, editar o registrar

    this.action = window.location.href.split("/").slice(-1).pop()!;
    this.action =
      this.action != "editar" && this.action != "registrar"
        ? "visualizar"
        : this.action;

    this.action = "registrar"; // hardcodeado por Diego Salas Noain para hcer pruebas

    console.log(this.action);

    // console.log("this.action");
    // console.log(this.action);

    (async () => {
      this.userInfoJson = await getUsuario();

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
          debugger;
        }
      } else {
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
  margin: 10px 0;
  padding: 5px;
  height: 60px;
  box-shadow: 0 2px 8px var(--box-shadow);
  transition: all 0.2s linear;
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
</style>
