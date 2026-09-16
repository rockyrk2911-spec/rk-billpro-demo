export type CustomerStatus =
  | 'Active'
  | 'Inactive'

export type Customer = {
  id: number

  name: string
  phone: string
  email: string

  gstin: string

  address: string
  city: string

  openingBalance: number
  loyaltyPoints: number

  status: CustomerStatus

  createdAt: string
}

export type NewCustomer = Omit<
  Customer,
  'id' | 'loyaltyPoints' | 'createdAt'
>