import { useRef, useState } from "react";
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
    const [cobrando, setCobrando] = useState(false);

    const cobrandoRef = useRef(false);

    const agregarAlCarrito = (producto: any) => {
        if (producto.stock <= 0) {
            alert(`No hay stock disponible de ${producto.nombre}`);
            return;
        }

        setCarrito((prev) => {
            const existe = prev.find(
                (p) => p.productoId === producto.id
            );

            if (existe) {
                if (existe.cantidad >= producto.stock) {
                    alert(
                        `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`
                    );

                    return prev;
                }

                return prev.map((p) =>
                    p.productoId === producto.id
                        ? {
                              ...p,
                              cantidad: p.cantidad + 1,
                          }
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
                    stock: producto.stock,
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
        } catch (error) {
            console.error(error);
        }
    };

    const buscarProducto = async () => {
        if (!codigo.trim()) {
            return;
        }

        try {
            const producto = await getProductoPorCodigo(codigo);

            agregarAlCarrito(producto);

            setCodigo("");
        } catch (error) {
            console.error(error);

            alert("Producto no encontrado");
        }
    };

    const cobrar = async (usuarioId: number) => {
        /*
         * Evita que un doble click dispare dos ventas
         * antes de que React llegue a actualizar el estado.
         */
        if (cobrandoRef.current) {
            return;
        }

        if (carrito.length === 0) {
            alert("No hay productos en el carrito");
            return;
        }

        const productoSinStock = carrito.find(
            (item) =>
                item.stock <= 0 ||
                item.cantidad > item.stock
        );

        if (productoSinStock) {
            alert(
                `Stock insuficiente para ${productoSinStock.nombre}. ` +
                    `Disponible: ${productoSinStock.stock}. ` +
                    `Cantidad solicitada: ${productoSinStock.cantidad}.`
            );

            return;
        }

        /*
         * Se bloquea antes de llamar al backend.
         */
        cobrandoRef.current = true;
        setCobrando(true);

        const body = {
            medioPago,
            usuarioId,
            items: carrito.map((item) => ({
                productoId: item.productoId,
                cantidad: item.cantidad,
            })),
        };

        try {
            await crearVenta(body);

            limpiarCarrito();

            alert("Venta realizada correctamente");
        } catch (error) {
            console.error(error);

            alert(
                "No se pudo realizar la venta. Verificá que haya stock suficiente."
            );
        } finally {
            /*
             * Tanto si salió bien como si falló,
             * volvemos a habilitar el botón.
             */
            cobrandoRef.current = false;
            setCobrando(false);
        }
    };

    const total = carrito.reduce(
        (acc, item) =>
            acc + item.precio * item.cantidad,
        0
    );

    const sumarCantidad = (productoId: number) => {
        setCarrito((prev) =>
            prev.map((item) => {
                if (item.productoId !== productoId) {
                    return item;
                }

                if (item.cantidad >= item.stock) {
                    alert(
                        `No hay más stock disponible de ${item.nombre}. Stock disponible: ${item.stock}`
                    );

                    return item;
                }

                return {
                    ...item,
                    cantidad: item.cantidad + 1,
                };
            })
        );
    };

    const restarCantidad = (productoId: number) => {
        setCarrito((prev) =>
            prev
                .map((item) =>
                    item.productoId === productoId
                        ? {
                              ...item,
                              cantidad: item.cantidad - 1,
                          }
                        : item
                )
                .filter((item) => item.cantidad > 0)
        );
    };

    const eliminarItem = (productoId: number) => {
        setCarrito((prev) =>
            prev.filter(
                (item) => item.productoId !== productoId
            )
        );
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
        cobrando,
        total,
        sumarCantidad,
        restarCantidad,
        eliminarItem,
        limpiarCarrito,
    };
};