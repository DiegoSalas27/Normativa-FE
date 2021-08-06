import { IRol } from './roles.interface';
export interface IUser {
	id?: string;
	nombre?: string;
	nombres?: string;
	apellidos?: string;
	nombreCompleto?: string;
	password?: string;
	token?: string;
	email?: string;
	username?: string;
	imagen?: string;
	phoneNumber?: string;
	fechaNacimiento: any;
	rol?: any;
	entity?: string;
	codigo?: string;
	especialidad?: string;
}

export interface TokenUser {
	nameid: string,
  role: string,
  nbf: number,
  exp: number,
  iat: number
}

export interface AuthUser {
	user: string;
	password: string;
}