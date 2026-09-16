export type SupplierStatus =
  | 'Active'
  | 'Inactive'

export type Supplier = {
  id: number
  name: string
  contactPerson: string
  phone: string
  email: string
  gstin: string
  address: string
  city: string
  openingBalance: number
  status: SupplierStatus
  createdAt: string
}

export type NewSupplier =
  Omit<Supplier, 'id' | 'createdAt'>