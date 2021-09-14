<template>
  <div class="header">
    <img
      id="logo"
      @click="goToDashboard()"
      alt="logo_banner"
      src="@/assets/images/Logo_aplicación.png"
      width="120"
      height="50"
    />
    <p>Bienvenido: {{ name + " " + lastName }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: ["name", "lastName"],
  methods: {
    goToDashboard() {
      this.$router.push("/dashboard");
    },
  },
});
</script>

<style scoped>
#logo {
  margin: auto 6px;
}
#logo:hover {
  cursor: pointer;
}

.header {
  z-index: 3;
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  background: var(--nav-bg);
  box-shadow: 0 0.1px 5px var(--box-shadow);
  height: 60px;
  color: white;
  justify-content: space-between;
}

.header p {
  font-size: 20px;
  margin: 0 40px;
  line-height: 60px;
}

.header p:last-child {
  font-size: 16px;
}

.dashboardText {
  cursor: pointer;
}
</style>