"use client";

import { IResumenTurno } from "@/app/turnos/turnos.interface";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { cerrarTurno } from "../helpers/httpHelper";
import DetalleArqueoCaja from "@/app/turnos/DetalleArqueoCaja";


interface CerrarTurnoModalProps {
  open: boolean;
  turno: IResumenTurno | null;

  onClose: () => void;

  onTurnoCerrado: (
    resumen: IResumenTurno
  ) => void | Promise<void>;
}

export default function CerrarTurnoModal({
  open,
  turno,
  onClose,
  onTurnoCerrado,
}: CerrarTurnoModalProps) {
  const [efectivoReal, setEfectivoReal] =
    useState("");

  const [cerrando, setCerrando] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (open) {
      setEfectivoReal("");
      setError("");
    }
  }, [open]);

  const efectivoRealNumerico =
    useMemo(() => {
      if (!efectivoReal.trim()) {
        return null;
      }

      const valor = Number(
        efectivoReal.replace(",", ".")
      );

      return Number.isFinite(valor)
        ? valor
        : null;
    }, [efectivoReal]);

  const diferenciaPrevia =
    useMemo(() => {
      if (
        efectivoRealNumerico === null ||
        !turno
      ) {
        return null;
      }

      return redondear(
        efectivoRealNumerico -
        turno.efectivoEsperado
      );
    }, [
      efectivoRealNumerico,
      turno,
    ]);

  const confirmarCierre = async () => {
    if (!turno) {
      return;
    }

    if (
      efectivoRealNumerico === null ||
      efectivoRealNumerico < 0
    ) {
      setError(
        "Ingresá el efectivo real contado."
      );

      return;
    }

    try {
      setCerrando(true);
      setError("");

      const resumenCerrado =
        await cerrarTurno(
          turno.turnoId,
          efectivoRealNumerico
        );

      await onTurnoCerrado(
        resumenCerrado
      );

      setEfectivoReal("");
    } catch (error) {
      console.error(
        "Error al cerrar el turno:",
        error
      );

      setError(
        obtenerMensajeError(
          error,
          "No se pudo cerrar el turno."
        )
      );
    } finally {
      setCerrando(false);
    }
  };

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

  const diferenciaColor =
    diferenciaPrevia === null ||
      diferenciaPrevia === 0
      ? "text.primary"
      : diferenciaPrevia > 0
        ? "success.main"
        : "error.main";

  const diferenciaTexto = () => {
    if (diferenciaPrevia === null) {
      return "Ingresá el dinero contado";
    }

    if (diferenciaPrevia === 0) {
      return "Caja exacta";
    }

    if (diferenciaPrevia > 0) {
      return `Sobrante de ${money(
        diferenciaPrevia
      )}`;
    }

    return `Faltante de ${money(
      Math.abs(diferenciaPrevia)
    )}`;
  };

  return (
    <Dialog
      open={open}
      onClose={
        cerrando
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{ fontWeight: 800 }}
      >
        Cerrar turno
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {turno && (
          <>
            <Typography
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Revisá los movimientos y contá
              todo el efectivo disponible
              antes de confirmar.
            </Typography>

            <DetalleArqueoCaja
              turno={turno}
              dentroDePaper
            />

            <TextField
              autoFocus
              fullWidth
              type="number"
              label="Efectivo real contado"
              value={efectivoReal}
              disabled={cerrando}
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 0.01,
                },
              }}
              onChange={(event) => {
                setEfectivoReal(
                  event.target.value
                );

                setError("");
              }}
              sx={{ mt: 3 }}
            />

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor:
                  "grey.100",
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{ fontWeight: 700 }}
                >
                  Diferencia preliminar
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Efectivo real menos efectivo
                  esperado
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign: "right",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    color:
                      diferenciaColor,
                  }}
                >
                  {diferenciaPrevia ===
                    null
                    ? "-"
                    : money(
                      diferenciaPrevia
                    )}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color:
                      diferenciaColor,
                  }}
                >
                  {diferenciaTexto()}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
        }}
      >
        <Button
          onClick={onClose}
          disabled={cerrando}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={confirmarCierre}
          disabled={
            cerrando ||
            efectivoRealNumerico === null ||
            efectivoRealNumerico < 0
          }
        >
          {cerrando
            ? "Cerrando..."
            : "Confirmar cierre"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function redondear(
  value: number
): number {
  return Math.round(
    value * 100
  ) / 100;
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
          data?:
          | string
          | {
            mensaje?: string;
            message?: string;
          };
        };
      }
    ).response;

    if (
      typeof response?.data ===
      "string"
    ) {
      return response.data;
    }

    return (
      response?.data?.mensaje ??
      response?.data?.message ??
      mensajePorDefecto
    );
  }

  return mensajePorDefecto;
}