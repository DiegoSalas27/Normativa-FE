<template>
  <confirmation-modal
    :error="null"
    :show="showModalConfirmation"
    :title="modalTitle"
    :massiveDelete="massiveDelete"
    @confirm="confirmDelete"
    @confirmMassive="confirmMassiveDelete"
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
    <div>
      <h2>ADMINISTRACIÓN DE {{ calculateUser() }}</h2>
      <button class="action-button massive" @click="deleteMassive()">
        Eliminación masiva
      </button>
      <button class="action-button" @click="register()">Registrar</button>
    </div>
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
</template>

<script lang="ts">
import Grid from "@/components/ui/Grid.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import Modal from "../components/ui/Modal.vue";
import { actions, BASE_URL, entity } from "@/common/constants";
import { IUser } from "../interfaces/user.interface";
import { columnsRolList } from "../common/constants";
import { defineComponent } from "@vue/runtime-core";
import { IDataSource } from "../interfaces/dataSource";
import { emptyDataSource } from "../utils/initializer";

export default defineComponent({
  components: {
    Grid,
    ConfirmationModal,
    Modal,
  },
  data() {
    return {
      profileUrl: "",
      userRol: "",
      userInfoJson: null as unknown as IUser,
      dataSource: emptyDataSource() as IDataSource<IUser>,
      columns: columnsRolList,
      config: {
        deleteEntity: "",
        entity: entity.USER,
      },
      actions: [
        { icon: "fas fa-trash-alt", type: actions.DELETE, method: this.delete },
        { icon: "fas fa-eye", type: actions.EDIT, method: this.edit },
      ],
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
      this.listUsersByRol();
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
    calculateUser(): string {
      console.log(this.$route);
      switch (this.$route.path) {
        case "/dashboard/alta-gerencia":
          this.userRol = "ALTA GERENCIA";
          this.profileUrl = "/dashboard/profile/alta-gerencia/";
          break;
        case "/dashboard/analistas":
          this.userRol = "ANALISTAS";
          this.profileUrl = "/dashboard/profile/analista/";
          break;
      }

      return this.userRol;
    },
    async listUsersByRol(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}usuario/listar/${this.userRol}?page=${this.page}&quantity=${this.quantity}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.dataSource = (await response.json()) as IDataSource<IUser>;
        console.log("this.dataSource");
        console.log(this.dataSource);
      } catch (error) {
        console.log(error);
      }
    },
    deleteMassive(): void {
      if (this.entityList.length > 0) {
        this.massiveDelete = true;
        this.showModalConfirmation = true;
        this.modalTitle =
          "Está seguro que desea eliminar los " +
          "usuario" +
          "s seleccionados ?";
      } else {
        this.message = "Debe seleccionar al menos un usuario";
        this.error = true;
      }
      this.page = 1;
    },
    register(): void {
      this.$router.push(this.profileUrl);
    },
    edit(id: string, entidad: string): void {
      if (entidad === entity.USER) {
        this.$router.push(this.profileUrl + id);
      }
    },
    delete(id: string, entity: string): void {
      this.id = id;
      this.entity = entity;
      this.modalTitle = "Está seguro que desea eliminar " + entity + "?";
      this.showModalConfirmation = true;
      this.page = 1;
    },
    async confirmMassiveDelete(): Promise<void> {
      console.log(this.entityList);
      await Promise.all(
        this.entityList.map(async (id: string) => {
          try {
            const response = await fetch(`${BASE_URL}usuario/${id}`, {
              method: "DELETE",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            });
          } catch (error) {
            console.log(error);
          }
        })
      );

      this.massiveDelete = false;
      this.showModalConfirmation = false;
      this.modalTitle = "";

      this.message = `Los usuarios  fueron eliminados`;

      setTimeout(async () => {
        await this.listUsersByRol();
        this.message = null;
      }, 2000);
    },
    async confirmDelete(): Promise<void> {
      this.closeModal();
      try {
        const response = await fetch(`${BASE_URL}${this.entity}/${this.id}`, {
          method: "DELETE",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        });

        this.message = `El ${this.entity} fue eliminado`;
        this.id = "";
        this.entity = "";

        // const result = await response.json();

        setTimeout(async () => {
          await this.listUsersByRol();
          this.message = null;
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    (async () => {
      try {
        const response = await fetch(`${BASE_URL}usuario`, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        });

        const userInfo = (await response.json()) as IUser;

        this.userInfoJson = userInfo;
      } catch (error) {
        console.log(error);
      }
      await this.listUsersByRol();
    })();
  },
});
</script>

<style scoped>
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