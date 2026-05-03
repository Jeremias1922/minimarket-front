"use client";

import { useEffect, useState } from "react";
import { IResumenTurno, ITurno, IVenta } from "./ventas.interface";
import {
  obtenerResumenTurno,
  obtenerTurnoActual,
  obtenerVentasTurno,
} from "../../../helpers/httpHelper";

export default function useVentas() {
  const [turno, setTurno] = useState<ITurno | null>(null);
  const [resumen, setResumen] = useState<IResumenTurno | null>(null);
  const [ventas, setVentas] = useState<IVenta[]>([]);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      setLoading(true);

      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

      if (!usuario?.id) {
        alert("No hay usuario logueado");
        return;
      }

      const turnoActual = await obtenerTurnoActual(usuario.id);
      setTurno(turnoActual);

      const resumenTurno = await obtenerResumenTurno(turnoActual.id);
      setResumen(resumenTurno);

      const ventasTurno = await obtenerVentasTurno(turnoActual.id);
      setVentas(ventasTurno);
    } catch (error) {
      console.error(error);
      alert("Error al cargar ventas del turno");
    } finally {
      setLoading(false);
    }
  };

  return {
    turno,
    resumen,
    ventas,
    loading,
    cargarVentas,
  };
}