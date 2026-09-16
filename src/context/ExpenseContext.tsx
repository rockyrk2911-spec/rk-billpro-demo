import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type {
  Expense,
  NewExpense,
} from '../types/expense'

import {
  useBackup,
} from './BackupContext'

type ExpenseContextType = {
  expenses: Expense[]

  addExpense: (
    expense: NewExpense
  ) => Expense

  updateExpense: (
    expense: Expense
  ) => void

  deleteExpense: (
    id: number
  ) => void

  getExpenseById: (
    id: number
  ) => Expense | undefined

  getNextExpenseNumber:
    () => string
}

const ExpenseContext =
  createContext<
    ExpenseContextType | undefined
  >(undefined)

/* =========================================
   DEFAULT DEMO EXPENSES
========================================= */

const defaultExpenses: Expense[] = [
  {
    id: 1,

    expenseNumber:
      'EXP-00001',

    title:
      'Shop Electricity Bill',

    category:
      'Electricity',

    amount: 4200,

    date:
      new Date()
        .toISOString(),

    paymentMethod:
      'Bank Transfer',

    status:
      'Paid',

    vendor:
      'Electricity Board',

    reference:
      'EB-DEMO-001',

    notes:
      'Demo monthly electricity expense.',

    createdAt:
      new Date()
        .toISOString(),
  },

  {
    id: 2,

    expenseNumber:
      'EXP-00002',

    title:
      'Store Maintenance',

    category:
      'Maintenance',

    amount: 1800,

    date:
      new Date()
        .toISOString(),

    paymentMethod:
      'Cash',

    status:
      'Paid',

    vendor:
      'Local Maintenance Service',

    reference:
      '',

    notes:
      'Demo maintenance expense.',

    createdAt:
      new Date()
        .toISOString(),
  },

  {
    id: 3,

    expenseNumber:
      'EXP-00003',

    title:
      'Local Advertising',

    category:
      'Marketing',

    amount: 2500,

    date:
      new Date()
        .toISOString(),

    paymentMethod:
      'UPI',

    status:
      'Pending',

    vendor:
      'Demo Advertising Agency',

    reference:
      '',

    notes:
      'Demo promotional expense.',

    createdAt:
      new Date()
        .toISOString(),
  },
]

/* =========================================
   PROVIDER
========================================= */

export function ExpenseProvider({
  children,
}: {
  children: ReactNode
}) {
  /* =======================================
     BACKUP / OFFLINE SYNC
  ======================================== */

  const {
    connectionStatus,
    addPendingChange,
  } = useBackup()

  /* =======================================
     EXPENSE STATE
  ======================================== */

  const [
    expenses,
    setExpenses,
  ] =
    useState<Expense[]>(
      () => {
        const saved =
          localStorage.getItem(
            'rk-billpro-expenses'
          )

        if (!saved) {
          return defaultExpenses
        }

        try {
          const parsed =
            JSON.parse(
              saved
            )

          if (
            Array.isArray(
              parsed
            )
          ) {
            return parsed
          }

          return defaultExpenses
        } catch {
          return defaultExpenses
        }
      }
    )

  /* =======================================
     LOCAL STORAGE
  ======================================== */

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-expenses',
      JSON.stringify(
        expenses
      )
    )
  }, [expenses])

  /* =======================================
     NEXT EXPENSE NUMBER
  ======================================== */

  function getNextExpenseNumber() {
    const numbers =
      expenses.map(
        (expense) => {
          const match =
            expense
              .expenseNumber
              ?.match(
                /^EXP-(\d+)$/
              )

          if (!match) {
            return 0
          }

          const number =
            Number(
              match[1]
            )

          return Number.isFinite(
            number
          )
            ? number
            : 0
        }
      )

    const highestNumber =
      numbers.length > 0
        ? Math.max(
            ...numbers
          )
        : 0

    const nextNumber =
      highestNumber + 1

    return `EXP-${String(
      nextNumber
    ).padStart(
      5,
      '0'
    )}`
  }

  /* =======================================
     ADD EXPENSE
  ======================================== */

  function addExpense(
    expense: NewExpense
  ) {
    const newExpense:
      Expense = {
        ...expense,

        id:
          Date.now(),

        expenseNumber:
          getNextExpenseNumber(),

        createdAt:
          new Date()
            .toISOString(),
      }

    /*
      Always save the expense locally.

      This means expense management
      continues even when RK BillPro
      is in offline demo mode.
    */

    setExpenses(
      (current) => [
        newExpense,
        ...current,
      ]
    )

    /*
      Only offline operations need
      to enter our simulated sync queue.
    */

    if (
      connectionStatus ===
      'Offline'
    ) {
      addPendingChange(
        'Expense',
        `${newExpense.expenseNumber} • ${newExpense.title} • ₹${newExpense.amount.toFixed(
          2
        )}`
      )
    }

    return newExpense
  }

  /* =======================================
     UPDATE EXPENSE
  ======================================== */

  function updateExpense(
    updatedExpense:
      Expense
  ) {
    setExpenses(
      (current) =>
        current.map(
          (expense) =>
            expense.id ===
            updatedExpense.id
              ? updatedExpense
              : expense
        )
    )

    /*
      Editing existing data offline
      also represents an unsynchronized
      local change.
    */

    if (
      connectionStatus ===
      'Offline'
    ) {
      addPendingChange(
        'Expense',
        `Updated ${updatedExpense.expenseNumber} • ${updatedExpense.title} • ₹${updatedExpense.amount.toFixed(
          2
        )}`
      )
    }
  }

  /* =======================================
     DELETE EXPENSE
  ======================================== */

  function deleteExpense(
    id: number
  ) {
    const expenseToDelete =
      expenses.find(
        (expense) =>
          expense.id === id
      )

    setExpenses(
      (current) =>
        current.filter(
          (expense) =>
            expense.id !== id
        )
    )

    /*
      If a saved expense is deleted
      while offline, remember that
      deletion in the demo sync queue.
    */

    if (
      connectionStatus ===
        'Offline' &&
      expenseToDelete
    ) {
      addPendingChange(
        'Expense',
        `Deleted ${expenseToDelete.expenseNumber} • ${expenseToDelete.title}`
      )
    }
  }

  /* =======================================
     GET EXPENSE BY ID
  ======================================== */

  function getExpenseById(
    id: number
  ) {
    return expenses.find(
      (expense) =>
        expense.id === id
    )
  }

  /* =======================================
     PROVIDER
  ======================================== */

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpenseById,
        getNextExpenseNumber,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

/* =========================================
   HOOK
========================================= */

export function useExpenses() {
  const context =
    useContext(
      ExpenseContext
    )

  if (!context) {
    throw new Error(
      'useExpenses must be used inside ExpenseProvider'
    )
  }

  return context
}