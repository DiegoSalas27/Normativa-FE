import { IUser } from '../interfaces/user.interface';

export default class User implements IUser {
  constructor(
    public fechaNacimiento: string,
    public id?: string | undefined,
    public nombre?: string | undefined,
    public nombres?: string | undefined,
    public apellidos?: string | undefined,
    public nombreCompleto?: string | undefined,
    public password?: string | undefined,
    public token?: string | undefined,
    public email?: string | undefined,
    public username?: string | undefined,
    public imagen?: string | undefined,
    public phoneNumber?: string | undefined,
    public rol?: any,
    public entity?: string | undefined,
    public codigo?: string | undefined,
    public especialidad?: string | undefined
  ) {}
  
}
