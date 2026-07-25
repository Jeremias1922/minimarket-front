"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import useMovimientosCaja from "./useMovimientosCaja";

import HistorialMovimientoCajaDialog from "./HistorialMovimientoCajaDialog";

import {
  editarMovimientoCaja,
} from "../../../helpers/httpHelper";

import {
  CategoriaMovimientoCaja,
  IMovimientoCaja,
  MedioPagoMovimientoCaja,
  TipoMovimientoCaja,
} from "./movimientosCaja.interface";

const TIPOS: Array<{
  valor: TipoMovimientoCaja;
  nombre: string;
}> = [
  {
    valor: "EGRESO",
    nombre: "Egreso",
  },
  {
    valor: "INGRESO",
    nombre: "Ingreso",
  },
];

const MEDIOS_PAGO: Array<{
  valor: MedioPagoMovimientoCaja;
  nombre: string;
}> = [
  {
    valor: "EFECTIVO",
    nombre: "Efectivo",
  },
  {
    valor: "DEBITO",
    nombre: "Débito",
  },
  {
    valor: "CREDITO",
    nombre: "Crédito",
  },
  {
    valor: "OTRO",
    nombre: "Otro",
  },
];

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

interface FormEdicion {
  tipo: TipoMovimientoCaja;

  categoria:
    CategoriaMovimientoCaja;

  medioPago:
    MedioPagoMovimientoCaja;

  monto: string;
  descripcion: string;
  motivoModificacion: string;
}

const FORM_EDICION_INICIAL:
  FormEdicion = {
    tipo: "EGRESO",
    categoria: "PAGO_PROVEEDOR",
    medioPago: "EFECTIVO",
    monto: "",
    descripcion: "",
    motivoModificacion: "",
  };

export default function MovimientosCaja() {
  const {
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

    limpiarMensaje,
    limpiarError,
  } = useMovimientosCaja();

  const [
    movimientoEditando,
    setMovimientoEditando,
  ] =
    useState<IMovimientoCaja | null>(
      null
    );

  const [
    movimientoHistorial,
    setMovimientoHistorial,
  ] =
    useState<IMovimientoCaja | null>(
      null
    );

  const [
    formEdicion,
    setFormEdicion,
  ] = useState<FormEdicion>(
    FORM_EDICION_INICIAL
  );

  const [
    guardandoEdicion,
    setGuardandoEdicion,
  ] = useState(false);

  const [
    errorEdicion,
    setErrorEdicion,
  ] = useState("");

  const [
    mensajeEdicion,
    setMensajeEdicion,
  ] = useState("");

  const categoriasEdicion =
    useMemo(() => {
      return obtenerCategoriasPorTipo(
        formEdicion.tipo
      );
    }, [formEdicion.tipo]);

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

  const fechaHora = (
    value?: string | null
  ) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString(
      "es-AR"
    );
  };

  const abrirEdicion = (
    movimiento: IMovimientoCaja
  ) => {
    if (
      !puedeRegistrar ||
      movimiento.anulado
    ) {
      return;
    }

    setMovimientoEditando(
      movimiento
    );

    setFormEdicion({
      tipo: movimiento.tipo,

      categoria:
        movimiento.categoria,

      medioPago:
        movimiento.medioPago,

      monto: String(
        movimiento.monto
      ),

      descripcion:
        movimiento.descripcion ?? "",

      motivoModificacion: "",
    });

    setErrorEdicion("");
  };

  const cerrarEdicion = () => {
    if (guardandoEdicion) {
      return;
    }

    setMovimientoEditando(null);

    setFormEdicion(
      FORM_EDICION_INICIAL
    );

    setErrorEdicion("");
  };

  const cambiarTipoEdicion = (
    tipo: TipoMovimientoCaja
  ) => {
    const categoriaInicial:
      CategoriaMovimientoCaja =
        tipo === "INGRESO"
          ? "APORTE_EFECTIVO"
          : "PAGO_PROVEEDOR";

    setFormEdicion(
      (formActual) => ({
        ...formActual,
        tipo,
        categoria:
          categoriaInicial,
      })
    );
  };

  const confirmarEdicion =
    async () => {
      if (
        !usuario ||
        !movimientoEditando
      ) {
        setErrorEdicion(
          "No se encontró el movimiento o el usuario."
        );

        return;
      }

      const monto = Number(
        formEdicion.monto.replace(
          ",",
          "."
        )
      );

      if (
        !Number.isFinite(monto) ||
        monto <= 0
      ) {
        setErrorEdicion(
          "Ingresá un monto mayor a cero."
        );

        return;
      }

      const motivo =
        formEdicion
          .motivoModificacion
          .trim();

      if (!motivo) {
        setErrorEdicion(
          "El motivo de modificación es obligatorio."
        );

        return;
      }

      try {
        setGuardandoEdicion(true);
        setErrorEdicion("");

        await editarMovimientoCaja(
          movimientoEditando.id,
          {
            usuarioId: usuario.id,

            tipo:
              formEdicion.tipo,

            categoria:
              formEdicion.categoria,

            medioPago:
              formEdicion.medioPago,

            monto,

            descripcion:
              formEdicion.descripcion
                .trim() ||
              undefined,

            motivoModificacion:
              motivo,
          }
        );

        setMovimientoEditando(null);

        setFormEdicion(
          FORM_EDICION_INICIAL
        );

        setMensajeEdicion(
          "Movimiento actualizado correctamente."
        );

        await cargarDatos();
      } catch (error) {
        console.error(
          "Error al editar movimiento:",
          error
        );

        setErrorEdicion(
          obtenerMensajeError(
            error,
            "No se pudo editar el movimiento."
          )
        );
      } finally {
        setGuardandoEdicion(false);
      }
    };

  return (
    <>
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
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800 }}
            >
              Movimientos de caja
            </Typography>

            <Typography color="text.secondary">
              Ingresos, egresos, pagos y
              retiros del turno actual
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={() =>
              cargarDatos()
            }
            disabled={loading}
          >
            Actualizar
          </Button>
        </Box>

        {mensaje && (
          <Alert
            severity="success"
            onClose={limpiarMensaje}
            sx={{ mb: 2 }}
          >
            {mensaje}
          </Alert>
        )}

        {mensajeEdicion && (
          <Alert
            severity="success"
            onClose={() =>
              setMensajeEdicion("")
            }
            sx={{ mb: 2 }}
          >
            {mensajeEdicion}
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            onClose={limpiarError}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Paper
            sx={{
              p: 5,
              borderRadius: 3,
              display: "flex",
              justifyContent:
                "center",
            }}
          >
            <CircularProgress />
          </Paper>
        ) : !turnoActivo ? (
          <Paper
            sx={{
              p: 5,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Chip
              label="CAJA CERRADA"
              sx={{
                mb: 2,
                fontWeight: 800,
              }}
            />

            <Typography
              variant="h5"
              sx={{ fontWeight: 800 }}
            >
              No hay ningún turno abierto
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Para registrar un
              movimiento primero debe
              existir un turno abierto.
            </Typography>
          </Paper>
        ) : (
          <>
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor:
                  puedeRegistrar
                    ? "success.light"
                    : "warning.light",
              }}
            >
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
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    Turno #
                    {
                      turnoActivo.turnoId
                    }
                  </Typography>

                  <Typography color="text.secondary">
                    Responsable:{" "}
                    {
                      turnoActivo.usuarioNombre
                    }
                  </Typography>
                </Box>

                <Chip
                  label={
                    puedeRegistrar
                      ? "PODÉS REGISTRAR Y EDITAR"
                      : "SOLO LECTURA"
                  }
                  color={
                    puedeRegistrar
                      ? "success"
                      : "warning"
                  }
                  sx={{
                    fontWeight: 800,
                  }}
                />
              </Box>

              {!puedeRegistrar && (
                <Typography
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Estás viendo el turno
                  de{" "}
                  {
                    turnoActivo.usuarioNombre
                  }
                  . Solamente el
                  responsable puede
                  registrar o modificar
                  movimientos.
                </Typography>
              )}
            </Paper>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 2,
                mb: 3,
              }}
            >
              <TarjetaMetrica
                titulo="Ingresos registrados"
                valor={money(
                  resumen?.totalIngresos
                )}
              />

              <TarjetaMetrica
                titulo="Egresos registrados"
                valor={money(
                  resumen?.totalEgresos
                )}
              />

              <TarjetaMetrica
                titulo="Ingresos en efectivo"
                valor={money(
                  resumen
                    ?.totalIngresosEfectivo
                )}
              />

              <TarjetaMetrica
                titulo="Egresos en efectivo"
                valor={money(
                  resumen
                    ?.totalEgresosEfectivo
                )}
              />
            </Box>

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
                  fontWeight: 800,
                  mb: 1,
                }}
              >
                Registrar movimiento
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Los movimientos en
                efectivo modifican el
                efectivo esperado del
                arqueo.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 2,
                }}
              >
                <TextField
                  select
                  label="Tipo"
                  value={form.tipo}
                  disabled={
                    !puedeRegistrar ||
                    guardando
                  }
                  onChange={(event) =>
                    cambiarTipo(
                      event.target
                        .value as TipoMovimientoCaja
                    )
                  }
                >
                  {TIPOS.map(
                    (tipo) => (
                      <MenuItem
                        key={tipo.valor}
                        value={tipo.valor}
                      >
                        {tipo.nombre}
                      </MenuItem>
                    )
                  )}
                </TextField>

                <TextField
                  select
                  label="Categoría"
                  value={
                    form.categoria
                  }
                  disabled={
                    !puedeRegistrar ||
                    guardando
                  }
                  onChange={(event) =>
                    cambiarCategoria(
                      event.target
                        .value as CategoriaMovimientoCaja
                    )
                  }
                >
                  {categoriasDisponibles.map(
                    (categoria) => (
                      <MenuItem
                        key={categoria}
                        value={categoria}
                      >
                        {
                          NOMBRES_CATEGORIA[
                            categoria
                          ]
                        }
                      </MenuItem>
                    )
                  )}
                </TextField>

                <TextField
                  select
                  label="Medio de pago"
                  value={
                    form.medioPago
                  }
                  disabled={
                    !puedeRegistrar ||
                    guardando
                  }
                  onChange={(event) =>
                    cambiarMedioPago(
                      event.target
                        .value as MedioPagoMovimientoCaja
                    )
                  }
                >
                  {MEDIOS_PAGO.map(
                    (medio) => (
                      <MenuItem
                        key={medio.valor}
                        value={medio.valor}
                      >
                        {medio.nombre}
                      </MenuItem>
                    )
                  )}
                </TextField>

                <TextField
                  label="Monto"
                  type="number"
                  value={form.monto}
                  disabled={
                    !puedeRegistrar ||
                    guardando
                  }
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: 0.01,
                    },
                  }}
                  onChange={(event) =>
                    cambiarMonto(
                      event.target
                        .value
                    )
                  }
                />

                <TextField
                  label="Descripción"
                  value={
                    form.descripcion
                  }
                  disabled={
                    !puedeRegistrar ||
                    guardando
                  }
                  placeholder="Ej: pago de mercadería"
                  onChange={(event) =>
                    cambiarDescripcion(
                      event.target
                        .value
                    )
                  }
                  sx={{
                    gridColumn: {
                      xs: "auto",
                      md: "span 2",
                      lg: "span 3",
                    },
                  }}
                />

                <Button
                  variant="contained"
                  size="large"
                  disabled={
                    !puedeRegistrar ||
                    guardando
                  }
                  onClick={
                    registrarMovimiento
                  }
                >
                  {guardando
                    ? "Registrando..."
                    : "Registrar"}
                </Button>
              </Box>
            </Paper>

            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Movimientos del turno
                </Typography>

                <Typography color="text.secondary">
                  {movimientos.length}{" "}
                  registros
                </Typography>
              </Box>

              {movimientos.length ===
              0 ? (
                <Typography color="text.secondary">
                  Todavía no hay
                  movimientos registrados.
                </Typography>
              ) : (
                movimientos.map(
                  (
                    movimiento,
                    index
                  ) => {
                    const puedeEditar =
                      puedeRegistrar &&
                      !movimiento.anulado;

                    return (
                      <Box
                        key={
                          movimiento.id
                        }
                      >
                        <Box
                          sx={{
                            display:
                              "grid",

                            gridTemplateColumns:
                              {
                                xs: "1fr",

                                md: "minmax(250px, 1fr) 180px 140px 150px 180px",
                              },

                            gap: 2,

                            alignItems:
                              "center",

                            py: 2,

                            opacity:
                              movimiento.anulado
                                ? 0.55
                                : 1,
                          }}
                        >
                          <Box>
                            <Box
                              sx={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap: 1,

                                flexWrap:
                                  "wrap",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 800,

                                  textDecoration:
                                    movimiento.anulado
                                      ? "line-through"
                                      : "none",
                                }}
                              >
                                {
                                  NOMBRES_CATEGORIA[
                                    movimiento
                                      .categoria
                                  ]
                                }
                              </Typography>

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
                              />

                              {movimiento.editado && (
                                <Chip
                                  size="small"
                                  label="EDITADO"
                                  color="warning"
                                  variant="outlined"
                                />
                              )}

                              {movimiento.anulado && (
                                <Chip
                                  size="small"
                                  label="ANULADO"
                                />
                              )}
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {movimiento.descripcion ||
                                "Sin descripción"}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: {
                                  xs: "block",
                                  md: "none",
                                },

                                mt: 0.5,
                              }}
                            >
                              {fechaHora(
                                movimiento.fecha
                              )}{" "}
                              ·{" "}
                              {
                                movimiento.medioPago
                              }
                            </Typography>

                            {movimiento.editado && (
                              <Box
                                sx={{
                                  mt: 1,
                                  p: 1.25,
                                  borderRadius: 1.5,

                                  backgroundColor:
                                    "rgba(237, 108, 2, 0.08)",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 700,
                                  }}
                                >
                                  Editado por{" "}
                                  {movimiento
                                    .usuarioUltimaModificacionNombre ??
                                    "usuario desconocido"}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {fechaHora(
                                    movimiento.fechaUltimaModificacion
                                  )}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Motivo:{" "}
                                  {movimiento
                                    .motivoUltimaModificacion ??
                                    "-"}
                                </Typography>
                              </Box>
                            )}

                            {movimiento.anulado && (
                              <Typography
                                variant="body2"
                                color="error"
                                sx={{ mt: 1 }}
                              >
                                Motivo de
                                anulación:{" "}
                                {movimiento.motivoAnulacion ??
                                  "-"}
                              </Typography>
                            )}
                          </Box>

                          <Typography
                            color="text.secondary"
                            sx={{
                              display: {
                                xs: "none",
                                md: "block",
                              },
                            }}
                          >
                            {fechaHora(
                              movimiento.fecha
                            )}
                          </Typography>

                          <Typography
                            sx={{
                              display: {
                                xs: "none",
                                md: "block",
                              },
                            }}
                          >
                            {
                              movimiento.medioPago
                            }
                          </Typography>

                          <Typography
                            sx={{
                              fontWeight: 800,

                              textAlign: {
                                xs: "left",
                                md: "right",
                              },
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

                          <Box
                            sx={{
                              display: "flex",

                              justifyContent: {
                                xs: "flex-start",
                                md: "flex-end",
                              },

                              gap: 1,

                              flexWrap:
                                "wrap",
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              disabled={
                                !puedeEditar
                              }
                              onClick={() =>
                                abrirEdicion(
                                  movimiento
                                )
                              }
                            >
                              Editar
                            </Button>

                            {movimiento.editado && (
                              <Button
                                variant="text"
                                size="small"
                                onClick={() =>
                                  setMovimientoHistorial(
                                    movimiento
                                  )
                                }
                              >
                                Historial
                              </Button>
                            )}
                          </Box>
                        </Box>

                        {index <
                          movimientos.length -
                            1 && (
                          <Divider />
                        )}
                      </Box>
                    );
                  }
                )
              )}
            </Paper>
          </>
        )}
      </Box>

      <Dialog
        open={
          movimientoEditando !== null
        }
        onClose={
          guardandoEdicion
            ? undefined
            : cerrarEdicion
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ fontWeight: 800 }}
        >
          Editar movimiento
        </DialogTitle>

        <DialogContent>
          <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            La modificación quedará
            registrada en el historial.
          </Typography>

          {movimientoEditando && (
            <Alert
              severity="info"
              sx={{ mb: 2 }}
            >
              Valor actual:{" "}
              <strong>
                {money(
                  movimientoEditando.monto
                )}
              </strong>
            </Alert>
          )}

          {errorEdicion && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {errorEdicion}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },

              gap: 2,
              pt: 1,
            }}
          >
            <TextField
              select
              label="Tipo"
              value={
                formEdicion.tipo
              }
              disabled={
                guardandoEdicion
              }
              onChange={(event) =>
                cambiarTipoEdicion(
                  event.target
                    .value as TipoMovimientoCaja
                )
              }
            >
              {TIPOS.map((tipo) => (
                <MenuItem
                  key={tipo.valor}
                  value={tipo.valor}
                >
                  {tipo.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Categoría"
              value={
                formEdicion.categoria
              }
              disabled={
                guardandoEdicion
              }
              onChange={(event) =>
                setFormEdicion(
                  (formActual) => ({
                    ...formActual,

                    categoria:
                      event.target
                        .value as CategoriaMovimientoCaja,
                  })
                )
              }
            >
              {categoriasEdicion.map(
                (categoria) => (
                  <MenuItem
                    key={categoria}
                    value={categoria}
                  >
                    {
                      NOMBRES_CATEGORIA[
                        categoria
                      ]
                    }
                  </MenuItem>
                )
              )}
            </TextField>

            <TextField
              select
              label="Medio de pago"
              value={
                formEdicion.medioPago
              }
              disabled={
                guardandoEdicion
              }
              onChange={(event) =>
                setFormEdicion(
                  (formActual) => ({
                    ...formActual,

                    medioPago:
                      event.target
                        .value as MedioPagoMovimientoCaja,
                  })
                )
              }
            >
              {MEDIOS_PAGO.map(
                (medio) => (
                  <MenuItem
                    key={medio.valor}
                    value={medio.valor}
                  >
                    {medio.nombre}
                  </MenuItem>
                )
              )}
            </TextField>

            <TextField
              label="Monto"
              type="number"
              value={
                formEdicion.monto
              }
              disabled={
                guardandoEdicion
              }
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: 0.01,
                },
              }}
              onChange={(event) =>
                setFormEdicion(
                  (formActual) => ({
                    ...formActual,

                    monto:
                      event.target
                        .value,
                  })
                )
              }
            />

            <TextField
              label="Descripción"
              value={
                formEdicion.descripcion
              }
              disabled={
                guardandoEdicion
              }
              multiline
              minRows={2}
              onChange={(event) =>
                setFormEdicion(
                  (formActual) => ({
                    ...formActual,

                    descripcion:
                      event.target
                        .value,
                  })
                )
              }
              sx={{
                gridColumn: {
                  xs: "auto",
                  sm: "span 2",
                },
              }}
            />

            <TextField
              required
              label="Motivo de modificación"
              value={
                formEdicion
                  .motivoModificacion
              }
              disabled={
                guardandoEdicion
              }
              multiline
              minRows={2}
              placeholder="Ej: se ingresó un cero de más"
              helperText="Este dato quedará guardado en el historial."
              onChange={(event) => {
                setFormEdicion(
                  (formActual) => ({
                    ...formActual,

                    motivoModificacion:
                      event.target
                        .value,
                  })
                );

                if (errorEdicion) {
                  setErrorEdicion("");
                }
              }}
              sx={{
                gridColumn: {
                  xs: "auto",
                  sm: "span 2",
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={
              cerrarEdicion
            }
            disabled={
              guardandoEdicion
            }
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={
              confirmarEdicion
            }
            disabled={
              guardandoEdicion ||
              !formEdicion.monto ||
              !formEdicion
                .motivoModificacion
                .trim()
            }
          >
            {guardandoEdicion
              ? "Guardando..."
              : "Guardar cambios"}
          </Button>
        </DialogActions>
      </Dialog>

      <HistorialMovimientoCajaDialog
        open={
          movimientoHistorial !== null
        }
        movimiento={
          movimientoHistorial
        }
        onClose={() =>
          setMovimientoHistorial(null)
        }
        money={money}
        fechaHora={fechaHora}
      />
    </>
  );
}

function obtenerCategoriasPorTipo(
  tipo: TipoMovimientoCaja
): CategoriaMovimientoCaja[] {
  if (tipo === "INGRESO") {
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
}

interface TarjetaMetricaProps {
  titulo: string;
  valor: string;
}

function TarjetaMetrica({
  titulo,
  valor,
}: TarjetaMetricaProps) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        {titulo}
      </Typography>

      <Typography
        variant="h5"
        sx={{ fontWeight: 800 }}
      >
        {valor}
      </Typography>
    </Paper>
  );
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