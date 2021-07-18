<template>
  <nav-bar
    :name="userInfoJson?.nombres"
    :lastName="userInfoJson?.apellidos"
  ></nav-bar>
  <side-bar :user="userInfoJson"></side-bar>
  <section id="main">
    <h1>PANEL PRINCIPAL</h1>
    <div class="gridCards">
      <div
        v-for="rolaction in rolUserActions"
        :key="rolaction.description"
        @click="goToList(rolaction.url)"
        class="card"
      >
        <img :src="rolaction.src" :alt="rolaction.src" class="image" />
        <p>{{ rolaction.description }}</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import NavBar from "@/components/layout/NavBar.vue";
import SideBar from "@/components/layout/SideBar.vue";
import { User } from "../interfaces/user.interface";
import { urlConstants } from "../common/constants";

export default {
  props: ["userInfo"],
  components: {
    NavBar,
    SideBar,
  },
  data() {
    return {
      userInfoJson: null as User,
      rolUserActions: [
        {
          src: require("@/assets/images/alta.png"),
          description: "Alta gerencia",
          url: urlConstants.ALTA_GERENCIA,
        },
        {
          src: require("@/assets/images/analyst.png"),
          description: "Analistas",
          url: urlConstants.ANALISTAS,
        },
        {
          src: require("@/assets/images/audit.png"),
          description: "Auditor",
          url: urlConstants.AUTDITOR,
        },
        {
          src: require("@/assets/images/security.png"),
          description: "Jefe de riesgos",
          url: urlConstants.PROFILE_JEFE_DE_RIESGOS,
        },
      ],
    };
  },
  methods: {
    goToList(url: string): void {
      if (url === urlConstants.PROFILE_JEFE_DE_RIESGOS) {
        this.$router.push(url);
      } else {
        this.$router.push({ name: url });
      }
    },
  },
  mounted() {
    (async () => {
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
        this.error = true;
        this.message = "Favor de llenar los campos con valores permitidos";
      }
    })();
  },
};
</script>

<style scoped>
h1 {
  font-weight: bold;
}

.gridCards {
  margin: 60px auto;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(42%, 1fr));
  gap: 100px;
  justify-content: center;
}

.gridCards p {
  font-weight: bold;
}

.image {
  width: 100px;
  height: 100px;
}

.card {
  cursor: pointer;
  border: 1px solid var(--placeholder);
  border-radius: 12px;
  width: 200px;
  margin: auto;
  padding: 20px;
  box-shadow: 0 2px 8px var(--box-shadow);
  transition: all 0.2s linear;
}

.card:hover {
  background: var(--secondary-color);
  /* opacity: 90%; */
}
</style>
