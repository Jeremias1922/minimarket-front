"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Button,
  Typography,
} from "@mui/material";

import {
  obtenerHistorialMovimientoCaja,
} from "../../../helpers/httpHelper";

import type {
  CategoriaMovimientoCaja,
  IMovimientoCaja,
  IMovimientoCajaHistorial,
  MedioPagoMovimientoCaja,
  TipoMovimientoCaja,
} from "./movimientosCaja.interface";

interface HistorialMovimientoCajaDialogProps {
  open: boolean;

  movimiento:
    | IMovimientoCaja
    | null;

  onClose: () => void;

  money: (
    value?: number | null
  ) => string;

  fechaHora: (
    value?: string | null
  ) => string;
}

const NOMBRES_CATEGORIA:
  Record<
    CategoriaMovimientoCaja,
    string
  > = {
    PAGO_PROVEEDOR:
      "Pago a proveedor",

    GASTO_OPERATIVO:
      "Gasto operativo",

    RETIRO_EFECTIVO:
      "Retiro de efectivo",

    APORTE_EFECTIVO:
      "Aporte de efectivo",

    AJUSTE_CAJA:
      "Ajuste de caja",

    SUELDO:
        "Sueldo",

    OTRO:
      "Otro",
  };

const NOMBRES_TIPO:
  Record<
    TipoMovimientoCaja,
    string
  > = {
    INGRESO: "Ingreso",
    EGRESO: "Egreso",
  };

const NOMBRES_MEDIO_PAGO:
  Record<
    MedioPagoMovimientoCaja,
    string
  > = {
    EFECTIVO: "Efectivo",
    DEBITO: "Débito",
    CREDITO: "Crédito",
    OTRO: "Otro",
  };

export default function HistorialMovimientoCajaDialog({
  open,
  movimiento,
  onClose,
  money,
  fechaHora,
}: HistorialMovimientoCajaDialogProps) {
  const [
    historial,
    setHistorial,
  ] = useState<
    IMovimientoCajaHistorial[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    if (
      !open ||
      !movimiento?.id
    ) {
      setHistorial([]);
      setError("");

      return;
    }

    let componenteActivo = true;

    const cargarHistorial =
      async () => {
        try {
          setLoading(true);
          setError("");

          const respuesta =
            await obtenerHistorialMovimientoCaja(
              movimiento.id
            );

          if (componenteActivo) {
            setHistorial(
              respuesta
            );
          }
        } catch (error) {
          console.error(
            "Error al obtener historial:",
            error
          );

          if (componenteActivo) {
            setError(
              obtenerMensajeError(
                error
              )
            );
          }
        } finally {
          if (componenteActivo) {
            setLoading(false);
          }
        }
      };

    cargarHistorial();

    return () => {
      componenteActivo = false;
    };
  }, [
    open,
    movimiento?.id,
  ]);

  const cerrar = () => {
    if (loading) {
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={cerrar}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{ fontWeight: 800 }}
      >
        Historial del movimiento
      </DialogTitle>

      <DialogContent>
        {movimiento && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Movimiento #
                  {movimiento.id}
                </Typography>

                <Typography color="text.secondary">
                  {
                    NOMBRES_CATEGORIA[
                      movimiento
                        .categoria
                    ]
                  }
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Registrado por{" "}
                  {
                    movimiento.usuarioNombre
                  }{" "}
                  el{" "}
                  {fechaHora(
                    movimiento.fecha
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign: {
                    xs: "left",
                    sm: "right",
                  },
                }}
              >
                <Chip
                  size="small"
                  label={
                    movimiento.tipo
                  }
                  color={
                    movimiento.tipo ===
                    "INGRESO"
                      ? "success"
                      : "error"
                  }
                  sx={{ mb: 1 }}
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                  }}
                  color={
                    movimiento.tipo ===
                    "INGRESO"
                      ? "success.main"
                      : "error.main"
                  }
                >
                  {movimiento.tipo ===
                  "INGRESO"
                    ? "+"
                    : "-"}
                  {money(
                    movimiento.monto
                  )}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              py: 6,
              display: "flex",
              justifyContent:
                "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : historial.length ===
          0 ? (
          <Alert severity="info">
            Este movimiento todavía no
            tiene modificaciones
            registradas.
          </Alert>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
            }}
          >
            {historial.map(
              (
                registro,
                index
              ) => (
                <Paper
                  key={
                    registro.id
                  }
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems: {
                        xs: "flex-start",
                        sm: "center",
                      },
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                        }}
                      >
                        Modificación{" "}
                        #
                        {historial.length -
                          index}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Realizada por{" "}
                        {
                          registro.usuarioModificacionNombre
                        }
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {fechaHora(
                        registro.fechaModificacion
                      )}
                    </Typography>
                  </Box>

                  <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                  >
                    <strong>
                      Motivo:
                    </strong>{" "}
                    {
                      registro.motivo
                    }
                  </Alert>

                  <Box
                    sx={{
                      display:
                        "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "1fr auto 1fr",
                      },
                      gap: 2,
                      alignItems:
                        "stretch",
                    }}
                  >
                    <ValoresMovimiento
                      titulo="Valores anteriores"
                      tipo={
                        registro.tipoAnterior
                      }
                      categoria={
                        registro.categoriaAnterior
                      }
                      medioPago={
                        registro.medioPagoAnterior
                      }
                      monto={
                        registro.montoAnterior
                      }
                      descripcion={
                        registro.descripcionAnterior
                      }
                      money={money}
                    />

                    <Box
                      sx={{
                        display: {
                          xs: "none",
                          md: "flex",
                        },
                        alignItems:
                          "center",
                      }}
                    >
                      <Divider
                        orientation="vertical"
                        flexItem
                      />
                    </Box>

                    <ValoresMovimiento
                      titulo="Valores nuevos"
                      tipo={
                        registro.tipoNuevo
                      }
                      categoria={
                        registro.categoriaNueva
                      }
                      medioPago={
                        registro.medioPagoNuevo
                      }
                      monto={
                        registro.montoNuevo
                      }
                      descripcion={
                        registro.descripcionNueva
                      }
                      money={money}
                      nuevo
                    />
                  </Box>
                </Paper>
              )
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
        }}
      >
        <Button
          onClick={cerrar}
          disabled={loading}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface ValoresMovimientoProps {
  titulo: string;

  tipo:
    TipoMovimientoCaja;

  categoria:
    CategoriaMovimientoCaja;

  medioPago:
    MedioPagoMovimientoCaja;

  monto: number;

  descripcion:
    | string
    | null;

  money: (
    value?: number | null
  ) => string;

  nuevo?: boolean;
}

function ValoresMovimiento({
  titulo,
  tipo,
  categoria,
  medioPago,
  monto,
  descripcion,
  money,
  nuevo = false,
}: ValoresMovimientoProps) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: nuevo
          ? "success.50"
          : "grey.100",
        border: "1px solid",
        borderColor: nuevo
          ? "success.light"
          : "divider",
      }}
    >
      <Typography
        sx={{
          fontWeight: 800,
          mb: 1.5,
        }}
      >
        {titulo}
      </Typography>

      <Fila
        label="Tipo"
        value={
          NOMBRES_TIPO[tipo]
        }
      />

      <Fila
        label="Categoría"
        value={
          NOMBRES_CATEGORIA[
            categoria
          ]
        }
      />

      <Fila
        label="Medio de pago"
        value={
          NOMBRES_MEDIO_PAGO[
            medioPago
          ]
        }
      />

      <Fila
        label="Monto"
        value={money(monto)}
        destacado
      />

      <Box sx={{ mt: 1.5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Descripción
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            whiteSpace:
              "pre-wrap",
          }}
        >
          {descripcion ||
            "Sin descripción"}
        </Typography>
      </Box>
    </Box>
  );
}

interface FilaProps {
  label: string;
  value: string;
  destacado?: boolean;
}

function Fila({
  label,
  value,
  destacado = false,
}: FilaProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent:
          "space-between",
        gap: 2,
        py: 0.5,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          fontWeight: destacado
            ? 800
            : 600,
          textAlign: "right",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function obtenerMensajeError(
  error: unknown
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
      "No se pudo cargar el historial."
    );
  }

  return "No se pudo cargar el historial.";
}