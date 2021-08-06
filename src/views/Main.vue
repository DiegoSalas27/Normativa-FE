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
          class="card"
        >
          <img :src="rol_action.src" :alt="rol_action.src" class="image" />
          <p>{{ rol_action.description }}</p>
        </div>
      </div>

      <div class="gridCards stats">
        <div class="card stat">
          <p>RESULTEADOS DE EVALUACIONES</p>
          <div ref="barChart" id="chart"></div>
        </div>
        <div class="card stat">
          <p>PLANES DE TRATAMIENTO</p>
          <div ref="pieChart" id="chart"></div>
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
  rol,
  urlConstants,
} from "../common/constants";
import {
  configureBarChartOptions,
  configurePieChartOptions,
} from "../common/graphics";
import {
  pieChartLabels,
  pieChartSeries,
  series,
  xAxisCategories,
} from "../common/mockdata";
import { IUser } from "../interfaces/user.interface";
import { getUsuario } from "../services/authService";
import { emptyUser } from "../utils/initializer";

export default defineComponent({
  data() {
    return {
      rolUserActions: [] as any,
      userInfoJson: emptyUser() as IUser,
    };
  },
  methods: {
    goToList(url: string): void {
      this.$router.push({ name: url });
    },
    calculateDashBoard() {
      switch (this.userInfoJson.rol) {
        case rol.ADMINISTRADOR:
          this.rolUserActions = AdminUserActions;
          break;
        case rol.ANALISTA:
          this.rolUserActions = AnalistaUserActions;
          break;
        // case  rol.JEFE_DE_RIESGOS: 
        //   this.rolUserActions = JefeRiesgosUserActions; break;
        // case  rol.ALTA_GERENCIA: this.rolUserActions = AdminUserActions; break;
      }
    },
  },
  mounted() {
    (async () => {
      try {
        this.userInfoJson = await getUsuario();
        console.log(this.userInfoJson)
        this.calculateDashBoard();
      } catch (err) {
        console.log(err);
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

      if (this.$refs.barChart) {
        const barChart = new ApexCharts(this.$refs.barChart, optionsbarChart);
        barChart.render();
      }
      if (this.$refs.pieChart) {
        const pieChart = new ApexCharts(this.$refs.pieChart, optionsPieChart);
        pieChart.render();
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
  max-width: 1200px;
  display: grid;
  gap: 100px;
  justify-content: left;
}

.gridCards.adminGrid {
  grid-template-columns: repeat(auto-fill, minmax(42%, 1fr));
  justify-content: center;
}

.gridCards.stats {
  position: absolute;
  top: 18%;
  right: 40px;
}

.gridCards p {
  font-weight: bold;
}

.image {
  width: 100px;
  height: 100px;
}

.card {
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
  min-width: 750px;
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
</style>