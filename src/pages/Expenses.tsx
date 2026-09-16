import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  Search,
  Plus,
  Wallet,
  IndianRupee,
  Clock3,
  CheckCircle2,
  Trash2,
  ReceiptText,
} from 'lucide-react'

import {
  useExpenses,
} from '../context/ExpenseContext'

import type {
  ExpenseCategory,
} from '../types/expense'

export default function Expenses() {
  const navigate =
    useNavigate()

  const {
    expenses,
    deleteExpense,
  } = useExpenses()

  // ==========================================
  // FILTER STATE
  // ==========================================

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState<
    'All' | ExpenseCategory
  >('All')

  const [
    statusFilter,
    setStatusFilter,
  ] = useState(
    'All'
  )

  // ==========================================
  // FILTERED EXPENSES
  // ==========================================

  const filteredExpenses =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase()

      return expenses.filter(
        (expense) => {
          const matchesSearch =
            searchText === '' ||
            expense.expenseNumber
              .toLowerCase()
              .includes(
                searchText
              ) ||
            expense.title
              .toLowerCase()
              .includes(
                searchText
              ) ||
            expense.vendor
              .toLowerCase()
              .includes(
                searchText
              ) ||
            expense.reference
              .toLowerCase()
              .includes(
                searchText
              )

          const matchesCategory =
            categoryFilter ===
              'All' ||
            expense.category ===
              categoryFilter

          const matchesStatus =
            statusFilter ===
              'All' ||
            expense.status ===
              statusFilter

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
          )
        }
      )
    }, [
      expenses,
      search,
      categoryFilter,
      statusFilter,
    ])

  // ==========================================
  // TOTALS
  // ==========================================

  const totalExpenses =
    expenses.reduce(
      (total, expense) =>
        total +
        expense.amount,
      0
    )

  const paidExpenses =
    expenses
      .filter(
        (expense) =>
          expense.status ===
          'Paid'
      )
      .reduce(
        (total, expense) =>
          total +
          expense.amount,
        0
      )

  const pendingExpenses =
    expenses
      .filter(
        (expense) =>
          expense.status ===
          'Pending'
      )
      .reduce(
        (total, expense) =>
          total +
          expense.amount,
        0
      )

  // ==========================================
  // MONEY
  // ==========================================

  function formatMoney(
    value: number
  ) {
    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
      }
    ).format(value)
  }

  // ==========================================
  // DATE
  // ==========================================

  function formatDate(
    date: string
  ) {
    const parsedDate =
      new Date(date)

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return 'Invalid date'
    }

    return new Intl.DateTimeFormat(
      'en-IN',
      {
        dateStyle: 'medium',
      }
    ).format(
      parsedDate
    )
  }

  // ==========================================
  // DELETE
  // ==========================================

  function handleDelete(
    id: number,
    title: string
  ) {
    const confirmed =
      window.confirm(
        `Delete "${title}"?`
      )

    if (!confirmed) {
      return
    }

    deleteExpense(id)
  }

  return (
    <div className="expenses-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="expenses-header">

        <div className="page-header">

          <h1>
            Expenses
          </h1>

          <p>
            Record and manage business
            operating expenses.
          </p>

        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate(
              '/expenses/add'
            )
          }
        >
          <Plus size={17} />
          Add Expense
        </button>

      </div>

      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="expense-summary-grid">

        <div className="expense-summary-card">

          <div className="expense-summary-icon">

            <Wallet size={22} />

          </div>

          <div>

            <span>
              Total Expenses
            </span>

            <strong>
              {formatMoney(
                totalExpenses
              )}
            </strong>

            <small>
              All expense records
            </small>

          </div>

        </div>

        <div className="expense-summary-card">

          <div className="expense-summary-icon">

            <CheckCircle2
              size={22}
            />

          </div>

          <div>

            <span>
              Paid Expenses
            </span>

            <strong>
              {formatMoney(
                paidExpenses
              )}
            </strong>

            <small>
              Completed payments
            </small>

          </div>

        </div>

        <div className="expense-summary-card">

          <div className="expense-summary-icon">

            <Clock3
              size={22}
            />

          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {formatMoney(
                pendingExpenses
              )}
            </strong>

            <small>
              Amount still pending
            </small>

          </div>

        </div>

        <div className="expense-summary-card">

          <div className="expense-summary-icon">

            <IndianRupee
              size={22}
            />

          </div>

          <div>

            <span>
              Records
            </span>

            <strong>
              {expenses.length}
            </strong>

            <small>
              Expense entries
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          MAIN CARD
      ====================================== */}

      <div className="expenses-card">

        <div className="expenses-card-header">

          <div>

            <h3>
              Expense History
            </h3>

            <p>
              Track store operating
              expenses and payments.
            </p>

          </div>

          <span className="expense-count">
            {filteredExpenses.length}
            {' '}
            {filteredExpenses.length ===
            1
              ? 'Expense'
              : 'Expenses'}
          </span>

        </div>

        {/* ===================================
            FILTERS
        ==================================== */}

        <div className="expenses-toolbar">

          <div className="expenses-search">

            <Search
              size={18}
            />

            <input
              type="text"
              placeholder="Search expense, vendor or reference..."
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          {/* CATEGORY */}

          <select
            value={
              categoryFilter
            }
            onChange={(
              event
            ) =>
              setCategoryFilter(
                event.target
                  .value as
                  | 'All'
                  | ExpenseCategory
              )
            }
          >

            <option value="All">
              All Categories
            </option>

            <option value="Rent">
              Rent
            </option>

            <option value="Electricity">
              Electricity
            </option>

            <option value="Salary">
              Salary
            </option>

            <option value="Transport">
              Transport
            </option>

            <option value="Maintenance">
              Maintenance
            </option>

            <option value="Marketing">
              Marketing
            </option>

            <option value="Office">
              Office
            </option>

            <option value="Other">
              Other
            </option>

          </select>

          {/* STATUS */}

          <select
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Pending">
              Pending
            </option>

          </select>

        </div>

        {/* ===================================
            TABLE
        ==================================== */}

        <div className="expenses-table-wrapper">

          <table className="expenses-table">

            <thead>

              <tr>

                <th>
                  Expense
                </th>

                <th>
                  Date
                </th>

                <th>
                  Category
                </th>

                <th>
                  Vendor
                </th>

                <th>
                  Payment
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredExpenses.map(
                (expense) => (

                  <tr
                    key={
                      expense.id
                    }
                  >

                    <td>

                      <div className="expense-title-cell">

                        <strong>
                          {
                            expense.title
                          }
                        </strong>

                        <small>
                          {
                            expense.expenseNumber
                          }
                        </small>

                      </div>

                    </td>

                    <td>
                      {formatDate(
                        expense.date
                      )}
                    </td>

                    <td>

                      <span className="expense-category-badge">
                        {
                          expense.category
                        }
                      </span>

                    </td>

                    <td>
                      {expense.vendor ||
                        '—'}
                    </td>

                    <td>
                      {
                        expense.paymentMethod
                      }
                    </td>

                    <td>

                      <strong>
                        {formatMoney(
                          expense.amount
                        )}
                      </strong>

                    </td>

                    <td>

                      <span
                        className={
                          expense.status ===
                          'Paid'
                            ? 'expense-status paid'
                            : 'expense-status pending'
                        }
                      >
                        {
                          expense.status
                        }
                      </span>

                    </td>

                    <td>

                      <button
                        type="button"
                        className="expense-delete-button"
                        title="Delete expense"
                        onClick={() =>
                          handleDelete(
                            expense.id,
                            expense.title
                          )
                        }
                      >
                        <Trash2
                          size={16}
                        />
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {/* ===================================
            EMPTY
        ==================================== */}

        {filteredExpenses.length ===
          0 && (

          <div className="expenses-empty">

            <ReceiptText
              size={42}
            />

            <h3>
              No expenses found
            </h3>

            <p>
              {expenses.length ===
              0
                ? 'Add your first business expense.'
                : 'No expenses match the selected filters.'}
            </p>

            {expenses.length ===
              0 && (

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  navigate(
                    '/expenses/add'
                  )
                }
              >
                <Plus
                  size={17}
                />

                Add Expense
              </button>

            )}

          </div>

        )}

      </div>

    </div>
  )
}