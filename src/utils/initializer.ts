import { User } from '../interfaces/user.interface';
export const emptyUser = (): User => ({
  nombres: '',
	apellidos: '',
	nombreCompleto: '',
	password: '',
	token: '',
	email: '',
	username: '',
	imagen: null,
	phoneNumber: '',
	fechaNacimiento: null,
	rol: null
});