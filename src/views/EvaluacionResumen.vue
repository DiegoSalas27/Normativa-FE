<template>
<nav-bar :name="userInfoJson?.nombres" :lastName="userInfoJson?.apellidos"></nav-bar>
<div v-if="listo" class="resumenE">

    <div class="containerizq">
    <h1>Resultados del Quiz</h1>
        <div class="col">
            <table class="grid">
                <thead class="header-grid">
                    <tr>
                        <th>Criterio</th>

                        <th>Puntaje</th>
                        <th>Porcentaje de cumplimiento</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in pruebaResultados.criteriosResultado
                  .length" :key="row">
                        <td>
                            {{
                    pruebaResultados.criteriosResultado[index].descripcion +
                    " (" +
                    pruebaResultados.criteriosResultado[index].peso +
                    ") "
                  }}
                        </td>
                        <td>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            {{
                    pruebaResultados.criteriosResultado[index].normalizedPuntaje
                  }}
                        </td>
                        <td>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            {{
                    pruebaResultados.criteriosResultado[index]
                      .porcentajeCumplimiento + "%"
                  }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col">
            <div class="containerder">
                <h3 class="form-header final resultados">Resultados finales</h3>

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
                    <button class="action-button main-form left final" @click="returnToEval">
                        Regresar
                    </button>
                    <button class="action-button main-form final" @click="showSummary">
                        Visualizar resumen
                    </button>
                </table>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import NavBar from "@/components/layout/NavBar.vue";
import {
    defineComponent
} from "@vue/runtime-core";
import {
    IUser
} from "../interfaces/user.interface";

import {
    BASE_URL
} from "../common/constants";

import {
    handleErrors
} from "../common/utils";
import {
    getUsuario
} from "@/services/authService";
import {
    IListaVerificacion
} from "../interfaces/listaVerificacion.interface";
import {
    IPrueba,
    IPruebaResultados
} from "../interfaces/prueba.interface";
import {
    emptyUser,
} from "../utils/initializer";
import {
    IEvaluacion,
    IEvaluacionDetalle,
} from "../interfaces/evaluacion.interface";
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
        evaluacion(): IEvaluacion {
            return this.$store.getters["evaluacionModule/obtenerEvaluacion"];
        },
        prueba(): IPrueba {
            return this.$store.getters["pruebaModule/obtenerPrueba"];
        },
    },
    data() {
        return {
            userInfoJson: emptyUser() as IUser,
            obraId: "",
            evaluacionDetalle: {} as Partial < IEvaluacionDetalle > ,
            error: false,
            pruebaResultados: {} as IPruebaResultados,
            listo: false,
        };
    },
    methods: {
        showSummary(): void {
            this.$router.push(
                `/lista-verificacion/${this.selectedListaVerificacion.codigo}/prueba/${this.$route.params.pr_codigo}/resumen`
            );
        },
        returnToEval(): void {
            this.$router.replace("/evaluacion/" + this.$route.params.ev_codigo);
        },
        async obtenerPruebaResults(): Promise < void > {
            try {
                const response = await fetch(
                    `${BASE_URL}prueba/${this.prueba.codigo}`, {
                        method: "GET",
                        headers: new Headers({
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + localStorage.getItem("token"),
                        }),
                    }
                );
                await handleErrors(response);
                this.pruebaResultados = await response.json();
            } catch (error) {
                this.error = true;
                const errorObj = JSON.parse(error.message);
                // this.validationForm.email = errorObj.errores.mensaje;
            }
        },
    },
    mounted() {
        (async () => {
            this.userInfoJson = await getUsuario();
            try {
                const response = await fetch(
                    `${BASE_URL}evaluacion/${this.$route.params.ev_codigo}`, {
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
            this.$store.dispatch("pruebaModule/guardarPrueba", {
                ...this.prueba,
                codigo: this.$route.params.pr_codigo,
            });
            await this.obtenerPruebaResults();
            this.listo = true;
        })();
    },

});
</script>

<style scoped>
.resumenE {
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

.containerizq {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 150px;
    padding: 0px;
}

.col {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0px;
}

.grid {
  position: relative;
  top: 0px;
  left: 0;
  right: 0;
  width: 500px;
}
.grid.summary {
  top: 0px;
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
  width: 33%;
}
.header-grid tr th {
  padding: 0px !important;
}
tbody tr td {
  height: 50px;
  padding: 0px !important;
}

.form-header {
  color: white;
  background: #54a1d4;
  padding: 10px;
  padding-left: 25px;
}
.form-header.final {
  position: relative;
  text-align: center;
  top: 230px;
  left: 0;
  right: 0;
  margin: auto;
  width: 500px;
  background: #2e348a;
  padding: 10px;
  color: white;
}

.form-header.final.resultados {
  position: relative;
  text-align: center;
  top: 0px;
  left: 0;
  right: 0;
  margin: auto;
  width: 500px;
  background: #2e348a;
  padding: 10px;
  color: white;
}
h1 {
  position: absolute;
  top: 100px;
  right: 50%;
  font-weight: bold;
  font-size: 30px;
}
.containerder {
  width: 250%;
  display: flex;
  flex-direction: column;
  margin-top: -220px;
}
button {
  position: absolute;
  top: 370px;
  right: 10%;
  padding: 10px;
}
p {
  display: inline-block;
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
</style>
