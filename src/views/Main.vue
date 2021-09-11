<template>
  <section>
    <section id="main">
      <h1 style="font-weight: 900; font-size: xx-large">PANEL PRINCIPAL</h1>
      <div v-if="userInfoJson?.rol === 'Administrador'">
        <div class="gridCards adminGrid">
          <div
            v-for="rol_action in rolUserActions"
            :key="rol_action.description"
            @click="goToList(rol_action.url)"
            class="card"
          >
            <img :src="rol_action.src" :alt="rol_action.src" class="image" />
            <p>{{ rol_action.description }}</p>
          </div>
        </div>
      </div>

      <div v-show="userInfoJson?.rol === 'Analistas'">
        <div class="gridCards">
          <div
            v-for="rol_action in rolUserActions"
            :key="rol_action.description"
            @click="goToList(rol_action.url)"
            class="cardanalista"
          >
            <img :src="rol_action.src" :alt="rol_action.src" class="image" />
            <p>{{ rol_action.description }}</p>
          </div>
        </div>

        <div class="gridCards stats">
          <div class="card statanalista">
            <button
              class="btn-table"
              @click="goTo('TableUser', { type: 'RiesgoNormativa' })"
            >
              RESULTADOS DE EVALUACIONES
            </button>
            <div ref="barChart" id="chart"></div>
          </div>
          <div class="card statanalista">
            <button
              class="btn-table"
              @click="goTo('TableUser', { type: 'PlanesTratamiento' })"
            >
              PLANES DE TRATAMIENTO
            </button>
            <div ref="pieChart" id="chart"></div>
          </div>
        </div>
      </div>

      <div v-show="userInfoJson?.rol === 'Jefe de riesgos'">
        <div class="flex-col" style="margin: 0 2vw">
          <div class="flex-row" style="justify-content: space-between">
            <div>
              <div class="card stat donut" style="height: 218.5px">
                <div><strong>PORCENTAJE DE CUMPLIMIENTO</strong></div>
                <div ref="gauge" id="chart"></div>
              </div>
            </div>

            <div style="padding: 30px">
              <button class="action-button" @click="generarPlan">
                Generar Plan
              </button>
              <br />
              <br />
              <img
                src="@/assets/images/Icon_GeneraPlan_Jefe.png"
                alt="Generar Plan Icono"
                width="130"
                height="130"
              />
            </div>

            <div>
              <div class="card stat donut" style="height: 218.5px">
                <div><strong>EVALUACIONES REALIZADAS</strong></div>
                <br />
                <h1 style="fontsize: 45px">{{ numberEvaluaciones }}</h1>
              </div>
            </div>
          </div>

          <div class="flex-row" style="justify-content: space-between">
            <div class="card stat restulado-eva">
              <button
                class="btn-table"
                @click="goTo('TableUser', { type: 'PlanesTratamiento' })"
              >
                PLANES DE TRATAMIENTO
              </button>
              <div ref="stackedBar" id="chart"></div>
            </div>
          </div>

          <div class="flex-row" style="justify-content: space-between">
            <div class="card stat restulado-eva">
              <button
                class="btn-table"
                @click="goTo('TableUser', { type: 'RiesgoNormativa' })"
              >
                RESULTADOS DE EVALUACIONES
              </button>
              <div ref="barChartJefe" id="chart"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="userInfoJson?.rol === 'Alta gerencia'">
        <div class="container">
          <!-- TODO: Mycard -->
          <div class="row">
            <div class="col">
              <div class="mycard count">
                <div style="margin-bottom: 10px"></div>
                <button
                  class="btn-table"
                  @click="goTo('TableUser', { type: 'Evaluacion' })"
                >
                  EVALUACIONES REALIZADAS
                </button>
                <p style="font-size: 35px; font-weight: bold">
                  {{ numberEvaluaciones }}
                </p>
              </div>
              <div class="mycard mydonut" style="height: 350px">
                <div><strong>PORCENTAJE DE CUMPLIMIENTO</strong></div>
                <div ref="gauge2" id="chart"></div>
              </div>
            </div>

            <div class="col">
              <div class="mycard pie">
                <div style="margin-bottom: 10px">
                  <strong>PORCENTAJE DE CUMPLIMIENTO POR OBRAS</strong>
                </div>
                <div ref="StackedBarPrueba" id="chart"></div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <div class="mycard line">
                <button
                  class="btn-table"
                  @click="goTo('TableUser', { type: 'RiesgoNormativa' })"
                >
                  NIVEL DE RIESGO POR NORMATIVA
                </button>
                <div ref="lineChart" id="chart"></div>
              </div>
            </div>

            <div class="col">
              <div class="mycard pie">
                <button
                  class="btn-table"
                  @click="goTo('TableUser', { type: 'PlanesTratamiento' })"
                >
                  PLANES DE TRATAMIENTO
                </button>
                <!-- <i @click="goToList('PlanesTratamiento')">icon</i> -->
                <div ref="pieChart2" id="chart"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="userInfoJson?.rol === 'Especialistas'">
        <div class="gridCards especialistaGrid">
          <div
            v-for="rol_action in rolUserActions"
            :key="rol_action.description"
            @click="goToList(rol_action.url)"
            class="gridEspecialista"
          >
            <img :src="rol_action.src" :alt="rol_action.src" class="image" />
            <p>{{ rol_action.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ApexCharts from "apexcharts";
import {
  AdminUserActions,
  AnalistaUserActions,
  BASE_URL,
  EspecialistaUserActions,
  rol,
} from "../common/constants";
import {
  configureBarChartOptions,
  configureGaugeOptions,
  configureLineChartOptions,
  configurePieChartOptions,
  configureGaugeOptions2,
  configureBarListOptions,
  configurePieChartOptions2,
  configureStackBarChartOptions,
  configureTreeMapChartOptions,
} from "../common/graphics";
import {
  lineChartSeries,
  pieChartLabels2,
  pieChartSeries2,
  treeMapChartSeries,
} from "../common/mockdata";
import { handleErrors } from "../common/utils";
import {
  IStatisticsEvaluacionCumplimiento,
  IStatisticsEvaluacionResult,
  IStatisticsEvaluacionCumplimientoPrueba,
  IStatisticsEvaluacionCumplimientoPruebaLista,
} from "../interfaces/evaluacion.interface";
import {
  IStatisticsTratamientoResultAnalistasDto,
  IStatisticsTratamientoResultDto,
  IStatisticsTratamientoResultListaDto,
} from "../interfaces/tratamiento.interface";
import { IUser } from "../interfaces/user.interface";
import { getUsuario } from "../services/authService";
import { emptyUser } from "../utils/initializer";

export default defineComponent({
  data() {
    return {
      rolUserActions: [] as any,
      userInfoJson: emptyUser() as IUser,
      numberEvaluaciones: 3000,
    };
  },
  methods: {
    goToList(url: string): void {
      this.$router.push({ name: url });
    },
    goTo(url: string, params: any): void {
      this.$router.push({ name: url, params: params });
    },
    calculateDashBoard() {
      switch (this.userInfoJson.rol) {
        case rol.ADMINISTRADOR:
          this.rolUserActions = AdminUserActions;
          break;
        case rol.ANALISTA:
          this.rolUserActions = AnalistaUserActions;
          break;
        case rol.ESPECIALISTA:
          this.rolUserActions = EspecialistaUserActions;
        // case  rol.ALTA_GERENCIA: this.rolUserActions = AdminUserActions; break;
      }
    },
    generarPlan() {
      this.$router.push("/plan-tratamiento");
    },
    async devolerResultadosEvaluaciones(): Promise<
      IStatisticsEvaluacionResult | undefined
    > {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/statistics/resultados?userId=${this.userInfoJson.id}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        await handleErrors(response);
        return (await response.json()) as IStatisticsEvaluacionResult;
      } catch (err) {
        console.log(err);
      }
    },
    async devolverResultadosTratamientos(): Promise<
      IStatisticsTratamientoResultDto | undefined
    > {
      try {
        const response = await fetch(
          `${BASE_URL}plantratamiento/statistics/resultados?userId=${this.userInfoJson.id}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        await handleErrors(response);
        return (await response.json()) as IStatisticsTratamientoResultDto;
      } catch (err) {
        console.log(err);
      }
    },

    async devolverResultadosTratamientosLista(): Promise<
      IStatisticsTratamientoResultListaDto | undefined
    > {
      try {
        const response = await fetch(
          `${BASE_URL}plantratamiento/statistics/resultadoslista`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        await handleErrors(response);
        return (await response.json()) as IStatisticsTratamientoResultListaDto;
      } catch (err) {
        console.log(err);
      }
    },

    async devolverCumplimientoEvaluaciones(): Promise<
      IStatisticsEvaluacionCumplimiento | undefined
    > {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/statistics/cumplimiento`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        await handleErrors(response);
        return (await response.json()) as IStatisticsEvaluacionCumplimiento;
      } catch (err) {
        console.log(err);
      }
    },

    async devolverCumplimientoEvaluacionesPruebas(): Promise<
      IStatisticsEvaluacionCumplimientoPrueba | undefined
    > {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/statistics/cumplimientoprueba`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        await handleErrors(response);
        return (await response.json()) as IStatisticsEvaluacionCumplimientoPrueba;
      } catch (err) {
        console.log(err);
      }
    },

    async devolverCumplimientoEvaluacionesPruebasLista(): Promise<
      IStatisticsEvaluacionCumplimientoPruebaLista | undefined
    > {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/statistics/cumplimientopruebalista`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        await handleErrors(response);
        return (await response.json()) as IStatisticsEvaluacionCumplimientoPruebaLista;
      } catch (err) {
        console.log(err);
      }
    },

    async devolverPlanesTratamientoPorAnalista(): Promise<
      IStatisticsTratamientoResultAnalistasDto | undefined
    > {
      try {
        const response = await fetch(
          `${BASE_URL}plantratamiento/statistics/resultados/analistas`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        await handleErrors(response);
        return (await response.json()) as IStatisticsTratamientoResultAnalistasDto;
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    (async () => {
      try {
        this.userInfoJson = await getUsuario();
        console.log(this.userInfoJson);
        this.calculateDashBoard();
      } catch (err) {
        console.log(err);
        //console.log("Impresion del rol sin api" + this.userInfoJson.rol);
        //this.rolUserActions = EspecialistaUserActions;
      }

      // Esto pertenece al analista

      const { series, xAxisCategories } =
        (await this.devolerResultadosEvaluaciones()) as IStatisticsEvaluacionResult; // para analista y jefe de riesgos
      const { pieChartSeries, pieChartLabels } =
        (await this.devolverResultadosTratamientos()) as IStatisticsTratamientoResultDto;

      const optionsbarChart = configureBarChartOptions(
        series,
        300,
        "category",
        xAxisCategories,
        true,
        false,
        "right",
        40
      );

      if (this.$refs.barChart) {
        const barChart = new ApexCharts(this.$refs.barChart, optionsbarChart);
        barChart.render();
      }

      const optionsPieChart = configurePieChartOptions(
        pieChartSeries,
        "70%",
        pieChartLabels
      );

      if (this.$refs.pieChart) {
        const pieChart = new ApexCharts(this.$refs.pieChart, optionsPieChart);
        pieChart.render();
      }

      // Hasta aca es lo que le pertenece al analista

      // Esto pertenece al jefe de riesgos

      const { gaugeSeries } =
        (await this.devolverCumplimientoEvaluaciones()) as IStatisticsEvaluacionCumplimiento;
      const { stackedBarSeries, xAxisCategoriesStacked } =
        (await this.devolverPlanesTratamientoPorAnalista()) as IStatisticsTratamientoResultAnalistasDto;

      const optionsGauge = configureGaugeOptions(gaugeSeries);

      if (this.$refs.gauge) {
        const gauge = new ApexCharts(this.$refs.gauge, optionsGauge);
        gauge.render();
      }

      const optionsStackedBar = configureStackBarChartOptions(
        stackedBarSeries,
        350,
        xAxisCategoriesStacked
      );

      if (this.$refs.stackedBar) {
        const stackedBar = new ApexCharts(
          this.$refs.stackedBar,
          optionsStackedBar
        );
        stackedBar.render();
      }

      // Hasta aca es lo que le pertenece al jefe de riesgos

      //esto le pertence a alta gerencia

      const { gaugeSeries2 } =
        (await this.devolverCumplimientoEvaluacionesPruebas()) as IStatisticsEvaluacionCumplimientoPrueba;
      const optionsSemiDonut = configureGaugeOptions2(gaugeSeries2);

      if (this.$refs.gauge2) {
        const gauge2 = new ApexCharts(this.$refs.gauge2, optionsSemiDonut);
        gauge2.render();
      }

      const { pieChartSeriesLista, pieChartLabelsLista } =
        (await this.devolverResultadosTratamientosLista()) as IStatisticsTratamientoResultListaDto;

      const { stackedBarSeriesPrueba, xAxisPruebaStacked } =
        (await this.devolverCumplimientoEvaluacionesPruebasLista()) as IStatisticsEvaluacionCumplimientoPruebaLista;

      const optionsStackedBarPrueba = configureBarListOptions(
        stackedBarSeriesPrueba,
        xAxisPruebaStacked
      );

      const optionsPieChart2 = configurePieChartOptions2(
        pieChartSeriesLista,
        "70%",
        pieChartLabelsLista
      );

      const optionsLineChart = configureLineChartOptions(lineChartSeries);
      const optionsTreeMapChart =
        configureTreeMapChartOptions(treeMapChartSeries);

      if (this.$refs.StackedBarPrueba) {
        const StackedBarPrueba = new ApexCharts(
          this.$refs.StackedBarPrueba,
          optionsStackedBarPrueba
        );
        StackedBarPrueba.render();
      }

      if (this.$refs.barChartJefe) {
        const barChart = new ApexCharts(
          this.$refs.barChartJefe,
          optionsbarChart
        );
        barChart.render();
      }

      if (this.$refs.pieChart) {
        const pieChart2 = new ApexCharts(
          this.$refs.pieChart2,
          optionsPieChart2
        );
        pieChart2.render();
      }

      if (this.$refs.lineChart) {
        const lineChart = new ApexCharts(
          this.$refs.lineChart,
          optionsLineChart
        );
        lineChart.render();
      }

      if (this.$refs.treeMapChart) {
        const treeMapChart = new ApexCharts(
          this.$refs.treeMapChart,
          optionsTreeMapChart
        );
        treeMapChart.render();
      }

      //hasta aca le pertenece alta gerencia

      if (
        this.userInfoJson.rol === "Jefe de riesgos" ||
        this.userInfoJson.rol === "Alta gerencia"
      ) {
        try {
          const response = await fetch(
            `${BASE_URL}evaluacion/count?visible=true`,
            {
              method: "GET",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            }
          );

          this.numberEvaluaciones = await response.json();
        } catch (err) {
          console.log(err);
        }
      }
    })();
  },
});
</script>

<style>
body {
  background-color: #d2d2d2;
}

h1 {
  font-weight: 900;
  font-size: xx-large;
}

.gridCards {
  margin: 60px auto;
  max-width: 1000px;
  display: grid;
  gap: 100px;
  justify-content: left;
}

.gridCards.adminGrid {
  grid-template-columns: repeat(auto-fill, minmax(42%, 1fr));
  justify-content: center;
}

.gridCards.especialistaGrid {
  grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
  justify-content: center;
}

.gridEspecialista {
  background-color: ghostwhite;
  cursor: pointer;
  border: 1px solid var(--placeholder);
  border-radius: 12px;
  width: 200px;
  margin: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--box-shadow);
  transition: all 0.2s linear;
}

.gridCards.stats {
  position: absolute;
  top: 18%;
  right: 40px;
}

.gridCards p {
  font-weight: bold;
}

.flex-row {
  margin-top: 65px;
  justify-content: space-around;
}

.action-button {
  width: 200px;
  padding-left: 2px;
  padding-right: 2px;
}

.image {
  width: 100px;
  height: 100px;
}

.card {
  background-color: ghostwhite;
  cursor: pointer;
  border: 1px solid var(--placeholder);
  border-radius: 12px;
  width: 200px;
  margin: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--box-shadow);
  transition: all 0.2s linear;
}

.cardanalista {
  cursor: pointer;
  border: 1px solid var(--placeholder);
  border-radius: 12px;
  width: 200px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 2px 8px var(--box-shadow);
  transition: all 0.2s linear;
}

.card.stat {
  min-width: 250px;
}

.card.statanalista {
  min-width: 750px;
}

.card.stat.donut {
  margin-top: 20px;
  min-width: 345px;
}

.restulado-eva {
  box-sizing: border-box;
  background: ghostwhite;
  font-style: normal;
  font-weight: 100;
  font-family: system-ui;
  min-width: 450px !important;
  width: 100% !important;
}

.card:hover {
  background: var(--secondary-color);
  /* opacity: 90%; */
}
.card.stat:hover {
  background: none;
}
#chart {
  margin: 35px auto;
  display: flex;
  justify-content: center;
}
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.col {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px;
}
.mycard {
  width: 85%;
  height: 200px;
  margin: 10px;
  padding: 10px;

  cursor: pointer;
  border: 1px solid var(--placeholder);
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--box-shadow);
  transition: all 0.2s linear;
}
.mydonut {
  height: 280px;
}
.donut-container {
  width: 400px;
}
.count {
  height: 100px;
}
.pie {
  height: 420px;
}
.line {
  height: 420px;
}

.btn-table {
  margin-top: 10px;
  padding: 5px 60px;
  border-radius: 10px;
  font-weight: bold;
}
.btn-table:hover {
  color: #fff;
}
.fondou {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -3;
  background-color: #d2d2d2;
  /* background-image: url("../assets/images/blanquito.jpg"); */
  height: 100%;

  background-repeat: no-repeat;
  background-size: cover;
}
</style>