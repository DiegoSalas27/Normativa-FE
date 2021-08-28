<template>
  <nav-bar
    :name="userInfoJson?.nombres"
    :lastName="userInfoJson?.apellidos"
  ></nav-bar>
  <section class="quiz">
    <h3 class="back" @click="backToEvluacion">
      <i class="fas fa-chevron-left"></i> Salir del quiz
    </h3>
    <h1>Quiz</h1>
    <div v-if="!start" class="form">
      <h3 class="form-header">
        Seleccione la lista de verificación que desea validar
      </h3>
      <div class="form-control">
        <p>Códido</p>
        <input type="text" :value="selectedListaVerificacion.codigo" />
        <p style="font-size: 14px; margin-left: 40px; font-weight: 100">
          {{ selectedListaVerificacion.requerimientos.length }} requerimientos
        </p>
      </div>
      <div class="form-control">
        <p>Fecha de creación</p>
        <div class="non-editable">
          {{
            new Date(
              selectedListaVerificacion.fechaCreacion
            ).toLocaleDateString()
          }}
        </div>
      </div>
    </div>
    <button v-if="!start" class="action-button" @click="startQuiz">
      Iniciar Quiz
    </button>

    <!-- Formulario flujo -->

    <section
      v-if="
        start &&
        !showResultado &&
        evidenciaRequerimiento &&
        evidenciaRequerimiento[stepIndex]
      "
      class="form"
    >
      <h4
        v-if="requerimientos[stepIndex]?.criterio !== undefined"
        class="form-header-criterio"
      >
        Criterio:
        {{ requerimientos[stepIndex]?.criterio.descripcion }}
      </h4>
      <h5 class="form-header">
        Pregunta {{ questionNumber + 1 }}: &nbsp;&nbsp;{{
          requerimientos[stepIndex]?.descripcion
        }}
      </h5>
      <div class="form-control">
        <p>Respuesta</p>

        <div class="radio-form" style="margin-left: 120px">
          <label for="totalmente">Totalmente</label>
          <input
            type="radio"
            name="totalmente"
            id="1"
            value="1"
            v-model="evidenciaRequerimiento[stepIndex].respuestaItem"
          />
        </div>

        <div class="radio-form">
          <label for="parcialmente">Parcialmente</label>
          <input
            type="radio"
            name="parcialmente"
            id="0.5"
            value="0.5"
            v-model="evidenciaRequerimiento[stepIndex].respuestaItem"
          />
        </div>

        <div class="radio-form">
          <label for="noimplementado">No implementado</label>
          <input
            type="radio"
            name="noimplementado"
            id="0"
            value="0"
            v-model="evidenciaRequerimiento[stepIndex].respuestaItem"
          />
        </div>

        <div class="radio-form">
          <label for="noaplica">No aplica</label>
          <input
            type="radio"
            name="noaplica"
            id="null"
            value="null"
            v-model="evidenciaRequerimiento[stepIndex].respuestaItem"
          />
        </div>
      </div>
      <div
        class="form-control"
        v-if="evidenciaRequerimiento[stepIndex].respuestaItem != 'null'"
      >
        <p>Justificación</p>
        <input
          style="margin-left: 102px; width: 400px"
          type="text"
          v-model="evidenciaRequerimiento[stepIndex].justificacion"
        />
      </div>
      <div
        class="form-control"
        v-if="evidenciaRequerimiento[stepIndex].respuestaItem != 'null'"
      >
        <p>Evidencia:</p>
        <label for="nuevo" style="margin-left: 122px">Nueva</label>
        <label class="switch">
          <input type="checkbox" name="nuevo" />
          <span class="slider round"></span>
        </label>
      </div>
      <div
        class="form-control"
        v-if="evidenciaRequerimiento[stepIndex].respuestaItem != 'null'"
      >
        <p>Nombre del Documento:</p>
        <input
          style="margin-left: 20px; width: 300px"
          type="text"
          v-model="evidencia[stepIndex].nombre"
        />
      </div>
      <div
        class="form-control"
        v-if="evidenciaRequerimiento[stepIndex].respuestaItem != 'null'"
      >
        <p>Archivo adjunto:</p>
        <span
          style="
            cursor: pointer;
            margin-top: -30px;
            margin-left: 70px !important;
          "
        >
          <!-- <p class="link">Adjutar archivo</p> -->
          <q-uploader
            :url="urlUpload"
            label="Archivo"
            flat
            bordered
            auto-upload
            color="red">
            <template>
              <q-list separator>

              </q-list>
            </template>
          </q-uploader>
          &nbsp;&nbsp; <i class="fas fa-paperclip"></i
        ></span>
      </div>
    </section>
    <button
      v-if="questionNumber > 0 && !showResultado"
      class="action-button main-form left"
      @click="previous"
    >
      Anterior
    </button>
    <button
      v-if="start && !showResultado"
      class="action-button main-form"
      @click="next"
    >
      {{ !end ? "Continuar" : "Finalizar" }}
    </button>

    <!-- Fin Formulario flujo -->

    <!-- Resultado -->

    <div v-if="showResultado">
      <table class="grid">
        <thead class="header-grid">
          <tr>
            <th>Criterio</th>
            <th>Puntaje</th>
            <th>Porcentaje de cumplimiento</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in pruebaResultados.criteriosResultado.length"
            :key="row"
          >
            <td>
              {{
                pruebaResultados.criteriosResultado[index].descripcion +
                " (" +
                pruebaResultados.criteriosResultado[index].peso +
                ") "
              }}
            </td>
            <td>
              {{ pruebaResultados.criteriosResultado[index].normalizedPuntaje }}
            </td>
            <td>
              {{
                pruebaResultados.criteriosResultado[index]
                  .porcentajeCumplimiento + "%"
              }}
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="form-header final">Resultados finales</h3>

      <table class="grid summary">
        <tbody>
          <tr>
            <td>Porcentaje de cumplimiento total</td>
            <td>{{ pruebaResultados.porcentajeCumplimientoTotal }}%</td>
          </tr>
          <tr>
            <td>Nivel de riesgo</td>
            <td>{{ pruebaResultados.nivelDeRiesgo }}</td>
          </tr>
        </tbody>
        <button class="action-button main-form left final" @click="showSummary">
          Visualizar resumen
        </button>
        <button class="action-button main-form final" @click="submit">
          Guardar prueba
        </button>
      </table>
    </div>
  </section>
</template>

<script lang="ts">
import NavBar from "@/components/layout/NavBar.vue";
import { defineComponent } from "@vue/runtime-core";
import { BASE_URL } from "../common/constants";
import { handleErrors } from "../common/utils";
import { ICriterio } from "../interfaces/criterio.interface";
import {
  IEvaluacion,
  IEvaluacionDetalle
} from "../interfaces/evaluacion.interface";
import { IEvidencia } from "../interfaces/evidencia.interface";
import { IEvidenciaRequerimiento } from "../interfaces/evidenciaRequerimiento.interface";
import { IRequerimiento } from "../interfaces/listaRequerimiento.interface";
import { IListaVerificacion } from "../interfaces/listaVerificacion.interface";
import { IPrueba, IPruebaResultados } from "../interfaces/prueba.interface";
import { IUser } from "../interfaces/user.interface";
import {
  emptyEvidencia,
  emptyEvidenciaRequerimiento,
  emptyUser
} from "../utils/initializer";

export default defineComponent({
  components: {
    NavBar,
  },
  computed: {
    selectedListaVerificacion(): IListaVerificacion {
      return this.$store.getters[
        "listaVerificacionModule/selectedListaVerificacion"
      ];
    },
    prueba(): IPrueba {
      return this.$store.getters["pruebaModule/obtenerPrueba"];
    },
    evaluacion(): IEvaluacion {
      return this.$store.getters["evaluacionModule/obtenerEvaluacion"];
    },
  },
  data() {
    return {
      userInfoJson: emptyUser() as IUser,
      date: new Date().toLocaleDateString(),
      start: false,
      criterios: [] as ICriterio[],
      requerimientos: [] as IRequerimiento[],
      evidenciaRequerimiento: [] as IEvidenciaRequerimiento[],
      evidencia: [] as IEvidencia[],
      pruebaResultados: {} as IPruebaResultados,
      obraId: "",
      criterioIndex: 0,
      stepIndex: 0,
      questionNumber: 0,
      end: false,
      showResultado: false,
      loading: false,
      error: false,
      message: "",
      evaluacionDetalle: {} as Partial<IEvaluacionDetalle>,
      urlUpload: '/document/upload',
    };
  },
  methods: {
    backToEvluacion(): void {
      this.$router.push(`/evaluacion/${this.evaluacion.codigo}`);
    },
    async startQuiz(): Promise<void> {
      // guardar Prueba
      const body = {
        EvaluacionId: this.evaluacion.evaluacionId,
        Codigo: this.prueba.codigo,
      };

      let pruebaCodigo;

      try {
        const response = await fetch(`${BASE_URL}prueba`, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
          body: JSON.stringify(body),
        });

        pruebaCodigo = await response.json();
      } catch (err) {
        console.log(err);
      }

      this.$router.replace({
        path: `/evaluacion/${this.evaluacion.codigo}/prueba/${pruebaCodigo.codigo}`,
        query: { req: 1 },
      });

      this.start = true;
    },
    async obtenerPruebaResults(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}prueba/${this.prueba.codigo}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        await handleErrors(response);

        this.loading = false;

        this.error = false;

        this.pruebaResultados = await response.json();
      } catch (error) {
        this.error = true;
        const errorObj = JSON.parse(error.message);
        // this.validationForm.email = errorObj.errores.mensaje;
      }
    },
    async registrarEvidenciaRequerimiento(): Promise<void> {
      try {
        if (
          this.evidenciaRequerimiento[this.stepIndex].respuestaItem === "null"
        ) {
          this.evidenciaRequerimiento[this.stepIndex].justificacion = "";
          this.evidencia[this.stepIndex].nombre = "";
        }

        const body = {
          EvidenciaId: this.evidencia[this.stepIndex].evidenciaId
            ? this.evidencia[this.stepIndex].evidenciaId
            : null,
          RequerimientoId: this.requerimientos[this.stepIndex].requerimientoId,
          PruebaCodigo: this.$route.params.pr_codigo,

          EvidenciaNombre: this.evidencia[this.stepIndex].nombre,
          Justificacion:
            this.evidenciaRequerimiento[this.stepIndex].justificacion,
          RespuestaItem: JSON.parse(
            this.evidenciaRequerimiento[this.stepIndex].respuestaItem as any
          ),
        };

        const response = await fetch(`${BASE_URL}evidenciarequerimiento`, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
          body: JSON.stringify(body),
        });

        await handleErrors(response);

        const evidencia = (await response.json()) as IEvidencia;

        // debugger
        // console.log("Evidencia", evidencia)

        this.evidencia[this.stepIndex].evidenciaId = evidencia.evidenciaId;

        // debugger
        // console.log("Evidencia Copia Lista", this.evidencia[this.stepIndex])

        this.loading = false;

        this.error = false;
      } catch (error) {
        this.error = true;
        console.log(error);
        const errorObj = JSON.parse(error.message);
        console.log(errorObj.errores);
      }
    },
    async next(): Promise<void> {
      await this.registrarEvidenciaRequerimiento();
      if (this.end) {
        this.stepIndex = 0;
        await this.obtenerPruebaResults();
        this.showResultado = true;
        this.$router.push(
          `/evaluacion/${this.evaluacion.codigo}/prueba/${this.$route.params.pr_codigo}/resumen`
        );
      } else {
        this.evidencia.push(emptyEvidencia());
        this.evidenciaRequerimiento.push(emptyEvidenciaRequerimiento());

        if (!this.requerimientos[this.stepIndex + 2]) {
          this.end = true;
        }

        if (this.requerimientos[this.stepIndex + 1]) {
          this.stepIndex += 1;
        } else {
          return;
        }

        this.questionNumber += 1;

        this.$router.push({
          path: `/evaluacion/${this.evaluacion.codigo}/prueba/${this.$route.params.pr_codigo}`,
          query: { req: this.questionNumber + 1 },
        });
      }
    },
    previous(): void {
      if (this.requerimientos[this.stepIndex - 1]) {
        this.stepIndex -= 1;
      } else {
        return;
      }
      this.questionNumber -= 1;
      this.end = false;

      this.$router.replace({
        path: `/evaluacion/${this.evaluacion.codigo}/prueba/${this.$route.params.pr_codigo}`,
        query: { req: this.questionNumber + 1 },
      });
    },
    showSummary(): void {
      this.$router.push(
        `/lista-verificacion/${this.selectedListaVerificacion.codigo}/prueba/${this.$route.params.pr_codigo}/resumen`
      );
    },
    submit(): void {
      // cambiar visivilidad a la prueba
      (async () => {
        try {
          await fetch(`${BASE_URL}prueba/activar/${this.prueba.codigo}`, {
            method: "PUT",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          });
        } catch (err) {
          console.log(err);
        }

        this.$router.push("/evaluacion/" + this.evaluacion.codigo);
      })();
    },
  },
  mounted() {
    (async () => {
      let ListasVerificacion: IListaVerificacion[] = [];
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/${this.$route.params.ev_codigo}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        if (response.statusText !== "No Content") {
          this.evaluacionDetalle =
            (await response.json()) as IEvaluacionDetalle;

          this.selectedListaVerificacion.fechaCreacion =
            this.evaluacionDetalle.listaVerificacionFechaCreacion;
          this.selectedListaVerificacion.requerimientosCount =
            this.evaluacionDetalle.requerimientosCount;
          this.selectedListaVerificacion.codigo =
            this.evaluacionDetalle.codigoListaVerificacion;

          this.obraId = this.evaluacionDetalle.obraId as string;

          this.$store.dispatch("evaluacionModule/guardarEvaluacion", {
            ...this.evaluacion,
            evaluacionId: this.evaluacionDetalle.evaluacionId,
            codigo: this.evaluacionDetalle.codigo,
            nombre: this.evaluacionDetalle.nombre,
            estado: this.evaluacionDetalle.estado,
            visibilidad: this.evaluacionDetalle.visibilidad,
            fechaCreacion: new Date(
              this.evaluacionDetalle.fechaCreacion
            ).toLocaleDateString(),
          });
        }
      } catch (err) {
        console.log(err);
      }

      try {
        const response = await fetch(
          `${BASE_URL}listaverificaciones/lista?filter=${this.evaluacionDetalle.codigoListaVerificacion}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        ListasVerificacion = (await response.json()) as IListaVerificacion[];

        this.$store.dispatch(
          "listaVerificacionModule/guardarListaVerificacion",
          {
            ...ListasVerificacion[0],
          }
        );

        const criteriosPrev = ListasVerificacion[0].requerimientos
          .map((req: IRequerimiento) => req.criterio)
          .sort((a, b) => a.descripcion.localeCompare(b.descripcion));

        const map = new Map();
        for (const criterio of criteriosPrev) {
          if (!map.has(criterio.descripcion)) {
            map.set(criterio.descripcion, true);
            this.criterios.push(criterio);
          }
        }

        this.requerimientos =
          this.selectedListaVerificacion.requerimientos.sort((a, b) =>
            a.criterio.descripcion.localeCompare(b.criterio.descripcion)
          );
        this.evidencia.push(emptyEvidencia());
        this.evidenciaRequerimiento.push(emptyEvidenciaRequerimiento());
      } catch (err) {
        console.log(err);
      }

      if (this.$route.params.pr_codigo == undefined) {
        try {
          const response = await fetch(`${BASE_URL}prueba/count`, {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          });

          const number: number = await response.json();
          let zeros = "";

          if (number > 10) {
            zeros = "0";
          } else {
            zeros = "00";
          }

          this.$store.dispatch("pruebaModule/guardarPrueba", {
            ...this.prueba,
            codigo: "PR" + zeros + (number + 1).toString(),
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        this.$store.dispatch("pruebaModule/guardarPrueba", {
          ...this.prueba,
          codigo: this.$route.params.pr_codigo,
        });
        try {
          const response = await fetch(
            `${BASE_URL}evidenciarequerimiento/${this.$route.params.pr_codigo}`,
            {
              method: "GET",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            }
          );

          let evidenciasRequerimientos =
            (await response.json()) as IEvidenciaRequerimiento[];

          if (evidenciasRequerimientos.length > 0) {
            this.evidencia = [];
            this.evidenciaRequerimiento = [];
            evidenciasRequerimientos = this.requerimientos
              .map((req) => {
                return evidenciasRequerimientos.find(
                  (evR) => evR.requerimientoId == req.requerimientoId
                );
              })
              .filter((evR) => evR !== undefined) as IEvidenciaRequerimiento[];

            evidenciasRequerimientos.forEach((er) => {
              this.evidencia.push({
                evidenciaId: er.evidencia?.evidenciaId,
                nombre: er.evidencia?.nombre,
                adjunto: er.evidencia?.adjunto,
              });
              this.evidenciaRequerimiento.push({
                evidenciaId: er.evidenciaId,
                requerimientoId: er.requerimientoId,
                pruebaId: er.pruebaId,
                justificacion: er.justificacion,
                respuestaItem: er.respuestaItem,
                recomendacion: er.recomendacion,
              });
            });
          }

          if (evidenciasRequerimientos.length > 0) {
            this.stepIndex = evidenciasRequerimientos.length - 1;
            this.questionNumber = evidenciasRequerimientos.length - 1;
          } else {
            this.stepIndex = 0;
            this.questionNumber = 0;
          }

          if (this.requerimientos.length == evidenciasRequerimientos.length) {
            this.end = true;
          }

          this.$router.replace({
            path: `/evaluacion/${this.evaluacion.codigo}/prueba/${this.$route.params.pr_codigo}`,
            query: { req: this.questionNumber + 1 },
          });

          this.start = true;
        } catch (err) {
          console.log(err);
        }
      }
    })();
  },
  unmounted() {
    this.start = false;
    this.criterioIndex = 0;
    this.stepIndex = 0;
    this.questionNumber = 0;
    this.end = false;
    this.showResultado = false;
  },
});
</script>

<style scoped>
.quiz {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -3;
  background-image: url("../assets/images/quiz.jpg");
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
h1 {
  position: absolute;
  top: 100px;
  right: 50%;
  font-weight: bold;
  font-size: 30px;
}
.form {
  position: absolute;
  top: 150px;
  right: 10%;
  width: 80%;
  background: #d2d2d2;
  border-radius: 5px;
  padding-bottom: 20px;
}
button {
  position: absolute;
  top: 370px;
  right: 10%;
  padding: 10px;
}
button.main-form {
  top: 580px;
}
button.main-form.left {
  left: 10%;
  top: 580px;
}
button.main-form.final.left {
  top: 140px;
  left: 0px;
}
button.main-form.final {
  top: 140px;
  right: 0px;
}

.form-header {
  color: white;
  background: #54a1d4;
  padding: 10px;
  padding-left: 25px;
}
.form-header-criterio {
  background: #2e348a;
  padding: 10px;
  padding-left: 25px;
  color: white;
}
.form-header.final {
  position: absolute;
  text-align: center;
  top: 370px;
  left: 0;
  right: 0;
  margin: auto;
  width: 500px;
  background: #2e348a;
  padding: 10px;
  color: white;
}
.non-editable {
  display: inline-block;
  padding-bottom: 5px;
  margin-left: 10px;
  width: 165px;
  background: var(--accent);
  color: white;
  border-radius: 3px;
  text-align: center;
}
input {
  width: 165px;
  margin-left: 90px;
}
input[type="radio"] {
  width: 20px;
  height: 20px;
  margin-left: 10px;
}
p {
  display: inline-block;
}
.form-control {
  margin: 25px 15px;
}
.form-control p {
  font-weight: bold;
  margin-left: 10px;
}
.link {
  text-decoration: underline;
  cursor: pointer;
  font-weight: 100 !important;
}
.radio-form {
  display: inline-flex;
  margin-left: 30px;
}
/* for the switch */

.switch {
  position: relative;
  display: inline-block;
  width: 55px;
  height: 25px;
  margin-left: 20px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  top: 2.5px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--secondary-color);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--secondary-color);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.grid {
  position: absolute;
  top: 90px;
  left: 0;
  right: 0;
  width: 500px;
}

.grid.summary {
  top: 420px;
  text-align: left;
}

.grid.summary tr td,
.grid.summary tr th {
  padding-left: 20px !important;
  width: 60%;
}

.grid tr td,
.grid tr th {
  margin-left: 20px;
  padding-left: 20px !important;
  width: 30%;
}

.header-grid tr th {
  padding: 0px !important;
}

tbody tr td {
  height: 50px;
  padding: 0px !important;
}
.back {
  position: absolute;
  top: 110px;
  left: 125px;
  cursor: pointer;
}
</style>