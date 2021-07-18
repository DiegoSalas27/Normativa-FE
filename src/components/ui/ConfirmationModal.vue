<template>
  <backdrop :show="show" @close="tryClose" :closable="false"></backdrop>
  <div class="modal" v-if="show">
    <i class="far fa-times-circle fa-2x"></i>
    <p>{{ title }}</p>
    <div class="flex-button">
      <button @click="confirm()" class="action-button">Aceptar</button>
      <button
        style="background: var(--danger)"
        @click="cancel()"
        class="action-button"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Backdrop from "../ui/Backdrop.vue";

export default {
  components: {
    Backdrop,
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
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    massiveDelete: {
      type: Boolean,
      required: false,
    },
  },
  emits: ["close", "confirm", "cancel"],
  methods: {
    tryClose(): void {
      this.$emit("close");
    },
    confirm(): void {
      if (this.massiveDelete) {
        this.$emit("confirmMassive");
      } else {
        this.$emit("confirm");
      }
    },
    cancel(): void {
      this.$emit("cancel");
    },
  },
};
</script>
<style scoped>
.modal {
  z-index: 9999;
  position: absolute;
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

.far.fa-times-circle {
  color: red;
}

.flex-button {
  display: flex;
  justify-content: space-around;
}

button {
  width: 100px;
  text-align: center;
  padding: 10px;
}
</style>