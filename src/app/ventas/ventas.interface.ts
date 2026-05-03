export interface IResumenTurno {
  turnoId: number;
  cantidadVentas: number;
  totalRecaudado: number;
  ticketPromedio: number;
   totalEfectivo: number;
  totalDebito: number;
  totalCredito: number;
}

export interface IDetalleVenta {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface IVenta {
  id: number;
  fecha: string;
  medioPago: string;
  total: number;
  items: IDetalleVenta[];
}

export interface ITurno {
  id: number;
  fechaApertura: string;
  fechaCierre: string | null;
  estado: "ABIERTO" | "CERRADO";
}