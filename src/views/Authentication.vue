<template>
  <div class="login">
    <h1>BIENVENIDO AL SISTEMA EXPERTO</h1>
    <base-card>
      <h1>Login</h1>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <input
            type="text"
            id="user"
            placeholder="Usuario"
            v-model.trim="user"
          />
        </div>
        <div class="form-control">
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            v-model.trim="password"
          />
        </div>
        <p v-if="!formIsValid">
          Por favor ingrese un usuario o contraseña correcto
        </p>
        <base-button mode="action-button">{{ submitButtonCaption }}</base-button>
        <!-- <base-button type="button" mode="flat" @click="switchAuthMode"
            >{{ switchModeButtonCaption }}
          </base-button> -->
      </form>
    </base-card>
  </div>
</template>

<script lang="ts">
import BaseButton from "../components/ui/BaseButton.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import { User } from '../interfaces/user.interface';
export default {
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
      if (this.user === "" || this.password === "") {
        this.formIsValid = false;
        return;
      }
      this.formIsValid = true;
      this.error = null;

      try {
        const response = await fetch(
          "http://localhost:5000/api/usuario/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Email: this.user,
              Password: this.password,
            }),
          }
        );

        const userInfo = await response.json() as User;

        localStorage.setItem('token', userInfo.token);

        this.$router.replace({name: 'Dashboard'});
      } catch (error) {
        console.log(error);
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
};
</script>


<style scoped>
.login {
  z-index: 0;
  height: 100vh;
  width: 100vw;
  background: url("../assets/images/construccion2.jpg") no-repeat center center;
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

.form-control {
  margin: 20px 0;
}

input[type="text"],
input[type="password"],
textarea:focus {
  width: 100%;
  border-radius: 4px;
  border: 0.5px solid var(--placeholder);
  outline: none;
  border: 1px solid var(--accent);
  padding: 12px 20px;
}
</style>
