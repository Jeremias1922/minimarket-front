"use client";

import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";
import { useRouter } from "next/navigation";

import useVentas from "./useVentas";
import Header from "../../../components/Header";

import {
  cerrarTurno,
} from "../../../helpers/httpHelper";
import DetalleArqueoCaja from "../turnos/DetalleArqueoCaja";


export default function Ventas() {
  const router = useRouter();

  const {
    turno,
    resumen,
    ventas,
    loading,
    cargarVentas,
  } = useVentas();

  const [
    ventaAbiertaId,
    setVentaAbiertaId,
  ] = useState<number | null>(null);

  const [
    openModal,
    setOpenModal,
  ] = useState(false);

  const [
    efectivoReal,
    setEfectivoReal,
  ] = useState("");

  const [
    errorCierre,
    setErrorCierre,
  ] = useState("");

  const [
    cerrandoTurno,
    setCerrandoTurno,
  ] = useState(false);

  /*
   * Valores necesarios para el arqueo.
   *
   * El backend ya devuelve efectivoEsperado,
   * pero mantenemos un cálculo alternativo
   * para compatibilidad con turnos antiguos.
   */
  const montoInicial = Number(
    resumen?.montoInicial ?? 0
  );

  const totalEfectivo = Number(
    resumen?.totalEfectivo ?? 0
  );

  const totalIngresosEfectivo = Number(
    resumen?.totalIngresosEfectivo ?? 0
  );

  const totalEgresosEfectivo = Number(
    resumen?.totalEgresosEfectivo ?? 0
  );

  const efectivoEsperado = Number(
    resumen?.efectivoEsperado ??
      montoInicial +
        totalEfectivo +
        totalIngresosEfectivo -
        totalEgresosEfectivo
  );

  const efectivoRealNumero =
    efectivoReal.trim() === ""
      ? null
      : Number(
          efectivoReal.replace(",", ".")
        );

  const diferenciaPrevia =
    efectivoRealNumero !== null &&
    Number.isFinite(
      efectivoRealNumero
    )
      ? redondear(
          efectivoRealNumero -
            efectivoEsperado
        )
      : null;

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

  const abrirModalCierre = () => {
    setEfectivoReal("");
    setErrorCierre("");
    setOpenModal(true);
  };

  const cancelarCierre = () => {
    if (cerrandoTurno) {
      return;
    }

    setOpenModal(false);
    setEfectivoReal("");
    setErrorCierre("");
  };

  const confirmarCierre =
    async () => {
      if (!turno?.id) {
        setErrorCierre(
          "No se encontró el turno actual."
        );

        return;
      }

      if (
        efectivoRealNumero === null ||
        !Number.isFinite(
          efectivoRealNumero
        ) ||
        efectivoRealNumero < 0
      ) {
        setErrorCierre(
          "Ingresá cuánto efectivo contaste realmente en la caja."
        );

        return;
      }

      try {
        setCerrandoTurno(true);
        setErrorCierre("");

        await cerrarTurno(
          turno.id,
          efectivoRealNumero
        );

        /*
         * Al cerrar el turno se finaliza
         * la sesión operativa del empleado.
         */
        localStorage.removeItem(
          "usuario"
        );

        setOpenModal(false);

        router.replace("/login");
      } catch (error) {
        console.error(
          "Error al cerrar el turno:",
          error
        );

        if (
          axios.isAxiosError(error)
        ) {
          const respuesta =
            error.response?.data;

          const mensajeBackend =
            typeof respuesta === "string"
              ? respuesta
              : respuesta?.mensaje ??
                respuesta?.message;

          if (
            error.response?.status ===
            400
          ) {
            setErrorCierre(
              mensajeBackend ||
                "Los datos del cierre no son válidos."
            );

            return;
          }

          if (
            error.response?.status ===
            404
          ) {
            setErrorCierre(
              mensajeBackend ||
                "No se encontró el turno."
            );

            return;
          }

          if (!error.response) {
            setErrorCierre(
              "No se pudo conectar con el servidor."
            );

            return;
          }
        }

        setErrorCierre(
          "No se pudo cerrar el turno. Intentá nuevamente."
        );
      } finally {
        setCerrandoTurno(false);
      }
    };

  return (
    <>
      <Header title="Ventas" />

      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700 }}
          >
            Ventas del turno
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              color="error"
              variant="outlined"
              disabled={
                !turno || loading
              }
              onClick={
                abrirModalCierre
              }
            >
              Cerrar turno
            </Button>

            <Button
              variant="contained"
              onClick={
                cargarVentas
              }
              disabled={loading}
            >
              {loading
                ? "Actualizando..."
                : "Actualizar"}
            </Button>
          </Box>
        </Box>

        {turno && (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontWeight: 800,
              }}
            >
              Turno abierto
            </Typography>

            <Typography>
              Inicio:{" "}
              {new Date(
                turno.fechaApertura
              ).toLocaleString(
                "es-AR"
              )}
            </Typography>

            <Typography>
              Estado: {turno.estado}
            </Typography>

            <Typography>
              Monto inicial:{" "}
              {money(
                resumen?.montoInicial
              )}
            </Typography>
          </Paper>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 2,
            mb: 3,
          }}
        >
          <ResumenCard
            title="Total recaudado"
            value={money(
              resumen?.totalRecaudado
            )}
          />

          <ResumenCard
            title="Cantidad de ventas"
            value={
              resumen?.cantidadVentas ??
              0
            }
          />

          <ResumenCard
            title="Ticket promedio"
            value={money(
              resumen?.ticketPromedio
            )}
          />

          <ResumenCard
            title="Efectivo esperado"
            value={money(
              resumen?.efectivoEsperado
            )}
            destacado
          />
        </Box>

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 800,
            }}
          >
            Detalle de ventas
          </Typography>

          {loading ? (
            <Typography>
              Cargando ventas...
            </Typography>
          ) : ventas.length === 0 ? (
            <Typography color="text.secondary">
              No hay ventas en este
              turno.
            </Typography>
          ) : (
            ventas.map((venta) => {
              const abierta =
                ventaAbiertaId ===
                venta.id;

              return (
                <Paper
                  key={venta.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 3,
                    border:
                      "1px solid #e5e7eb",
                    backgroundColor:
                      "#ffffff",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr auto",
                        md: "1fr auto auto auto auto",
                      },
                      gap: 2,
                      alignItems:
                        "center",
                      pb: abierta
                        ? 1.5
                        : 0,
                      borderBottom:
                        abierta
                          ? "1px solid #e5e7eb"
                          : "none",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                      }}
                    >
                      Venta #{venta.id}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        display: {
                          xs: "none",
                          md: "block",
                        },
                      }}
                    >
                      {new Date(
                        venta.fecha
                      ).toLocaleTimeString(
                        "es-AR"
                      )}
                    </Typography>

                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 999,
                        backgroundColor:
                          "#f3f4f6",
                        fontWeight: 700,
                        fontSize: 13,
                        display: {
                          xs: "none",
                          md: "block",
                        },
                      }}
                    >
                      {
                        venta.medioPago
                      }
                    </Box>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        setVentaAbiertaId(
                          abierta
                            ? null
                            : venta.id
                        )
                      }
                    >
                      {abierta
                        ? "Ocultar"
                        : "Detalle"}
                    </Button>

                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: 18,
                        textAlign:
                          "right",
                      }}
                    >
                      {money(
                        venta.total
                      )}
                    </Typography>
                  </Box>

                  {abierta && (
                    <Box sx={{ mt: 1 }}>
                      {venta.items?.map(
                        (item) => (
                          <Box
                            key={`${venta.id}-${item.productoId}`}
                            sx={{
                              display:
                                "grid",
                              gridTemplateColumns: {
                                xs: "1fr auto",
                                md: "1fr 80px 120px 120px",
                              },
                              gap: 2,
                              py: 1,
                              borderBottom:
                                "1px solid #f3f4f6",
                              "&:last-child":
                                {
                                  borderBottom:
                                    "none",
                                },
                            }}
                          >
                            <Typography>
                              {
                                item.nombreProducto
                              }
                            </Typography>

                            <Typography
                              sx={{
                                textAlign:
                                  "center",
                              }}
                            >
                              x
                              {
                                item.cantidad
                              }
                            </Typography>

                            <Typography
                              sx={{
                                textAlign:
                                  "right",
                                display: {
                                  xs: "none",
                                  md: "block",
                                },
                              }}
                            >
                              {money(
                                item.precioUnitario
                              )}
                            </Typography>

                            <Typography
                              sx={{
                                textAlign:
                                  "right",
                                fontWeight: 600,
                                display: {
                                  xs: "none",
                                  md: "block",
                                },
                              }}
                            >
                              {money(
                                item.subtotal
                              )}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                  )}
                </Paper>
              );
            })
          )}
        </Paper>
      </Box>

      <Dialog
        open={openModal}
        onClose={
          cerrandoTurno
            ? undefined
            : cancelarCierre
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ fontWeight: 800 }}
        >
          Arqueo y cierre de turno
        </DialogTitle>

        <DialogContent>
          <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Revisá los movimientos y
            contá todo el efectivo físico
            disponible antes de confirmar.
          </Typography>

          {errorCierre && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {errorCierre}
            </Alert>
          )}

          {resumen && (
            <DetalleArqueoCaja
              turno={resumen}
              dentroDePaper
            />
          )}

          <TextField
            autoFocus
            fullWidth
            label="Efectivo real contado"
            type="number"
            value={efectivoReal}
            disabled={cerrandoTurno}
            onChange={(event) => {
              setEfectivoReal(
                event.target.value
              );

              if (errorCierre) {
                setErrorCierre("");
              }
            }}
            slotProps={{
              htmlInput: {
                min: 0,
                step: "0.01",
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                ),
              },
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
                sx={{ fontWeight: 800 }}
              >
                Diferencia preliminar
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Efectivo real menos
                efectivo esperado
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
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color:
                    obtenerColorDiferencia(
                      diferenciaPrevia
                    ),
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
                    obtenerColorDiferencia(
                      diferenciaPrevia
                    ),
                }}
              >
                {obtenerTextoDiferencia(
                  diferenciaPrevia,
                  money
                )}
              </Typography>
            </Box>
          </Box>

          {diferenciaPrevia !== null &&
            diferenciaPrevia !== 0 && (
              <Alert
                severity={
                  diferenciaPrevia < 0
                    ? "error"
                    : "warning"
                }
                sx={{ mt: 2 }}
              >
                {diferenciaPrevia < 0
                  ? "La caja tiene un faltante. Revisá el efectivo y los movimientos antes de confirmar."
                  : "La caja tiene un sobrante. Revisá el efectivo y los movimientos antes de confirmar."}
              </Alert>
            )}

          {diferenciaPrevia === 0 && (
            <Alert
              severity="success"
              sx={{ mt: 2 }}
            >
              La caja coincide
              correctamente con el monto
              esperado.
            </Alert>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={
              cancelarCierre
            }
            disabled={cerrandoTurno}
          >
            Cancelar
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={
              confirmarCierre
            }
            disabled={
              cerrandoTurno ||
              efectivoRealNumero ===
                null ||
              !Number.isFinite(
                efectivoRealNumero
              ) ||
              efectivoRealNumero < 0
            }
          >
            {cerrandoTurno
              ? "Cerrando..."
              : "Confirmar cierre"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

interface ResumenCardProps {
  title: string;
  value: string | number;
  destacado?: boolean;
}

function ResumenCard({
  title,
  value,
  destacado = false,
}: ResumenCardProps) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: destacado
          ? "1px solid #fed7aa"
          : undefined,
        backgroundColor: destacado
          ? "#fffaf5"
          : undefined,
      }}
    >
      <Typography color="text.secondary">
        {title}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mt: 1,
          color: destacado
            ? "#ea580c"
            : "text.primary",
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

function obtenerColorDiferencia(
  diferencia: number | null
) {
  if (
    diferencia === null ||
    diferencia === 0
  ) {
    return "text.primary";
  }

  return diferencia > 0
    ? "warning.main"
    : "error.main";
}

function obtenerTextoDiferencia(
  diferencia: number | null,
  money: (
    value?: number | null
  ) => string
) {
  if (diferencia === null) {
    return "Ingresá el efectivo contado";
  }

  if (diferencia === 0) {
    return "Caja exacta";
  }

  if (diferencia > 0) {
    return `Sobrante de ${money(
      diferencia
    )}`;
  }

  return `Faltante de ${money(
    Math.abs(diferencia)
  )}`;
}

function redondear(
  value: number
) {
  return (
    Math.round(value * 100) / 100
  );
}