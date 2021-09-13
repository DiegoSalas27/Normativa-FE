<template>
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
      <h1 v-if="userInfoJson.codigo">Código</h1>
      <p v-if="userInfoJson.codigo">{{ userInfoJson.codigo }}</p>
    </section>
    <section id="right-side">
      <h1 class="titleProfile">{{ titleProfile }}</h1>
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
        <p class="error" v-if="validationForm.nombres">
          {{ validationForm.nombres }}
        </p>
      </div>
      <div v-if="update" style="display: inline-block">
        <h1>Apellidos</h1>
        <br />
        <input
          v-if="update"
          type="text"
          v-model.trim="userInfoJson.apellidos"
        />
        <p class="error" v-if="validationForm.apellidos">
          {{ validationForm.apellidos }}
        </p>
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
          <p class="error" v-if="validationForm.email">
            {{ validationForm.email }}
          </p>
        </div>
        <div
          class="info-field"
          v-if="
            userInfoJson?.rol == 'Analistas' ||
            userInfoJson?.rol == 'Alta gerencia'
          "
        >
          <p>Especialidad</p>
          <i class="fas fa-user-shield"></i> &nbsp;&nbsp;&nbsp;
          <span v-if="!update">{{ userInfoJson?.especialidad }}</span>
          <select
            v-if="update"
            class="select"
            v-model="userInfoJson.especialidad"
            name="especialidad"
          >
            <option
              v-for="especialidad in especialidades"
              :key="especialidad"
              :value="especialidad.descripcion"
            >
              {{ especialidad.descripcion }}
            </option>
          </select>
          <p class="error" v-if="validationForm.especialidad">
            {{ validationForm.especialidad }}
          </p>
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

         <abbr title= "La contraseña debe tener por lo menos un número, un caracter especial y contar con 8 caracteres">
                   
                  <i class="fas fa-info-circle"></i></abbr>
    
        <p
          class="error"
          v-if="validationForm.password && !skipPasswordValidation"
        >
          {{ validationForm.password }}
        </p>
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
        <p class="error" v-if="validationForm.phoneNumber">
          {{ validationForm.phoneNumber }}
        </p>
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
        <p class="error" v-if="validationForm.fechaNacimiento">
          {{ validationForm.fechaNacimiento }}
        </p>
      </div>
      <div class="info-field">
        <p>Rol</p>
        <i class="fas fa-user-shield"></i> &nbsp;&nbsp;&nbsp;
        <span v-if="!update">{{ userInfoJson.rol }}</span>
        <select
          v-if="update"
          class="select"
          v-model="userInfoJson.rol"
          @change="(e) => changedRol(e.target.value)"
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
import { defineComponent } from "vue";
import jwt_decode from "jwt-decode";
import { TokenUser, IUser } from "../interfaces/user.interface";
import Modal from "../components/ui/Modal.vue";
import { emptyUser } from "../utils/initializer";
import { BASE_URL, rol, urlConstants } from "../common/constants";
import { Especialidad } from "../interfaces/especialidad.interface";
import {
  handleErrors,
  validateEmail,
  validateNotEmpty,
  validatePassword,
  validatePhone,
} from "../common/utils";
import { calculateAge } from "../utils/formater";
import { IDataSource } from "../interfaces/dataSource";
import { IRol } from "../interfaces/roles.interface";

export default defineComponent({
  name: "Profile",
  props: {
    createUser: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    Modal,
  },
  data() {
    return {
      roles: [] as IRol[],
      formIsValid: true,
      error: false,
      userInfoJson: emptyUser() as IUser,
      update: false,
      userImage: null,
      message: null as string | null,
      loading: false,
      titleProfile: "",
      especialidades: [] as Especialidad[],
      validationForm: {} as Partial<IUser>,
      skipPasswordValidation: false,
    };
  },
  watch: {
    userInfoJson() {
      console.log(this.userInfoJson);
    },
  },
  computed: {
    displayButtonText(): string {
      if (this.update) {
        return "Guardar";
      }
      return "Editar";
    },
    getUserImage(): string {
      const userImage =
        this.userInfoJson && this.userInfoJson.imagen
          ? this.userInfoJson.imagen
          : require("@/assets/images/adminImg.png");
      return userImage;
    },
  },
  methods: {
    async changedRol(rolName: string): Promise<void> {
      await this.fetchEspecialidades(rolName);
    },
    handleError() {
      this.message = null;
    },
    setDate(event: { target: HTMLInputElement }) {
      this.userInfoJson.fechaNacimiento = event.target.value;
    },
    calculateRolDisplay() {
      switch (this.$route.name) {
        case urlConstants.ADMINISTRADOR:
          this.titleProfile = "";
          break;
        case urlConstants.PROFILE_ANALISTA:
          this.titleProfile = "REGISTRAR ANALISTA";
          this.userInfoJson.rol = rol.ANALISTA;
          break;
        case urlConstants.PROFILE_JEFE_DE_RIESGOS:
          this.titleProfile = "REGISTRAR JEFE DE RIESGOS";
          console.log(rol.JEFE_DE_RIESGOS);
          this.userInfoJson.rol = rol.JEFE_DE_RIESGOS;
          break;
        case urlConstants.PROFILE_ALTA_GERENCIA:
          this.titleProfile = "REGISTRAR ALTA GERENCIA";
          this.userInfoJson.rol = rol.ALTA_GERENCIA;
          break;
        case urlConstants.PROFILE_AUDITOR:
          this.titleProfile = "REGISTRAR ESPECIALISTA";
          this.userInfoJson.rol = rol.ESPECIALISTA;
          break;
        
      }
    },
    async fetchEspecialidades(rolName: string): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}especialidad/lista/${rolName}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        this.especialidades = await response.json();
        this.userInfoJson.especialidad = this.especialidades[0].descripcion;
      } catch (error) {
        console.log(error);
      }
    },

    // performValidation() {},
    async submit(): Promise<void> {
      if (!this.update) {
        this.update = true;
        return;
      }

      this.validationForm = {};
      const jsonToValidate: Partial<IUser> = { ...this.userInfoJson };
      delete jsonToValidate.imagen;
      delete jsonToValidate.nombreCompleto;
      delete jsonToValidate.token;
      delete jsonToValidate.username;
      delete jsonToValidate.entity;
      delete jsonToValidate.id;
      delete jsonToValidate.nombre;
      delete jsonToValidate.codigo;
      delete jsonToValidate.especialidad;

      let isValid = validateNotEmpty(jsonToValidate, this.validationForm);
      let age = null;

      jsonToValidate.fechaNacimiento !== null &&
        jsonToValidate.fechaNacimiento !== "" &&
        (age = calculateAge(jsonToValidate.fechaNacimiento as string));

      if (age !== null && age <= 18) {
        this.validationForm.fechaNacimiento = "La edad míninma es de 18 años";
        isValid = false;
      }

      if (age !== null && age >= 101) {
        this.validationForm.fechaNacimiento = "La edad máxima es de 100 años";
        isValid = false;
      }

      if (
        jsonToValidate.email !== null &&
        jsonToValidate.email !== "" &&
        !validateEmail(jsonToValidate.email as string)
      ) {
        this.validationForm.email = "El email no tiene el formato correcto";
        isValid = false;
      }

      if (
        jsonToValidate.password !== null &&
        jsonToValidate.password !== "" &&
        !this.skipPasswordValidation &&
        !validatePassword(jsonToValidate.password as string)
      ) {
        this.validationForm.password =
          "La contraseña debe ser lo suficientemente segura";
        isValid = false;
      }

      if (
        jsonToValidate.phoneNumber !== null &&
        jsonToValidate.phoneNumber !== "" &&
        !validatePhone(jsonToValidate.phoneNumber as string)
      ) {
        this.validationForm.phoneNumber =
          "El teléfono no tiene el formato correcto";
        isValid = false;
      }

      if (isValid) {
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

        if (
          this.$route.name !== "Profile" &&
          !this.$route.params.id &&
          this.titleProfile != "JEFE DE RIESGOS"
          // no se encontro razon de booleano title profile
        ) {
          try {
            const response = await fetch(
              `${BASE_URL}usuario/registrar`,
              {
                method: "POST",
                headers: new Headers({
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                }),
                body: JSON.stringify(this.userInfoJson),
              }
            );

            await handleErrors(response);

            this.loading = false;

            this.error = false;
            this.message = "¡El usuario ha sido registrado exitósamente!";

            setTimeout(() => {
              this.$router.replace("/dashboard");
            }, 2000);
          } catch (error) {
            this.error = true;
            isValid = false;
            const errorObj = JSON.parse(error.message);
            this.validationForm.email = errorObj.errores.mensaje;
          }
        } else {
          try {
            const response = await fetch(`${BASE_URL}usuario`, {
              method: "PUT",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
              body: JSON.stringify(this.userInfoJson),
            });

            this.loading = false;

            this.error = false;
            this.message = "¡Los datos se modificaron éxito!";

            setTimeout(() => {
              this.$router.replace("/dashboard");
            }, 2000);
          } catch (error) {
            this.error = true;
            this.message = "Favor de llenar los campos con valores permitidos";
          }
        }
      }
    },
  },
  mounted() {
    (async () => {
      const token = localStorage.getItem("token");
      var decoded: TokenUser = jwt_decode(token as string);

      try {
        const response = await fetch(`${BASE_URL}rol/lista`, {
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

      this.calculateRolDisplay();

      if (
        this.$route.name !== "Profile" &&
        // this.$route.path !== urlConstants.PROFILE_JEFE_DE_RIESGOS &&
        !this.$route.params.id
      ) {
        this.update = true;
      }

      // if (this.$route.name === urlConstants.PROFILE_JEFE_DE_RIESGOS) {
      //   try {
      //     const response = await fetch(
      //       `${BASE_URL}usuario/listar/${rol.JEFE_DE_RIESGOS}?page=1&quantity=1`,
      //       {
      //         method: "GET",
      //         headers: new Headers({
      //           "Content-Type": "application/json",
      //           Authorization: "Bearer " + localStorage.getItem("token"),
      //         }),
      //       }
      //     );
      //     const resp = (await response.json()) as IDataSource<IUser>;
      //     console.log(resp);
      //     resp.listaRecords.length > 0 &&
      //       ((this.userInfoJson = resp.listaRecords[0]),
      //       (this.titleProfile = "JEFE DE RIESGOS"),
      //       (this.skipPasswordValidation = true));

      //     if (resp.listaRecords.length === 0) {
      //       this.update = false;
      //     } else {
      //       this.update = true;
      //     }
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }

      if (this.$route.params.id) {
        try {
          const response = await fetch(
            `${BASE_URL}usuario/${this.$route.params.id}`,
            {
              method: "GET",
              headers: new Headers({
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              }),
            }
          );

          const userInfo = (await response.json()) as IUser;

          userInfo.rol == rol.ANALISTA &&
            (this.titleProfile = "ANALISTA " + userInfo.codigo);
          userInfo.rol == rol.ALTA_GERENCIA &&
            (this.titleProfile = "ALTA GERENCIA " + userInfo.codigo);
          userInfo.rol == rol.JEFE_DE_RIESGOS &&
            (this.titleProfile = "JEFE DE RIESGOS " + userInfo.codigo);
          userInfo.rol == rol.ESPECIALISTA &&
            (this.titleProfile = "ESPECIALISTA " + userInfo.codigo);

          this.userInfoJson = userInfo;
          // !this.userInfoJson.especialidad &&
          //   (this.userInfoJson.especialidad =
          //     this.especialidades[0].descripcion);
          // //no se encontro razon de implementacion
            this.skipPasswordValidation = true;
        } catch (error) {
          this.error = true;
          this.message = "Favor de llenar los campos con valores permitidos";
        }
      }

      try {
        const response = await fetch(`${BASE_URL}usuario/`, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        });

        const userInfo = (await response.json()) as IUser;

        this.$route.name === "Profile" &&
          ((this.userInfoJson = { ...userInfo }),
          (this.skipPasswordValidation = true));
      } catch (error) {
        this.error = true;
        this.message = "Favor de llenar los campos con valores permitidos";
      }

      if (decoded.role !== rol.ADMINISTRADOR) {
        await this.fetchEspecialidades(decoded.role);
      } else {
        if (
          this.userInfoJson.rol == rol.ANALISTA ||
          this.userInfoJson.rol == rol.ALTA_GERENCIA ||
          this.userInfoJson.rol == rol.JEFE_DE_RIESGOS ||
          this.userInfoJson.rol == rol.ESPECIALISTA
        ) {
          await this.fetchEspecialidades(this.userInfoJson.rol);
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

#right-side .titleProfile {
  position: absolute;
  top: -50px;
  right: 55%;
  font-weight: bold;
  font-size: 22px;
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