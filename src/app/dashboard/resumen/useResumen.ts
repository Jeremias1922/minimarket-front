"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  obtenerMovimientosModificadosRecientes,
  obtenerResumenVentasMensual,
} from "../../../../helpers/httpHelper";

import type {
  IMovimientoCajaModificado,
  IResumenVentas,
} from "../dashboard.interface";

export default function useResumen() {
  const [
    anioSeleccionado,
    setAnioSeleccionado,
  ] = useState(
    () => new Date().getFullYear()
  );

  const [
    mesSeleccionado,
    setMesSeleccionado,
  ] = useState(
    () => new Date().getMonth() + 1
  );

  const [
    resumenMensual,
    setResumenMensual,
  ] =
    useState<IResumenVentas | null>(
      null
    );

  const [
    movimientosModificados,
    setMovimientosModificados,
  ] = useState<
    IMovimientoCajaModificado[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    errorMovimientos,
    setErrorMovimientos,
  ] = useState("");

  const cargarResumen =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        setErrorMovimientos("");

        /*
         * Las consultas son independientes.
         *
         * Si falla el listado de movimientos,
         * igualmente dejamos visible el resumen mensual.
         */
        const [
          resultadoResumen,
          resultadoMovimientos,
        ] = await Promise.allSettled([
          obtenerResumenVentasMensual(
            anioSeleccionado,
            mesSeleccionado
          ),

          obtenerMovimientosModificadosRecientes(
            5
          ),
        ]);

        if (
          resultadoResumen.status ===
          "rejected"
        ) {
          throw resultadoResumen.reason;
        }

        setResumenMensual(
          resultadoResumen.value
        );

        if (
          resultadoMovimientos.status ===
          "fulfilled"
        ) {
          setMovimientosModificados(
            resultadoMovimientos.value
          );
        } else {
          console.error(
            "Error al cargar movimientos modificados:",
            resultadoMovimientos.reason
          );

          setMovimientosModificados([]);

          setErrorMovimientos(
            "No se pudieron consultar las modificaciones recientes."
          );
        }
      } catch (error) {
        console.error(
          "Error al cargar el resumen mensual:",
          error
        );

        setError(
          "No se pudo obtener el resumen mensual."
        );
      } finally {
        setLoading(false);
      }
    }, [
      anioSeleccionado,
      mesSeleccionado,
    ]);

  useEffect(() => {
    cargarResumen();
  }, [cargarResumen]);

  return {
    resumenMensual,
    movimientosModificados,

    anioSeleccionado,
    setAnioSeleccionado,

    mesSeleccionado,
    setMesSeleccionado,

    loading,
    error,
    errorMovimientos,

    cargarResumen,
  };
}