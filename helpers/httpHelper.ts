import { IProducto } from "@/app/productos/productos.interface";
import { IVentaTurno, IResumenTurno } from "@/app/turnos/turnos.interface";
import { ITurno, IVenta } from "@/app/ventas/ventas.interface";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProductoPorCodigo = async (codigo: string) => {
  const res = await api.get(`/productos/codigo/${codigo}`);
  return res.data;
};

export const crearVenta = async (body: any) => {
  const res = await api.post("/ventas", body);
  return res.data;
};

export const buscarProductos = async (texto: string) => {
  const res = await api.get("/productos/buscar", {
    params: { texto },
  });
  return res.data;
};

export const crearProducto = async (producto: IProducto): Promise<void> => {
  await api.post("/productos", producto);
};

export const listarProductos = async (): Promise<IProducto[]> => {
  const response = await api.get("/productos");
  return response.data;
};

export const buscarProductoPorId = async (id: number): Promise<IProducto> => {
  const response = await api.get(`/productos/${id}`);
  return response.data;
};

export const buscarProductoPorCodigoBarras = async (
  codigoBarras: string
): Promise<IProducto> => {
  const response = await api.get(`/productos/codigo/${codigoBarras}`);
  return response.data;
};

export const actualizarProducto = async (
  id: number,
  producto: IProducto
): Promise<void> => {
  await api.put(`/productos/${id}`, producto);
};

export const eliminarProducto = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`);
};

export const obtenerTurnoActual = async (
  usuarioId: number
): Promise<ITurno> => {
  const res = await api.get(`/turnos/actual/${usuarioId}`);
  return res.data;
};

export const obtenerResumenTurno = async (
  turnoId: number
): Promise<IResumenTurno> => {
  const res = await api.get(`/turnos/${turnoId}/resumen`);
  return res.data;
};

export const obtenerVentasTurno = async (
  turnoId: number
): Promise<IVenta[]> => {
  const res = await api.get(`/turnos/${turnoId}/ventas`);
  return res.data;
};

export const cerrarTurno = async (turnoId: number) => {
  const res = await api.post(`/turnos/cerrar/${turnoId}`);
  return res.data;
};

export const abrirTurno = async (usuarioId: number) => {
  const res = await api.post(`/turnos/abrir/${usuarioId}`);
  return res.data;
};

export const listarTurnos = async (): Promise<IResumenTurno[]> => {
  const res = await api.get("/turnos");
  return res.data;
};

export const obtenerVentasPorTurno = async (
  turnoId: number
): Promise<IVentaTurno[]> => {
  const res = await api.get(`/turnos/${turnoId}/ventas`);
  return res.data;
};