"use client";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import useProductos from "./useProductos";
import Header from "../../../components/Header";
import useAuth from "@/app/login/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUsuario } from "../../../utils/auth";

export default function Productos() {
  const {
    productos,
    form,
    loading,
    textoBusqueda,
    productoEditandoId,
    setTextoBusqueda,
    onChange,
    guardarProducto,
    editarProducto,
    borrarProducto,
    buscar,
    limpiarForm,
  } = useProductos();

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
      <Header title="Productos" />

      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {productoEditandoId ? "Editar producto" : "Cargar producto"}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(e) => onChange("nombre", e.target.value)}
            />

            <TextField
              label="Categoría"
              value={form.categoria}
              onChange={(e) => onChange("categoria", e.target.value)}
            />

            <TextField
              label="Código de barras"
              value={form.codigoBarras}
              onChange={(e) => onChange("codigoBarras", e.target.value)}
            />

            <TextField
              label="Precio de venta"
              type="number"
              value={form.precio}
              onChange={(e) => onChange("precio", e.target.value)}
            />

            <TextField
              label="Precio de costo"
              type="number"
              value={form.costo}
              onChange={(e) => onChange("costo", e.target.value)}
            />

            {usuario?.rol === "ADMIN" && (
              <TextField
                label="Stock"
                type="number"
                value={form.stock}
                onChange={(e) => onChange("stock", e.target.value)}
              />
            )}

            <Button
              variant="contained"
              onClick={guardarProducto}
              disabled={loading}
            >
              {productoEditandoId ? "Guardar cambios" : "Agregar"}
            </Button>

            {productoEditandoId && (
              <Button variant="outlined" onClick={limpiarForm}>
                Cancelar
              </Button>
            )}
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Buscar productos
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Buscar por nombre, categoría o código"
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              fullWidth
            />

            <Button
              variant="contained"
              onClick={buscar}
              disabled={loading}
            >
              Buscar
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Lista de productos
          </Typography>

          {loading ? (
            <Typography>Cargando...</Typography>
          ) : productos.length === 0 ? (
            <Typography color="text.secondary">
              No hay productos para mostrar.
            </Typography>
          ) : (
            productos.map((producto) => (
              <Box
                key={producto.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1.5fr",
                  gap: 2,
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                  py: 1,
                }}
              >
                <Typography>{producto.nombre}</Typography>
                <Typography>{producto.categoria || "-"}</Typography>
                <Typography>Venta: ${producto.precio}</Typography>
                <Typography>Costo: ${producto.costo}</Typography>
                <Typography>Stock: {producto.stock}</Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => editarProducto(producto)}
                  >
                    Editar
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => borrarProducto(producto.id)}
                  >
                    Eliminar
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </Paper>
      </Box>
    </>
  );
}