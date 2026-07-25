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

  // Ventas por medio de pago
  totalEfectivo: number;
  totalDebito: number;
  totalCredito: number;

  // Movimientos manuales de caja
  totalIngresosEfectivo: number;
  totalEgresosEfectivo: number;
  saldoMovimientosEfectivo: number;

  // Arqueo
  montoInicial: number;
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