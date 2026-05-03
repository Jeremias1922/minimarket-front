"use client";

import Header from "../../../components/Header";
import { useCaja } from "./useCaja";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUsuario } from "../../../utils/auth";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import useAuth from "../login/useAuth";

export const Caja = () => {
  const {
    codigo,
    setCodigo,
    carrito,
    medioPago,
    setMedioPago,
    busqueda,
    resultados,
    buscarProducto,
    buscarPorNombre,
    agregarDesdeBusqueda,
    cobrar,
    total,
    sumarCantidad,
    restarCantidad,
    eliminarItem,
    limpiarCarrito,
  } = useCaja();

  const { obtenerUsuario } = useAuth();
  const usuario = obtenerUsuario();
  const router = useRouter();

  useEffect(() => {
    const usuario = getUsuario();

    if (!usuario) {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <Header title="Caja" />

      <Box sx={{ display: "flex", height: "calc(100vh - 72px)", backgroundColor: "#f3f4f6" }}>
        <Box sx={{ flex: 2, p: 3 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%", display: "flex", flexDirection: "column" }}>
            <TextField
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscarProducto()}
              placeholder="Escanear código de barras..."
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              value={busqueda}
              onChange={(e) => buscarPorNombre(e.target.value)}
              placeholder="Buscar producto por nombre..."
              fullWidth
              sx={{ mb: resultados.length > 0 ? 1 : 3 }}
            />

            {resultados.length > 0 && (
              <Paper sx={{ mb: 3, maxHeight: 220, overflow: "auto", border: "1px solid #e5e7eb" }}>
                {resultados.map((producto) => (
                  <Box
                    key={producto.id}
                    onClick={() => agregarDesdeBusqueda(producto)}
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      borderBottom: "1px solid #f3f4f6",
                      "&:hover": { backgroundColor: "#fff7ed" },
                    }}
                  >
                    <Typography>{producto.nombre}</Typography>
                    <Typography sx={{ fontWeight: 600 }}>${producto.precio}</Typography>
                  </Box>
                ))}
              </Paper>
            )}

            <Box sx={{ flex: 1, overflow: "auto" }}>
              {carrito.length === 0 && <Typography color="text.secondary">No hay productos</Typography>}

              {carrito.map((item) => (
                <Box
                  key={item.productoId}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr 180px 140px 100px",
                    alignItems: "center",
                    borderBottom: "1px solid #e5e7eb",
                    py: 2,
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{item.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.precio} c/u
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => restarCantidad(item.productoId)} sx={{ minWidth: 48 }}>
                      -
                    </Button>

                    <Typography sx={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>
                      {item.cantidad}
                    </Typography>

                    <Button size="small" variant="outlined" onClick={() => sumarCantidad(item.productoId)} sx={{ minWidth: 48 }}>
                      +
                    </Button>
                  </Box>

                  <Typography sx={{ fontWeight: 600, textAlign: "right" }}>
                    ${item.precio * item.cantidad}
                  </Typography>

                  <Button color="error" onClick={() => eliminarItem(item.productoId)} sx={{ justifySelf: "end" }}>
                    Eliminar
                  </Button>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        <Box
          sx={{
            width: 320,
            backgroundColor: "#fff",
            borderLeft: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 3,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Resumen</Typography>

            {carrito.length === 0 ? (
              <Typography color="text.secondary">Sin productos</Typography>
            ) : (
              carrito.map((item) => (
                <Box key={item.productoId} sx={{ display: "flex", justifyContent: "space-between", mb: 1, gap: 1 }}>
                  <Typography variant="body2">{item.nombre} x{item.cantidad}</Typography>
                  <Typography variant="body2">${item.precio * item.cantidad}</Typography>
                </Box>
              ))
            )}
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>${total}</Typography>

            <Select fullWidth value={medioPago} onChange={(e) => setMedioPago(e.target.value as any)} sx={{ mb: 2 }}>
              <MenuItem value="EFECTIVO">Efectivo</MenuItem>
              <MenuItem value="DEBITO">Débito</MenuItem>
              <MenuItem value="CREDITO">Crédito</MenuItem>
            </Select>

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                if (!usuario?.id) {
                  alert("No hay usuario logueado");
                  return;
                }

                cobrar(usuario.id);
              }}
              sx={{
                backgroundColor: "#16a34a",
                "&:hover": { backgroundColor: "#15803d" },
                py: 1.5,
                fontWeight: 600,
              }}
            >
              COBRAR
            </Button>

            {carrito.length > 0 && (
              <Button fullWidth color="error" sx={{ mt: 1 }} onClick={limpiarCarrito}>
                Limpiar carrito
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};