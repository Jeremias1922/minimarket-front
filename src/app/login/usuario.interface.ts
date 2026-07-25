export interface IUsuario {
  id: number;
  nombre: string;
  username: string;
  password: string;
  rol: "CAJERO" | "ENCARGADO" | "DUENIO";
}