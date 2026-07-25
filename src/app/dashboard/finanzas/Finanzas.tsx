"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import useFinanzas from "./useFinanzas";

const MESES = [
  { valor: 1, nombre: "Enero" },
  { valor: 2, nombre: "Febrero" },
  { valor: 3, nombre: "Marzo" },
  { valor: 4, nombre: "Abril" },
  { valor: 5, nombre: "Mayo" },
  { valor: 6, nombre: "Junio" },
  { valor: 7, nombre: "Julio" },
  { valor: 8, nombre: "Agosto" },
  { valor: 9, nombre: "Septiembre" },
  { valor: 10, nombre: "Octubre" },
  { valor: 11, nombre: "Noviembre" },
  { valor: 12, nombre: "Diciembre" },
];

export default function Finanzas() {
  const {
    resumenFinanzas,

    anioSeleccionado,
    setAnioSeleccionado,

    mesSeleccionado,
    setMesSeleccionado,

    loading,
    error,

    cargarFinanzas,
  } = useFinanzas();

  const anioActual =
    new Date().getFullYear();

  const aniosDisponibles =
    Array.from(
      {
        length: 7,
      },
      (_, index) =>
        anioActual - index
    );

  const nombreMes =
    MESES.find(
      (mes) =>
        mes.valor ===
        mesSeleccionado
    )?.nombre ?? "";

  const money = (
    value?: number | null
  ) => {
    const numero =
      Number(value ?? 0);

    const valorFormateado =
      Math.abs(numero).toLocaleString(
        "es-AR",
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }
      );

    return numero < 0
      ? `-$${valorFormateado}`
      : `$${valorFormateado}`;
  };

  const porcentaje = (
    value?: number | null
  ) =>
    `${Number(value ?? 0).toLocaleString(
      "es-AR",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}%`;

  const totalGastosResultado =
    Number(
      resumenFinanzas
        ?.gastosOperativos ?? 0
    ) +
    Number(
      resumenFinanzas?.sueldos ?? 0
    );

  const ajustesNetos =
    Number(
      resumenFinanzas
        ?.ajustesIngresos ?? 0
    ) -
    Number(
      resumenFinanzas
        ?.ajustesEgresos ?? 0
    );

  const otrosNetos =
    Number(
      resumenFinanzas
        ?.otrosIngresos ?? 0
    ) -
    Number(
      resumenFinanzas
        ?.otrosEgresos ?? 0
    );

  const hayGanancia =
    Number(
      resumenFinanzas
        ?.gananciaNeta ?? 0
    ) >= 0;

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
            sx={{
              fontWeight: 800,
            }}
          >
            Finanzas
          </Typography>

          <Typography color="text.secondary">
            Ganancia neta, gastos y
            movimientos financieros del
            negocio
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <TextField
            select
            size="small"
            label="Mes"
            value={mesSeleccionado}
            disabled={loading}
            sx={{
              minWidth: 150,
            }}
            onChange={(event) =>
              setMesSeleccionado(
                Number(
                  event.target.value
                )
              )
            }
          >
            {MESES.map((mes) => (
              <MenuItem
                key={mes.valor}
                value={mes.valor}
              >
                {mes.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Año"
            value={anioSeleccionado}
            disabled={loading}
            sx={{
              minWidth: 110,
            }}
            onChange={(event) =>
              setAnioSeleccionado(
                Number(
                  event.target.value
                )
              )
            }
          >
            {aniosDisponibles.map(
              (anio) => (
                <MenuItem
                  key={anio}
                  value={anio}
                >
                  {anio}
                </MenuItem>
              )
            )}
          </TextField>

          <Button
            variant="contained"
            disabled={loading}
            onClick={
              cargarFinanzas
            }
          >
            {loading
              ? "Actualizando..."
              : "Actualizar"}
          </Button>
        </Box>
      </Box>

      {loading &&
      !resumenFinanzas ? (
        <Paper
          sx={{
            p: 6,
            borderRadius: 3,

            display: "flex",
            justifyContent:
              "center",
          }}
        >
          <CircularProgress />
        </Paper>
      ) : error ? (
        <Alert severity="error">
          {error}
        </Alert>
      ) : resumenFinanzas ? (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
              }}
            >
              Resultado económico
            </Typography>

            <Typography color="text.secondary">
              {nombreMes} de{" "}
              {anioSeleccionado}
            </Typography>
          </Box>

          <Alert
            severity={
              hayGanancia
                ? "success"
                : "error"
            }
            sx={{
              mb: 3,
              borderRadius: 3,
            }}
          >
            {hayGanancia ? (
              <>
                El negocio obtuvo una
                ganancia neta de{" "}
                <strong>
                  {money(
                    resumenFinanzas
                      .gananciaNeta
                  )}
                </strong>{" "}
                durante el período.
              </>
            ) : (
              <>
                El negocio registró una
                pérdida neta de{" "}
                <strong>
                  {money(
                    Math.abs(
                      resumenFinanzas
                        .gananciaNeta
                    )
                  )}
                </strong>{" "}
                durante el período.
              </>
            )}
          </Alert>

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
              titulo="Recaudación"
              valor={money(
                resumenFinanzas
                  .recaudacion
              )}
              descripcion="Total vendido durante el período"
            />

            <TarjetaMetrica
              titulo="Costo de mercadería"
              valor={money(
                resumenFinanzas
                  .costoMercaderia
              )}
              descripcion="Costo histórico de los productos vendidos"
            />

            <TarjetaMetrica
              titulo="Ganancia bruta"
              valor={money(
                resumenFinanzas
                  .gananciaBruta
              )}
              descripcion="Recaudación menos costo de mercadería"
              color="success.main"
            />

            <TarjetaMetrica
              titulo="Gastos operativos"
              valor={money(
                resumenFinanzas
                  .gastosOperativos
              )}
              descripcion="Alquiler, servicios y otros gastos"
              color="error.main"
            />

            <TarjetaMetrica
              titulo="Sueldos"
              valor={money(
                resumenFinanzas
                  .sueldos
              )}
              descripcion="Pagos registrados con categoría Sueldo"
              color="error.main"
            />

            <TarjetaMetrica
              titulo="Gastos que afectan el resultado"
              valor={money(
                totalGastosResultado
              )}
              descripcion="Gastos operativos más sueldos"
              color="error.main"
            />

            <TarjetaMetrica
              titulo="Ganancia neta"
              valor={money(
                resumenFinanzas
                  .gananciaNeta
              )}
              descripcion="Ganancia bruta menos gastos y sueldos"
              color={
                hayGanancia
                  ? "success.main"
                  : "error.main"
              }
              destacado
            />

            <TarjetaMetrica
              titulo="Margen neto"
              valor={porcentaje(
                resumenFinanzas
                  .margenNetoPorcentaje
              )}
              descripcion="Ganancia neta sobre la recaudación"
              color={
                hayGanancia
                  ? "success.main"
                  : "error.main"
              }
              destacado
            />
          </Box>

          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
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

                gap: 1,
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                  }}
                >
                  Destino de los egresos
                </Typography>

                <Typography color="text.secondary">
                  En qué se utilizó el
                  dinero durante el período
                </Typography>
              </Box>

              <Chip
                label={`Total: ${money(
                  resumenFinanzas
                    .totalEgresosMovimientos
                )}`}
                color="error"
                variant="outlined"
                sx={{
                  fontWeight: 800,
                }}
              />
            </Box>

            <LineaFinanciera
              titulo="Pagos a proveedores"
              descripcion="Compra y reposición de mercadería"
              valor={
                resumenFinanzas
                  .pagosProveedores
              }
              money={money}
            />

            <Divider />

            <LineaFinanciera
              titulo="Gastos operativos"
              descripcion="Alquiler, servicios y funcionamiento"
              valor={
                resumenFinanzas
                  .gastosOperativos
              }
              money={money}
            />

            <Divider />

            <LineaFinanciera
              titulo="Sueldos"
              descripcion="Pagos realizados al personal"
              valor={
                resumenFinanzas
                  .sueldos
              }
              money={money}
            />

            <Divider />

            <LineaFinanciera
              titulo="Retiros del dueño"
              descripcion="Dinero retirado para uso personal"
              valor={
                resumenFinanzas
                  .retirosDueno
              }
              money={money}
            />

            <Divider />

            <LineaFinanciera
              titulo="Ajustes de egreso"
              descripcion="Correcciones financieras registradas"
              valor={
                resumenFinanzas
                  .ajustesEgresos
              }
              money={money}
            />

            <Divider />

            <LineaFinanciera
              titulo="Otros egresos"
              descripcion="Movimientos de egreso sin categoría específica"
              valor={
                resumenFinanzas
                  .otrosEgresos
              }
              money={money}
            />
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 0.5,
              }}
            >
              Flujo de movimientos
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Este cálculo contempla
              únicamente movimientos
              registrados manualmente. Las
              ventas se muestran en el
              resultado económico.
            </Typography>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                },

                gap: 2,
              }}
            >
              <TarjetaMetrica
                titulo="Ingresos registrados"
                valor={money(
                  resumenFinanzas
                    .totalIngresosMovimientos
                )}
                descripcion="Aportes, ajustes y otros ingresos"
                color="success.main"
              />

              <TarjetaMetrica
                titulo="Egresos registrados"
                valor={money(
                  resumenFinanzas
                    .totalEgresosMovimientos
                )}
                descripcion="Todos los egresos manuales"
                color="error.main"
              />

              <TarjetaMetrica
                titulo="Aportes"
                valor={money(
                  resumenFinanzas.aportes
                )}
                descripcion="Dinero agregado al negocio"
                color="success.main"
              />

              <TarjetaMetrica
                titulo="Ajustes netos"
                valor={money(
                  ajustesNetos
                )}
                descripcion="Ajustes de ingreso menos ajustes de egreso"
                color={
                  ajustesNetos >= 0
                    ? "success.main"
                    : "error.main"
                }
              />

              <TarjetaMetrica
                titulo="Otros movimientos netos"
                valor={money(
                  otrosNetos
                )}
                descripcion="Otros ingresos menos otros egresos"
                color={
                  otrosNetos >= 0
                    ? "success.main"
                    : "error.main"
                }
              />

              <TarjetaMetrica
                titulo="Saldo de movimientos"
                valor={money(
                  resumenFinanzas
                    .saldoMovimientos
                )}
                descripcion="Ingresos manuales menos egresos manuales"
                color={
                  resumenFinanzas
                    .saldoMovimientos >= 0
                    ? "success.main"
                    : "error.main"
                }
                destacado
              />
            </Box>
          </Paper>
        </>
      ) : null}
    </Box>
  );
}

interface TarjetaMetricaProps {
  titulo: string;
  valor: string;
  descripcion: string;
  color?: string;
  destacado?: boolean;
}

function TarjetaMetrica({
  titulo,
  valor,
  descripcion,
  color = "text.primary",
  destacado = false,
}: TarjetaMetricaProps) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,

        border: destacado
          ? "2px solid"
          : "1px solid",

        borderColor: destacado
          ? color
          : "divider",
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
          color,
          overflowWrap: "anywhere",
        }}
      >
        {valor}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1 }}
      >
        {descripcion}
      </Typography>
    </Paper>
  );
}

interface LineaFinancieraProps {
  titulo: string;
  descripcion: string;
  valor: number;
  money: (
    value?: number | null
  ) => string;
}

function LineaFinanciera({
  titulo,
  descripcion,
  valor,
  money,
}: LineaFinancieraProps) {
  return (
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

        gap: 1,
        py: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontWeight: 700,
          }}
        >
          {titulo}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {descripcion}
        </Typography>
      </Box>

      <Typography
        variant="h6"
        color="error.main"
        sx={{
          fontWeight: 800,
        }}
      >
        -{money(valor)}
      </Typography>
    </Box>
  );
}