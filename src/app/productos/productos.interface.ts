export interface IProducto {
  id?: number;
  nombre: string;
  categoria?: string;
  precio: number;
  costo: number;
  stock: number;
  codigoBarras: string;
}

export interface IProductosPaginados {
  contenido: IProducto[];
  paginaActual: number;
  tamanioPagina: number;
  totalElementos: number;
  totalPaginas: number;
  primeraPagina: boolean;
  ultimaPagina: boolean;
}