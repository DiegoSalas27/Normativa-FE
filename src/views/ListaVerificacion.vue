<template>
  <section id="main">
    <h1>
      {{
        $route.params.lvCodigo
          ? "Editar Lista de Verificación"
          : "Registrar Lista de Verificación"
      }}
    </h1>
    <div class="flex-row px-5 mt-3" style="justify-content: space-around">
      <div>
        <div class="form-control">
          <span>Nombre: </span>&nbsp;
          <input
            class="w-5"
            type="text"
            style="width: 68%"
            placeholder="Ingrese el nombre de la lista de verificación"
            v-model="listaVerificacion.nombre"
          />
        </div>
        <!-- CRITERIOS -->
        <div class="form-control">
          <section class="form">
            <div class="flex-row" style="justify-content: space-between">
              <p><strong>Criterios</strong></p>
              <div>
                <i class="fas fa-plus-circle blue" @click="addCriterio"></i>
                <i class="fas fa-trash red ml-1" @click="deleteCriterios"></i>
              </div>
            </div>

            <h5 class="form-header">
              Ingrese el valor de prioridad de cada criterio según corresponda.
              El rango aceptado va desde 0.01 hasta 1.0
            </h5>
            <p style="font-weight: bold; text-align: right; margin-right: 10px">
              Prioridad
            </p>
            <div
              v-for="criterio in criterios"
              :key="criterio.criterioId"
              class="flex-row control"
              style="justify-content: space-between"
            >
              <input
                type="checkbox"
                :id="criterio.criterioId"
                :value="criterio.criterioId"
                v-model="checkedEntities"
                v-if="update"
              />
              <span v-if="!update" style="width: 80%">{{
                criterio.descripcion
              }}</span>
              <input
                v-if="update"
                type="text"
                style="width: 80%; margin-left: 5px"
                v-model="criterio.descripcion"
              />
              <span v-if="!update" style="width: 12%">{{ criterio.peso }}</span>
              <input
                v-if="update"
                type="number"
                style="width: 12%"
                v-model="criterio.peso"
              />
            </div>
            <div style="text-align: right; margin-right: 10px">
              <span style="margin-right: 30px">Total</span>
              <span style="margin-right: 20px">{{
                calculateCriteriaTotal
              }}</span>
            </div>
          </section>
        </div>
        <!-- END CRITERIOS -->

        <!-- NIVELES DE RIESGO -->
        <div class="form-control">
          <section class="form">
            <div class="flex-row" style="justify-content: space-between">
              <p><strong>Niveles de riesgo</strong></p>
            </div>

            <h5 class="form-header">
              Ingrese los valores mínimo y máximo para los niveles de riesgo. El
              rango va desde 0 hasta 100
            </h5>
            <div
              style="font-weight: bold; text-align: right; margin-right: 11%"
            >
              <span style="margin-right: 12%">Mínimo</span>
              <span>Máximo</span>
            </div>

            <div
              v-for="nivelRiesgo in nivelesRiesgo"
              :key="nivelRiesgo.nivelesRiesgoId"
              class="flex-row control"
              style="justify-content: space-evenly"
            >
              <span style="width: 40%; text-align: center">{{
                nivelRiesgo.nombre
              }}</span>
              <span v-if="!update" style="width: 15%; text-align: right">{{
                nivelRiesgo.extMinimo
              }}</span>
              <input
                v-if="update"
                type="number"
                style="width: 15%"
                v-model="nivelRiesgo.extMinimo"
              />
              <span v-if="!update" style="width: 15%">{{
                nivelRiesgo.extMaximo
              }}</span>
              <input
                v-if="update"
                type="number"
                style="width: 15%"
                v-model="nivelRiesgo.extMaximo"
              />
            </div>
          </section>
        </div>
        <!-- END NIVELES DE RIESGO -->
      </div>
      <div style="width: 50%">
        <div class="form-control">
          <div class="flex-row">
            <div style="text-align: left">
              <span>Fecha de creación</span>&nbsp;
              <span>{{
                $route.params.lvCodigo
                  ? new Date(
                      listaVerificacion.fechaCreacion
                    ).toLocaleDateString()
                  : new Date().toLocaleDateString()
              }}</span>
            </div>
            <button
              class="action-button"
              style="margin-right: 20%"
              @click="submit"
            >
              Guardar
            </button>
          </div>

          <!-- REQUERIMIENTOS -->
          <div class="form-control" style="margin-top: 35px">
            <section class="form">
              <div class="flex-row" style="justify-content: space-between">
                <div v-if="criterios.length > 0">
                  <a-select
                    :default-value="criterios[0].descripcion"
                    style="width: 100%"
                    @change="handleChange"
                  >
                    <a-select-option
                      v-for="criterio in criterios"
                      :key="criterio.criterioId"
                      :value="criterio.criterioId"
                    >
                      {{ criterio.descripcion }}
                    </a-select-option>
                  </a-select>
                </div>
                <div>
                  <i
                    class="fas fa-plus-circle blue"
                    @click="addRequerimiento"
                  ></i>
                  <i
                    class="fas fa-trash red ml-1"
                    @click="deleteRequerimientos"
                  ></i>
                </div>
              </div>
              <div v-if="activeKey.length > 0">
                <div
                  v-for="requerimiento in requerimientosFiltered"
                  :key="requerimiento.requerimientoId"
                  class="flex-row"
                  style="background: white"
                >
                  <input
                    type="checkbox"
                    class="req"
                    :id="requerimiento.requerimientoId"
                    :value="requerimiento.requerimientoId"
                    v-model="checkedRequerimientos"
                  />
                  <a-collapse v-model="activeKey" style="width: 100%">
                    <a-collapse-panel :header="requerimiento.descripcion">
                      <p>Descripción:</p>
                      <input
                        v-if="update"
                        type="text"
                        style="width: 100%; margin-bottom: 20px"
                        v-model="requerimiento.descripcion"
                      />
                      <p>Recomendación:</p>
                      <textarea
                        rows="3"
                        style="width: 100%"
                        v-model="requerimiento.recomendacion"
                      >
                      </textarea>
                    </a-collapse-panel>
                  </a-collapse>
                </div>
              </div>
            </section>
          </div>
          <!-- END REQUERIMIENTOS -->
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { BASE_URL } from "../common/constants";
import { handleErrors } from "../common/utils";
import { ICriterio } from "../interfaces/criterio.interface";
import { IRequerimiento } from "../interfaces/listaRequerimiento.interface";
import { IListaVerificacion } from "../interfaces/listaVerificacion.interface";
import { INivelesRiesgo } from "../interfaces/nivelesRiesgo.interface";
import { uuidv4 } from "../utils/guid";
import { emptyVerificationList } from "../utils/initializer";

export default defineComponent({
  data() {
    return {
      criterios: [] as ICriterio[],
      requerimientos: [] as IRequerimiento[],
      requerimientosFiltered: [] as IRequerimiento[],
      nivelesRiesgo: [] as INivelesRiesgo[],
      listaVerificacion: emptyVerificationList() as IListaVerificacion,
      update: true,
      checkedEntities: [] as string[],
      checkedRequerimientos: [] as string[],
      activeKey: [] as string[],
      currentlySelectedCriterio: "",
    };
  },
  computed: {
    calculateCriteriaTotal(): number {
      return +this.criterios.reduce((acc, el) => +el.peso + +acc, 0).toFixed(2);
    },
  },
  watch: {
    checkedEntities(): any {
      console.log(this.checkedEntities);
    },
    checkedRequerimientos(): any {
      console.log(this.checkedRequerimientos);
    },
    activeKey(key) {
      console.log(key);
    },
  },
  methods: {
    handleChange(value: string) {
      this.currentlySelectedCriterio = value;
      this.requerimientosFiltered = this.requerimientos.filter(
        (r) => r.criterio?.criterioId == value || r.criterioId == value
      );

      if (this.requerimientosFiltered.length == 0) {
        this.requerimientos.push({
          requerimientoId: uuidv4(),
          descripcion: "Nuevo requerimiento " + this.requerimientos.length,
          recomendacion: "",
          criterioId: value,
          listaVerificacionId: this.listaVerificacion.listaVerificacionId,
        });

        this.requerimientosFiltered = [
          this.requerimientos[this.requerimientos.length - 1],
        ];
      }

      this.activeKey = [
        this.requerimientosFiltered[0].requerimientoId as string,
      ];
    },
    deleteCriterios() {
      this.criterios = this.criterios.filter(
        (c) => !this.checkedEntities.includes(c.criterioId!)
      );

      this.requerimientos = this.requerimientos.filter(
        (c) => !this.checkedEntities.includes(c.criterioId!)
      );

      this.requerimientosFiltered = this.requerimientos.filter(
        (r) =>
          r.criterioId == this.currentlySelectedCriterio
      );
    },
    deleteRequerimientos() {
      this.requerimientos = this.requerimientos.filter(
        (c) => !this.checkedRequerimientos.includes(c.requerimientoId!)
      );

      this.requerimientosFiltered = this.requerimientos.filter(
        (r) =>
          r.criterioId == this.currentlySelectedCriterio
      );
    },
    addCriterio() {
      this.criterios.push({
        criterioId: uuidv4(),
        descripcion: "Nuevo criterio " + this.criterios.length,
        peso: 0,
      });
    },
    addRequerimiento() {
      this.requerimientos.push({
        requerimientoId: uuidv4(),
        descripcion: "Nuevo requerimiento " + this.requerimientos.length,
        recomendacion: "",
        criterioId: this.currentlySelectedCriterio,
        listaVerificacionId: this.listaVerificacion.listaVerificacionId,
      });

      this.requerimientosFiltered = this.requerimientos.filter(
        (r) =>
          r.criterioId == this.currentlySelectedCriterio
      );
    },
    async submit(): Promise<void> {
      const body = {
        Criterios: this.criterios,
        Requerimientos: this.requerimientos,
        NivelesRiesgo: this.nivelesRiesgo,
        ListaVerificacion: this.listaVerificacion,
      };
      console.log(body);
      debugger

      try {
        const response = await fetch(`${BASE_URL}listaverificaciones`, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          }),
          body: JSON.stringify(body),
        });

        await handleErrors(response);
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    (async () => {
      if (this.$route.params.lvCodigo) {
        try {
          const response = await fetch(
            `${BASE_URL}listaverificaciones/lista?filter=${this.$route.params.lvCodigo}`,
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
          this.listaVerificacion = listasVerificacion[0];
          const criteriosPrev = this.listaVerificacion.requerimientos
            .map((req: IRequerimiento) => req.criterio!)
            .sort((a, b) => a.descripcion.localeCompare(b.descripcion));
          const map = new Map();
          for (const criterio of criteriosPrev) {
            if (!map.has(criterio.descripcion)) {
              map.set(criterio.descripcion, true);
              this.criterios.push(criterio);
            }
          }
          this.requerimientos = this.listaVerificacion.requerimientos.sort(
            (a, b) =>
              a.criterio!.descripcion.localeCompare(b.criterio!.descripcion)
          );
          this.nivelesRiesgo = this.listaVerificacion.nivelesRiesgos;

          this.requerimientosFiltered = this.requerimientos.filter(
            (r) => r.criterio!.criterioId == this.criterios[0].criterioId
          );
          this.activeKey = [
            this.requerimientosFiltered[0].requerimientoId as string,
          ];
          this.currentlySelectedCriterio = this.criterios[0].criterioId!;
        } catch (err) {
          console.log(err);
        }
      } else {
        this.listaVerificacion.listaVerificacionId = uuidv4();
        this.listaVerificacion.fechaCreacion = new Date();
        this.criterios.push({
          criterioId: uuidv4(),
          descripcion: "Nuevo criterio",
          peso: 0,
        });
        this.requerimientos.push({
          requerimientoId: uuidv4(),
          descripcion: "Nuevo requerimiento",
          recomendacion: "",
          criterioId: this.criterios[0].criterioId,
          listaVerificacionId: this.listaVerificacion.listaVerificacionId,
        });
        this.nivelesRiesgo.push(
          {
            nivelesRiesgoId: uuidv4(),
            listaVerificacionId: this.listaVerificacion.listaVerificacionId,
            nombre: "Alto",
            extMinimo: "0",
            extMaximo: "0",
          },
          {
            nivelesRiesgoId: uuidv4(),
            listaVerificacionId: this.listaVerificacion.listaVerificacionId,
            nombre: "Medio",
            extMinimo: "0",
            extMaximo: "0",
          },
          {
            nivelesRiesgoId: uuidv4(),
            listaVerificacionId: this.listaVerificacion.listaVerificacionId,
            nombre: "Bajo",
            extMinimo: "0",
            extMaximo: "0",
          }
        );

        this.requerimientosFiltered = this.requerimientos.filter(
          (r) => r.criterioId == this.criterios[0].criterioId
        );
        this.activeKey = [
          this.requerimientosFiltered[0].requerimientoId as string,
        ];
        this.currentlySelectedCriterio = this.criterios[0].criterioId!;
      }
    })();
  },
});
</script>

<style scoped>
.form {
  width: 80%;
  background: #d2d2d2;
  border-radius: 5px;
  padding-bottom: 20px;
}

.form .flex-row {
  padding: 10px;
}
.form-header {
  color: white;
  background: var(--placeholder);
  padding: 10px;
}
input {
  width: max-content;
}
input[type="checkbox"].req {
  margin-right: 20px;
  align-self: center;
}

p {
  margin-bottom: 0;
}

.action-button.blocked {
  background: var(--accent);
  cursor: auto;
}
.action-button.massive {
  position: relative;
  top: 10px;
  right: 0px;
  width: 240px;
}
i {
  cursor: pointer;
}
</style>

