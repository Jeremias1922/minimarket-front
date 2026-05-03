"use client";

import { useEffect, useMemo, useState } from "react";
import { IResumenTurno, IVentaTurno } from "./turnos.interface";
import { listarTurnos, obtenerVentasPorTurno } from "../../../helpers/httpHelper";

export default function useTurnos() {
  const [turnos, setTurnos] = useState<IResumenTurno[]>([]);
  const [ventasPorTurno, setVentasPorTurno] = useState<Record<number, IVentaTurno[]>>({});
  const [turnoAbiertoId, setTurnoAbiertoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    try {
      setLoading(true);
      const data = await listarTurnos();
      setTurnos(data);
    } finally {
      setLoading(false);
    }
  };

  const toggleTurno = async (turnoId: number) => {
    if (turnoAbiertoId === turnoId) {
      setTurnoAbiertoId(null);
      return;
    }

    setTurnoAbiertoId(turnoId);

    if (!ventasPorTurno[turnoId]) {
      const ventas = await obtenerVentasPorTurno(turnoId);
      setVentasPorTurno((prev) => ({
        ...prev,
        [turnoId]: ventas,
      }));
    }
  };

  const turnosFiltrados = useMemo(() => {
    return turnos.filter((t) => {
      const fecha = new Date(t.fechaApertura);

      if (fechaDesde) {
        const desde = new Date(`${fechaDesde}T00:00:00`);
        if (fecha < desde) return false;
      }

      if (fechaHasta) {
        const hasta = new Date(`${fechaHasta}T23:59:59`);
        if (fecha > hasta) return false;
      }

      return true;
    });
  }, [turnos, fechaDesde, fechaHasta]);

  const datosGrafico = turnosFiltrados.map((t) => ({
    name: `#${t.turnoId}`,
    total: t.totalRecaudado,
  }));

  return {
    turnosFiltrados,
    ventasPorTurno,
    turnoAbiertoId,
    loading,
    fechaDesde,
    fechaHasta,
    datosGrafico,
    setFechaDesde,
    setFechaHasta,
    cargarTurnos,
    toggleTurno,
  };
}