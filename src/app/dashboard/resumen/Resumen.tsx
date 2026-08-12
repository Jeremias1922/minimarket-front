"use client";

import {
    useState,
} from "react";

import {
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

import useResumen from "./useResumen";

import HistorialMovimientoCajaDialog from "../../movimientos-caja/HistorialMovimientoCajaDialog";

import type {
    CategoriaMovimientoCaja,
    IMovimientoCaja,
} from "../../movimientos-caja/movimientosCaja.interface";

const MESES = [
    {
        valor: 1,
        nombre: "Enero",
    },
    {
        valor: 2,
        nombre: "Febrero",
    },
    {
        valor: 3,
        nombre: "Marzo",
    },
    {
        valor: 4,
        nombre: "Abril",
    },
    {
        valor: 5,
        nombre: "Mayo",
    },
    {
        valor: 6,
        nombre: "Junio",
    },
    {
        valor: 7,
        nombre: "Julio",
    },
    {
        valor: 8,
        nombre: "Agosto",
    },
    {
        valor: 9,
        nombre: "Septiembre",
    },
    {
        valor: 10,
        nombre: "Octubre",
    },
    {
        valor: 11,
        nombre: "Noviembre",
    },
    {
        valor: 12,
        nombre: "Diciembre",
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

export default function Resumen() {
    const {
        resumenMensual,
        movimientosModificados,

        anioSeleccionado,
        setAnioSeleccionado,

        mesSeleccionado,
        setMesSeleccionado,

        loading,
        error,
        errorMovimientos,

        cargarResumen,
    } = useResumen();

    const [
        movimientoHistorial,
        setMovimientoHistorial,
    ] =
        useState<IMovimientoCaja | null>(
            null
        );

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
    ) =>
        `$${Number(value ?? 0).toLocaleString(
            "es-AR",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }
        )}`;

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

    const fechaHora = (
        value?: string | null
    ) => {
        if (!value) {
            return "-";
        }

        return new Date(value).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
        });
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
                            sx={{
                                fontWeight: 800,
                            }}
                        >
                            Resumen del minimarket
                        </Typography>

                        <Typography color="text.secondary">
                            Métricas económicas
                            mensuales del negocio
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.5,
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            select
                            size="small"
                            label="Mes"
                            value={mesSeleccionado}
                            sx={{
                                minWidth: 150,
                            }}
                            disabled={loading}
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
                            sx={{
                                minWidth: 110,
                            }}
                            disabled={loading}
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
                            onClick={
                                cargarResumen
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Actualizando..."
                                : "Actualizar"}
                        </Button>
                    </Box>
                </Box>

                {errorMovimientos && (
                    <Paper
                        sx={{
                            p: 2,
                            mb: 3,

                            borderRadius: 3,

                            border: "1px solid",

                            borderColor:
                                "warning.light",

                            backgroundColor:
                                "rgba(237, 108, 2, 0.06)",
                        }}
                    >
                        <Typography
                            color="warning.dark"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {errorMovimientos}
                        </Typography>
                    </Paper>
                )}

                {movimientosModificados.length >
                    0 && (
                        <Paper
                            sx={{
                                p: 3,
                                mb: 3,

                                borderRadius: 3,

                                border: "1px solid",

                                borderColor:
                                    "warning.light",

                                backgroundColor:
                                    "rgba(237, 108, 2, 0.04)",
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
                                        Movimientos modificados
                                        recientemente
                                    </Typography>

                                    <Typography color="text.secondary">
                                        Cambios realizados sobre
                                        ingresos o egresos de caja
                                    </Typography>
                                </Box>

                                <Chip
                                    color="warning"
                                    label={`${movimientosModificados.length} ${movimientosModificados.length ===
                                            1
                                            ? "modificación"
                                            : "modificaciones"
                                        }`}
                                    sx={{
                                        fontWeight: 800,
                                    }}
                                />
                            </Box>

                            {movimientosModificados.map(
                                (
                                    movimiento,
                                    index
                                ) => (
                                    <Box
                                        key={
                                            movimiento.id
                                        }
                                    >
                                        <Box
                                            sx={{
                                                display: "grid",

                                                gridTemplateColumns:
                                                {
                                                    xs: "1fr",

                                                    md: "minmax(260px, 1fr) 150px 220px 130px",
                                                },

                                                gap: 2,

                                                alignItems:
                                                    "center",

                                                py: 2,
                                            }}
                                        >
                                            <Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",

                                                        alignItems:
                                                            "center",

                                                        gap: 1,

                                                        flexWrap:
                                                            "wrap",

                                                        mb: 0.5,
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 800,
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

                                                    <Chip
                                                        size="small"
                                                        label="EDITADO"
                                                        color="warning"
                                                        variant="outlined"
                                                    />
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Turno #
                                                    {
                                                        movimiento.turnoId
                                                    }{" "}
                                                    ·{" "}
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
                                                    {
                                                        movimiento.medioPago
                                                    }{" "}
                                                    ·{" "}
                                                    {fechaHora(
                                                        movimiento.fechaUltimaModificacion
                                                    )}
                                                </Typography>
                                            </Box>

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

                                            <Box>
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
                                                    sx={{
                                                        mt: 0.5,

                                                        overflowWrap:
                                                            "anywhere",
                                                    }}
                                                >
                                                    Motivo:{" "}
                                                    {movimiento
                                                        .motivoUltimaModificacion ??
                                                        "-"}
                                                </Typography>
                                            </Box>

                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() =>
                                                    setMovimientoHistorial(
                                                        movimiento
                                                    )
                                                }
                                            >
                                                Ver historial
                                            </Button>
                                        </Box>

                                        {index <
                                            movimientosModificados.length -
                                            1 && (
                                                <Divider />
                                            )}
                                    </Box>
                                )
                            )}
                        </Paper>
                    )}

                {loading &&
                    !resumenMensual ? (
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
                ) : error ? (
                    <Paper
                        sx={{
                            p: 3,

                            borderRadius: 3,

                            border: "1px solid",

                            borderColor:
                                "error.light",
                        }}
                    >
                        <Typography
                            color="error"
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {error}
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                }}
                            >
                                Resultado mensual
                            </Typography>

                            <Typography color="text.secondary">
                                {nombreMes} de{" "}
                                {anioSeleccionado}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "grid",

                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    lg: "repeat(3, 1fr)",
                                },

                                gap: 2,
                                mb: 3,
                            }}
                        >
                            <TarjetaMetrica
                                titulo="Recaudación mensual"
                                valor={money(
                                    resumenMensual?.total
                                )}
                                descripcion="Total vendido en el período"
                            />

                            <TarjetaMetrica
                                titulo="Costo de mercadería"
                                valor={money(
                                    resumenMensual
                                        ?.costoMercaderia
                                )}
                                descripcion="Costo histórico de lo vendido"
                            />

                            <TarjetaMetrica
                                titulo="Ganancia bruta"
                                valor={money(
                                    resumenMensual
                                        ?.gananciaBruta
                                )}
                                descripcion="Antes de gastos mensuales"
                            />

                            <TarjetaMetrica
                                titulo="Margen bruto"
                                valor={porcentaje(
                                    resumenMensual
                                        ?.margenPorcentaje
                                )}
                                descripcion="Ganancia sobre la recaudación"
                            />

                            <TarjetaMetrica
                                titulo="Cantidad de ventas"
                                valor={String(
                                    resumenMensual
                                        ?.cantidadVentas ??
                                    0
                                )}
                                descripcion="Operaciones del período"
                            />

                            <TarjetaMetrica
                                titulo="Ticket promedio"
                                valor={money(
                                    resumenMensual
                                        ?.ticketPromedio
                                )}
                                descripcion="Promedio por operación"
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
                                    fontWeight: 800,
                                    mb: 2,
                                }}
                            >
                                Recaudación mensual por
                                medio de pago
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
                                        resumenMensual
                                            ?.totalEfectivo
                                    )}
                                    total={
                                        resumenMensual?.total ??
                                        0
                                    }
                                    monto={
                                        resumenMensual
                                            ?.totalEfectivo ?? 0
                                    }
                                />

                                <TarjetaPago
                                    titulo="Débito"
                                    valor={money(
                                        resumenMensual
                                            ?.totalDebito
                                    )}
                                    total={
                                        resumenMensual?.total ??
                                        0
                                    }
                                    monto={
                                        resumenMensual
                                            ?.totalDebito ?? 0
                                    }
                                />

                                <TarjetaPago
                                    titulo="Crédito"
                                    valor={money(
                                        resumenMensual
                                            ?.totalCredito
                                    )}
                                    total={
                                        resumenMensual?.total ??
                                        0
                                    }
                                    monto={
                                        resumenMensual
                                            ?.totalCredito ?? 0
                                    }
                                />
                            </Box>
                        </Paper>
                    </>
                )}
            </Box>

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

interface TarjetaMetricaProps {
    titulo: string;
    valor: string;
    descripcion?: string;
}

function TarjetaMetrica({
    titulo,
    valor,
    descripcion,
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
                sx={{
                    fontWeight: 800,
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

                border:
                    "1px solid #e5e7eb",

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