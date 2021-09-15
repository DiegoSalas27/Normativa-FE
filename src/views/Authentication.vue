<template>
  <div class="login">
    <h1>BIENVENIDO AL SISTEMA EXPERTO</h1>
    <base-card class="base">
      <div class="logo"></div>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <i class="fa fa-user icon"></i>
          <input
            type="text"
            id="user"
            placeholder="Usuario"
            v-model.trim="user"
          />
          <p class="error" v-if="validationForm.user">
            {{ validationForm.user }}
          </p>
        </div>
        <div class="form-control">
          <i class="fa fa-lock icon"></i>
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            v-model.trim="password"
          />
          <p class="error" v-if="validationForm.password">
            {{ validationForm.password }}
          </p>
        </div>
        <base-button class="btn-primary" mode="action-button">{{
          submitButtonCaption
        }}</base-button>
        <!-- <base-button type="button" mode="flat" @click="switchAuthMode"
            >{{ switchModeButtonCaption }}
          </base-button> -->
      </form>
    </base-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { BASE_URL } from "../common/constants";
import { handleErrors, validateEmail, validatePassword } from "../common/utils";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import { AuthUser, IUser } from "../interfaces/user.interface";

export default defineComponent({
  components: {
    BaseButton,
    BaseCard,
  },
  data() {
    return {
      user: "",
      password: "",
      formIsValid: true,
      mode: "login",
      error: null,
      validationForm: {} as AuthUser,
    };
  },
  computed: {
    submitButtonCaption(): string {
      if (this.mode === "login") {
        return "Ingresar";
      } else {
        return "Registrarse";
      }
    },
    switchModeButtonCaption(): string {
      if (this.mode === "login") {
        return "No tiene cuenta? Regístrese.";
      } else {
        return "Ya tiene una cuenta? Inicie sesión";
      }
    },
  },
  methods: {
    async submitForm(): Promise<void> {
      this.validationForm = {} as AuthUser;
      this.formIsValid = true;

      if (this.user === "") {
        this.validationForm["user"] = "El usuario es obligatorio";
        this.formIsValid = false;
      }

      if (this.password === "") {
        this.validationForm["password"] = "La contraseña es obligatoria";
        this.formIsValid = false;
      }

      if (this.user !== "" && this.user !== null && !validateEmail(this.user)) {
        this.validationForm["user"] = "El email no tiene el formato correcto";
        this.formIsValid = false;
      }

      if (
        this.password !== null &&
        this.password !== "" &&
        !validatePassword(this.password)
      ) {
        this.validationForm["password"] =
          "La contraseña debe ser lo suficientemente segura";
        this.formIsValid = false;
      }

      if (this.formIsValid) {
        try {
          const response = await fetch(`${BASE_URL}usuario/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Email: this.user,
              Password: this.password,
            }),
          });

          await handleErrors(response);

          const userInfo = (await response.json()) as IUser;

          localStorage.setItem("token", userInfo.token as string);

          this.$router.replace("/dashboard");
        } catch (error) {
          const errorObj = JSON.parse(error.message);
          this.validationForm.password = errorObj.errores.usuario;
        }
      }
    },
    switchAuthMode(): void {
      if (this.mode === "login") {
        this.mode = "signup";
      } else {
        this.mode = "login";
      }
    },
  },
});
</script>


<style scoped>
/* h1 {
  font-family: 'Segoe UI', sans-serif;
} */

.login {
  z-index: 0;
  height: 100vh;
  width: 100vw;
  background: url("../assets/images/construccion2.jpg") no-repeat center center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login .logo {
  width: 7rem;
  height: 9.8rem;
  /*border-radius: 100%;*/
  margin-left: 30%;
  background: url("../assets/images/logo-login.png") no-repeat center center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login::before {
  z-index: 0;
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  background: var(--linear-gradient);
}

.login h1 {
  text-align: center;
  margin-bottom: 20px;
}

.login > h1 {
  position: absolute;
  color: white;
  margin-top: 60px;
  right: 0;
  left: 0;
  padding-left: 35%;
  padding-right: 35%;
}

.login .base {
  background-color: rgba(0, 0, 0, 0);
  box-shadow: none;
}

.form-control {
  margin: 30px 20px;
}

.icon {
  z-index: 1;
  position: absolute;
  left: 3.1rem;
  margin-top: 0.5rem;
  color: rgb(27, 27, 27);
}

.btn-primary {
  margin-top: 2.5rem;
  border-radius: 10px;
  background-color: #4f6fff;
  color: white;
  /* font-family: 'Segoe UI', sans-serif; */
  font-weight: 600;
}

.error {
  /* font-family: 'Segoe UI', sans-serif; */
  background-color: rgb(27, 27, 27);
  color: #4f6fff;
  font-size: 13px;
  margin-top: 0.5rem;
  font-weight: 800;
  text-align: center;
}

input[type="text"],
input[type="password"],
textarea:focus {
  z-index: 0;
  width: 100%;
  /* font-family: 'Segoe UI', sans-serif; */
  border-radius: 15px;
  border: 1px solid var(--placeholder);
  outline: none;
  /* border: 1px solid var(--accent); */
  padding: 15px 35px;
}
</style>
