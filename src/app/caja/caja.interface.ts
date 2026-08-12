export type ItemCarrito = {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  stock: number;
};

export type MedioPago = "EFECTIVO" | "DEBITO" | "CREDITO";