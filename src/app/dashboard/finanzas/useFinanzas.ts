"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  obtenerResumenFinanzas,
} from "../../../../helpers/httpHelper";

import type {
  IResumenFinanzas,
} from "../dashboard.interface";

export default function useFinanzas() {
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
    resumenFinanzas,
    setResumenFinanzas,
  ] =
    useState<IResumenFinanzas | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const cargarFinanzas =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const resumen =
          await obtenerResumenFinanzas(
            anioSeleccionado,
            mesSeleccionado
          );

        setResumenFinanzas(resumen);
      } catch (error) {
        console.error(
          "Error al cargar el resumen financiero:",
          error
        );

        setError(
          "No se pudo obtener el resumen financiero."
        );
      } finally {
        setLoading(false);
      }
    }, [
      anioSeleccionado,
      mesSeleccionado,
    ]);

  useEffect(() => {
    cargarFinanzas();
  }, [cargarFinanzas]);

  return {
    resumenFinanzas,

    anioSeleccionado,
    setAnioSeleccionado,

    mesSeleccionado,
    setMesSeleccionado,

    loading,
    error,

    cargarFinanzas,
  };
}