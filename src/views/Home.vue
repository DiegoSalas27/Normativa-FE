<template>
  <section class="main-container">
    <section id="home">
      <div class="content">
        <h1>LOS RIESGOS BAJO CONTROL</h1>
        <p>
          SISTEMA EXPERTO PARA LA PREVENCIÓN DE RIESGOS LABORALES EN
          CONSTRUCCIÓN DE EDIFICACIONES
        </p>
        <button @click="goToLogin()" class="action-button">DEMO</button>
      </div>
    </section>
    <section id="features">
      <horizontal-flex-list
        :images="images"
        :size="'150px'"
        :bgcolor="'white'"
        :title="'BASADOS EN NORMATIVAS DE SEGURIDAD LABORAL'"
      ></horizontal-flex-list>
    </section>
    <the-footer></the-footer>
  </section>
</template>

<script lang="ts">
import HorizontalFlexList from "@/components/ui/HorizontalFlexList.vue";
import TheFooter from "@/components/layout/TheFooter.vue";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  components: {
    HorizontalFlexList,
    TheFooter,
  },
  data() {
    return {
      images: [
        {
          src: "ley29783.jpg",
          description: "Ley Nº 29783",
        },
        {
          src: "norma-tecnica.jpg",
          description: "Normas técnicas G-050",
        },
        {
          src: "iso45001.jpg",
          description: "ISP 450001:2018",
        },
        {
          src: "normas-seguridad.jpg",
          description: "Normas de Seguridad e Higiene en obras",
        },
      ],
    };
  },
  methods: {
    goToLogin(): void {
      this.$router.push('/auth');
    }
  }
});
</script>

<style scoped>
.main-container {
  z-index: 1;
  background: url("../assets/images/construccion.png") no-repeat center center;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.main-container::before {
  z-index: -1;
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

#home {
  height: 60vh;
}

.content {
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  padding-left: 30px;
  padding-top: 80px;
  padding-bottom: 160px;
}
.content * {
  color: white;
}

.content > h1 {
  font-size: 35px;
}

.content > p {
  margin-top: 20px;
  margin-bottom: 10px;
  width: 550px;
}

#banner {
}
</style>