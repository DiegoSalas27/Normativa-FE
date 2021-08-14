import { IUser } from "../interfaces/user.interface";
import { BASE_URL } from './../common/constants';

export async function getUsuario() {
  const response = await fetch(`${BASE_URL}usuario`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    }),
  });

  const userInfo = (await response.json()) as IUser;

  return userInfo;
}
