import { IUser } from "../interfaces/user.interface";

export async function getUsuario() {
  const response = await fetch("http://localhost:5000/api/usuario", {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    }),
  });

  const userInfo = (await response.json()) as IUser;

  return userInfo;
}
