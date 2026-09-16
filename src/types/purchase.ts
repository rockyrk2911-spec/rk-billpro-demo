export type PurchaseStatus =
  | 'Completed'
  | 'Pending'

export type PurchaseItem = {
  productId: number
  name: string
  quantity: number
  purchasePrice: number
  gst: number
  subtotal: number
  taxAmount: number
  total: number
}

export type Purchase = {
  id: number

  purchaseNumber: string

  supplierId: number
  supplier: string
  supplierInvoice: string

  date: string

  items: PurchaseItem[]

  subtotal: number
  taxAmount: number
  grandTotal: number

  status: PurchaseStatus
}