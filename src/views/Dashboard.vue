<template>
  <nav-bar
    :name="userInfoJson?.nombres"
    :lastName="userInfoJson?.apellidos"
  ></nav-bar>
  <side-bar :user="userInfoJson"></side-bar>
  <router-view></router-view>
</template>

<script lang="ts">
import NavBar from "@/components/layout/NavBar.vue";
import SideBar from "@/components/layout/SideBar.vue";
import { getUsuario } from "@/services/authService";
import { defineComponent } from "@vue/runtime-core";
import { IUser } from "../interfaces/user.interface";
import { emptyUser } from "../utils/initializer";

export default defineComponent({
  props: ["userInfo"],
  components: {
    NavBar,
    SideBar,
  },
  data() {
    return {
      userInfoJson: emptyUser() as IUser,
    };
  },
  
  mounted() {
    (async () => {
      try {
        this.userInfoJson = await getUsuario();
      } catch (err) {
        console.log(err);
      }
    })();
  },
});
</script>
