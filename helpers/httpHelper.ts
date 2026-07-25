import { IProducto, IProductosPaginados } from "@/app/productos/productos.interface";
import {
  IVentaTurno,
  IResumenTurno,
} from "@/app/turnos/turnos.interface";
import {
  ITurno,
  IVenta,
} from "@/app/ventas/ventas.interface";
import axios from "axios";
import { IResumenFinanzas, IResumenVentas } from "@/app/dashboard/dashboard.interface";
import { ICrearMovimientoCajaRequest, IEditarMovimientoCajaRequest, IMovimientoCaja, IMovimientoCajaHistorial, IResumenMovimientosCaja } from "@/app/movimientos-caja/movimientosCaja.interface";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const getProductoPorCodigo = async (
  codigo: string
) => {
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

export const crearProducto = async (
  producto: IProducto
): Promise<void> => {
  await api.post("/productos", producto);
};

export const listarProductos =
  async (): Promise<IProducto[]> => {
    const response = await api.get("/productos");
    return response.data;
  };

export const buscarProductoPorId = async (
  id: number
): Promise<IProducto> => {
  const response = await api.get(`/productos/${id}`);
  return response.data;
};

export const buscarProductoPorCodigoBarras = async (
  codigoBarras: string
): Promise<IProducto> => {
  const response = await api.get(
    `/productos/codigo/${codigoBarras}`
  );

  return response.data;
};

export const actualizarProducto = async (
  id: number,
  producto: IProducto
): Promise<void> => {
  await api.put(`/productos/${id}`, producto);
};

export const eliminarProducto = async (
  id: number
): Promise<void> => {
  await api.delete(`/productos/${id}`);
};

export const obtenerTurnoActual = async (
  usuarioId: number
): Promise<ITurno> => {
  const res = await api.get(
    `/turnos/actual/${usuarioId}`
  );

  return res.data;
};

export const obtenerTurnoActivo =
  async (): Promise<IResumenTurno | null> => {
    try {
      const res = await api.get<IResumenTurno>(
        "/turnos/activo"
      );

      return res.data;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 404
      ) {
        return null;
      }

      throw error;
    }
  };

export const obtenerResumenTurno = async (
  turnoId: number
): Promise<IResumenTurno> => {
  const res = await api.get(
    `/turnos/${turnoId}/resumen`
  );

  return res.data;
};

export const obtenerVentasTurno = async (
  turnoId: number
): Promise<IVenta[]> => {
  const res = await api.get(
    `/turnos/${turnoId}/ventas`
  );

  return res.data;
};

/*
 * Lo adaptamos en el siguiente paso para enviar
 * el efectivo real del arqueo.
 */
export const cerrarTurno = async (
  turnoId: number,
  efectivoReal: number
): Promise<IResumenTurno> => {
  const res = await api.post(
    `/turnos/cerrar/${turnoId}`,
    {
      efectivoReal,
    }
  );

  return res.data;
};
/*
 * Abre un turno nuevo indicando el efectivo inicial.
 *
 * Si el mismo usuario ya tiene un turno abierto,
 * el backend recupera ese turno.
 */
export const abrirTurno = async (
  usuarioId: number,
  montoInicial: number
): Promise<ITurno> => {
  const res = await api.post(
    `/turnos/abrir/${usuarioId}`,
    {
      montoInicial,
    }
  );

  return res.data;
};

export const listarTurnos =
  async (): Promise<IResumenTurno[]> => {
    const res = await api.get("/turnos");
    return res.data;
  };

export const obtenerVentasPorTurno = async (
  turnoId: number
): Promise<IVentaTurno[]> => {
  const res = await api.get(
    `/turnos/${turnoId}/ventas`
  );

  return res.data;
};

export const obtenerResumenVentas = async (
  fecha: string
): Promise<IResumenVentas> => {
  const response = await api.get<IResumenVentas>(
    "/ventas/resumen",
    {
      params: {
        fecha,
      },
    }
  );

  return response.data;
};

export const obtenerResumenVentasMensual = async (
  anio: number,
  mes: number
): Promise<IResumenVentas> => {
  const response = await api.get<IResumenVentas>(
    "/ventas/resumen-mensual",
    {
      params: {
        anio,
        mes,
      },
    }
  );

  return response.data;
};

export const crearMovimientoCaja = async (
  data: ICrearMovimientoCajaRequest
): Promise<IMovimientoCaja> => {
  const response =
    await api.post<IMovimientoCaja>(
      "/movimientos-caja",
      data
    );

  return response.data;
};

export const obtenerMovimientosCajaPorTurno =
  async (
    turnoId: number
  ): Promise<IMovimientoCaja[]> => {
    const response =
      await api.get<IMovimientoCaja[]>(
        `/movimientos-caja/turno/${turnoId}`
      );

    return response.data;
  };

export const obtenerResumenMovimientosCaja =
  async (
    turnoId: number
  ): Promise<IResumenMovimientosCaja> => {
    const response =
      await api.get<IResumenMovimientosCaja>(
        `/movimientos-caja/turno/${turnoId}/resumen`
      );

    return response.data;
  };

  export const editarMovimientoCaja =
  async (
    movimientoId: number,
    data: IEditarMovimientoCajaRequest
  ): Promise<IMovimientoCaja> => {
    const response =
      await api.put<IMovimientoCaja>(
        `/movimientos-caja/${movimientoId}`,
        data
      );

    return response.data;
  };

export const obtenerHistorialMovimientoCaja =
  async (
    movimientoId: number
  ): Promise<IMovimientoCajaHistorial[]> => {
    const response =
      await api.get<
        IMovimientoCajaHistorial[]
      >(
        `/movimientos-caja/${movimientoId}/historial`
      );

    return response.data;
  };

  export const obtenerMovimientosModificadosRecientes =
  async (
    limite = 5
  ): Promise<IMovimientoCaja[]> => {
    const response =
      await api.get<IMovimientoCaja[]>(
        "/movimientos-caja/modificados-recientes",
        {
          params: {
            limite,
          },
        }
      );

    return response.data;
  };

  export const obtenerResumenFinanzas =
  async (
    anio: number,
    mes: number
  ): Promise<IResumenFinanzas> => {
    const response =
      await api.get<IResumenFinanzas>(
        "/finanzas/resumen",
        {
          params: {
            anio,
            mes,
          },
        }
      );

    return response.data;
  };

  export const listarProductosPaginados = async (
  pagina: number = 0,
  tamanio: number = 25,
  texto: string = ""
): Promise<IProductosPaginados> => {
  const response = await api.get<IProductosPaginados>(
    "/productos/paginados",
    {
      params: {
        pagina,
        tamanio,
        texto,
      },
    }
  );

  return response.data;
};