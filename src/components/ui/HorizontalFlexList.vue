<template>
  <section class="list" :style="{ background: bgcolor }">
    <div v-if="title">
      <h1>{{ title }}</h1>
    </div>
    <section class="flex-items">
      <div v-for="image in images" :key="image">
        <img
          :src="getImrUrl(image.src)"
          :alt="image"
          :style="{ width: size, height: size }"
        />
        <p>{{ image.description }}</p>
      </div>

    </section>
  </section>
</template>

<script lang="ts">
export default {
  props: ["images", "size", "bgcolor", "title"],
  methods: {
    getImrUrl(pic: string): string {
      return require("@/assets/images/" + pic);
    },
  },
};
</script>


<style scoped>
.list {
  padding: 20px 0;
}
.list h1 {
  text-align: center;
  font-weight: bold;
  font-size: 25px;
}
.flex-items {
  display: flex;
  justify-content: space-between;
  padding: 0 80px;
  margin: 30px 0;
}

.flex-items img {
  height: 100px;
  width: 100px;
}

.flex-items p {
  text-align: center;
  font-weight: bold;
  color: var(--placeholder);
  width: 150px;
}

</style>