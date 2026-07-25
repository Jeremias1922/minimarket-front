import type { IMovimientoCaja } from "../movimientos-caja/movimientosCaja.interface";

export interface IResumenVentas {
  total: number;
  cantidadVentas: number;

  totalEfectivo: number;
  totalDebito: number;
  totalCredito: number;

  costoMercaderia: number;
  gananciaBruta: number;
  margenPorcentaje: number;
  ticketPromedio: number;
  totalIngresosEfectivo: number;
}

/*
 * El backend devuelve el mismo formato de MovimientoCaja
 * para el endpoint de modificaciones recientes.
 */
  export type IMovimientoCajaModificado =
  IMovimientoCaja;

  export interface IResumenFinanzas {
  anio: number;
  mes: number;

  recaudacion: number;
  costoMercaderia: number;
  gananciaBruta: number;

  gastosOperativos: number;
  sueldos: number;

  gananciaNeta: number;
  margenNetoPorcentaje: number;

  pagosProveedores: number;
  retirosDueno: number;
  aportes: number;

  ajustesIngresos: number;
  ajustesEgresos: number;

  otrosIngresos: number;
  otrosEgresos: number;

  totalIngresosMovimientos: number;
  totalEgresosMovimientos: number;
  saldoMovimientos: number;
}