export type ProductStatus =
  | 'In Stock'
  | 'Low Stock'
  | 'Out of Stock'

export type Product = {
  id: number
  name: string
  barcode: string
  category: string
  stock: number
  minimumStock: number
  purchasePrice: number
  price: number
  gst: number
  unit: string
  status: ProductStatus
}