export interface IUsuario {
  id: number;
  nombre: string;
  username: string;
  rol: "ADMIN" | "CAJERO";
}