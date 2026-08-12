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
  CircularProgress,
} from "@mui/material";

import useAuth from "../login/useAuth";
import { IProducto } from "@/app/productos/productos.interface";

export const Caja = () => {
const {
  codigo,
  setCodigo,
  carrito,
  medioPago,
  setMedioPago,
  resultados,
  buscarProducto,
  buscarPorNombre,
  agregarDesdeBusqueda,
  cobrar,
  cobrando,
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
    const usuarioGuardado = getUsuario();

    if (!usuarioGuardado) {
      router.push("/login");
    }
  }, [router]);

  const money = (valor: number) =>
    `$${Number(valor || 0).toLocaleString("es-AR")}`;

  const limpiarBusqueda = () => {
    setCodigo("");
    buscarPorNombre("");
  };

  const seleccionarProducto = (producto: IProducto) => {
    agregarDesdeBusqueda(producto);
    limpiarBusqueda();
  };

  const handleCambioBusqueda = (valor: string) => {
    setCodigo(valor);

    if (!valor.trim()) {
      buscarPorNombre("");
      return;
    }

    buscarPorNombre(valor);
  };

  const handleEnterBusqueda = async () => {
    const termino = codigo.trim();

    if (!termino) {
      return;
    }

    /*
     * Si el texto contiene solamente números, se interpreta
     * como un código de barras.
     */
    const esCodigoDeBarras = /^\d+$/.test(termino);

    if (esCodigoDeBarras) {
      await buscarProducto();
      buscarPorNombre("");
      return;
    }

    /*
     * Si se buscó por nombre y hay un único resultado,
     * se agrega directamente al carrito.
     */
    if (resultados.length === 1) {
      seleccionarProducto(resultados[0]);
    }
  };

  return (
    <>
      <Header title="Caja" />

      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 72px)",
          backgroundColor: "#f3f4f6",
        }}
      >
        <Box sx={{ flex: 2, p: 3 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Búsqueda unificada */}
            <TextField
              value={codigo}
              onChange={(event) =>
                handleCambioBusqueda(event.target.value)
              }
              onKeyDown={async (event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  await handleEnterBusqueda();
                }
              }}
              placeholder="Escanear código o buscar producto por nombre..."
              fullWidth
              autoFocus
              sx={{
                mb: resultados.length > 0 ? 1 : 3,
              }}
            />

            {/* Resultados de búsqueda por nombre */}
            {resultados.length > 0 && codigo.trim() && (
              <Paper
                sx={{
                  mb: 3,
                  maxHeight: 220,
                  overflow: "auto",
                  border: "1px solid #e5e7eb",
                }}
              >
                {resultados.map((producto) => (
                  <Box
                    key={producto.id}
                    onClick={() => seleccionarProducto(producto)}
                    sx={{
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      borderBottom: "1px solid #f3f4f6",
                      "&:last-child": {
                        borderBottom: "none",
                      },
                      "&:hover": {
                        backgroundColor: "#fff7ed",
                      },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>
                        {producto.nombre}
                      </Typography>

                      {producto.codigoBarras && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Código: {producto.codigoBarras}
                        </Typography>
                      )}
                    </Box>

                    <Typography sx={{ fontWeight: 700 }}>
                      {money(producto.precio)}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}

            {/* Productos agregados al carrito */}
            <Box sx={{ flex: 1, overflow: "auto" }}>
              {carrito.length === 0 && (
                <Typography color="text.secondary">
                  No hay productos
                </Typography>
              )}

              {carrito.map((item) => (
                <Box
                  key={item.productoId}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "1.6fr 180px 140px 100px",
                    alignItems: "center",
                    borderBottom: "1px solid #e5e7eb",
                    py: 2,
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.nombre}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {money(item.precio)} c/u
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        restarCantidad(item.productoId)
                      }
                      sx={{ minWidth: 48 }}
                    >
                      -
                    </Button>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        minWidth: 24,
                        textAlign: "center",
                      }}
                    >
                      {item.cantidad}
                    </Typography>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        sumarCantidad(item.productoId)
                      }
                      sx={{ minWidth: 48 }}
                    >
                      +
                    </Button>
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "right",
                    }}
                  >
                    {money(item.precio * item.cantidad)}
                  </Typography>

                  <Button
                    color="error"
                    onClick={() =>
                      eliminarItem(item.productoId)
                    }
                    sx={{ justifySelf: "end" }}
                  >
                    Eliminar
                  </Button>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Resumen lateral */}
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
            <Typography variant="h6" sx={{ mb: 2 }}>
              Resumen
            </Typography>

            {carrito.length === 0 ? (
              <Typography color="text.secondary">
                Sin productos
              </Typography>
            ) : (
              carrito.map((item) => (
                <Box
                  key={item.productoId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    gap: 1,
                  }}
                >
                  <Typography variant="body2">
                    {item.nombre} x{item.cantidad}
                  </Typography>

                  <Typography variant="body2">
                    {money(item.precio * item.cantidad)}
                  </Typography>
                </Box>
              ))
            )}
          </Box>

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              {money(total)}
            </Typography>

            <Select
              fullWidth
              value={medioPago}
              onChange={(event) =>
                setMedioPago(event.target.value as any)
              }
              sx={{ mb: 2 }}
            >
              <MenuItem value="EFECTIVO">Efectivo</MenuItem>
              <MenuItem value="DEBITO">Transferencia</MenuItem>
              <MenuItem value="CREDITO">Crédito</MenuItem>
            </Select>

            <Button
              fullWidth
              variant="contained"
              disabled={carrito.length === 0 || cobrando}
              onClick={() => {
                if (!usuario?.id) {
                  alert("No hay usuario logueado");
                  return;
                }

                cobrar(usuario.id);
              }}
              sx={{
                backgroundColor: "#16a34a",
                "&:hover": {
                  backgroundColor: "#15803d",
                },
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {cobrando ? (
                <>
                  <CircularProgress
                    size={20}
                    color="inherit"
                    sx={{ mr: 1 }}
                  />

                  PROCESANDO...
                </>
              ) : (
                "COBRAR"
              )}
            </Button>

            {carrito.length > 0 && (
              <Button
                fullWidth
                color="error"
                sx={{ mt: 1 }}
                onClick={limpiarCarrito}
              >
                Limpiar carrito
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};