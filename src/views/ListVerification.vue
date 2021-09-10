<template>
  <div>
    <section id="main" :class="{ expand: expand }">
      <grid
        :dataSource="dataSource"
        :columns="columns"
        :config="config"
        :actions="actions"
        :rows="5"
        @movePage="movePage"
        @selectedList="selectedList"
      ></grid>
    </section>
    <button
      class="btn-table"
      @click="goTo('TableUser', { type: 'RiesgoNormativa' })"
    >
      NIVEL DE RIESGO POR NORMATIVA
    </button>
  </div>
</template>

<script lang="ts">
import Grid from "@/components/ui/Grid.vue";
import { defineComponent } from "@vue/runtime-core";
import {
  columnsPlanesTratamientoList,
  columnsRiesgoNormativaList,
  columnsEvaluacionesList,
  columnsVerificacionList,
} from "../common/constants";
import { ITratamiento } from "../interfaces/tratamiento.interface";
import { IDataSource } from "../interfaces/dataSource";
import { emptyDataSource } from "../utils/initializer";
import { actions, BASE_URL, entity } from "@/common/constants";
import moment from "moment";
import { IEvaluacion } from "@/interfaces/evaluacion.interface";
import { IColumnsGrid } from "@/interfaces/grid.interface";
import { DataSourcetratamiento } from "../common/mockdata";
import { DataSourceEvaluaciones } from "../common/mockdata";
import { DataSourceRiesgo } from "../common/mockdata";

export default defineComponent({
  components: {
    Grid,
  },
  data() {
    return {
      columns: {} as any,
      dataSource: emptyDataSource() as IDataSource<any>,
      config: {
        deleteEntity: "",
        entity: entity.USER,
      },
      actions: [] as any,
      page: 1,
      entityList: [] as string[],
    };
  },

  mounted() {
    let type = this.$route.params.type;
    (async () => {
      switch (type) {
        default:
          this.columns = columnsVerificacionList;
          this.actions = [
            {
              icon: "fas fa-eye",
              type: actions.EDIT,
              method: this.editPlanTratamiento,
            },
          ];
        //await this.listPlanTratamiento();
      }
    })();
  },

  methods: {
    editPlanTratamiento(): void {
      console.log("edit plan tratmiento");
    },
  },
});
</script>