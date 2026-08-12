"use client";

import {
  Box,
  Button,
  CircularProgress,
  Pagination,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import useProductos from "./useProductos";
import Header from "../../../components/Header";
import useAuth from "@/app/login/useAuth";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useEffect } from "react";
import { getUsuario } from "../../../utils/auth";

export default function Productos() {
  const {
    productos,
    form,
    loading,

    textoBusqueda,
    textoAplicado,
    setTextoBusqueda,

    paginaActual,
    totalPaginas,
    totalElementos,
    tamanioPagina,

    productoEditandoId,

    onChange,
    guardarProducto,
    editarProducto,
    borrarProducto,

    buscar,
    limpiarBusqueda,
    irAPagina,

    limpiarForm,
  } = useProductos();

  const { obtenerUsuario } = useAuth();
  const usuario = obtenerUsuario();
  const router = useRouter();

  const puedeModificarPrecio =
  usuario?.rol === "DUENIO" ||
  usuario?.rol === "ENCARGADO";

  useEffect(() => {
    const usuarioGuardado = getUsuario();

    if (!usuarioGuardado) {
      router.push("/login");
    }
  }, [router]);

  const buscarConEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      buscar();
    }
  };

  const desde =
    totalElementos === 0 ? 0 : paginaActual * tamanioPagina + 1;

  const hasta = Math.min(
    (paginaActual + 1) * tamanioPagina,
    totalElementos
  );

  return (
    <>
      <Header title="Productos" />

      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {productoEditandoId ? "Editar producto" : "Cargar producto"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(e) => onChange("nombre", e.target.value)}
              disabled={loading}
            />

            <TextField
              label="Categoría"
              value={form.categoria}
              onChange={(e) => onChange("categoria", e.target.value)}
              disabled={loading}
            />

            <TextField
              label="Código de barras"
              value={form.codigoBarras}
              onChange={(e) => onChange("codigoBarras", e.target.value)}
              disabled={loading}
            />

            <TextField
              label="Precio de venta"
              type="number"
              value={form.precio}
              onChange={(e) => onChange("precio", e.target.value)}
              disabled={
                loading ||
                (!!productoEditandoId && !puedeModificarPrecio)
              }
            />

            <TextField
              label="Precio de costo"
              type="number"
              value={form.costo}
              onChange={(e) => onChange("costo", e.target.value)}
              disabled={loading}
            />

            {(usuario?.rol === "DUENIO" ||
              usuario?.rol === "ENCARGADO") && (
              <TextField
                label="Stock"
                type="number"
                value={form.stock}
                onChange={(e) => onChange("stock", e.target.value)}
                disabled={loading}
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
              <Button
                variant="outlined"
                onClick={limpiarForm}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Buscar productos
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: {
                xs: "column",
                sm: "row",
              },
            }}
          >
            <TextField
              label="Buscar por nombre, categoría o código"
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              onKeyDown={buscarConEnter}
              fullWidth
              disabled={loading}
            />

            <Button
              variant="contained"
              onClick={buscar}
              disabled={loading}
            >
              Buscar
            </Button>

            {(textoBusqueda || textoAplicado) && (
              <Button
                variant="outlined"
                onClick={limpiarBusqueda}
                disabled={loading}
              >
                Limpiar
              </Button>
            )}
          </Box>

          {textoAplicado && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Resultados para: <strong>{textoAplicado}</strong>
            </Typography>
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography variant="h6">
              Lista de productos
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {totalElementos === 0
                ? "Sin productos"
                : `Mostrando ${desde} a ${hasta} de ${totalElementos}`}
            </Typography>
          </Box>

          {loading ? (
            <Box
              sx={{
                minHeight: 200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CircularProgress size={28} />
              <Typography>Cargando productos...</Typography>
            </Box>
          ) : productos.length === 0 ? (
            <Typography color="text.secondary">
              No hay productos para mostrar.
            </Typography>
          ) : (
            <>
              {productos.map((producto) => (
                <Box
                  key={producto.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "2fr 1fr 1fr 1fr 1fr 1.5fr",
                    },
                    gap: 2,
                    alignItems: "center",
                    borderBottom: "1px solid #ddd",
                    py: 1.5,
                  }}
                >
                  <Typography>{producto.nombre}</Typography>

                  <Typography>
                    {producto.categoria || "-"}
                  </Typography>

                  <Typography>
                    Venta: ${producto.precio}
                  </Typography>

                  <Typography>
                    Costo: ${producto.costo}
                  </Typography>

                  <Typography>
                    Stock: {producto.stock}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                    }}
                  >
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
              ))}

              {totalPaginas > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                  }}
                >
                  <Pagination
                    count={totalPaginas}
                    page={paginaActual + 1}
                    onChange={(_, nuevaPagina) =>
                      irAPagina(nuevaPagina - 1)
                    }
                    color="primary"
                    disabled={loading}
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    </>
  );
}