export type UserRole =
  | 'Owner / Admin'
  | 'Manager'
  | 'Cashier'
  | 'Accountant'

export type UserStatus =
  | 'Active'
  | 'Inactive'

export type UserPermission =
  | 'dashboard'
  | 'pos'
  | 'sales'
  | 'products'
  | 'inventory'
  | 'purchases'
  | 'customers'
  | 'suppliers'
  | 'expenses'
  | 'reports'
  | 'settings'

export type AppUser = {
  id: number

  name: string
  email: string
  phone: string

  role: UserRole

  permissions:
    UserPermission[]

  status: UserStatus

  createdAt: string
}

export type NewAppUser =
  Omit<
    AppUser,
    'id' | 'createdAt'
  >