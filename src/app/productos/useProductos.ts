"use client";

import { useEffect, useState } from "react";
import { IProducto } from "./productos.interface";
import {
  actualizarProducto,
  buscarProductos,
  crearProducto,
  eliminarProducto,
  listarProductos,
} from "../../../helpers/httpHelper";

const FORM_INICIAL: IProducto = {
  nombre: "",
  categoria: "",
  precio: 0,
  costo: 0,
  stock: 0,
  codigoBarras: "",
};

export default function useProductos() {
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [form, setForm] = useState<IProducto>(FORM_INICIAL);
  const [loading, setLoading] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [productoEditandoId, setProductoEditandoId] = useState<number | null>(
    null
  );

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      setLoading(true);
      const data = await listarProductos();
      setProductos(data);
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
    if (!form.nombre || !form.codigoBarras || form.precio <= 0) {
      alert("Completá nombre, código de barras y precio");
      return;
    }

    try {
      setLoading(true);

      if (productoEditandoId) {
        await actualizarProducto(productoEditandoId, form);
      } else {
        await crearProducto(form);
      }

      limpiarForm();
      await obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("Error al guardar producto");
    } finally {
      setLoading(false);
    }
  };

  const editarProducto = (producto: IProducto) => {
    if (!producto.id) return;

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
  };

  const borrarProducto = async (id?: number) => {
    if (!id) return;

    const confirma = confirm("¿Seguro que querés eliminar este producto?");
    if (!confirma) return;

    try {
      setLoading(true);
      await eliminarProducto(id);
      await obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar producto");
    } finally {
      setLoading(false);
    }
  };

  const buscar = async () => {
    try {
      setLoading(true);

      if (!textoBusqueda.trim()) {
        await obtenerProductos();
        return;
      }

      const data = await buscarProductos(textoBusqueda);
      setProductos(data);
    } catch (error) {
      console.error(error);
      alert("Error al buscar productos");
    } finally {
      setLoading(false);
    }
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
    productoEditandoId,
    setTextoBusqueda,
    onChange,
    guardarProducto,
    editarProducto,
    borrarProducto,
    buscar,
    limpiarForm,
    obtenerProductos,
  };
}