import SideBar from '@/components/layout/SideBar.vue';
<template>
  <section id="sideBar">
    <nav class="sideBarMenu">
      <!-- <ul class="sideBarItems">
        <li v-for="option in options" :key="option.name">
          
        </li>
      </ul> -->
      <img :src="userImage" :alt="userImage" class="userImage" />
      <p>Bienvenido</p>
      <div>
        <i class="fas fa-user"></i
        ><span class="link" @click="goProfile()">Mi perfil</span>
      </div>
      <!-- <div>
        <span>{{ user.nombres }} {{ user.apellidos }}</span>
      </div> -->
      <div>
        <i class="far fa-envelope"></i>
        <span>{{ user?.email }}</span>
      </div>
      <div>
        <i class="fas fa-phone"></i>
        <span>{{ user?.phoneNumber }}</span>
      </div>
      <div>
        <i class="fas fa-user-shield"></i>
        <span>{{ user?.rol }}</span>
      </div>

      <router-link class="bottom" to="/"
        >Salir &nbsp;&nbsp; <i class="fas fa-sign-out-alt"></i>
      </router-link>
    </nav>
  </section>
</template>

<script lang="ts">
export default {
  props: ["user"],
  data() {
    return {
      userImage:
        this.user && this.user.imagen
          ? this.user.imagen
          : require("@/assets/images/adminImg.png"),
    };
  },
  methods: {
    goProfile(): void {
      this.$router.push({
        name: "Profile",
      });
    },
  },
};
</script>


<style scoped>
#sideBar {
  display: flex;
}

.sideBarMenu {
  background-color: var(--primary-variant);
  box-shadow: 0 0.1px 5px var(--nav-bg);
  color: white;
  height: calc(100vh - 60px);
  width: 220px;
  display: flex;
  position: fixed;
  top: 60px;
  left: 0;
  transition: 400ms;
  font-size: 16px;
  z-index: 2;
  flex-direction: column;
  align-items: center;
}

.sideBarMenu div {
  margin: 20px 0;
  margin-left: 20px;
  text-decoration: none;
  /* word-break: break-all; */
  width: 180px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.sideBarMenu img {
  margin: 20px 0;
}

.sideBarMenu div span {
  margin-left: 20px;
}

.sideBarMenu i {
  margin-right: 5px;
}

.bottom {
  color: white;
  bottom: 0;
  position: absolute;
  bottom: 20px;
  right: 0;
  padding-right: 20px;
  text-decoration: none;
}

.bottom:hover,
.link:hover {
  color: var(--secondary-color);
}

.link {
  margin-top: 0;
  color: white;
  cursor: pointer;
}

.userImage {
  height: 100px;
  width: 100px;
  border-radius: 50%;
}
</style>