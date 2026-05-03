"use client";

import { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import useVentas from "./useVentas";
import Header from "../../../components/Header";
import { useRouter } from "next/navigation"
import { cerrarTurno } from "../../../helpers/httpHelper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function Ventas() {
  const { turno, resumen, ventas, loading, cargarVentas } = useVentas();
  const [ventaAbiertaId, setVentaAbiertaId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  

  const confirmarCierre = async () => {
  if (!turno?.id) return;

  await cerrarTurno(turno.id);
  localStorage.removeItem("usuario");
  router.push("/login");
};

  const router = useRouter();

  const finalizarTurno = async () => {
    if (!turno?.id) return;

    const confirma = confirm("¿Seguro que querés cerrar el turno?");
    if (!confirma) return;

    await cerrarTurno(turno.id);
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  const money = (value?: number) =>
    `$${Number(value || 0).toLocaleString("es-AR")}`;

  return (
    <>
      <Header title="Ventas" />

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>

          {/* IZQUIERDA */}
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Ventas del turno
          </Typography>

          {/* DERECHA */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="error"
              variant="outlined"
              onClick={() => setOpenModal(true)}
            >
              Cerrar turno
            </Button>

            <Button variant="contained" onClick={cargarVentas} disabled={loading}>
              Actualizar
            </Button>
          </Box>

        </Box>
        {turno && (
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Turno abierto
            </Typography>

            <Typography>
              Inicio: {new Date(turno.fechaApertura).toLocaleString("es-AR")}
            </Typography>

            <Typography>Estado: {turno.estado}</Typography>
          </Paper>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 2,
            mb: 3,
          }}
        >
          <ResumenCard title="Total recaudado" value={money(resumen?.totalRecaudado)} />
          <ResumenCard title="Cantidad de ventas" value={resumen?.cantidadVentas || 0} />
          <ResumenCard title="Ticket promedio" value={money(resumen?.ticketPromedio)} />
        </Box>

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Detalle de ventas
          </Typography>

          {loading ? (
            <Typography>Cargando ventas...</Typography>
          ) : ventas.length === 0 ? (
            <Typography color="text.secondary">
              No hay ventas en este turno.
            </Typography>
          ) : (
            ventas.map((venta) => {
              const abierta = ventaAbiertaId === venta.id;

              return (
                <Paper
                  key={venta.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto auto auto",
                      gap: 2,
                      alignItems: "center",
                      pb: abierta ? 1.5 : 0,
                      borderBottom: abierta ? "1px solid #e5e7eb" : "none",
                    }}
                  >
                    <Typography sx={{ fontWeight: 800 }}>
                      Venta #{venta.id}
                    </Typography>

                    <Typography color="text.secondary">
                      {new Date(venta.fecha).toLocaleTimeString("es-AR")}
                    </Typography>

                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 999,
                        backgroundColor: "#f3f4f6",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {venta.medioPago}
                    </Box>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        setVentaAbiertaId(abierta ? null : venta.id)
                      }
                    >
                      {abierta ? "Ocultar" : "Detalle"}
                    </Button>

                    <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                      {money(venta.total)}
                    </Typography>
                  </Box>

                  {abierta && (
                    <Box sx={{ mt: 1 }}>
                      {venta.items?.map((item) => (
                        <Box
                          key={`${venta.id}-${item.productoId}`}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 80px 120px 120px",
                            gap: 2,
                            py: 1,
                            borderBottom: "1px solid #f3f4f6",
                            "&:last-child": {
                              borderBottom: "none",
                            },
                          }}
                        >
                          <Typography>{item.nombreProducto}</Typography>

                          <Typography sx={{ textAlign: "center" }}>
                            x{item.cantidad}
                          </Typography>

                          <Typography sx={{ textAlign: "right" }}>
                            {money(item.precioUnitario)}
                          </Typography>

                          <Typography sx={{ textAlign: "right", fontWeight: 600 }}>
                            {money(item.subtotal)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              );
            })
          )}
        </Paper>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
      <DialogTitle>Cierre de turno</DialogTitle>

      <DialogContent>
        <Typography>Total: {money(resumen?.totalRecaudado)}</Typography>
        <Typography>Ventas: {resumen?.cantidadVentas}</Typography>

        <Typography>Efectivo: {money(resumen?.totalEfectivo)}</Typography>
        <Typography>Débito: {money(resumen?.totalDebito)}</Typography>
        <Typography>Crédito: {money(resumen?.totalCredito)}</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenModal(false)}>
          Cancelar
        </Button>

        <Button color="error" variant="contained" onClick={confirmarCierre}>
          Confirmar cierre
        </Button>
      </DialogActions>
    </Dialog>
  </>
  );
  
}

function ResumenCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography color="text.secondary">{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
        {value}
      </Typography>
    </Paper>
  );



}
