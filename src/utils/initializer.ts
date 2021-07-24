import { IUser } from '../interfaces/user.interface';
import { IDataSource } from '../interfaces/dataSource';
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

export const emptyDataSource = <T>(): IDataSource<T> => ({
	listaRecords: [],
  numeroPaginas: 0,
  totalRecords: 0,
})