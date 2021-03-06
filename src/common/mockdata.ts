export const series = [
  {
    name: "Riesgo Bajo", //verde
    data: [44, 55, 41, 67, 22, 43],
  },
  {
    name: "Riesgo Medio", //Naranja
    data: [13, 23, 20, 8, 13, 27],
  },
  {
    name: "Riesgo Alto", //Rojo
    data: [11, 17, 15, 15, 21, 14],
  },
];

export const xAxisCategories = [
  "01/01/2011 GMT",
  "01/02/2011 GMT",
  "01/03/2011 GMT",
  "01/04/2011 GMT",
  "01/05/2011 GMT",
  "01/06/2011 GMT",
];

export const pieChartSeries = [44, 55, 13, 43, 22];
export const pieChartLabels = [
  "Team A",
  "Team B",
  "Team C",
  "Team D",
  "Team E",
];

export const pieChartSeries2 = [44, 55, 13, 43, 22];
export const pieChartLabels2 = [
  "Team A",
  "Team B",
  "Team C",
  "Team D",
  "Team E",
];
 
export const lineChartSeries = [
  {
    name: "High - 2013",
    data: [12, 29, 33, 36, 32, 32, 33]
  },
  {
    name: "Low - 2013",
    data: [28, 11, 14, 18, 17, 13, 13]
  }
];

export const Chartxd=[
{
  name: "ISO45002",
  data: [
    {
    x: "2021-09-21T13:29:04.1505407",
    y: 50
  },
  {
    x: "2021-09-21T19:41:15.2131958",
    y: 67.5
  },
  {
    x: "2021-09-24T05:47:41.499891",
    y: 92.5
  }
]
},

{
  name: "Ley 123123",
  data: [
    {
      x: "2021-09-24T15:11:57.1189539",
      y: 85.88
    },    
    {
      x: "2021-09-29T21:27:49.6300572",
      y: 59.08
    },
    {
      x: "2021-10-04T01:38:06.9029905",
      y: 81.25
    }
  ]
}
  
];

export const treeMapChartSeries = [
  {
    data: [
      {
        x: 'New Delhi',
        y: 218
      },
      {
        x: 'Kolkata',
        y: 149
      },
      {
        x: 'Mumbai',
        y: 184
      },
      {
        x: 'Ahmedabad',
        y: 55
      },
      {
        x: 'Bangaluru',
        y: 84
      },
      {
        x: 'Pune',
        y: 31
      },
      {
        x: 'Chennai',
        y: 70
      },
      {
        x: 'Jaipur',
        y: 30
      },
      {
        x: 'Surat',
        y: 44
      },
      {
        x: 'Hyderabad',
        y: 68
      },
      {
        x: 'Lucknow',
        y: 28
      },
      {
        x: 'Indore',
        y: 19
      },
      {
        x: 'Kanpur',
        y: 29
      }
    ]
  }
];

export const semiDonutSeries = [62.99, 37.01];

export const stackedBarSeries = [{
  name: 'Cancelado',
  data: [44, null, 41, 37, 22, 43, 21]
}, {
  name: 'Sin asignar',
  data: [53, 32, null, 52, null, 43, 32]
}, {
  name: 'En proceso',
  data: [12, 17, 11, null, 15, 11, 20]
}, {
  name: 'Solucionado',
  data: [9, 7, null, 8, null, 9, 4]
}, {
  name: 'Asignado',
  data: [25, null, 19, null, 25, 24, 10]
}];

export const xAxisCategoriesStacked = [2008, 2009, 2010, 2011, 2012, 2013, 2014];

export const fechaCreacionPrueba = {
  listaRecords: [
    {
      id: 1,
      fechaCreacion: "01/01/2011",
    },
    {
      id: 2,
      fechaCreacion: "01/02/2011",
    },
    {
      id: 3,
      fechaCreacion: "01/03/2011",
    },
    {
      id: 4,
      fechaCreacion: "01/04/2011",
    },
    {
      id: 5,
      fechaCreacion: "01/05/2011",
    },
    {
      id: 6,
      fechaCreacion: "01/06/2011",
    },
  ],
  numeroPaginas: 1,
  totalRecords: 6,
};

export const fechaCreacionPruebaVacia = {
  listaRecords: [],
  numeroPaginas: 1,
  totalRecords: 0,
};

export const criterios: any = [
  { id: 1, descripcion: "Principios del SG-SST", peso: 0.3, requerimientos: [] },
  { id: 2, descripcion: "Politicas del SG-SST", peso: 0.5, requerimientos: [] },
  { id: 3, descripcion: "Organizacion del SG-SST", peso: 0.2, requerimientos: [] },
];

export const requerimientos = [
  {
    id: 1,
    idCriterio: 1,
    idListaVerificacion: 1,
    descripcion: `Se adopta un enfoque de SG-SST de conformidad con los instrumentos y directrices internacionales y la legislacion vigente`,
    recomendacion: null,
  },
  {
    id: 2,
    idCriterio: 1,
    idListaVerificacion: 1,
    descripcion: `El sistema de SG-SST se rige por los principios estipulados en la legislaci??n vigente, entre ellos: compromiso, coherencia, mejora continua, autoestima y trabajo en equipo, cultura de prevenci??n, empat??a, reconocimiento, retroalimentaci??n, evaluaci??n de riesgos y participaci??n de organizaciones sindicales y/o representantes del trabajador.`,
    recomendacion: null,
  },
  {
    id: 3,
    idCriterio: 1,
    idListaVerificacion: 1,
    descripcion: `Se hace efectiva la participaci??n activa de los trabajadores y organizaciones sindicales en aspectos de SST seg??n la legislacion vigente.`,
    recomendacion: null,
  },
  {
    id: 4,
    idCriterio: 1,
    idListaVerificacion: 1,
    descripcion: `La metodolog??a de mejora continua del SG-SST considera la identificaci??n de desviaciones, estandares de seguridad y medici??n, evaluaci??n, correcci??n y reconocimiento del desempe??o respecto a los est??ndares.`,
    recomendacion: null,
  },
  {
    id: 5,
    idCriterio: 1,
    idListaVerificacion: 1,
    descripcion: `Las medidas de prevenci??n y protecci??n del SG-SST se aplican seg??n el orden de prioridad que estipula la legislaci??n vigente.`,
    recomendacion: null,
  },
  {
    id: 6,
    idCriterio: 2,
    idListaVerificacion: 1,
    descripcion: `La pol??tica de SG-SST es expuesta por escrito siendo espec??fica, concisa, difundida, actualizada y accesible para todos los trabajadores y interesados`,
    recomendacion: null,
  },
  {
    id: 7,
    idCriterio: 2,
    idListaVerificacion: 1,
    descripcion: `La pol??tica de SG-SST incluye su compromiso con los siguientes principios y objetivos fundamentales: protecci??n de la SST de todos los miembros, garant??a de participaci??n activa de trabajadores y representantes, mejora continua del desempe??o y compatibilidad con otros sistemas de gesti??n de la organizaci??n`,
    recomendacion: null,
  },
  {
    id: 8,
    idCriterio: 2,
    idListaVerificacion: 1,
    descripcion: `Se asegura que los trabajadores y representantes sean consultados, informados y capacitados en todos los aspectos de SST relacionados con su trabajo, incluidos temas relevantes a situaciones de emergencia`,
    recomendacion: null,
  },
  {
    id: 9,
    idCriterio: 2,
    idListaVerificacion: 1,
    descripcion: `Se adoptan medidas para que los trabajadores y representantes dispongan del tiempo y recursos para participar activamente en los procesos del SG-SST`,
    recomendacion: null,
  },
  {
    id: 10,
    idCriterio: 3,
    idListaVerificacion: 1,
    descripcion: `Se asume el liderazgo y compromiso del Sistema de Gesti??n de la Seguridad y Salud en la organizaci??n`,
    recomendacion: null,
  },
  {
    id: 11,
    idCriterio: 3,
    idListaVerificacion: 1,
    descripcion: `Se establecen programas de capacitaci??n y entrenamiento como parte de la jornada laboral como materia de prevenci??n`,
    recomendacion: null,
  },

  {
    id: 12,
    idCriterio: 3,
    idListaVerificacion: 1,
    descripcion: `Se implementan los registros y documentaci??n obligatoria del SG-SST de manera f??sica o virtual`,
    recomendacion: null,
  },
  {
    id: 13,
    idCriterio: 3,
    idListaVerificacion: 1,
    descripcion: `Se constituye un comit?? de seguridad y salud en el trabajo en el SG-SST a los empleadores con m??s de 20 trabajadores a su cargo`,
    recomendacion: null,
  },{
    id: 14,
    idCriterio: 3,
    idListaVerificacion: 1,
    descripcion: `Se nombra un supervisor de seguridad y salud en el trabajo en los centros con menos de 20 trabajadores`,
    recomendacion: null,
  },
  {
    id: 15,
    idCriterio: 3,
    idListaVerificacion: 1,
    descripcion: `Los trabajadores eligen a sus representantes ante el comit?? de SST o sus supervisores de SST`,
    recomendacion: null,
  },
  {
    id: 16,
    idCriterio: 3,
    idListaVerificacion: 1,
    descripcion: `Se elaboran un reglamento interno de seguridad y salud en el trabajo`,
    recomendacion: null,
  },
  {
    id: 17,
    idCriterio: 3,
    idListaVerificacion: 1,
    descripcion: `Se recibe, documenta y responde adecuadamente a las comunicaciones internas y externas relativas a la seguridad y salud en el trabajo`,
    recomendacion: null,
  },{
    id: 18,
    idCriterio: 3,
    idListaVerificacion: 1,
    descripcion: `Se garantiza la comunicaci??n interna de la informaci??n relativa a la seguridad y salud en el trabajo entre los distintos niveles y cargos de la organizaci??n`,
    recomendacion: null,
  },
  {
    id: 19,
    idCriterio: 3,
    idListaVerificacion: 1,
    descripcion: `Se garantiza que las sugerencias de los trabajadores o de sus representantes sobre seguridad y salud en el trabajo se reciban y atiendan en forma oportuna y adecuada`,
    recomendacion: null,
  },

];

export const DataSourceListasVerificacion = [
  {codigo: 'LV001', nombre: 'Ley 29723', numeroRequerimientos: '25', fechaCreacion: '24/05/2021' },
  {codigo: 'LV002', nombre: 'Ley 29724', numeroRequerimientos: '30', fechaCreacion: '24/05/2021' },
];

export const DataSourcetratamiento = [
  {codigo: 'TR001', fechaInicio: '05/06/2021',fechaFin:'11/06/2021', estado:'Solucionado',evaluacion:'EV001-Departamento Bohem',responsable:'Luis Quispe'},
	{codigo: 'TR002', fechaInicio: '01/01/2021',fechaFin:'07/01/2021', estado:'Asignado',evaluacion:'EV002-Departamento Plaza 27',responsable:'Marcelo Lopez'}
];

export const DataSourceEvaluaciones = [
{codigo: 'EV001', obra: 'OB001-Departamento Bohem', nivelRiesgo: 'Bajo', porcentajeCumplimiento: '30%', duracion: '12'},
{codigo: 'EV002', obra: 'OB002-Departamento Plaza 27', nivelRiesgo: 'Medio', porcentajeCumplimiento: '60%', duracion: '24'}
];

export const DataSourceRiesgo = [
{normativa: '29783', codigoEvaluacion: 'EV001', evaluacion: 'Evaluacion de elementos de seguridad', nivelRiesgo: 'Medio', fechaCreacion: '15/05/2021',},
{normativa: 'ISO 45001', codigoEvaluacion: 'EV002', evaluacion: 'Evaluacion de elementos peligrosos', nivelRiesgo: 'Bajo', fechaCreacion: '25/05/2021',}
];

