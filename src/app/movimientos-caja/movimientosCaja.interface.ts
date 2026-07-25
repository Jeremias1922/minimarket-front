export type TipoMovimientoCaja =
  | "INGRESO"
  | "EGRESO";

export type CategoriaMovimientoCaja =
  | "PAGO_PROVEEDOR"
  | "GASTO_OPERATIVO"
  | "RETIRO_EFECTIVO"
  | "APORTE_EFECTIVO"
  | "AJUSTE_CAJA"
  | "SUELDO"
  | "OTRO";

export type MedioPagoMovimientoCaja =
  | "EFECTIVO"
  | "DEBITO"
  | "CREDITO"
  | "OTRO";

export interface IMovimientoCaja {
  id: number;

  turnoId: number;

  usuarioId: number;
  usuarioNombre: string;

  fecha: string;

  tipo: TipoMovimientoCaja;
  categoria: CategoriaMovimientoCaja;
  medioPago: MedioPagoMovimientoCaja;

  monto: number;
  descripcion: string | null;

  /*
   * Datos de edición.
   */
  editado: boolean;

  fechaUltimaModificacion: string | null;

  usuarioUltimaModificacionId:
    | number
    | null;

  usuarioUltimaModificacionNombre:
    | string
    | null;

  motivoUltimaModificacion:
    | string
    | null;

  /*
   * Datos de anulación.
   */
  anulado: boolean;

  fechaAnulacion: string | null;

  usuarioAnulacionId:
    | number
    | null;

  usuarioAnulacionNombre:
    | string
    | null;

  motivoAnulacion: string | null;
}

export interface ICrearMovimientoCajaRequest {
  turnoId: number;
  usuarioId: number;

  tipo: TipoMovimientoCaja;
  categoria: CategoriaMovimientoCaja;
  medioPago: MedioPagoMovimientoCaja;

  monto: number;
  descripcion?: string;
}

export interface IEditarMovimientoCajaRequest {
  usuarioId: number;

  tipo: TipoMovimientoCaja;
  categoria: CategoriaMovimientoCaja;
  medioPago: MedioPagoMovimientoCaja;

  monto: number;
  descripcion?: string;

  motivoModificacion: string;
}

export interface IMovimientoCajaHistorial {
  id: number;
  movimientoId: number;

  usuarioModificacionId: number;
  usuarioModificacionNombre: string;

  fechaModificacion: string;
  motivo: string;

  tipoAnterior: TipoMovimientoCaja;
  categoriaAnterior: CategoriaMovimientoCaja;
  medioPagoAnterior: MedioPagoMovimientoCaja;
  montoAnterior: number;
  descripcionAnterior: string | null;

  tipoNuevo: TipoMovimientoCaja;
  categoriaNueva: CategoriaMovimientoCaja;
  medioPagoNuevo: MedioPagoMovimientoCaja;
  montoNuevo: number;
  descripcionNueva: string | null;
}

export interface IResumenMovimientosCaja {
  turnoId: number;

  totalIngresos: number;
  totalEgresos: number;

  totalIngresosEfectivo: number;
  totalEgresosEfectivo: number;

  saldoMovimientosEfectivo: number;

  cantidadMovimientos: number;
}

export interface IUsuarioGuardado {
  id: number;
  nombre: string;
  username: string;
  rol:
    | "CAJERO"
    | "ENCARGADO"
    | "DUENIO";
}