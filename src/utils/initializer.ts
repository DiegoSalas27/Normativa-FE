import { IDataSource } from '../interfaces/dataSource';
import { IEvaluacion } from '../interfaces/evaluacion.interface';
import { IEvidencia } from '../interfaces/evidencia.interface';
import { IEvidenciaRequerimiento } from '../interfaces/evidenciaRequerimiento.interface';
import { IListaVerificacion } from '../interfaces/listaVerificacion.interface';
import { IObra } from '../interfaces/obra.interface';
import { IPrueba } from '../interfaces/prueba.interface';
import { IUser } from '../interfaces/user.interface';
import { ITratamiento } from '../interfaces/tratamiento.interface';
export const emptyUser = (): IUser => ({
  nombres: '',
	apellidos: '',
	nombreCompleto: '',
	password: '',
	token: '',
	email: '',
	username: '',
	imagen: '',
	phoneNumber: '',
	fechaNacimiento: null,
	especialidad: '',
	rol: null
});

export const emptyTratamiento = (): ITratamiento => ({
	tratamientoId: '',
	evaluacionId: '',
	usuarioId: null,
	estadosTratamientoId: null, 
	nombre: '',
	codigo: '',
	fechaInicio: null,
	fechaFin: null,
	porcentajeAvance: 0,
})

export const emptyVerificationList = (): IListaVerificacion => ({
	listaVerificacionId: '',
	codigo: '',
	nombre: '',
	fechaCreacion: '',
  requerimientosCount: 0,
	requerimientos: [],
	nivelesRiesgos: []
})

export const emptyObra = (): IObra => ({
	obraId: '',
	codigo: '',
	nombre: '',
	evaluacionList: undefined,
});

export const emptyDataSource = <T>(): IDataSource<T> => ({
	listaRecords: [],
  numeroPaginas: 0,
  totalRecords: 0,
})

export const emptyEvaluacion = (): IEvaluacion => ({
	evaluacionId: undefined,
  obra: undefined,
  tratamiento: null,
  listaVerificacion: undefined,
	codigo: '',
  nombre: '',
  porcentajeFinal: 0,
  estado: '',
	fechaCreacion: null,
  pruebaList: null,
	visibilidad: false,
});

export const emptyEvidencia = (): IEvidencia => ({
	evidenciaId: '',
  nombre: '',
  adjunto: '',
})

export const emptyEvidenciaRequerimiento = (): IEvidenciaRequerimiento => ({
	evidenciaId: '',
  requerimientoId: '',
  pruebaId: '',
  justificacion: '',
  respuestaItem: 1,
  recomendacion: undefined,
});

export const emptyPrueba = (): IPrueba => ({
	pruebaId: '',
	codigo: '',
  evaluacionId: '',
  porcentajeCumplimiento: 0,
  evaluacion: undefined,
  evidenciaRequerimientoLink: [],
});