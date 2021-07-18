<template>
  <div class="backdropFade" :style="{opacity: show ? '50%' : '0',
            'visibility': show ? 'visible' : 'hidden'}" @click="tryClose"></div>
</template>

<script lang="ts">
export default {
  props: {
     show: {
      type: Boolean,
      required: true,
    },
    closable: {
      type: Boolean,
      required: false,
    }
  },
   emits: ['close'],
   methods: {
    tryClose(): void {
      this.closable && this.$emit('close');
    },
  }
}
</script>

<style scoped>
.backdropFade {
  width: 100%;
  left: 0;
  top: 0;
  height: 100vh;
  position: fixed;
  background-color: #000;
  z-index: 1;
  transition: visibility 0.5s, opacity 0.5s linear;
}
</style>