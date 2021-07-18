<template>
  <table className="grid">
    <thead className="header-grid">
      <tr>
        <th v-if="actions.length > 0">
          <input type="checkbox" id="checkbox" v-model="massiveCheck" />
        </th>
        <th v-for="column in columns" :key="column.field">
          {{ column.title }}
        </th>
        <th v-if="actions.length > 0">Acciones</th>
      </tr>
    </thead>
    <div v-if="dataSource.length === 0">
      <br />
      <h3>No hay datos registrados</h3>
    </div>

    <tbody>
      <tr v-for="(row, index) in rows" :key="row">
        <td v-if="actions.length > 0">
          <input
            v-if="dataSource[index]"
            type="checkbox"
            :id="dataSource[index].id"
            :value="dataSource[index].id"
            v-model="checkedEntities"
          />
        </td>
        <td v-for="column in columns" :key="column.field">
          {{ getValue(column.field, dataSource, row - 1) }}
        </td>
        <td>
          <span v-for="action in actions" :key="action.type">
            <i
              v-if="dataSource[index]"
              :class="action.icon"
              style="margin-left: 18px;"
              @click="
                action.method(dataSource[index].id, dataSource[index].entity)
              "
            ></i>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { calculateAge } from "../../utils/formater";
import { User } from '../../interfaces/user.interface';

export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    dataSource: {
      type: Array,
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
  },
  emits: ["selectedList"],
  data() {
    return {
      rows: 5,
      massiveCheck: false,
      checkedEntities: [],
    };
  },
  watch: {
    massiveCheck(): void {
      if (this.massiveCheck) {
        this.checkedEntities = this.dataSource.map((data: User) => data.id);
      } else {
        this.checkedEntities = [];
      }
    },
    checkedEntities(): void {
      this.$emit("selectedList", this.checkedEntities);
    },
  },
  methods: {
    getValue(columnField: string, data: any, row: number): any {
      if (data[row]) {
        if (columnField === "fechaNacimiento") {
          return calculateAge(data[row][columnField]);
        }
        return data[row][columnField];
      } else {
        return "";
      }
    },
  },
};
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

.grid {
  font-family: "Reem Kufi", sans-serif;
  margin: 0 auto;
  margin-top: 20px;
  background: white;
  border-radius: 2px;
  border-collapse: collapse; /*delete inner border*/
  box-shadow: 0 0.1px 5px var(--accent);
  width: 90%;
}

/* .header-grid  {
  box-shadow: 0 4px 8px -2px #d8d8d8;
} */

.header-grid tr th {
  padding: 25px 0;
  background-color: #ecf3ff;
}

tbody {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

tbody tr:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

tbody tr td {
  padding: 25px 10px;
}

tbody tr:nth-child(even) {
  background-color: #ecf3ff;
}

td:nth-child(2) {
  padding-left: 0px;
}

h3 {
  position: absolute;
  left: 50%;
  color: #3378ff;
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
</style>