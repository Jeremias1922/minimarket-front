import { useState } from "react";
import { ItemCarrito, MedioPago } from "./caja.interface";
import {
    buscarProductos,
    crearVenta,
    getProductoPorCodigo,
} from "../../../helpers/httpHelper";

export const useCaja = () => {
    const [codigo, setCodigo] = useState("");
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [medioPago, setMedioPago] = useState<MedioPago>("EFECTIVO");
    const [busqueda, setBusqueda] = useState("");
    const [resultados, setResultados] = useState<any[]>([]);

    const agregarAlCarrito = (producto: any) => {
        setCarrito((prev) => {
            const existe = prev.find((p) => p.productoId === producto.id);

            if (existe) {
                return prev.map((p) =>
                    p.productoId === producto.id
                        ? { ...p, cantidad: p.cantidad + 1 }
                        : p
                );
            }

            return [
                ...prev,
                {
                    productoId: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: 1,
                },
            ];
        });
    };

    const agregarDesdeBusqueda = (producto: any) => {
        setResultados([]);
        setBusqueda("");
        agregarAlCarrito(producto);
    };

    const buscarPorNombre = async (value: string) => {
        setBusqueda(value);

        if (value.length < 2) {
            setResultados([]);
            return;
        }

        try {
            const data = await buscarProductos(value);
            setResultados(data);
        } catch (e) {
            console.error(e);
        }
    };

    const buscarProducto = async () => {
        if (!codigo.trim()) return;

        try {
            const producto = await getProductoPorCodigo(codigo);
            agregarAlCarrito(producto);
            setCodigo("");
        } catch {
            alert("Producto no encontrado");
        }
    };

    const cobrar = async (usuarioId: number) => {
        if (carrito.length === 0) {
            alert("No hay productos en el carrito");
            return;
        }

        const body = {
            medioPago,
            usuarioId,
            items: carrito.map((item) => ({
                productoId: item.productoId,
                cantidad: item.cantidad,
            })),
        };

        await crearVenta(body);

        limpiarCarrito();
        alert("Venta realizada correctamente");
    };

    const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

    const sumarCantidad = (productoId: number) => {
        setCarrito((prev) =>
            prev.map((item) =>
                item.productoId === productoId
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            )
        );
    };

    const restarCantidad = (productoId: number) => {
        setCarrito((prev) =>
            prev
                .map((item) =>
                    item.productoId === productoId
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item
                )
                .filter((item) => item.cantidad > 0)
        );
    };

    const eliminarItem = (productoId: number) => {
        setCarrito((prev) => prev.filter((item) => item.productoId !== productoId));
    };

    const limpiarCarrito = () => {
        setCarrito([]);
    };

    return {
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
    };
};