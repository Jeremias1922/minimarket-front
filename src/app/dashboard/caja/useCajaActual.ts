"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  obtenerTurnoActivo,
  obtenerVentasPorTurno,
} from "../../../../helpers/httpHelper";

import {
  IResumenTurno,
  IVentaTurno,
} from "../../turnos/turnos.interface";

export default function useCajaActual() {
  const [turnoActivo, setTurnoActivo] =
    useState<IResumenTurno | null>(null);

  const [ventas, setVentas] =
    useState<IVentaTurno[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const cargarCaja = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const turno =
        await obtenerTurnoActivo();

      setTurnoActivo(turno);

      if (!turno) {
        setVentas([]);
        return;
      }

      const ventasTurno =
        await obtenerVentasPorTurno(
          turno.turnoId
        );

      setVentas(ventasTurno);
    } catch (error) {
      console.error(
        "Error al cargar la caja actual:",
        error
      );

      setError(
        "No se pudo obtener el estado actual de la caja."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCaja();

    const intervalo = window.setInterval(
      cargarCaja,
      30000
    );

    return () => {
      window.clearInterval(intervalo);
    };
  }, [cargarCaja]);

  const ultimasVentas = useMemo(() => {
    return [...ventas]
      .sort(
        (a, b) =>
          new Date(b.fecha).getTime() -
          new Date(a.fecha).getTime()
      )
      .slice(0, 5);
  }, [ventas]);

  return {
    turnoActivo,
    ventas,
    ultimasVentas,
    loading,
    error,
    cargarCaja,
  };
}