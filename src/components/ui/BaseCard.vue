<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--box-shadow);
  padding: 1rem;
  max-width: 42rem;
  min-width: 20rem;
  min-height: 19rem;
}
</style>