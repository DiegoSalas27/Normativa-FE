import { IColumnsGrid } from '../interfaces/grid.interface';

export const urlConstants = {
  //roles

  ADMINISTRADOR: 'Profile',
  ALTA_GERENCIA: 'AltaGerencia',
  PROFILE_ALTA_GERENCIA: 'ProfileAltaGerencia',
  PROFILE_ANALISTA: 'ProfileAnalista',
  ANALISTAS: 'Analistas',
  ESPECIALISTAS: 'ListaEspecialistas',
  PROFILE_JEFE_DE_RIESGOS: 'ProfileJefeRiesgos',
  PROFILE_AUDITOR: 'ProfileEspecialista',
  JEFE_DE_RIESGOS: 'JefeRiesgos',

  //funcionalidades
  REALIZAR_PRUEBA: 'Evaluacion',
  REALIZAR_PRUEBA_EVALUACION: 'Prueba',
  VISUALIZAR_INFORME: 'TipoInforme',

  GENERAR_LISTA: 'ListasVerificacionCrear',
  MODIFICAR_LISTA: 'ModificarListaVerificacion',
  MODIFICAR_EVALUACIONES: 'ModificarEvaluaciones'
}

export const rol = {
  ANALISTA: 'Analistas',
  JEFE_DE_RIESGOS: 'Jefe de riesgos',
  ADMINISTRADOR: 'Administrador',
  ALTA_GERENCIA: 'Alta gerencia',
  ESPECIALISTA: 'Especialistas'
}

export const columnsRolList: IColumnsGrid[] = [
  {
    field: 'codigo',
    title: 'Código',
    type: 'text'
  },
  {
    field: 'nombre',
    title: 'Nombre',
    type: 'text'
  },
  {
    field: 'especialidad',
    title: 'Especialidad',
    type: 'text'
  },
  {
    field: 'email',
    title: 'Correo electrónico',
    type: 'text'
  },
  {
    field: 'phoneNumber',
    title: 'Número de teléfono',
    type: 'text'
  },
  {
    field: 'fechaNacimiento',
    title: 'Edad',
    type: 'text'
  }
]
export const columnsRolList2: IColumnsGrid[] = [
  {
    field: 'codigo',
    title: 'Código',
    type: 'text'
  },
  {
    field: 'nombre',
    title: 'Nombre',
    type: 'text'
  },
  {
    field: 'email',
    title: 'Correo electrónico',
    type: 'text'
  },
  {
    field: 'phoneNumber',
    title: 'Número de teléfono',
    type: 'text'
  },
  {
    field: 'fechaNacimiento',
    title: 'Edad',
    type: 'text'
  }
]

export const columnsListaVerificacionDiegoSalas: IColumnsGrid[] = [
  {
    field: 'codigo',
    title: 'Código',
    align: 'center',
    type: 'text'
  },
  {
    field: 'nombre',
    title: 'Nombre',
    align: 'center',
    type: 'text'
  },
  {
    field: 'numeroRequerimientos',
    title: 'Número de requerimientos',
    align: 'center',
    type: 'text'
  },
  {
    field: 'fechaCreacion',
    title: 'Fecha de creación',
    align: 'center',
    type: 'date'
  },
];

export const columnsPlanesTratamientoList: IColumnsGrid[] = [
  {
    field: 'codigo',
    title: 'Código',
    type: 'text'
  },

  {
    field: 'nombre',
    title: 'Nombre del Plan',
    type: 'text'
  },
  /*
  {
    field: 'fechaInicio',
    title: 'Fecha de Inicio',
    type: 'text'
  },
  {
    field: 'fechaFin',
    title: 'Fecha de fin',
    type: 'text'
  },

  */
  {
    field: 'estado',
    title: 'Estado',
    type: 'text'
  },
  {
    field: 'evaluacion',
    title: 'Evaluación',
    type: 'text'
  },
  {
    field: 'nuevoresponsable',
    title: 'Responsable',
    type: 'text'
  },
]


export const columnsVerificacionList: IColumnsGrid[] = [
  {
    field: 'criterios',
    title: 'Criterios',
    type: 'text'
  },

  {
    field: 'prioridad',
    title: 'Prioridad',
    type: 'text'

  },
]



export const columnsVerificacionList2: IColumnsGrid[] = [
  {
    field: 'niveles',
    title: 'Niveles',
    type: 'text'
  },

  {
    field: 'minimo',
    title: 'Minimo',
    type: 'text'

  },

  {
    field: 'maximo',
    title: 'Maximo',
    type: 'text'

  },

  {
    field: 'requerimientos',
    title: 'Requerimientos',
    type: 'text'

  },
]


export const columnsRiesgoNormativaList: IColumnsGrid[] = [

  {
    field: 'ListaVerificacion',
    title: 'Lista de Verificacion',
    type: 'text'
  },
/*
  {
    field: 'codigo',
    title: 'Cod. de evaluacion',
    type: 'text'
  },
*/
  {
    field: 'nombre',
    title: 'Nombre de evaluacion',
    type: 'text'
  },

  {
    field: 'NivelDeRiesgo',
    title: 'Nivel de Riesgo',
    type: 'text'
  },

  {
    field: 'PorcentajeDeCumplimiento',
    title: 'Porcentaje de Cumplimiento',
    type: 'text'
  },

  {
    field: 'fecha',
    title: 'Fecha de Creación',
    type: 'text'
  },
  /*
  {
    field: 'duracion',
    title: 'Duración',
    type: 'text'
  },
  */
]

export const columnsEvaluacionesList: IColumnsGrid[] = [
  {
    field: 'codigo',
    title: 'Código',
    type: 'text'
  },
  {
    field: 'obra',
    title: 'Obra',
    type: 'text'
  },

 {
    field: 'NivelDeRiesgo',
    title: 'Nivel de Riesgo',
    type: 'text'
  },

  {
    field: 'ListaVerificacion',
    title: 'Lista de Verificacion',
    type: 'text'
  },

  {
    field: 'PorcentajeDeCumplimiento',
    title: 'Porcentaje de Cumplimiento',
    type: 'text'
  },

  {
    field: 'Estado',
    title: 'Estado',
    type: 'text'
  },
  /*
  {
    field: 'duracion',
    title: 'Duración',
    type: 'text'
  },
  */
]

export const columnsPruebaLista: IColumnsGrid[] = [
  {
    field: 'id',
    title: 'Nª',
    type: 'number',
    align: 'center',
  },
  {
    field: 'fechaCreacion',
    title: 'Fecha de creación',
    type: 'text',
    align: 'center',
  },
  {
    field: 'estado',
    title: 'Estado',
    type: 'text',
    align: 'center',
  }
]

export const actions = {
  DELETE: 'delete',
  EDIT: 'edit',
}

export const entity = {
  USER: 'usuario',
  PRUEBA: 'prueba',
  EVALUACION: 'evaluacion',
  TRATAMIENTO: 'plantratamiento'
}

// Rol Actions

export const AdminUserActions = [
  {
    src: require("@/assets/images/Icon_Alta_Gerencia.jpg"),
    description: "Alta gerencia",
    url: urlConstants.ALTA_GERENCIA,
  },
  {
    src: require("@/assets/images/Icon_Analista.jpg"),
    description: "Analistas",
    url: urlConstants.ANALISTAS,
  },
  {
    src: require("@/assets/images/Icon_Especialista.jpg"),
    description: "Especialista",
    url: urlConstants.ESPECIALISTAS,
  },
  {
    src: require("@/assets/images/Icon_Jefe_Riesgos.jpg"),
    description: "Jefe de riesgos",
    url: urlConstants.JEFE_DE_RIESGOS,
  },
];

export const AnalistaUserActions = [
  {
    src: require("@/assets/images/RealizarPrueba_Analista.png"),
    description: "Realizar prueba",
    url: urlConstants.REALIZAR_PRUEBA,
    props: 'registrar'
  },
];

export const EspecialistaUserActions = [
  {
    src: require("@/assets/images/GenerarListaVerificación_Especialista.jpg"),
    description: "Generar lista de verificación",
    url: urlConstants.GENERAR_LISTA,
  },
  {
    src: require("@/assets/images/ModificarListaVerificación_Especialista.jpg"),
    description: "Modificar lista de verificación",
    name: 'TableUser',
    params:  { type: 'ListasVerificacion' }
  },
  {
    src: require("@/assets/images/ModificarEvaluaciones_Especialista.png"),
    description: "Modificar evaluaciones",
    url: urlConstants.MODIFICAR_EVALUACIONES,
  },
];


export const estadoAccionMitigacion = [
  'En Proceso',
  'Terminado'
]


  export const BASE_URL = "https://sistemaexperto.azurewebsites.net/api/";
// export const BASE_URL = "http://localhost:55016/api/";
//export const BASE_URL = "http://localhost:5000/api/";
//export const BASE_URL = "https://localhost:44357/api/";