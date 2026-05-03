export interface IProducto {
  id?: number;
  nombre: string;
  categoria?: string;
  precio: number;
  costo: number;
  stock: number;
  codigoBarras: string;
}