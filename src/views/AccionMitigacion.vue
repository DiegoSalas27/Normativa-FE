<template>
  <nav-bar
    :name="userInfoJson?.nombres"
    :lastName="userInfoJson?.apellidos"
  ></nav-bar>
  <modal
    :show="!!message"
    :title="message"
    @close="handleError"
    :error="error"
    :loading="loading"
  ></modal>
  <section id="main">
    <h1 style="text-align: left; cursor: pointer" @click="back">
      <i class="fas fa-chevron-circle-left"></i> Volver
    </h1>
    <br />
    <div class="summary">
      <div class="summary-body">
        <div
          class="body-item-header flex-row"
          style="paddingbottom: 20px; paddingtop: 20px"
        >
          <h3>Pregunta:</h3>
          <span style="width: 70%">{{
            evidenciaRequerimientoAccionMitigacion.requerimientoDescripcion
          }}</span>
          <span style="marginleft: 5px">{{ respuestaItem() }}</span>
        </div>
        <div class="body-item-content" style="paddingbottom: 20px">
          <div class="flex-row">
            <p>Justificación:</p>
            <textarea
              name="justificacion"
              id="justi"
              cols="80"
              rows="5"
              style="width: 71.5%"
              disabled="true"
              :value="evidenciaRequerimientoAccionMitigacion.justificacion"
            ></textarea>
            <div>
              <i class="far fa-file-pdf"></i>
              <span style="textdecoration: underline; cursor: pointer"
                >Descargar evidencia</span
              >
            </div>
          </div>
          <br />
          <div class="flex-row">
            <p>Recomendación:</p>
            <textarea
              name="recomendacion"
              id="recom"
              cols="120"
              rows="5"
              style="width: 75%"
              disabled="true"
              :value="evidenciaRequerimientoAccionMitigacion.recomendacion"
            ></textarea>
          </div>
          <br />
        </div>
      </div>
    </div>
    <div id="comentarios">
      <h3>Comentarios</h3>
      <br />
      <input
        type="text"
        v-model="comentarioInput"
        placeholder="Escribe tu comentario"
      />
      &nbsp;&nbsp;
      <button class="action-button blocked" @click="sendMessage">Enviar</button>
       <div class="info-field" style="display: inline-block; float: right;">
        <span>Estado</span>&nbsp;&nbsp;
        <select
          class="select"
          :value="evidenciaRequerimientoAccionMitigacion.estadoAccionMitigacion ? 'Terminado' : 'En Proceso'"
          @change="changedEstado"
          name="estado"
        >
          <option v-for="estado in estados" :key="estado" :value="estado">
            {{ estado }}
          </option>
        </select>
      </div>
      <div
        class="comentario-lista"
        v-for="(
          comentario, index
        ) in evidenciaRequerimientoAccionMitigacion.comentarioLista"
        :key="comentario.descripcion"
      >
        <img
          :src="require('@/assets/images/adminImg.png')"
          alt="userImage"
          class="userImage"
        />
        <div class="flex-row" style="display: inline-flex">
          <div>
            <h4>
              {{ comentario.nombreUsuario }}
              {{ "(" + comentario.usuarioRol + ")" }}
            </h4>
            <p>{{ comentario.descripcion }}</p>
          </div>
          <p>{{ calculateTimeFromNow(comentario.fechaCreacion) }}</p>
          <p v-if="index == 0" style="color: #FFEA00">Último mensaje</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import moment from "moment";
import NavBar from "@/components/layout/NavBar.vue";
import { defineComponent } from "@vue/runtime-core";
import { BASE_URL, estadoAccionMitigacion } from "../common/constants";
import { handleErrors } from "../common/utils";
import Modal from "../components/ui/Modal.vue";
import { IEvidenciaRequerimientoAccionMitigacion } from "../interfaces/accionMitigacion";
import { IUser } from "../interfaces/user.interface";
import { getUsuario } from "../services/authService";
import { emptyUser } from "../utils/initializer";

export default defineComponent({
  components: {
    NavBar,
    Modal,
  },
  data() {
    return {
      userInfoJson: emptyUser() as IUser,
      evidenciaRequerimientoAccionMitigacion:
        {} as IEvidenciaRequerimientoAccionMitigacion,
      comentarioInput: "",
      message: null as string | null,
      loading: false,
      error: false,
      estados: estadoAccionMitigacion,
    };
  },
  methods: {
    async changedEstado(event: { target: HTMLInputElement }) {
      if (event.target.value == estadoAccionMitigacion[0]) {
        this.evidenciaRequerimientoAccionMitigacion.estadoAccionMitigacion = false;
      } else {
        this.evidenciaRequerimientoAccionMitigacion.estadoAccionMitigacion = true;
      }
      const body = {
        Estado: this.evidenciaRequerimientoAccionMitigacion.estadoAccionMitigacion,
      }

      try {
        const response = await fetch(
          `${BASE_URL}accionmitigacion/estado/${this.$route.params.acm_id}`,
          {
            method: "PUT",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
            body: JSON.stringify(body),
          }
        );

        await handleErrors(response);

        this.message = "¡Se ha editado accion exitósamente!";
        
        setTimeout(() => {
          this.message = '';
        }, 1500);
      } catch (error) {
        console.log(error);
      }
    },
    calculateTimeFromNow(date: Date) {
      return moment(date).locale("es").fromNow();
    },
    handleError() {
      this.message = null;
    },
    back(): void {
      this.$router.back();
    },
    respuestaItem(): string {
      let respuesta = "No implementado";
      switch (this.evidenciaRequerimientoAccionMitigacion.respuestaItem) {
        case 1:
          respuesta = "Totalmente";
          break;
        case 0.5:
          respuesta = "Parcialmente";
          break;
        case 0:
          respuesta = "No implementado";
          break;
        case null:
          respuesta = "No aplica";
          break;
        default:
          break;
      }

      return respuesta;
    },
    async sendMessage(): Promise<void> {
      const body = {
        Descripcion: this.comentarioInput,
        UsuarioId: this.userInfoJson.id,
        AccionMitigacionId: this.$route.params.acm_id,
      };
      try {
        const response = await fetch(`${BASE_URL}comentarios`, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
          body: JSON.stringify(body),
        });

        await handleErrors(response);

        this.evidenciaRequerimientoAccionMitigacion.comentarioLista.unshift({
          nombreUsuario:
            this.userInfoJson.nombres + " " + this.userInfoJson.apellidos,
          fechaCreacion: new Date(),
          descripcion: this.comentarioInput,
          usuarioRol: this.userInfoJson.rol as string
        });

        

        this.comentarioInput = "";
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    (async () => {
      try {
        this.userInfoJson = await getUsuario();
        const response = await fetch(
          `${BASE_URL}evidenciarequerimiento/accion-mitigacion/${this.$route.params.acm_id}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );

        await handleErrors(response);

        this.evidenciaRequerimientoAccionMitigacion =
          (await response.json()) as IEvidenciaRequerimientoAccionMitigacion;

        console.log(this.evidenciaRequerimientoAccionMitigacion);
      } catch (error) {
        console.log(error);
      }
    })();
  },
});
</script>

<style scoped>
#main {
  margin-left: 0px;
  margin: 90px 40px;
}
.percentage {
  width: 56px;
  height: 26px;
}
.options-buttons button:first-child {
  position: relative;
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  height: 55.2px;
  top: -32px;
  border-right: 1px solid white;
}
.options-buttons button:nth-child(2) {
  position: relative;
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  top: -40.5px;
  border-left: 1px solid white;
}
.summary {
  position: absolute;
  width: 100%;
  margin-left: -40px;
}
.header-summary {
  padding: 10px 0;
  background: #54a1d4;
  color: white;
}
#comentarios {
  position: absolute;
  top: 480px;
  text-align: left;
}

.action-button {
  height: 35px;
  padding: 5px 2px;
}
.action-button.blocked {
  background: var(--accent);
  cursor: pointer;
}
.action-button.blocked:hover {
  background: #848484;
}

.body-item-header {
  background: #d0eafb;
  padding: 10px 40px;
}
.body-item-content {
  background: #f5f5f5;
  padding: 10px 40px;
}
textarea {
  padding: 10px;
}
.userImage {
  height: 100px;
  width: 100px;
  border-radius: 50%;
}
.comentario-lista img {
  position: relative;
  top: 38px;
  width: 60px;
  height: 60px;
}

.comentario-lista .flex-row {
  border: 2px solid #dadada;
  align-items: center;
  width: 600px;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  margin-left: 10px;
}
</style>
