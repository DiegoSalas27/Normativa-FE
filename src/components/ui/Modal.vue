<template>
  <backdrop :show="show" @close="tryClose" :closable="error"></backdrop>
  <div class="modal" v-if="show">
    <img v-if="!error" src="../../assets/images/check.png"/>
    <br  v-if="error"/>
    <p>{{ title }}</p>
    <button @click="tryClose" class="action-button" v-if="error">Aceptar</button>
    <spinner v-if="!error"></spinner>
  </div>
</template>

<script lang="ts">
import Spinner from '../ui/Spinner.vue';
import Backdrop from '../ui/Backdrop.vue';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  components: {
    Spinner,
    Backdrop
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    fixed: {
      type: Boolean,
      required: false,
      default: false,
    },
    error: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  methods: {
    tryClose(): void {
      this.$emit('close');
    },
  }
})

</script>
<style scoped>
.modal {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--box-shadow);
  padding: 1rem;
  width: 300px;
  height: 180px;
  text-align: center;
  font-weight: bold;
}

p {
  margin-bottom: 20px;
}

img {
  position: relative;
  right: -109px;
  margin-left: 10px;
  margin-bottom: 10px;
  width: 30px;
  height: 30px;
}
</style>