import { IColumnsGrid } from '../interfaces/grid.interface';

export const urlConstants = {
  //roles

  ADMINISTRADOR: 'Profile',
  ALTA_GERENCIA: 'AltaGerencia',
  PROFILE_ALTA_GERENCIA: 'ProfileAltaGerencia',
  PROFILE_ANALISTA: 'ProfileAnalista',
  ANALISTAS: 'Analistas',
  AUTDITOR: 'auditor',
  PROFILE_JEFE_DE_RIESGOS: 'ProfileJefeRiesgos',

  //funcionalidades
  REALIZAR_PRUEBA: 'Evaluacion',
  REALIZAR_PRUEBA_EVALUACION: 'Prueba',
  VISUALIZAR_INFORME: 'TipoInforme',

  GENERAR_LISTA: 'Especialistas',
  MODIFICAR_LISTA: 'ModificarListaVerificacion'

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

export const columnsPlanesTratamientoList: IColumnsGrid[] = [
  {
    field: 'codigo',
    title: 'Código',
    type: 'text'
  },
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
    field: 'responsable',
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
    field: 'normativa',
    title: 'Normativa',
    type: 'text'
  },
  {
    field: 'codigoEvaluacion',
    title: 'Código de Evaluación',
    type: 'text'
  },
  {
    field: 'evaluacion',
    title: 'Nombre de Evaluación',
    type: 'text'
  },
  {
    field: 'nivelRiesgo',
    title: 'Nivel de Riesgo',
    type: 'text'
  },
  {
    field: 'fechaCreacion',
    title: 'Fecha de Creación',
    type: 'text'
  },
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
    field: 'nivelRiesgo',
    title: 'Nivel de Riesgo',
    type: 'text'
  },
  {
    field: 'porcentajeCumplimiento',
    title: 'Porcentaje de Cumplimiento',
    type: 'text'
  },
  {
    field: 'duracion',
    title: 'Duración',
    type: 'text'
  },
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
  PRUEBA: 'prueba'
}

// Rol Actions

export const AdminUserActions = [
  {
    src: require("@/assets/images/alta.png"),
    description: "Alta gerencia",
    url: urlConstants.ALTA_GERENCIA,
  },
  {
    src: require("@/assets/images/analyst.png"),
    description: "Analistas",
    url: urlConstants.ANALISTAS,
  },
  {
    src: require("@/assets/images/audit.png"),
    description: "Auditor",
    url: urlConstants.AUTDITOR,
  },
  {
    src: require("@/assets/images/security.png"),
    description: "Jefe de riesgos",
    url: urlConstants.PROFILE_JEFE_DE_RIESGOS,
  },
];

export const AnalistaUserActions = [
  {
    src: require("@/assets/images/audit.png"),
    description: "Realizar prueba",
    url: urlConstants.REALIZAR_PRUEBA,
  },
  {
    src: require("@/assets/images/informes.png"),
    description: "Visualizar informes",
    url: urlConstants.VISUALIZAR_INFORME,
  },
];

export const EspecialistaUserActions = [
  {
    src: require("@/assets/images/audit.png"),
    description: "Generar lista de verificación",
    url: urlConstants.GENERAR_LISTA,
  },
  {
    src: require("@/assets/images/informes.png"),
    description: "Modificar lista de verificación",
    url: urlConstants.MODIFICAR_LISTA,
  },
];


export const estadoAccionMitigacion = [
  'En Proceso',
  'Terminado'
]


export const BASE_URL = "https://sistemaexperto.azurewebsites.net/api/";
// export const BASE_URL = "http://localhost:55016/api/";
// export const BASE_URL = "http://localhost:5000/api/";
//export const BASE_URL = "https://localhost:44357/api/";