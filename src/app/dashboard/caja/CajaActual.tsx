"use client";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import useCajaActual from "./useCajaActual";
import DetalleArqueoCaja from "@/app/turnos/DetalleArqueoCaja";


export default function CajaActual() {
  const {
    turnoActivo,
    ultimasVentas,
    loading,
    error,
    cargarCaja,
  } = useCajaActual();

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

  const calcularTiempoAbierto = (
    fechaApertura: string
  ) => {
    const apertura = new Date(
      fechaApertura
    ).getTime();

    const diferencia = Math.max(
      0,
      Date.now() - apertura
    );

    const minutosTotales = Math.floor(
      diferencia / 60000
    );

    const dias = Math.floor(
      minutosTotales / 1440
    );

    const horas = Math.floor(
      (minutosTotales % 1440) / 60
    );

    const minutos =
      minutosTotales % 60;

    if (dias > 0) {
      return `${dias} d ${horas} h ${minutos} min`;
    }

    if (horas > 0) {
      return `${horas} h ${minutos} min`;
    }

    return `${minutos} min`;
  };

  return (
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
            Caja actual
          </Typography>

          <Typography color="text.secondary">
            Estado del turno, movimientos y
            actividad actual del minimarket
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={cargarCaja}
          disabled={loading}
        >
          {loading
            ? "Actualizando..."
            : "Actualizar"}
        </Button>
      </Box>

      {loading && !turnoActivo ? (
        <Paper
          sx={{
            p: 5,
            borderRadius: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Paper>
      ) : error ? (
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "error.light",
          }}
        >
          <Typography
            color="error"
            sx={{ fontWeight: 700 }}
          >
            {error}
          </Typography>
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
            color="default"
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
            La información aparecerá cuando
            un cajero o encargado inicie su
            turno.
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
              borderColor: "success.light",
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 800 }}
                  >
                    Turno #
                    {turnoActivo.turnoId}
                  </Typography>

                  <Chip
                    label="CAJA ABIERTA"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 800 }}
                  />
                </Box>

                <Typography>
                  Responsable:{" "}
                  <strong>
                    {
                      turnoActivo.usuarioNombre
                    }
                  </strong>
                </Typography>

                <Typography color="text.secondary">
                  Apertura:{" "}
                  {fechaHora(
                    turnoActivo.fechaApertura
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign: {
                    xs: "left",
                    md: "right",
                  },
                }}
              >
                <Typography color="text.secondary">
                  Tiempo abierto
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800 }}
                >
                  {calcularTiempoAbierto(
                    turnoActivo.fechaApertura
                  )}
                </Typography>
              </Box>
            </Box>
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
              titulo="Recaudación del turno"
              valor={money(
                turnoActivo.totalRecaudado
              )}
              descripcion="Total vendido en el turno"
            />

            <TarjetaMetrica
              titulo="Cantidad de ventas"
              valor={String(
                turnoActivo.cantidadVentas ??
                  0
              )}
              descripcion="Operaciones realizadas"
            />

            <TarjetaMetrica
              titulo="Ticket promedio"
              valor={money(
                turnoActivo.ticketPromedio
              )}
              descripcion="Promedio por operación"
            />

            <TarjetaMetrica
              titulo="Efectivo esperado"
              valor={money(
                turnoActivo.efectivoEsperado
              )}
              descripcion="Disponible para el arqueo"
              destacado
            />
          </Box>

          <DetalleArqueoCaja
            turno={turnoActivo}
          />

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
                mb: 2,
              }}
            >
              Recaudación del turno por medio
              de pago
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              <TarjetaPago
                titulo="Efectivo"
                valor={money(
                  turnoActivo.totalEfectivo
                )}
                total={
                  turnoActivo.totalRecaudado
                }
                monto={
                  turnoActivo.totalEfectivo
                }
              />

              <TarjetaPago
                titulo="Débito"
                valor={money(
                  turnoActivo.totalDebito
                )}
                total={
                  turnoActivo.totalRecaudado
                }
                monto={
                  turnoActivo.totalDebito
                }
              />

              <TarjetaPago
                titulo="Crédito"
                valor={money(
                  turnoActivo.totalCredito
                )}
                total={
                  turnoActivo.totalRecaudado
                }
                monto={
                  turnoActivo.totalCredito
                }
              />
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
                sx={{ fontWeight: 800 }}
              >
                Últimas ventas del turno
              </Typography>

              <Typography color="text.secondary">
                Últimas{" "}
                {ultimasVentas.length}
              </Typography>
            </Box>

            {ultimasVentas.length === 0 ? (
              <Typography color="text.secondary">
                El turno todavía no tiene
                ventas.
              </Typography>
            ) : (
              ultimasVentas.map(
                (venta, index) => (
                  <Box key={venta.id}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr auto",
                          md: "1fr 180px 160px 160px",
                        },
                        gap: 2,
                        alignItems: "center",
                        py: 2,
                      }}
                    >
                      <Box>
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
                              xs: "block",
                              md: "none",
                            },
                          }}
                        >
                          {fechaHora(
                            venta.fecha
                          )}
                        </Typography>
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
                          venta.fecha
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
                        {venta.medioPago}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 800,
                          textAlign: "right",
                        }}
                      >
                        {money(venta.total)}
                      </Typography>
                    </Box>

                    {index <
                      ultimasVentas.length -
                        1 && <Divider />}
                  </Box>
                )
              )
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}

interface TarjetaMetricaProps {
  titulo: string;
  valor: string;
  descripcion?: string;
  destacado?: boolean;
}

function TarjetaMetrica({
  titulo,
  valor,
  descripcion,
  destacado = false,
}: TarjetaMetricaProps) {
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
      <Typography
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        {titulo}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          color: destacado
            ? "#ea580c"
            : "text.primary",
          overflowWrap: "anywhere",
        }}
      >
        {valor}
      </Typography>

      {descripcion && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {descripcion}
        </Typography>
      )}
    </Paper>
  );
}

interface TarjetaPagoProps {
  titulo: string;
  valor: string;
  monto?: number;
  total?: number;
}

function TarjetaPago({
  titulo,
  valor,
  monto = 0,
  total = 0,
}: TarjetaPagoProps) {
  const porcentaje =
    total > 0
      ? Math.round(
          (monto / total) * 100
        )
      : 0;

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #e5e7eb",
        borderRadius: 2,
      }}
    >
      <Typography color="text.secondary">
        {titulo}
      </Typography>

      <Typography
        variant="h6"
        sx={{ fontWeight: 800 }}
      >
        {valor}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        {porcentaje}% del total
      </Typography>
    </Box>
  );
}