export type ExpenseCategory =
  | 'Rent'
  | 'Electricity'
  | 'Salary'
  | 'Transport'
  | 'Maintenance'
  | 'Marketing'
  | 'Office'
  | 'Other'

export type ExpensePaymentMethod =
  | 'Cash'
  | 'UPI'
  | 'Card'
  | 'Bank Transfer'

export type ExpenseStatus =
  | 'Paid'
  | 'Pending'

export type Expense = {
  id: number

  expenseNumber: string

  title: string

  category: ExpenseCategory

  amount: number

  date: string

  paymentMethod: ExpensePaymentMethod

  status: ExpenseStatus

  vendor: string

  reference: string

  notes: string

  createdAt: string
}

export type NewExpense = Omit<
  Expense,
  'id' | 'expenseNumber' | 'createdAt'
>