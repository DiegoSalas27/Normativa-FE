<template>
  <section id="main">
    <h1>PANEL PRINCIPAL</h1>

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
          <p>RESULTADOS DE EVALUACIONES</p>
          <div ref="barChart" id="chart"></div>
        </div>
        <div class="card statanalista">
          <p>PLANES DE TRATAMIENTO</p>
          <div ref="pieChart" id="chart"></div>
        </div>
      </div>
    </div>

    <div v-show="userInfoJson?.rol === 'Jefe de riesgos'">
      <div class="flex-col">
        <div class="flex-row">
          <div>
            <button class="action-button" @click="generarPlan">
              Generar Plan
            </button>
            <div class="card stat donut">
              <div><strong>PORCENTAJE DE CUMPLIMIENTO</strong></div>
              <div ref="semiDonut" id="chart"></div>
            </div>
          </div>

          <div>
            <button class="action-button">Visualizar informes</button>
            <div class="card stat donut" style="height: 218.5px">
              <div><strong>EVALUACIONES REALIZADAS</strong></div>
              <br />
              <h1 style="fontsize: 45px">{{ numberEvaluaciones }}</h1>
            </div>
          </div>
        </div>

        <br />
        <div class="card stat restulado-eva">
          <p><strong> PLANES DE TRATAMIENTO</strong></p>
          <div ref="stackedBar" id="chart"></div>
        </div>
        <br />
        <div class="card stat restulado-eva">
          <p><strong>RESULTADOS DE EVALUACIONES</strong></p>
          <div ref="barChartJefe" id="chart"></div>
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
              <button class="btn-table" @click="goTo('TableUser', { type: 'Evaluacion' })">EVALUACIONES REALIZADAS</button>
              <p style="font-size: 35px; font-weight: bold">
                {{ numberEvaluaciones }}
              </p>
            </div>
            <div class="mycard mydonut">
              <div><strong>PORCENTAJE DE CUMPLIMIENTO</strong></div>
              <div class="donut-container" ref="semiDonut" id="chart"></div>
            </div>
          </div>
          <div class="col">
            <div class="mycard pie">
              <div style="margin-bottom: 10px">
                <strong>PORCENTAJE DE CUMPLIMIENTO POR OBRAS</strong> 
              </div>
              <div ref="treeMapChart" id="chart"></div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="mycard line">
              <button class="btn-table" @click="goTo('TableUser', { type: 'RiesgoNormativa' })">NIVEL DE RIESGO POR NORMATIVA</button>
              <div ref="lineChart" id="chart"></div>
            </div>
          </div>
          <div class="col">
            <div class="mycard pie">
              <button class="btn-table" @click="goTo('TableUser', { type: 'PlanesTratamiento' })">PLANES DE TRATAMIENTO</button>
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
  urlConstants,
} from "../common/constants";
import {
  configureBarChartOptions,
  configurePieChartOptions,
  configurePieChartOptions2,
  configureSemiDonutOptions,
  configureStackBarChartOptions,
  configureLineChartOptions,
  configureTreeMapChartOptions,
} from "../common/graphics";
import {
  lineChartSeries,
  treeMapChartSeries,
  pieChartLabels,
  pieChartSeries,
  pieChartLabels2,
  pieChartSeries2,
  semiDonutSeries,
  series,
  stackedBarSeries,
  xAxisCategories,
  xAxisCategoriesStacked,
} from "../common/mockdata";
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
    goTo(url: string, params: any ): void {
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

      const optionsbarChart = configureBarChartOptions(
        series,
        300,
        "datetime",
        xAxisCategories,
        true,
        false,
        "right",
        40
      );

      const optionsPieChart = configurePieChartOptions(
        pieChartSeries,
        "70%",
        pieChartLabels
      );

      const optionsPieChart2 = configurePieChartOptions2(
        pieChartSeries2,
        "70%",
        pieChartLabels2
      );
            

      const optionsLineChart = configureLineChartOptions(lineChartSeries);
      const optionsTreeMapChart = configureTreeMapChartOptions(treeMapChartSeries);

      const optionsStackedBar = configureStackBarChartOptions(
        stackedBarSeries,
        350,
        xAxisCategoriesStacked
      );

      const optionsSemiDonut = configureSemiDonutOptions(semiDonutSeries, 50);

      if (this.$refs.barChart) {
        const barChart = new ApexCharts(this.$refs.barChart, optionsbarChart);
        barChart.render();
      }

      if (this.$refs.barChartJefe) {
        const barChart = new ApexCharts(
          this.$refs.barChartJefe,
          optionsbarChart
        );
        barChart.render();
      }

      if (this.$refs.pieChart) {
        const pieChart = new ApexCharts(this.$refs.pieChart, optionsPieChart);
        pieChart.render();
      }

      if (this.$refs.pieChart) {
        const pieChart2 = new ApexCharts(this.$refs.pieChart2, optionsPieChart2);
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

      if (this.$refs.semiDonut) {
        const semiDonut = new ApexCharts(
          this.$refs.semiDonut,
          optionsSemiDonut
        );
        semiDonut.render();
      }

      if (this.$refs.stackedBar) {
        const stackedBar = new ApexCharts(
          this.$refs.stackedBar,
          optionsStackedBar
        );
        stackedBar.render();
      }

      if (this.userInfoJson.rol === "Jefe de riesgos") {
        try {
          const response = await fetch(`${BASE_URL}evaluacion/count`, {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          });

          this.numberEvaluaciones = await response.json();
        } catch (err) {
          console.log(err);
        }
      }



    })();
  },
});
</script>

<style scoped>
h1 {
  font-weight: bold;
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
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  justify-content: center;
}

.gridEspecialista {
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
  cursor: pointer;
  border: 1px solid var(--placeholder);
  border-radius: 12px;
  width: 100px;
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
  min-width: 250px;
}

.restulado-eva {
  min-width: 450px !important;
  width: 81% !important;
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
</style>