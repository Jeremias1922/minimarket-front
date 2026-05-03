import { api } from "../../../helpers/httpHelper";
import { IUsuario } from "./usuario.interface";

export const login = async (
  username: string,
  password: string
): Promise<IUsuario> => {
  const res = await api.post("/auth/login", {
    username,
    password,
  });

  return res.data;
};