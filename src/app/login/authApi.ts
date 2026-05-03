import { api } from "../../../helpers/httpHelper";
import { IUsuario } from "./usuario.interface";

export const login = async (
  username: string,
  password: string
): Promise<IUsuario> => {
  const res = await api.get("/usuarios");

  const usuario = res.data.find(
    (u: IUsuario) => u.username === username && u.password === password
  );

  if (!usuario) {
    throw new Error("Credenciales incorrectas");
  }

  return usuario;
};