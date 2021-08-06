import SideBar from '@/components/layout/SideBar.vue';
<template>
  <section id="sideBar">
    <nav :class="expand ? 'sideBarMenu' : 'sideBarMenu minimized'">
      <!-- <ul class="sideBarItems">
        <li v-for="option in options" :key="option.name">
          
        </li>
      </ul> -->
      <img :src="userImage" :alt="userImage" class="userImage" />
      <p>Bienvenido</p>
      <div @click="goProfile()" class="link">
        <i :class="expand ? 'fas fa-user' : 'fas fa-user fa-lg show'"></i
        ><span v-if="expand">Mi perfil</span>
      </div>
      <!-- <div>
        <span>{{ user.nombres }} {{ user.apellidos }}</span>
      </div> -->
      <div>
        <i :class="expand ? 'far fa-envelope' : 'far fa-envelope fa-lg show'"></i>
        <span v-if="expand">{{ user?.email }}</span>
      </div>
      <div>
        <i :class="expand ? 'fas fa-phone' : 'fas fa-phone fa-lg show'"></i>
        <span v-if="expand">{{ user?.phoneNumber }}</span>
      </div>
      <div>
        <i
          :class="expand ? 'fas fa-user-shield' : 'fas fa-user-shield fa-lg show'"
        ></i>
        <span v-if="expand">{{ user?.rol }}</span>
      </div>

      <router-link class="bottom" to="/"
        >Salir &nbsp;&nbsp; <i class="fas fa-sign-out-alt"></i>
      </router-link>
    </nav>
    <button
      @click="minimize"
      :class="expand ? 'leftArrow' : 'rightArrow'"
    >
      <i :class="expand ? 'arrow left' : 'arrow right'"></i>
    </button>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: ["user"],
  emits: ["minimized"],
  data() {
    return {
      userImage:
        this.user && this.user.imagen
          ? this.user.imagen
          : require("@/assets/images/adminImg.png"),
      expand: true,
    };
  },
  methods: {
    goProfile(): void {
      this.$router.push({
        name: "Profile",
      });
    },
    minimize(): void {
      this.expand = !this.expand;
      this.$emit("minimized", this.expand);
    },
  },
});

</script>


<style scoped>
.far.show {
  margin-left: 70px;
}
.fas.show {
  margin-left: 70px;
}

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
  transition: 500ms;
  font-size: 16px;
  z-index: 2;
  flex-direction: column;
  align-items: center;
}

.sideBarMenu.minimized {
  width: 110px;
}

.rightArrow {
  position: fixed;
  transform: translateY(-50%);
  top: 120px;
  margin-right: -15px;
  left: 5.9rem;
  width: 30px;
  height: 30px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 9999;
  border-radius: 50%;
  transition: 500ms !important;
  background: rgb(247, 247, 247);
}

.rightArrow:hover {
  cursor: pointer;
  background: #fff !important;
}
.rightArrow:hover i {
  border: solid #0f7c90;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
}

.rightArrow .right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.leftArrow {
  position: fixed;
  transform: translateY(-50%);
  top: 120px;
  margin-right: -15px;
  left: 12.8rem;
  width: 30px;
  height: 30px;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 9999;
  border-radius: 50%;
  transition: 500ms !important;
  background: rgb(247, 247, 247);
}

.leftArrow:hover {
  cursor: pointer;
  background: #fff !important;
}
.leftArrow:hover i {
  border: solid #0f7c90;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
}

.leftArrow .left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.arrow {
  border: solid #aaaaaa;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transition: 0.200s;
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