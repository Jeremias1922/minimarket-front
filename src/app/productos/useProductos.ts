"use client";

import { useEffect, useState } from "react";
import { IProducto } from "./productos.interface";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductosPaginados,
} from "../../../helpers/httpHelper";

const FORM_INICIAL: IProducto = {
  nombre: "",
  categoria: "",
  precio: 0,
  costo: 0,
  stock: 0,
  codigoBarras: "",
};

const TAMANIO_PAGINA = 25;

export default function useProductos() {
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [form, setForm] = useState<IProducto>(FORM_INICIAL);
  const [loading, setLoading] = useState(false);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [textoAplicado, setTextoAplicado] = useState("");

  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [primeraPagina, setPrimeraPagina] = useState(true);
  const [ultimaPagina, setUltimaPagina] = useState(true);

  const [productoEditandoId, setProductoEditandoId] = useState<number | null>(
    null
  );

  useEffect(() => {
    obtenerProductos(0, "");
  }, []);

  const obtenerProductos = async (
    pagina: number = paginaActual,
    texto: string = textoAplicado
  ) => {
    try {
      setLoading(true);

      const data = await listarProductosPaginados(
        pagina,
        TAMANIO_PAGINA,
        texto
      );

      setProductos(data.contenido);
      setPaginaActual(data.paginaActual);
      setTotalPaginas(data.totalPaginas);
      setTotalElementos(data.totalElementos);
      setPrimeraPagina(data.primeraPagina);
      setUltimaPagina(data.ultimaPagina);
    } catch (error) {
      console.error(error);
      alert("Error al listar productos");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (field: keyof IProducto, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === "precio" || field === "costo" || field === "stock"
          ? Number(value)
          : value,
    }));
  };

  const guardarProducto = async () => {
    if (!form.nombre.trim()) {
      alert("Completá el nombre del producto");
      return;
    }

    if (!form.codigoBarras.trim()) {
      alert("Completá el código de barras");
      return;
    }

    if (form.precio <= 0) {
      alert("El precio de venta debe ser mayor a cero");
      return;
    }

    try {
      setLoading(true);

      if (productoEditandoId !== null) {
        await actualizarProducto(productoEditandoId, form);
      } else {
        await crearProducto(form);
      }

      limpiarForm();

      await obtenerProductos(paginaActual, textoAplicado);
    } catch (error) {
      console.error(error);
      alert("Error al guardar producto");
    } finally {
      setLoading(false);
    }
  };

  const editarProducto = (producto: IProducto) => {
    if (!producto.id) {
      return;
    }

    setProductoEditandoId(producto.id);

    setForm({
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria || "",
      precio: producto.precio,
      costo: producto.costo,
      stock: producto.stock,
      codigoBarras: producto.codigoBarras,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const borrarProducto = async (id?: number) => {
    if (!id) {
      return;
    }

    const confirma = confirm("¿Seguro que querés eliminar este producto?");

    if (!confirma) {
      return;
    }

    try {
      setLoading(true);

      await eliminarProducto(id);

      const quedanProductosEnPagina = productos.length > 1;

      if (!quedanProductosEnPagina && paginaActual > 0) {
        await obtenerProductos(paginaActual - 1, textoAplicado);
      } else {
        await obtenerProductos(paginaActual, textoAplicado);
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar producto");
    } finally {
      setLoading(false);
    }
  };

  const buscar = async () => {
    const texto = textoBusqueda.trim();

    setTextoAplicado(texto);

    await obtenerProductos(0, texto);
  };

  const limpiarBusqueda = async () => {
    setTextoBusqueda("");
    setTextoAplicado("");

    await obtenerProductos(0, "");
  };

  const irAPagina = async (pagina: number) => {
    if (pagina < 0) {
      return;
    }

    if (totalPaginas > 0 && pagina >= totalPaginas) {
      return;
    }

    await obtenerProductos(pagina, textoAplicado);
  };

  const paginaAnterior = async () => {
    if (primeraPagina) {
      return;
    }

    await irAPagina(paginaActual - 1);
  };

  const paginaSiguiente = async () => {
    if (ultimaPagina) {
      return;
    }

    await irAPagina(paginaActual + 1);
  };

  const limpiarForm = () => {
    setForm(FORM_INICIAL);
    setProductoEditandoId(null);
  };

  return {
    productos,
    form,
    loading,

    textoBusqueda,
    textoAplicado,
    setTextoBusqueda,

    paginaActual,
    totalPaginas,
    totalElementos,
    primeraPagina,
    ultimaPagina,
    tamanioPagina: TAMANIO_PAGINA,

    productoEditandoId,

    onChange,
    guardarProducto,
    editarProducto,
    borrarProducto,

    buscar,
    limpiarBusqueda,

    irAPagina,
    paginaAnterior,
    paginaSiguiente,

    limpiarForm,
    obtenerProductos,
  };
}