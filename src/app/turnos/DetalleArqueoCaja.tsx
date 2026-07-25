"use client";

import {
  Box,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { IResumenTurno } from "./turnos.interface";


interface DetalleArqueoCajaProps {
  turno: IResumenTurno;
  dentroDePaper?: boolean;
}

export default function DetalleArqueoCaja({
  turno,
  dentroDePaper = false,
}: DetalleArqueoCajaProps) {
  const money = (
    value?: number | null
  ) =>
    `$${Number(value ?? 0).toLocaleString(
      "es-AR",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;

  const contenido = (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          mb: 0.5,
        }}
      >
        Composición del efectivo esperado
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 2.5 }}
      >
        Dinero que debería encontrarse
        físicamente en la caja.
      </Typography>

      <FilaArqueo
        concepto="Monto inicial"
        descripcion="Efectivo disponible al abrir el turno"
        valor={money(turno.montoInicial)}
        signo="+"
      />

      <FilaArqueo
        concepto="Ventas en efectivo"
        descripcion="Cobros realizados en efectivo"
        valor={money(turno.totalEfectivo)}
        signo="+"
      />

      <FilaArqueo
        concepto="Ingresos en efectivo"
        descripcion="Aportes y otros ingresos registrados"
        valor={money(
          turno.totalIngresosEfectivo
        )}
        signo="+"
        color="success.main"
      />

      <FilaArqueo
        concepto="Egresos en efectivo"
        descripcion="Pagos, gastos y retiros registrados"
        valor={money(
          turno.totalEgresosEfectivo
        )}
        signo="-"
        color="error.main"
      />

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{ fontWeight: 800 }}
          >
            Efectivo esperado
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Total calculado para el arqueo
          </Typography>
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 900,
            color: "#ea580c",
            textAlign: "right",
          }}
        >
          {money(turno.efectivoEsperado)}
        </Typography>
      </Box>
    </>
  );

  if (dentroDePaper) {
    return (
      <Box
        sx={{
          p: 2.5,
          border: "1px solid",
          borderColor: "#fed7aa",
          backgroundColor: "#fffaf5",
          borderRadius: 2,
        }}
      >
        {contenido}
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "#fed7aa",
        backgroundColor: "#fffaf5",
      }}
    >
      {contenido}
    </Paper>
  );
}

interface FilaArqueoProps {
  concepto: string;
  descripcion: string;
  valor: string;
  signo: "+" | "-";
  color?: string;
}

function FilaArqueo({
  concepto,
  descripcion,
  valor,
  signo,
  color = "text.primary",
}: FilaArqueoProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns:
          "28px minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 1.5,
        py: 1.25,
      }}
    >
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: 20,
          color,
          textAlign: "center",
        }}
      >
        {signo}
      </Typography>

      <Box>
        <Typography
          sx={{ fontWeight: 700 }}
        >
          {concepto}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {descripcion}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontWeight: 800,
          color,
          textAlign: "right",
        }}
      >
        {valor}
      </Typography>
    </Box>
  );
}