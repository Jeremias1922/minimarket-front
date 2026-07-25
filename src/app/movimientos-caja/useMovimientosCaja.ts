"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  crearMovimientoCaja,
  obtenerMovimientosCajaPorTurno,
  obtenerResumenMovimientosCaja,
  obtenerTurnoActivo,
} from "../../../helpers/httpHelper";

import { IResumenTurno } from "../turnos/turnos.interface";

import {
  CategoriaMovimientoCaja,
  ICrearMovimientoCajaRequest,
  IMovimientoCaja,
  IResumenMovimientosCaja,
  IUsuarioGuardado,
  MedioPagoMovimientoCaja,
  TipoMovimientoCaja,
} from "./movimientosCaja.interface";

interface FormMovimiento {
  tipo: TipoMovimientoCaja;
  categoria: CategoriaMovimientoCaja;
  medioPago: MedioPagoMovimientoCaja;
  monto: string;
  descripcion: string;
}

const FORM_INICIAL: FormMovimiento = {
  tipo: "EGRESO",
  categoria: "PAGO_PROVEEDOR",
  medioPago: "EFECTIVO",
  monto: "",
  descripcion: "",
};

export default function useMovimientosCaja() {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<IUsuarioGuardado | null>(null);

  const [turnoActivo, setTurnoActivo] =
    useState<IResumenTurno | null>(null);

  const [movimientos, setMovimientos] =
    useState<IMovimientoCaja[]>([]);

  const [resumen, setResumen] =
    useState<IResumenMovimientosCaja | null>(
      null
    );

  const [form, setForm] =
    useState<FormMovimiento>(FORM_INICIAL);

  const [loading, setLoading] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  useEffect(() => {
    const usuarioStorage =
      localStorage.getItem("usuario");

    if (!usuarioStorage) {
      router.replace("/login");
      return;
    }

    try {
      const usuarioParseado: IUsuarioGuardado =
        JSON.parse(usuarioStorage);

      setUsuario(usuarioParseado);
    } catch (error) {
      console.error(
        "Usuario inválido en localStorage:",
        error
      );

      localStorage.removeItem("usuario");
      router.replace("/login");
    }
  }, [router]);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const turno =
        await obtenerTurnoActivo();

      setTurnoActivo(turno);

      if (!turno) {
        setMovimientos([]);
        setResumen(null);
        return;
      }

      const [
        movimientosTurno,
        resumenTurno,
      ] = await Promise.all([
        obtenerMovimientosCajaPorTurno(
          turno.turnoId
        ),
        obtenerResumenMovimientosCaja(
          turno.turnoId
        ),
      ]);

      setMovimientos(movimientosTurno);
      setResumen(resumenTurno);
    } catch (error) {
      console.error(
        "Error al cargar movimientos:",
        error
      );

      setError(
        obtenerMensajeError(
          error,
          "No se pudieron obtener los movimientos de caja."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    cargarDatos();
  }, [usuario, cargarDatos]);

  const puedeRegistrar = useMemo(() => {
    if (!usuario || !turnoActivo) {
      return false;
    }

    return (
      turnoActivo.estado === "ABIERTO" &&
      turnoActivo.usuarioId === usuario.id
    );
  }, [usuario, turnoActivo]);

  const categoriasDisponibles =
    useMemo<CategoriaMovimientoCaja[]>(() => {
      if (form.tipo === "INGRESO") {
        return [
          "APORTE_EFECTIVO",
          "AJUSTE_CAJA",
          "OTRO",
        ];
      }

      return [
        "PAGO_PROVEEDOR",
        "GASTO_OPERATIVO",
        "RETIRO_EFECTIVO",
        "AJUSTE_CAJA",
        "SUELDO",
        "OTRO",
      ];
    }, [form.tipo]);

  const cambiarTipo = (
    tipo: TipoMovimientoCaja
  ) => {
    const categoriaInicial:
      CategoriaMovimientoCaja =
        tipo === "INGRESO"
          ? "APORTE_EFECTIVO"
          : "PAGO_PROVEEDOR";

    setForm((actual) => ({
      ...actual,
      tipo,
      categoria: categoriaInicial,
    }));
  };

  const cambiarCategoria = (
    categoria: CategoriaMovimientoCaja
  ) => {
    setForm((actual) => ({
      ...actual,
      categoria,
    }));
  };

  const cambiarMedioPago = (
    medioPago: MedioPagoMovimientoCaja
  ) => {
    setForm((actual) => ({
      ...actual,
      medioPago,
    }));
  };

  const cambiarMonto = (
    monto: string
  ) => {
    setForm((actual) => ({
      ...actual,
      monto,
    }));
  };

  const cambiarDescripcion = (
    descripcion: string
  ) => {
    setForm((actual) => ({
      ...actual,
      descripcion,
    }));
  };

  const registrarMovimiento =
    async () => {
      if (
        !usuario ||
        !turnoActivo ||
        !puedeRegistrar
      ) {
        setError(
          "Solamente el responsable del turno puede registrar movimientos."
        );

        return;
      }

      const monto = Number(form.monto);

      if (
        !Number.isFinite(monto) ||
        monto <= 0
      ) {
        setError(
          "Ingresá un monto mayor a cero."
        );

        return;
      }

      const request: ICrearMovimientoCajaRequest =
        {
          turnoId: turnoActivo.turnoId,
          usuarioId: usuario.id,

          tipo: form.tipo,
          categoria: form.categoria,
          medioPago: form.medioPago,

          monto,
          descripcion:
            form.descripcion.trim() ||
            undefined,
        };

      try {
        setGuardando(true);
        setError("");
        setMensaje("");

        await crearMovimientoCaja(request);

        setForm(FORM_INICIAL);

        setMensaje(
          form.tipo === "EGRESO"
            ? "Egreso registrado correctamente."
            : "Ingreso registrado correctamente."
        );

        await cargarDatos();
      } catch (error) {
        console.error(
          "Error al registrar movimiento:",
          error
        );

        setError(
          obtenerMensajeError(
            error,
            "No se pudo registrar el movimiento."
          )
        );
      } finally {
        setGuardando(false);
      }
    };

  return {
    usuario,
    turnoActivo,
    movimientos,
    resumen,

    form,
    categoriasDisponibles,

    loading,
    guardando,
    error,
    mensaje,

    puedeRegistrar,

    cambiarTipo,
    cambiarCategoria,
    cambiarMedioPago,
    cambiarMonto,
    cambiarDescripcion,

    registrarMovimiento,
    cargarDatos,

    limpiarMensaje: () =>
      setMensaje(""),

    limpiarError: () =>
      setError(""),
  };
}

function obtenerMensajeError(
  error: unknown,
  mensajePorDefecto: string
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            mensaje?: string;
            message?: string;
          };
        };
      }
    ).response;

    return (
      response?.data?.mensaje ??
      response?.data?.message ??
      mensajePorDefecto
    );
  }

  return mensajePorDefecto;
}