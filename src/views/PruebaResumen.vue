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
    <div
      v-if="canEdit"
      style="display: flex; align-items: center; justify-content: space-between"
    >
<div>


      <div>
        <h4 style="display: inline">
          Ingrese el porcentaje de cumplimiento deseado:
        </h4>
        <input
          class="percentage"
          type="number"
          :min="porcentajeCumplimiento"
          max="101"
          @change="setValue"
          :value="porcentajeCumplimientoDeseado"
          oninput="this.value = Math.abs(this.value)"
        />
        <abbr
          :title="'El valor debe ser mayor o igual a ' + porcentajeCumplimiento"
        >
          <i class="fas fa-info-circle"></i 
        ></abbr>
      </div>

<!--ga -->
<br>
      <div>
        <h4 style="display: inline">
          Ingrese el margen de error que usted desee:
        </h4>
        <input 
          class="percentage"
          type="number"
          min="0"
          max="100"
          oninput="this.value = Math.abs(this.value)"
         @change="setValue2"
          
          :value="margen"
        />
        <abbr
          :title="'Puede el poner el margen que desee pero se le recomienda un máximo de 10 '"
        >
          <i class="fas fa-info-circle"></i
        ></abbr>
      </div>
</div> 

      <div>
        <table class="grid">
          <thead class="header-grid">
            <tr>
              <th>Nivel de riesgo</th>
              <th>Porcentaje de cumplimiento actual</th>
            </tr>
          </thead>
          <tbody :class="rowBodyStyle ? rowBodyStyle : ''">
            <tr>
              <td>{{ nivelDeRiesgo }}</td>
              <td>{{ porcentajeCumplimiento }} %</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- <div>
        <h4 style="display: inline">Porcentaje actual:</h4>
        &nbsp;&nbsp;
        <span>{{ porcentajeCumplimiento }}%</span>
      </div> -->

      <div class="options-buttons" style="display: flex; align-items: center">
        <button class="action-button" @click="summary">Resumen</button>

        <button
          class="action-button"
          :class="
            porcentajeCumplimientoDeseado < porcentajeCumplimiento
              ? 'action-button blocked'
              : 'action-button'
          "
          @click="idealScenario"
          :disabled="porcentajeCumplimientoDeseado < porcentajeCumplimiento"
        >
          Escenario deseado
        </button>
      </div>
    </div>

    

    <div class="summary">
      <div class="header-summary">
        <h1>{{ headingTitle }}</h1>
      </div>
      <div class="summary-body">
        <div
          class="body-item"
          v-for="(req, index) in requerimientos"
          :key="req.requerimientoId"
        >
          <div
            class="body-item-header flex-row"
            style="paddingbottom: 20px; paddingtop: 20px"
          >
            <h3>Pregunta {{ req.posicion ? req.posicion : index + 1 }}:</h3>
            <span style="width: 70%">{{ req.descripcion }}</span>
            <span style="marginleft: 5px">{{ respuestaItem(index) }}</span>
          </div>

          <div class="body-item-content" style="paddingbottom: 20px">
            <div
              class="flex-row"
              style="justify-content: flex-start; gap: 20px"
            >
              <p>Justificación:</p>
              <textarea
                name="justificacion"
                id="justi"
                cols="80"
                rows="5"
                style="width: 85%"
                disabled="true"
                :value="evidenciaRequerimiento[index]?.justificacion"
              ></textarea>
              <div>
                <i class="far fa-file-pdf"></i>
                <span
                  style="textdecoration: underline; cursor: pointer"
                  @click="downloadEvidencia(evidencia[index])"
                  >Descargar evidencia</span
                >
              </div>
            </div>
            <br />
            <div
              class="flex-row"
              style="justify-content: flex-start; gap: 20px"
              v-if="evidenciaRequerimiento[index]"
            >
              <p>Recomendación:</p>
              <textarea
                name="recomendacion"
                id="recom"
                cols="120"
                rows="5"
                style="width: 85%"
                disabled="true"
                v-model="evidenciaRequerimiento[index].recomendacion"
              ></textarea>
              <button
                :class="
                  evidenciaRequerimiento[index]?.respuestaItem != null &&
                  evidenciaRequerimiento[index]?.respuestaItem != 1 &&
                  !evidenciaRequerimiento[index]?.accionMigitagcion
                    ? 'action-button thin'
                    : 'action-button thin blocked'
                "
                @click="saveRecomendacion(index)"
                :disabled="evidenciaRequerimiento[index]?.accionMigitagcion"
                v-if="
                  evidenciaRequerimiento[index]?.respuestaItem != null &&
                  evidenciaRequerimiento[index]?.respuestaItem != 1 &&
                  canEdit
                "
              >
                Añadir ({{ accionesMitigacionCreadas }})
              </button>
            </div>
            <br />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import NavBar from "@/components/layout/NavBar.vue";
import { emptyUser } from "../utils/initializer";
import { IUser } from "../interfaces/user.interface";
import { getUsuario } from "../services/authService";
import { IEvidenciaRequerimiento } from "../interfaces/evidenciaRequerimiento.interface";
import { IEvidencia } from "../interfaces/evidencia.interface";
import { IRequerimiento } from "../interfaces/listaRequerimiento.interface";
import { IListaVerificacion } from "../interfaces/listaVerificacion.interface";
import { ICriterio } from "../interfaces/criterio.interface";
import { handleErrors } from "../common/utils";
import { uuidv4 } from "../utils/guid";
import Modal from "../components/ui/Modal.vue";
import { BASE_URL, rol } from "../common/constants";
import { IPrueba, IPruebaResultados } from "../interfaces/prueba.interface";

export default defineComponent({
  components: {
    NavBar,
    Modal,
  },

  data() {
    return {
      userInfoJson: emptyUser() as IUser,
      headingTitle: "Resumen",
      evidencia: [] as IEvidencia[],
      evidenciaRequerimiento: [] as IEvidenciaRequerimiento[],
      requerimientos: [] as IRequerimiento[],
      criterios: [] as ICriterio[],
      porcentajeCumplimiento: 0,
      porcentajeCumplimientoDeseado: 0,
      margen:0,
      nivelDeRiesgo: "",
      accionesMitigacionCreadas: 0,
      message: null as string | null,
      loading: false,
      pruebaResultados: {} as IPruebaResultados,
      error: false,
      canEdit: false,
    };
  },
  methods: {
    async downloadEvidencia(evidencia: IEvidencia): Promise<void> {
      this.message = "Cargando...";
      try {
        fetch(`${BASE_URL}evidencia/downloadfile/${evidencia.adjuntoURL}`, {
          method: "GET",
          headers: new Headers({
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
        })
          .then((response) => response.blob())
          .then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = evidencia.adjunto as string;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
            this.message = null;
          });
      } catch (err) {
        console.log(err);
      }
    },
    handleError() {
      this.message = null;
    },
    setValue(event: { target: HTMLInputElement }) {
      if (Number(event.target.value) < this.porcentajeCumplimiento) {
        event.target.value = this.porcentajeCumplimiento.toString();
      }
      if (Number(event.target.value) >= 100) {
            event.target.value = "100";
      }
      this.porcentajeCumplimientoDeseado = +event.target.value;

      if(this.porcentajeCumplimientoDeseado+this.margen>100)
      {
        //this.porcentajeCumplimientoDeseado=this.porcentajeCumplimientoDeseado-1;
        this.margen= Math.round((100-this.porcentajeCumplimientoDeseado)*100)/100;
      }
 
console.log(this.porcentajeCumplimientoDeseado)
    },

  setValue2(event:{ target: HTMLInputElement }) {

      this.margen = +event.target.value;

      if(this.porcentajeCumplimientoDeseado+this.margen>100)
      {
        this.porcentajeCumplimientoDeseado= Math.round((100-this.margen)*100)/100;
        
       // this.margen=this.margen-1;
       console.log(this.porcentajeCumplimientoDeseado)
      }     
  },



    back(): void {
      this.$router.back();
    },
    async summary(): Promise<void> {
      await this.realScenario();
    },


    async idealScenario(): Promise<void> {


      if (this.porcentajeCumplimientoDeseado < this.porcentajeCumplimiento)
      
        return;


     this.message = "Cargando...";
      try {
        const response = await fetch(
          `${BASE_URL}prueba/${this.$route.params.pr_codigo}/${this.porcentajeCumplimientoDeseado}/${this.margen}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
              
            }),
          }
        );
        console.log("GAAAAAAAAAAAAAAAAAAAAAAAAA");
        console.log(this.porcentajeCumplimientoDeseado);
        await handleErrors(response);

        let nuevoporcentaje =
          (await response.json())as any;
          let evidenciasRequerimientos=(nuevoporcentaje.reque2) as any[];
console.log(nuevoporcentaje.limit)

alert("Toma en cuenta que tu porcentaje de cumplimiento obtenido es "+ nuevoporcentaje.limit+"%");


        this.requerimientos = this.requerimientos.filter((req, index) =>
          evidenciasRequerimientos.some((evR) => {
            if (evR.requerimientoId == req.requerimientoId) {
              req.posicion = index + 1;
              return true;
            }
          })
        );
        if (evidenciasRequerimientos.length > 0) {
          this.evidencia = [];
          this.evidenciaRequerimiento = [];
          evidenciasRequerimientos = this.requerimientos
            .map((req) => {
              return evidenciasRequerimientos.find(
                (evR) => evR.requerimientoId == req.requerimientoId
              );
            })
            .filter((evR) => evR !== undefined) as IEvidenciaRequerimiento[];
          evidenciasRequerimientos.forEach((er) => {
            this.evidencia.push({
              evidenciaId: er.evidencia?.evidenciaId,
              nombre: er.evidencia?.nombre,
              adjunto: er.evidencia?.adjunto,
              codigo: er.evidencia?.codigo,
              adjuntoURL: er.evidencia?.adjuntoURL,
            });
            this.evidenciaRequerimiento.push({
              evidenciaId: er.evidenciaId,
              requerimientoId: er.requerimientoId,
              pruebaId: er.pruebaId,
              justificacion: er.justificacion,
              respuestaItem: er.respuestaItem,
              recomendacion: er.recomendacion,
              tratamientoId: er.tratamientoId,
              tratamientoCodigo: er.tratamientoCodigo,
              accionMigitagcion: er.accionMigitagcion,
            });
          });
        }
        this.headingTitle = "Escenario deseado";
        this.message = "";
      } catch (error) {
        this.error = true;
        const errorObj = JSON.parse(error?.message);
        const mensaje = errorObj.errores.mensaje;
        this.message = mensaje;
        console.log("GAAAAAAAAAAAAAAAAAAAAAAAAA");
        console.log(this.porcentajeCumplimientoDeseado);
      }
    },


    async realScenario(): Promise<void> {
      var hardcodeo=1
      this.message = "Cargando...";
      try {
        const response = await fetch(
          `${BASE_URL}listaverificaciones/lista?filter=${this.$route.params.lv_codigo}&nuevo=${hardcodeo}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );
        const listasVerificacion =
          (await response.json()) as IListaVerificacion[];
        const criteriosPrev = listasVerificacion[0].requerimientos
          .map((req: IRequerimiento) => req.criterio!)
          .sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        const map = new Map();
        for (const criterio of criteriosPrev) {
          if (!map.has(criterio.descripcion)) {
            map.set(criterio.descripcion, true);
            this.criterios.push(criterio);
          }
          
        }
        this.requerimientos = listasVerificacion[0].requerimientos.sort(
          (a, b) => a.criterio!.descripcion.localeCompare(b.criterio!.descripcion)
        );
      } catch (err) {
        console.log(err);
      }

      //////////////////////////////////////////////////////
      try {
        const response = await fetch(
          `${BASE_URL}evidenciarequerimiento/${this.$route.params.pr_codigo}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );
        let evidenciasRequerimientos =
          (await response.json()) as IEvidenciaRequerimiento[];
        console.log(evidenciasRequerimientos);
        this.porcentajeCumplimiento = evidenciasRequerimientos[0]
          .pruebaPorcentajeCumplimiento as number;
        this.accionesMitigacionCreadas = evidenciasRequerimientos.filter(
          (evR) => evR.accionMigitagcion
        ).length;
        if (evidenciasRequerimientos.length > 0) {
          this.evidencia = [];
          this.evidenciaRequerimiento = [];
          evidenciasRequerimientos = this.requerimientos
            .map((req) => {
              return evidenciasRequerimientos.find(
                (evR) => evR.requerimientoId == req.requerimientoId
              );
            })
            .filter((evR) => evR !== undefined) as IEvidenciaRequerimiento[];
          evidenciasRequerimientos.forEach((er) => {
            this.evidencia.push({
              evidenciaId: er.evidencia?.evidenciaId,
              nombre: er.evidencia?.nombre,
              adjunto: er.evidencia?.adjunto,
              codigo: er.evidencia?.codigo,
              adjuntoURL: er.evidencia?.adjuntoURL,
            });
            this.evidenciaRequerimiento.push({
              evidenciaId: er.evidenciaId,
              requerimientoId: er.requerimientoId,
              pruebaId: er.pruebaId,
              justificacion: er.justificacion,
              respuestaItem: er.respuestaItem,
              recomendacion: er.recomendacion,
              tratamientoId: er.tratamientoId,
              tratamientoCodigo: er.tratamientoCodigo,
              accionMigitagcion: er.accionMigitagcion,
            });
          });
        }
        this.headingTitle = "Resumen";
        this.message = "";
      } catch (err) {
        console.log(err);
      }
    },

    ////////    //////////
    async obtenerPruebaResults(): Promise<void> {
      try {
        const response = await fetch(
          `${BASE_URL}prueba/${this.$route.params.pr_codigo}`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            }),
          }
        );
        await handleErrors(response);
        this.pruebaResultados = await response.json();
        this.nivelDeRiesgo = this.pruebaResultados.nivelDeRiesgo;
      } catch (error) {
        this.error = true;
        const errorObj = JSON.parse(error.message);
        // this.validationForm.email = errorObj.errores.mensaje;
      }
    },

    ////////////

    respuestaItem(index: number): string {
      let respuesta = "No implementado";
      switch (this.evidenciaRequerimiento[index]?.respuestaItem) {
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
    async saveRecomendacion(index: number): Promise<void> {
      const evidenciaReq = this.evidenciaRequerimiento[index];
      const body = {
        TratamientoId: evidenciaReq.tratamientoId,
        AccionMitigacionId: uuidv4(),
        Descripcion: this.requerimientos[index].descripcion,
        Estado: false,
      };
      try {
        const response = await fetch(
          `${BASE_URL}evidenciarequerimiento/${evidenciaReq.pruebaId}/${evidenciaReq.requerimientoId}`,
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
        this.evidenciaRequerimiento[index].accionMigitagcion = true;
        this.accionesMitigacionCreadas++;
        // this.$router.push(`/plan-tratamiento/${evidenciaReq.tratamientoCodigo}`);
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    (async () => {
      this.userInfoJson = await getUsuario();
      if (
        this.userInfoJson.rol == rol.JEFE_DE_RIESGOS &&
        this.$route.query.edit == "true"
      ) {
        this.canEdit = true;
      } else this.canEdit = false;
      await this.realScenario();
      await this.obtenerPruebaResults();
    })();
    console.log();
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
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  height: 55.2px;
  border-right: 1px solid white;
}
table {
  margin-bottom: 3vw;
}

th,
td {
  padding: 0 !important;
}

.options-buttons button:nth-child(2) {
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  height: 55.2px;
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
.action-button.thin {
  height: 40px;
  padding: 10px 2px;
}
.action-button.blocked {
  background: var(--accent);
  cursor: auto;
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
</style>