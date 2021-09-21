<template>
  <table class="grid">
    <thead :class="rowHeaderStyle ? `${rowHeaderStyle} header-grid` : 'header-grid'" >
      <tr>
        <th v-if="actions?.length > 0 && actions[0].type == 'delete' && dataSource.listaRecords.length > 0">
          <input type="checkbox" id="checkbox" v-model="massiveCheck" />
          
        </th>
        <th v-for="column in columns" :key="column.field" :style="{ textAlign: column.align ? column.align : 'left' }">
          {{ column.title }}
        </th>
        <th v-if="actions?.length > 0">Acciones</th>
      </tr>
    </thead>
    <div
      v-if="dataSource.listaRecords && dataSource.listaRecords?.length === 0"
    >
      <br />
      <h3 v-if="!rowBodyStyle">No hay datos registrados</h3>
      <p class="no-data" v-else>Sin registros</p>
    </div>

    <tbody :class="rowBodyStyle ? rowBodyStyle : ''">
      <tr v-for="(row, index) in rows" :key="row">
        <td v-if="actions?.length > 0 && actions[0].type == 'delete' && dataSource.listaRecords.length > 0">
          <input
            v-if="dataSource.listaRecords && dataSource.listaRecords[index]"
            type="checkbox"
            :id="dataSource.listaRecords[index].id"
            :value="dataSource.listaRecords[index].id"
            v-model="checkedEntities"
          />
        </td>
        <td v-for="column in columns" :key="column.field">
          <p :style="{ textAlign: column.align ? column.align : 'left' }">
            {{ getValue(column.field, dataSource.listaRecords, row - 1) }}
          </p>
        </td>
        <td v-if="actions?.length > 0">
          <span v-for="action in actions" :key="action.type">
            <i
              v-if="dataSource.listaRecords[index]"
              :class="action.icon"
              style="margin-left: 18px"
              @click="
                action.method(
                  dataSource.listaRecords[index].id,
                  dataSource.listaRecords[index].codigo,
                  dataSource.listaRecords[index].entity
                )
              "
            ></i>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="dataSource.numeroPaginas > 1">
    <div
      v-for="page in dataSource.numeroPaginas"
      :key="page"
      class="pageButton"
      @click="goPage(page)"
    >
      {{ page }}
    </div>
  </div>
</template>

<script lang="ts">
import { calculateAge } from "../../utils/formater";
import { defineComponent } from "@vue/runtime-core";
import DataSource from "../../models/DataSource";
import User from "../../models/User";
import evaluacion from "../../models/Evaluacion";


export default defineComponent({
  props: {
    columns: {
      type: Array,
      required: true,
    },
    dataSource: {
      type: DataSource,
      required: true,
    },
    config: {
      type: null,
      required: false,
    },
    actions: {
      type: null,
      required: false,
      default: [],
    },
    method: {
      type: Function,
      required: false,
    },
    rows: {
      type: Number,
      required: false,
      default: 5,
    },
    pages: {
      type: Number,
      required: true,
    },
    rowHeaderStyle: {
      type: String,
      required: false,
    },
    rowBodyStyle: {
      type: String,
      required: false,
    }
  },
  emits: ["selectedList", "movePage"],
  data() {
    return {
      massiveCheck: false,
      checkedEntities: [] as string[],
    };
  },
  watch: {
    massiveCheck(): void {
      if (this.massiveCheck) {
        this.checkedEntities = (
          this.dataSource as DataSource<any>
        ).listaRecords.map((user) => user.id as string);
      } else {
        this.checkedEntities = [];
      }
    },
    checkedEntities(): void {
      this.$emit("selectedList", this.checkedEntities);
    },
  },
  methods: {
    goPage(pageNumber: number): void {
      this.$emit("movePage", pageNumber);
    },
    getValue(
      columnField: string,
      data: any[],
      row: number
    ): string | number | undefined {
      if (data) {
        if (data[row]) {
          if (columnField === "fechaNacimiento") {
            return calculateAge(data[row][columnField]);
          }
          return data[row][columnField];
        } else {
          return "";
        }
      }
    },
  }
});
</script>

<style scoped>
.action-options {
  display: flex;
  justify-content: space-evenly;
}

.action-options i {
  padding-top: 7px;
  color: red;
}

.thin tr td {
  padding: 5px 5px;
  height: 25px;
  
}

.thin tr th {
  padding: 5px 5px !important;
   height: 45px;
}

h3 {
  position: absolute;
  left: 50%;
  color: #3378ff;
}

.no-data {
  color: #3378ff;
  font-weight: bold;
  position: relative;
  left: 150px;
  font-size: 14px;
  

}

i:hover {
  cursor: pointer;
}

.fas.fa-trash-alt {
  color: red;
}

.fas.fa-edit {
  color: #3378ff;
}

.pageButton {
  display: inline-block;
  background: var(--primary-variant);
  width: 40px;
  height: 40px;
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 20px;
  line-height: 20px;
  color: white;
  font-weight: bold;
  padding-top: 8px;
  border: 2px solid var(--primary-color);
  cursor: pointer;
}

.pageButton:hover {
  opacity: 0.9;
}

input {
  width: 12px;
  height: 12px;
}
</style>