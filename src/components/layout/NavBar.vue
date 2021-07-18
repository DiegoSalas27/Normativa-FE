<template>
  <div class="header">
    <p @click="goToDashboard()" class="dashboardText">Normativa: Dashboard</p>
    <p>Bienvenido: {{ name + ' ' + lastName }}</p>
  </div>
</template>

<script lang="ts">
export default {
  props: ["name", "lastName"],
  methods: {
    goToDashboard() {
      this.$router.push('/dashboard');
    }
  }
};
</script>

<style scoped>
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