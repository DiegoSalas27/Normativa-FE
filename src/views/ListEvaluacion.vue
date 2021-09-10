<template>
  <confirmation-modal
    :error="null"
    :show="showModalConfirmation"
    :title="modalTitle"
    :massiveDelete="massiveDelete"
    @cancel="closeModal"
  ></confirmation-modal>
  <modal
    :show="!!message"
    :title="message"
    @close="handleError"
    :error="error"
    :loading="loading"
  ></modal>
  <section id="main" :class="{ expand: expand }">
    <h1>REPORTE DE EVALUACIONES</h1>
    <grid
      :dataSource="dataSource"
      :columns="columns"
      :actions="actions"
      :rows="5"
      @movePage="movePage"
      @selectedList="selectedList"
    ></grid>
  </section>
</template>

<script lang="ts">
import {
  actions,
  BASE_URL,
  columnsEvaluacionesList,
  columnsRolList,
  entity,
} from "@/common/constants";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import Grid from "@/components/ui/Grid.vue";
import {
  IEvaluacion,
  IEvaluacionListado,
} from "@/interfaces/evaluacion.interface";
import { defineComponent } from "@vue/runtime-core";
import Modal from "../components/ui/Modal.vue";
import { IDataSource } from "../interfaces/dataSource";
import { IUser } from "../interfaces/user.interface";
import { emptyDataSource } from "../utils/initializer";

export default defineComponent({
  components: {
    Grid,
    ConfirmationModal,
    Modal,
  },
  data() {
    return {
      dataSource: emptyDataSource() as IDataSource<IEvaluacion>,
      // dataSource: emptyDataSource() as IDataSource<IUser>,
      columns: columnsEvaluacionesList,
      // columns: columnsRolList,
      // config: {
      //   deleteEntity: "",
      //   entity: entity.USER,
      // },
      actions: [{ icon: "fas fa-eye", type: actions.EDIT, method: this.edit }],
      modalTitle: "",
      showModalConfirmation: false,
      id: "",
      entity: "",
      message: null as unknown as string | null,
      loading: false,
      error: false,
      entityList: [] as string[],
      massiveDelete: false,
      expand: false,
      page: 1,
      quantity: 5,
    };
  },
  methods: {
    movePage(pageNumber: number) {
      this.page = pageNumber;
      this.listEvaluaciones();
    },
    expandMain(value: boolean): void {
      this.expand = !value;
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
    async listEvaluaciones(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}evaluacion/lista?page=${this.page}&quantity=${this.quantity}`,
          // `${BASE_URL}usuario/listar/ANALISTAS?page=${this.page}&quantity=${this.quantity}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.dataSource = (await response.json()) as IDataSource<IEvaluacion>;
        // this.dataSource = (await response.json()) as IDataSource<IUser>;
        console.log("this.dataSource");
        console.log(this.dataSource);
      } catch (error) {
        console.log(error);
      }
    },
    edit(id: string, entidad: string): void {
      if (entidad === entity.USER) {
        // this.$router.push(this.profileUrl + id);
      }
    },
  },
  mounted() {
    (async () => {
      await this.listEvaluaciones();
    })();
  },
});
</script>

<style>
body {
  background-color: #d2d2d2;
}

.action-button {
  position: absolute;
  top: 95px;
  right: 30px;
}

.massive {
  top: 95px;
  right: 200px;
  width: 220px;
}
</style>