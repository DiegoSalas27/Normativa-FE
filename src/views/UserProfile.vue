<template>
  <nav-bar
    :name="userAdmin?.nombres"
    :lastName="userAdmin?.apellidos"
  ></nav-bar>
  <side-bar :user="userAdmin"></side-bar>
  <modal
    :show="!!message"
    :title="message"
    @close="handleError"
    :error="error"
    :loading="loading"
  ></modal>
  <section id="main">
    <section id="left-side">
      <h1>Perfil de usuario</h1>
      <img :src="getUserImage" :alt="getUserImage" class="userImage" />
    </section>
    <section id="right-side">
      <button class="action-button" @click="submit()">
        {{ displayButtonText }}
      </button>
      <div style="display: inline-block; margin-right: 135px">
        <h1>Nombre</h1>
        <br />
        <p class="impact" v-if="!update">
          {{ userInfoJson?.nombres + " " + userInfoJson?.apellidos }}
        </p>
        <input
          v-if="update"
          type="text"
          :placeholder="userInfoJson?.nombres"
          v-model.trim="userInfoJson.nombres"
        />
      </div>
      <div v-if="update" style="display: inline-block">
        <h1>Apellidos</h1>
        <br />
        <input
          v-if="update"
          type="text"
          :placeholder="userInfoJson?.apellidos"
          v-model.trim="userInfoJson.apellidos"
        />
      </div>

      <div class="flex-items">
        <div class="info-field">
          <p>Correo</p>
          <i class="fas fa-envelope"></i> &nbsp;&nbsp;&nbsp;
          <span v-if="!update">{{ userInfoJson?.email }}</span>
          <input
            v-if="update"
            type="email"
            :placeholder="userInfoJson?.email"
            v-model.trim="userInfoJson.email"
          />
        </div>
        <div class="info-field">
          <p>Especialidad</p>
          <i class="fas fa-graduation-cap"></i> &nbsp;&nbsp;&nbsp;
          <span v-if="!update">{{ userInfoJson?.email }}</span>
          <input
            v-if="update"
            type="email"
            :placeholder="userInfoJson?.email"
            v-model.trim="userInfoJson.email"
          />
        </div>
      </div>

      <div class="info-field">
        <p>Contraseña</p>
        <i class="fas fa-lock"></i> &nbsp;&nbsp;&nbsp;
        <span v-if="!update">**********</span>
        <input
          v-if="update"
          type="password"
          placeholder="**********"
          v-model.trim="userInfoJson.password"
        />
      </div>
      <div class="info-field">
        <p>Telefono</p>
        <i class="fas fa-phone"></i> &nbsp;&nbsp;&nbsp;
        <span v-if="!update">{{ userInfoJson?.phoneNumber }}</span>
        <input
          v-if="update"
          type="text"
          :placeholder="userInfoJson?.phoneNumber"
          v-model.trim="userInfoJson.phoneNumber"
        />
      </div>
      <div class="info-field">
        <p>Fecha de nacimiento</p>
        <i class="fas fa-calendar-alt"></i> &nbsp;&nbsp;&nbsp;
        <span v-if="!update">{{
          userInfoJson
            ? new Date(userInfoJson.fechaNacimiento).toISOString().substr(0, 10)
            : null
        }}</span>
        <input
          v-if="update"
          type="date"
          @change="setDate"
          :value="
            userInfoJson && userInfoJson.fechaNacimiento
              ? new Date(userInfoJson.fechaNacimiento)
                  .toISOString()
                  .substr(0, 10)
              : null
          "
        />
      </div>
      <div class="info-field">
        <p>Rol</p>
        <i class="fas fa-user-shield"></i> &nbsp;&nbsp;&nbsp;
        <span v-if="!update">{{ userInfoJson?.rol }}</span>
        <select
          v-if="update"
          class="select"
          v-model="userInfoJson.rol"
          name="rol"
        >
          <option v-for="rol in roles" :key="rol" :value="rol.name">
            {{ rol.name }}
          </option>
        </select>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import jwt_decode from "jwt-decode";
import NavBar from "@/components/layout/NavBar.vue";
import SideBar from "@/components/layout/SideBar.vue";
import { tokenUser, User } from "../interfaces/user.interface";
import Modal from "../components/ui/Modal.vue";
import { emptyUser } from "../utils/initializer";
import { rol, urlConstants } from "../common/constants";

export default defineComponent({
  name: "Profile",
  props: {
    createUser: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    NavBar,
    SideBar,
    Modal,
  },
  data() {
    return {
      roles: [],
      formIsValid: true,
      error: false,
      userAdmin: emptyUser() as User,
      userInfoJson: emptyUser() as User,
      update: false,
      userImage: null,
      message: null,
      loading: false,
    };
  },
  computed: {
    displayButtonText(): string {
      if (this.update) {
        return "Guardar";
      }
      return "Editar";
    },
    getUserImage() {
      const userImage =
        this.userInfoJson && this.userInfoJson.imagen
          ? this.userInfoJson.imagen
          : require("@/assets/images/adminImg.png");
      return userImage;
    },
  },
  methods: {
    handleError() {
      this.message = null;
    },
    setDate(e) {
      this.userInfoJson.fechaNacimiento = e.target.value;
    },
    async submit(): Promise<void> {
      if (!this.update) {
        this.update = true;
        return;
      }

      this.loading = true;

      if (
        this.userInfoJson.nombres === "" ||
        this.userInfoJson.apellidos === "" ||
        this.userInfoJson.password === ""
      ) {
        this.formIsValid = false;
        return;
      }
      this.formIsValid = true;
      this.error = false;

      if (this.$route.name !== "Profile" && !this.$route.params.id) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/usuario/registrar",
            {
              method: "POST",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
              body: JSON.stringify(this.userInfoJson),
            }
          );

          const userInfo = await response.json();

          this.loading = false;

          this.error = false;
          this.message = "¡El usuario ha sido registrado exitósamente!";

          setTimeout(() => {
            this.$router.replace({
              name: "Dashboard",
              params: { userInfo: JSON.stringify(userInfo) },
            });
          }, 2000);
        } catch (error) {
          this.error = true;
          this.message = "Favor de llenar los campos con valores permitidos";
        }
      } else {
        try {
          const response = await fetch("http://localhost:5000/api/usuario", {
            method: "PUT",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
            body: JSON.stringify(this.userInfoJson),
          });

          const userInfo = await response.json();

          this.loading = false;

          this.error = false;
          this.message = "¡Los datos se modificaron éxito!";

          setTimeout(() => {
            this.$router.replace({
              name: "Dashboard",
              params: { userInfo: JSON.stringify(userInfo) },
            });
          }, 2000);
        } catch (error) {
          this.error = true;
          this.message = "Favor de llenar los campos con valores permitidos";
        }
      }
    },
  },
  mounted() {
    (async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rol/lista", {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        });

        this.roles = await response.json();
      } catch (error) {
        console.log(error);
      }

      if (
        this.$route.name !== "Profile" &&
        this.$route.path !== urlConstants.PROFILE_JEFE_DE_RIESGOS &&
        !this.$route.params.id
      ) {
        this.update = true;
      }

      if (this.$route.path === urlConstants.PROFILE_JEFE_DE_RIESGOS) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/usuario/listar/${rol.JEFE_DE_RIESGOS}`,
            {
              method: "GET",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            }
          );
          const resp = (await response.json()) as User[];
          resp.length > 0 && (this.userInfoJson =  resp[0]);

          if (this.userInfoJson.length === 0) {
            this.update = false;
          } else {
            this.update = true;
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (this.$route.params.id) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/usuario/${this.$route.params.id}`,
            {
              method: "GET",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            }
          );

          const userInfo = (await response.json()) as User;

          this.userInfoJson = userInfo;
        } catch (error) {
          this.error = true;
          this.message = "Favor de llenar los campos con valores permitidos";
        }
      }

      const token = localStorage.getItem("token");
      var decoded: tokenUser = jwt_decode(token);

      if (decoded.role === "Administrador") {
        try {
          const response = await fetch("http://localhost:5000/api/usuario/", {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          });

          const userInfo = (await response.json()) as User;

          this.userAdmin = { ...userInfo };
          this.$route.name === "Profile" &&
            (this.userInfoJson = { ...userInfo });
        } catch (error) {
          this.error = true;
          this.message = "Favor de llenar los campos con valores permitidos";
        }
      }
    })();
  },
});
</script>

<style scoped>
#left-side {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 0;
  padding-left: 45px;
  width: 20%;
  height: calc(100vh - 120px);
}

#right-side {
  position: absolute;
  top: 150px;
  left: calc(20% + 220px);
  width: calc(80% - 220px);
  height: calc(100vh - 150px);
  text-align: left;
}

#right-side button {
  position: absolute;
  top: -50px;
  right: 50px;
}

.userImage {
  height: 150px;
  width: 150px;
  margin-top: 30px;
  border-radius: 50%;
}

.flex-items {
  display: flex;
  margin-top: 40px;
}

.flex-items div {
  margin-right: 100px;
}

.info-field {
  margin-bottom: 20px;
}

.info-field p,
.info-field input,
.info-field span {
  font-weight: bold;
  margin-bottom: 10px;
}

input {
  width: 250px;
  height: 35px;
}

@media (max-width: 954px) {
  #right-side {
    position: relative;
    top: 0;
    left: 0;
    width: calc(80% - 220px);
    height: calc(100vh - 150px);
    text-align: left;
    padding-left: 45px;
  }
  #left-side {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    left: 0;
    width: 100%;
    height: fit-content;
  }
}
</style>