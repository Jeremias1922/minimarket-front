"use client";

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import useTurnos from "./useTurnos";
import Header from "../../../components/Header";

export default function Turnos() {
    const {
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
    } = useTurnos();

    const money = (value?: number) =>
        `$${Number(value || 0).toLocaleString("es-AR")}`;

    return (
        <>
            <Header title="Turnos" />

            <Box sx={{ p: 3 }}>
                {/* Título */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 3,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{ fontWeight: 700 }}
                    >
                        Historial de turnos
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={cargarTurnos}
                        disabled={loading}
                    >
                        Actualizar
                    </Button>
                </Box>

                {/* Filtros */}
                <Paper
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ mb: 2 }}
                    >
                        Filtros
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <TextField
                            label="Desde"
                            type="date"
                            value={fechaDesde}
                            onChange={(e) =>
                                setFechaDesde(e.target.value)
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />

                        <TextField
                            label="Hasta"
                            type="date"
                            value={fechaHasta}
                            onChange={(e) =>
                                setFechaHasta(e.target.value)
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />

                        <Button
                            variant="outlined"
                            onClick={() => {
                                setFechaDesde("");
                                setFechaHasta("");
                            }}
                        >
                            Limpiar
                        </Button>
                    </Box>
                </Paper>

                {/* Gráfico */}
                <Paper
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ mb: 2 }}
                    >
                        Recaudación por turno
                    </Typography>

                    <Box
                        sx={{
                            width: "100%",
                            height: 280,
                        }}
                    >
                        <ResponsiveContainer>
                            <BarChart data={datosGrafico}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="name" />

                                <YAxis />

                                <Tooltip
                                    formatter={(value) =>
                                        money(Number(value))
                                    }
                                />

                                <Bar dataKey="total" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>

                {/* Turnos */}
                {loading ? (
                    <Typography>
                        Cargando...
                    </Typography>
                ) : turnosFiltrados.length === 0 ? (
                    <Typography>
                        No hay turnos para mostrar.
                    </Typography>
                ) : (
                    turnosFiltrados.map((turno) => {
                        const abierto =
                            turnoAbiertoId === turno.turnoId;

                        const ventas =
                            ventasPorTurno[turno.turnoId] || [];

                        return (
                            <Paper
                                key={turno.turnoId}
                                sx={{
                                    p: 3,
                                    mb: 2,
                                    borderRadius: 3,
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                {/* Resumen del turno */}
                                <Box
                                    sx={{
                                        display: "grid",

                                        gridTemplateColumns: {
                                            xs: "1fr",

                                            lg:
                                                "minmax(260px, 1fr) repeat(3, 170px) auto auto auto",
                                        },

                                        gap: 2,
                                        alignItems: "center",
                                    }}
                                >
                                    {/* Información del turno */}
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                            }}
                                        >
                                            Turno #{turno.turnoId} -{" "}
                                            {turno.usuarioNombre}
                                        </Typography>

                                        <Typography color="text.secondary">
                                            Apertura:{" "}
                                            {new Date(
                                                turno.fechaApertura
                                            ).toLocaleString(
                                                "es-AR"
                                            )}
                                        </Typography>

                                        <Typography color="text.secondary">
                                            Cierre:{" "}
                                            {turno.fechaCierre
                                                ? new Date(
                                                      turno.fechaCierre
                                                  ).toLocaleString(
                                                      "es-AR"
                                                  )
                                                : "En curso"}
                                        </Typography>
                                    </Box>

                                    {/* EFECTIVO */}
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            textAlign: "center",

                                            width: "100%",
                                            height: 86,

                                            boxSizing: "border-box",

                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Efectivo
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: 18,
                                            }}
                                        >
                                            {money(
                                                turno.totalEfectivo
                                            )}
                                        </Typography>
                                    </Paper>

                                    {/* TRANSFERENCIAS */}
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            textAlign: "center",

                                            width: "100%",
                                            height: 86,

                                            boxSizing: "border-box",

                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Transferencias
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: 18,
                                            }}
                                        >
                                            {money(
                                                turno.totalDebito
                                            )}
                                        </Typography>
                                    </Paper>

                                    {/* CRÉDITO */}
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            textAlign: "center",

                                            width: "100%",
                                            height: 86,

                                            boxSizing: "border-box",

                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Crédito
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: 18,
                                            }}
                                        >
                                            {money(
                                                turno.totalCredito
                                            )}
                                        </Typography>
                                    </Paper>

                                    {/* Cantidad de ventas */}
                                    <Typography
                                        sx={{
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {turno.cantidadVentas} ventas
                                    </Typography>

                                    {/* Total */}
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: 18,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {money(
                                            turno.totalRecaudado
                                        )}
                                    </Typography>

                                    {/* Botón */}
                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            toggleTurno(
                                                turno.turnoId
                                            )
                                        }
                                        sx={{
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {abierto
                                            ? "Ocultar"
                                            : "Ver ventas"}
                                    </Button>
                                </Box>

                                {/* Detalle de ventas */}
                                {abierto && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            pt: 2,
                                            borderTop:
                                                "1px solid #e5e7eb",
                                        }}
                                    >
                                        {ventas.length === 0 ? (
                                            <Typography color="text.secondary">
                                                Este turno no tiene
                                                ventas.
                                            </Typography>
                                        ) : (
                                            ventas.map((venta) => (
                                                <Paper
                                                    key={venta.id}
                                                    variant="outlined"
                                                    sx={{
                                                        p: 2,
                                                        mb: 2,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    {/* Cabecera venta */}
                                                    <Box
                                                        sx={{
                                                            display:
                                                                "grid",

                                                            gridTemplateColumns:
                                                                "1fr auto auto auto",

                                                            gap: 2,
                                                            alignItems:
                                                                "center",

                                                            mb: 1,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            Venta #
                                                            {venta.id}
                                                        </Typography>

                                                        <Typography color="text.secondary">
                                                            {new Date(
                                                                venta.fecha
                                                            ).toLocaleTimeString(
                                                                "es-AR"
                                                            )}
                                                        </Typography>

                                                        <Typography>
                                                            {venta.medioPago ===
                                                            "DEBITO"
                                                                ? "TRANSFERENCIA"
                                                                : venta.medioPago}
                                                        </Typography>

                                                        <Typography
                                                            sx={{
                                                                fontWeight: 800,
                                                            }}
                                                        >
                                                            {money(
                                                                venta.total
                                                            )}
                                                        </Typography>
                                                    </Box>

                                                    {/* Productos de la venta */}
                                                    {venta.items?.map(
                                                        (item) => (
                                                            <Box
                                                                key={`${venta.id}-${item.productoId}`}
                                                                sx={{
                                                                    display:
                                                                        "grid",

                                                                    gridTemplateColumns:
                                                                        "1fr 80px 120px 120px",

                                                                    gap: 2,
                                                                    py: 0.8,

                                                                    borderTop:
                                                                        "1px solid #f3f4f6",
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
                                                                    }}
                                                                >
                                                                    {money(
                                                                        item.subtotal
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        )
                                                    )}
                                                </Paper>
                                            ))
                                        )}
                                    </Box>
                                )}
                            </Paper>
                        );
                    })
                )}
            </Box>
        </>
    );
}