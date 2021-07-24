import { IColumnsGrid } from '../interfaces/grid.interface';
export const urlConstants = {
  ADMINISTRADOR: 'Profile',
  ALTA_GERENCIA: 'AltaGerencia',
  PROFILE_ALTA_GERENCIA: 'ProfileAltaGerencia',
  PROFILE_ANALISTA: 'ProfileAnalista',
  ANALISTAS: 'Analistas',
  AUTDITOR: 'auditor',
  PROFILE_JEFE_DE_RIESGOS: '/profile/jefe-de-riesgos/'
}

export const rol = {
  ANALISTA: 'Analistas',
  JEFE_DE_RIESGOS: 'Jefe de riesgos',
  ADMINISTRADOR: 'Administrador',
  ALTA_GERENCIA: 'Alta gerencia'
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

export const actions = {
  DELETE: 'delete',
  EDIT: 'edit',
}

export const entity = {
  USER: 'usuario'
}