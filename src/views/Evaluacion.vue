<template>
  <nav-bar
    :name="userInfoJson?.nombres"
    :lastName="userInfoJson?.apellidos"
  ></nav-bar>
  <section id="main">
    <h1>Registrar evaluación de obra</h1>
    <button
      :class="$route.params.id ? 'action-button' : 'action-button blocked'"
      :disabled="!$route.params.id"
      @click="submit"
    >
      {{ !evaluacion.visibilidad ? "Guardar" : "Editar" }}
    </button>
    <div class="flex-row">
      <div class="flex-col">
        <div class="">
          <h3>Códidgo de evaluación</h3>
          <img src="../assets/images/llave.png" alt="codeva" class="imgIcon" />
          <div class="non-editable">{{ evaluacion.codigo }}</div>
        </div>
        <div>
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
            class="dropdownSelect"
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
              <span style="font-weight: bold">requerimientos: </span
              >{{ selectedListaVerificacion.requerimientosCount }}
            </p>
            <br />
          </div>
        </div>
        <div>
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
            class="dropdownSelect"
            v-for="obra in obras"
            :key="obra.obraId"
            @click="SelectObra(obra)"
          >
            {{ obra.codigo + "-" + obra.nombre }}
          </p>
        </div>
        <div>
          <h3>Nombre</h3>
          <img
            src="../assets/images/carduser.png"
            alt="nombre"
            class="imgIcon"
          />
          <input
            type="text"
            :placeholder="evaluacion.nombre"
            v-model.trim="evaluacion.nombre"
          />
        </div>
        <div>
          <h3>Fecha de creación</h3>
          <img src="../assets/images/date.png" alt="fecha" class="imgIcon" />
          <div class="non-editable">{{ evaluacion.fechaCreacion }}</div>
        </div>
      </div>
      <div class="flex-col">
        <div>
          <h3>Estado</h3>
          <img src="../assets/images/check.png" alt="estado" class="imgIcon" />
          <div class="non-editable">{{ evaluacion.estado }}</div>
        </div>
        <div>
          <img src="../assets/images/prueba.png" alt="prueba" class="imgIcon" />
          <button
            class="link"
            @click="startQuiz()"
            :disabled="
              (!selectedObra.obraId ||
                !selectedListaVerificacion.listaVerificacionId) &&
              !$route.params.id
            "
          >
            Realizar prueba
          </button>
          <grid
            :dataSource="pruebas"
            :columns="columns"
            :config="config"
            :actions="actions"
            :rows="rows"
            :rowHeaderStyle="'thin'"
            :rowBodyStyle="'thin'"
            @movePage="() => {}"
            @selectedList="() => {}"
          ></grid>
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
import { columnsPruebaLista, entity, urlConstants } from "../common/constants";
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
import { uuidv4 } from "../utils/guid";

export default defineComponent({
  components: {
    NavBar,
    Grid,
  },
  computed: {
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
      userInfoJson: emptyUser() as IUser,
      pruebas: fechaCreacionPruebaVacia as IDataSource<{
        id: number;
        fechaCreacion: string;
      }>,
      columns: columnsPruebaLista,
      config: {
        deleteEntity: "",
        entity: entity.PRUEBA,
      },
      actions: [],
      rows: 1,
      codigoListaVerificacion: "",
      codigoObra: "",
      obras: [] as IObra[],
      listasVerificacion: [] as IListaVerificacion[],
      timeout: undefined as number | undefined,
    };
  },
  methods: {
    searchObra() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/obras/lista?filter=${this.codigoObra}`,
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
          `http://localhost:5000/api/listaverificaciones/lista?filter=${this.codigoListaVerificacion}`,
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
        ListaVerificacionId:
          this.selectedListaVerificacion.listaVerificacionId,
      }

      // Guardar evaluacion
      
      try {
            await fetch(
              `http://localhost:5000/api/evaluacion`,
              {
                method: "POST",
                headers: new Headers({
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                }),
                body: JSON.stringify(body)
              }
            );
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
      if (this.evaluacion.visibilidad) {
        (async () => {
          const body: Partial<IEvaluacion> = {
            nombre: this.evaluacion.nombre,
          };

          try {
            await fetch(
              `http://localhost:5000/api/evaluacion/${this.evaluacion.evaluacionId}`,
              {
                method: "PUT",
                headers: new Headers({
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                }),
                body: JSON.stringify(body)
              }
            );
          } catch (err) {
            console.log(err);
          }

          this.$router.push("/dashboard");
        })();
      } else {
        (async () => {
          try {
            await fetch(
              `http://localhost:5000/api/evaluacion/activar/${this.evaluacion.evaluacionId}`,
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
      }
    },
  },
  mounted() {
    (async () => {
      this.userInfoJson = await getUsuario();

      if (!this.$route.params.id) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/evaluacion/count",
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

          this.$store.dispatch("evaluacionModule/guardarEvaluacion", {
            ...this.evaluacion,
            codigo: "EV" + zeros + (number + 1).toString(),
            fechaCreacion: new Date().toLocaleDateString(),
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          const response = await fetch(
            `http://localhost:5000/api/evaluacion/${this.$route.params.id}`,
            {
              method: "GET",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            }
          );

          const evaluacionDetalle =
            (await response.json()) as IEvaluacionDetalle;

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
          this.selectedListaVerificacion.listaVerificacionId = evaluacionDetalle.listaVerificacionId;
          this.selectedObra.obraId = evaluacionDetalle.obraId;

          evaluacionDetalle.pruebaList.forEach((prueba, index) => {
            this.pruebas.listaRecords.push({
              id: index + 1,
              fechaCreacion: new Date(
                prueba.fechaCreacion
              ).toLocaleDateString(),
            });
          });

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
      }
    })();
  },
});
</script>

<style scoped>
.imgIcon {
  margin-top: 15px;
  width: 30px;
  height: 30px;
}
.non-editable {
  margin-top: -34px;
  margin-left: 41px;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 165px;
  background: var(--accent);
  color: white;
  font-weight: bold;
  border-radius: 3px;
  text-align: center;
}
.link {
  margin-top: -30px;
  margin-left: 41px;
  text-decoration: underline;
  cursor: pointer;
  background: white;
}
input {
  display: block;
  margin-top: -34px;
  margin-left: 41px;
  width: 165px;
  height: 30px;
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
.action-button.blocked {
  background: var(--accent);
  cursor: auto;
}
#main {
  text-align: left;
  margin-left: 100px;
}
.dropdownSelect {
  position: absolute;
  left: 141px;
  background-color: #f6f6f6;
  padding: 12px 16px;
  width: 252px;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
  cursor: pointer;
}
.dropdownSelect:hover {
  background-color: #ddd;
}
</style>
