export type PaymentMethod =
  | 'Cash'
  | 'UPI'
  | 'Card'
  | 'Bank Transfer'

export type SaleItem = {
  productId: number
  name: string
  price: number
  gst: number
  quantity: number
  total: number
}

export type Sale = {
  id: number

  invoiceNumber: string

  date: string

  /*
    Optional because old sales and
    walk-in customers may not have
    a registered customer ID.
  */
  customerId?: number

  customer: string

  items: SaleItem[]

  subtotal: number

  discountPercent: number

  discountAmount: number

  taxAmount: number

  grandTotal: number

  paymentMethod: PaymentMethod

  /*
    Optional for backward compatibility.

    Existing sales saved before payment
    references were introduced will still
    work normally.
  */
  paymentReference?: string

  amountReceived?: number

  changeAmount?: number
}