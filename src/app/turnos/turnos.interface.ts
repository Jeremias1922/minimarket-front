export interface IResumenTurno {
  turnoId: number;

  usuarioId: number;
  usuarioNombre: string;

  fechaApertura: string;
  fechaCierre: string | null;

  estado: "ABIERTO" | "CERRADO";

  cantidadVentas: number;
  totalRecaudado: number;
  ticketPromedio: number;

  totalEfectivo: number;
  totalDebito: number;
  totalCredito: number;

  montoInicial: number;

  totalIngresosEfectivo: number;
  totalEgresosEfectivo: number;
  saldoMovimientosEfectivo: number;

  efectivoEsperado: number;
  efectivoReal: number | null;
  diferenciaCaja: number | null;
}
export interface IDetalleVenta {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface IVentaTurno {
  id: number;
  fecha: string;
  medioPago: string;
  total: number;
  items: IDetalleVenta[];
}