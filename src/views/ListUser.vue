<template>
  <nav-bar
    :name="userInfoJson?.nombres"
    :lastName="userInfoJson?.apellidos"
  ></nav-bar>
  <side-bar :user="userInfoJson"></side-bar>
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
  <section id="main">
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
      @selectedList="selectedList"
    ></grid>
  </section>
</template>

<script lang="ts">
import NavBar from "@/components/layout/NavBar.vue";
import SideBar from "@/components/layout/SideBar.vue";
import Grid from "@/components/ui/Grid.vue";
import ConfirmationModal from "@/components/ui/ConfirmationModal.vue";
import Modal from "../components/ui/Modal.vue";
import { actions, entity, urlConstants } from "@/common/constants";
import { User } from "../interfaces/user.interface";
import { columnsRolList } from "../common/constants";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  components: {
    NavBar,
    SideBar,
    Grid,
    ConfirmationModal,
    Modal,
  },
  data() {
    return {
      profileUrl: "",
      userRol: "",
      userInfoJson: null as User,
      dataSource: [],
      columns: columnsRolList,
      config: {
        deleteEntity: "",
        entity: entity.USER,
      },
      actions: [
        { icon: "fas fa-trash-alt", type: actions.DELETE, method: this.delete },
        { icon: "fas fa-edit", type: actions.EDIT, method: this.edit },
      ],
      modalTitle: "",
      showModalConfirmation: false,
      id: "",
      entity: "",
      message: null,
      loading: false,
      error: false,
      entityList: [] as User[],
      massiveDelete: false,
    };
  },
  methods: {
    selectedList(entityList: User): void {
      this.entityList = entityList;
    },
    handleError(): void {
      this.message = null;
    },
    closeModal(): void {
      this.showModalConfirmation = false;
    },
    calculateUser(): string {
      switch (this.$route.path) {
        case "/alta-gerencia":
          this.userRol = "ALTA GERENCIA";
          this.profileUrl = "/profile/alta-gerencia/";
          break;
        case "/analistas":
          this.userRol = "ANALISTAS";
          this.profileUrl = "/profile/analista/";
          break;
      }

      return this.userRol;
    },
    async listUsersByRol(): Promise<void> {
      try {
        const response = await fetch(
          `http://localhost:5000/api/usuario/listar/${this.userRol}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.dataSource = (await response.json()) as User[];
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
    },
    async confirmMassiveDelete(): Promise<void> {
      console.log(this.entityList);
      Promise.all(
        this.entityList.map(async (id: string) => {
          try {
            const response = await fetch(
              `http://localhost:5000/api/usuario/${id}`,
              {
                method: "DELETE",
                headers: new Headers({
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                }),
              }
            );
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
        const response = await fetch(
          `http://localhost:5000/api/${this.entity}/${this.id}`,
          {
            method: "DELETE",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

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
      await this.listUsersByRol();
      try {
        const response = await fetch("http://localhost:5000/api/usuario", {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        });

        const userInfo = (await response.json()) as User;

        this.userInfoJson = userInfo;
      } catch (error) {
        console.log(error);
      }
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