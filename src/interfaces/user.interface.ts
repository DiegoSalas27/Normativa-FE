export interface User {
	id?: string;
	nombres?: string;
	apellidos?: string;
	nombreCompleto?: string;
	password?: string;
	token?: string;
	email?: string;
	username?: string;
	imagen?: any;
	phoneNumber?: any;
	fechaNacimiento?: string;
	rol?: any;
	entity?: string;
}

export interface tokenUser {
	nameid: string,
  role: string,
  nbf: number,
  exp: number,
  iat: number
}
