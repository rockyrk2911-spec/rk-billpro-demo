import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Wallet,
  CheckCircle2,
  Clock3,
  ReceiptText,
  Search,
  Tags,
  CreditCard,
  TrendingUp,
} from 'lucide-react'

import {
  useExpenses,
} from '../context/ExpenseContext'

type DateFilter =
  | 'All'
  | 'Today'
  | '7 Days'
  | '30 Days'

type StatusFilter =
  | 'All'
  | 'Paid'
  | 'Pending'

/* =========================================
   DATE FILTER HELPER
========================================= */

function matchesDateFilter(
  dateString: string,
  dateFilter: DateFilter
) {
  if (
    dateFilter === 'All'
  ) {
    return true
  }

  const expenseDate =
    new Date(dateString)

  if (
    Number.isNaN(
      expenseDate.getTime()
    )
  ) {
    return false
  }

  const now =
    new Date()

  if (
    dateFilter === 'Today'
  ) {
    return (
      expenseDate.getFullYear() ===
        now.getFullYear() &&
      expenseDate.getMonth() ===
        now.getMonth() &&
      expenseDate.getDate() ===
        now.getDate()
    )
  }

  const days =
    dateFilter === '7 Days'
      ? 7
      : 30

  const startDate =
    new Date()

  startDate.setDate(
    startDate.getDate() -
      (days - 1)
  )

  startDate.setHours(
    0,
    0,
    0,
    0
  )

  return (
    expenseDate >=
      startDate &&
    expenseDate <=
      now
  )
}

/* =========================================
   EXPENSE REPORT
========================================= */

export default function ExpenseReport() {
  const navigate =
    useNavigate()

  const {
    expenses,
  } = useExpenses()

  const [
    dateFilter,
    setDateFilter,
  ] =
    useState<DateFilter>(
      'All'
    )

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      'All'
    )

  const [
    categoryFilter,
    setCategoryFilter,
  ] =
    useState('All')

  const [
    search,
    setSearch,
  ] =
    useState('')

  /* =========================================
     DATE FILTERED EXPENSES

     Used for the summary cards and charts.
     Search/category/status filters are used
     separately for the transaction table.
  ========================================= */

  const periodExpenses =
    useMemo(
      () =>
        expenses.filter(
          (expense) =>
            matchesDateFilter(
              expense.date,
              dateFilter
            )
        ),
      [
        expenses,
        dateFilter,
      ]
    )

  /* =========================================
     CATEGORIES
  ========================================= */

  const categories =
    useMemo(() => {
      return Array.from(
        new Set(
          expenses.map(
            (expense) =>
              expense.category
          )
        )
      ).sort()
    }, [expenses])

  /* =========================================
     TABLE FILTERS
  ========================================= */

  const filteredExpenses =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase()

      return periodExpenses.filter(
        (expense) => {
          const matchesStatus =
            statusFilter === 'All' ||
            expense.status ===
              statusFilter

          const matchesCategory =
            categoryFilter === 'All' ||
            expense.category ===
              categoryFilter

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
            expense.category
              .toLowerCase()
              .includes(
                searchText
              ) ||
            expense.reference
              .toLowerCase()
              .includes(
                searchText
              )

          return (
            matchesStatus &&
            matchesCategory &&
            matchesSearch
          )
        }
      )
    }, [
      periodExpenses,
      statusFilter,
      categoryFilter,
      search,
    ])

  /* =========================================
     TOTAL RECORDED EXPENSES
  ========================================= */

  const totalExpenses =
    periodExpenses.reduce(
      (
        total,
        expense
      ) =>
        total +
        expense.amount,
      0
    )

  /* =========================================
     PAID EXPENSES
  ========================================= */

  const paidExpenses =
    periodExpenses
      .filter(
        (expense) =>
          expense.status ===
          'Paid'
      )
      .reduce(
        (
          total,
          expense
        ) =>
          total +
          expense.amount,
        0
      )

  /* =========================================
     PENDING EXPENSES
  ========================================= */

  const pendingExpenses =
    periodExpenses
      .filter(
        (expense) =>
          expense.status ===
          'Pending'
      )
      .reduce(
        (
          total,
          expense
        ) =>
          total +
          expense.amount,
        0
      )

  /* =========================================
     CATEGORY BREAKDOWN
  ========================================= */

  const categoryBreakdown =
    useMemo(() => {
      const categoryMap =
        new Map<
          string,
          {
            category: string
            count: number
            amount: number
          }
        >()

      periodExpenses.forEach(
        (expense) => {
          const existing =
            categoryMap.get(
              expense.category
            )

          if (existing) {
            existing.count += 1

            existing.amount +=
              expense.amount
          } else {
            categoryMap.set(
              expense.category,
              {
                category:
                  expense.category,

                count: 1,

                amount:
                  expense.amount,
              }
            )
          }
        }
      )

      return Array.from(
        categoryMap.values()
      ).sort(
        (a, b) =>
          b.amount -
          a.amount
      )
    }, [periodExpenses])

  /* =========================================
     PAYMENT METHOD BREAKDOWN
  ========================================= */

  const paymentBreakdown =
    useMemo(() => {
      const paymentMap =
        new Map<
          string,
          {
            method: string
            count: number
            amount: number
          }
        >()

      periodExpenses.forEach(
        (expense) => {
          const existing =
            paymentMap.get(
              expense.paymentMethod
            )

          if (existing) {
            existing.count += 1

            existing.amount +=
              expense.amount
          } else {
            paymentMap.set(
              expense.paymentMethod,
              {
                method:
                  expense.paymentMethod,

                count: 1,

                amount:
                  expense.amount,
              }
            )
          }
        }
      )

      return Array.from(
        paymentMap.values()
      ).sort(
        (a, b) =>
          b.amount -
          a.amount
      )
    }, [periodExpenses])

  /* =========================================
     HIGHEST EXPENSES
  ========================================= */

  const highestExpenses =
    useMemo(() => {
      return [
        ...periodExpenses,
      ]
        .sort(
          (a, b) =>
            b.amount -
            a.amount
        )
        .slice(0, 5)
    }, [periodExpenses])

  /* =========================================
     AVERAGE EXPENSE
  ========================================= */

  const averageExpense =
    periodExpenses.length > 0
      ? totalExpenses /
        periodExpenses.length
      : 0

  /* =========================================
     FORMAT MONEY
  ========================================= */

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

  /* =========================================
     FORMAT DATE
  ========================================= */

  function formatDate(
    dateString: string
  ) {
    const date =
      new Date(
        dateString
      )

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return 'Invalid date'
    }

    return new Intl.DateTimeFormat(
      'en-IN',
      {
        dateStyle:
          'medium',
      }
    ).format(date)
  }

  return (
    <div className="detailed-report-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="report-page-top">

        <div>

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate(
                '/reports'
              )
            }
          >

            <ArrowLeft
              size={17}
            />

            Back to Reports

          </button>

          <div className="page-header report-page-title">

            <h1>
              Expense Report
            </h1>

            <p>
              Analyse operating expenses,
              categories, payment methods
              and payment status.
            </p>

          </div>

        </div>

        <div className="expense-report-header-actions">

          <select
            className="report-date-filter"
            value={
              dateFilter
            }
            onChange={(
              event
            ) =>
              setDateFilter(
                event.target
                  .value as DateFilter
              )
            }
          >

            <option value="All">
              All Time
            </option>

            <option value="Today">
              Today
            </option>

            <option value="7 Days">
              Last 7 Days
            </option>

            <option value="30 Days">
              Last 30 Days
            </option>

          </select>

          <button
            type="button"
            className="expense-report-open-button"
            onClick={() =>
              navigate(
                '/expenses'
              )
            }
          >

            <Wallet
              size={17}
            />

            Open Expenses

          </button>

        </div>

      </div>

      {/* =====================================
          KPI CARDS
      ====================================== */}

      <div className="report-kpi-grid">

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <Wallet
              size={21}
            />

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
              All recorded expenses
            </small>

          </div>

        </div>

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <CheckCircle2
              size={21}
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
              Payments completed
            </small>

          </div>

        </div>

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <Clock3
              size={21}
            />

          </div>

          <div>

            <span>
              Pending Expenses
            </span>

            <strong>
              {formatMoney(
                pendingExpenses
              )}
            </strong>

            <small>
              Payment pending
            </small>

          </div>

        </div>

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <ReceiptText
              size={21}
            />

          </div>

          <div>

            <span>
              Expense Records
            </span>

            <strong>
              {
                periodExpenses.length
              }
            </strong>

            <small>
              Recorded transactions
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          AVERAGE
      ====================================== */}

      <div className="expense-average-card">

        <div>

          <TrendingUp
            size={20}
          />

          <span>
            Average Expense
          </span>

        </div>

        <strong>
          {formatMoney(
            averageExpense
          )}
        </strong>

      </div>

      {/* =====================================
          CATEGORY + PAYMENT BREAKDOWN
      ====================================== */}

      <div className="report-two-column">

        {/* CATEGORY */}

        <div className="report-data-card">

          <div className="report-data-header">

            <div>

              <h3>
                Expense by Category
              </h3>

              <p>
                Where business money is
                being spent.
              </p>

            </div>

            <Tags
              size={18}
            />

          </div>

          {categoryBreakdown.length >
          0 ? (

            <div className="expense-breakdown-list">

              {categoryBreakdown.map(
                (category) => {

                  const percentage =
                    totalExpenses > 0
                      ? (
                          category.amount /
                          totalExpenses
                        ) *
                        100
                      : 0

                  return (
                    <div
                      key={
                        category.category
                      }
                      className="expense-breakdown-item"
                    >

                      <div className="expense-breakdown-top">

                        <div>

                          <strong>
                            {
                              category.category
                            }
                          </strong>

                          <small>
                            {
                              category.count
                            }
                            {' '}
                            {category.count ===
                            1
                              ? 'expense'
                              : 'expenses'}
                          </small>

                        </div>

                        <div className="expense-breakdown-value">

                          <strong>
                            {formatMoney(
                              category.amount
                            )}
                          </strong>

                          <small>
                            {percentage.toFixed(
                              1
                            )}
                            %
                          </small>

                        </div>

                      </div>

                      <div className="report-progress">

                        <div
                          className="report-progress-value"
                          style={{
                            width:
                              `${Math.min(
                                percentage,
                                100
                              )}%`,
                          }}
                        />

                      </div>

                    </div>
                  )
                }
              )}

            </div>

          ) : (

            <div className="report-empty-small">
              No expense categories
              available.
            </div>

          )}

        </div>

        {/* PAYMENT METHOD */}

        <div className="report-data-card">

          <div className="report-data-header">

            <div>

              <h3>
                Payment Methods
              </h3>

              <p>
                Expense value by payment
                method.
              </p>

            </div>

            <CreditCard
              size={18}
            />

          </div>

          {paymentBreakdown.length >
          0 ? (

            <div className="expense-payment-list">

              {paymentBreakdown.map(
                (payment) => {

                  const percentage =
                    totalExpenses > 0
                      ? (
                          payment.amount /
                          totalExpenses
                        ) *
                        100
                      : 0

                  return (
                    <div
                      key={
                        payment.method
                      }
                      className="expense-payment-item"
                    >

                      <div className="expense-payment-icon">

                        <CreditCard
                          size={17}
                        />

                      </div>

                      <div className="expense-payment-info">

                        <div>

                          <strong>
                            {
                              payment.method
                            }
                          </strong>

                          <small>
                            {
                              payment.count
                            }
                            {' '}
                            transactions
                          </small>

                        </div>

                        <div>

                          <strong>
                            {formatMoney(
                              payment.amount
                            )}
                          </strong>

                          <small>
                            {percentage.toFixed(
                              1
                            )}
                            %
                          </small>

                        </div>

                      </div>

                    </div>
                  )
                }
              )}

            </div>

          ) : (

            <div className="report-empty-small">
              No payment method data
              available.
            </div>

          )}

        </div>

      </div>

      {/* =====================================
          HIGHEST EXPENSES
      ====================================== */}

      <div className="report-data-card expense-highest-card">

        <div className="report-data-header">

          <div>

            <h3>
              Highest Expenses
            </h3>

            <p>
              Largest recorded expenses
              in the selected period.
            </p>

          </div>

        </div>

        {highestExpenses.length >
        0 ? (

          <div className="expense-highest-list">

            {highestExpenses.map(
              (
                expense,
                index
              ) => (

                <div
                  key={
                    expense.id
                  }
                  className="expense-highest-item"
                >

                  <div className="expense-highest-rank">

                    {index + 1}

                  </div>

                  <div className="expense-highest-main">

                    <div>

                      <strong>
                        {
                          expense.title
                        }
                      </strong>

                      <small>
                        {
                          expense.category
                        }
                        {' • '}
                        {formatDate(
                          expense.date
                        )}
                      </small>

                    </div>

                    <div className="expense-highest-amount">

                      <strong>
                        {formatMoney(
                          expense.amount
                        )}
                      </strong>

                      <span
                        className={
                          expense.status ===
                          'Paid'
                            ? 'expense-report-status paid'
                            : 'expense-report-status pending'
                        }
                      >
                        {
                          expense.status
                        }
                      </span>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="report-empty-small">
            No expenses available.
          </div>

        )}

      </div>

      {/* =====================================
          TRANSACTION HISTORY
      ====================================== */}

      <div className="report-data-card report-transactions-card">

        <div className="report-data-header report-transaction-header">

          <div>

            <h3>
              Expense Transactions
            </h3>

            <p>
              Detailed expense records
              for the selected period.
            </p>

          </div>

          <span className="report-record-count">

            {filteredExpenses.length}
            {' '}
            {filteredExpenses.length ===
            1
              ? 'record'
              : 'records'}

          </span>

        </div>

        {/* FILTERS */}

        <div className="expense-report-toolbar">

          <div className="report-search expense-report-search">

            <Search
              size={18}
            />

            <input
              type="text"
              placeholder="Search expense, vendor, reference..."
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <select
            className="expense-report-select"
            value={
              categoryFilter
            }
            onChange={(
              event
            ) =>
              setCategoryFilter(
                event.target.value
              )
            }
          >

            <option value="All">
              All Categories
            </option>

            {categories.map(
              (category) => (

                <option
                  key={
                    category
                  }
                  value={
                    category
                  }
                >
                  {category}
                </option>

              )
            )}

          </select>

          <select
            className="expense-report-select"
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              setStatusFilter(
                event.target
                  .value as StatusFilter
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

        {/* TABLE */}

        <div className="report-table-wrapper">

          <table className="report-table expense-report-table">

            <thead>

              <tr>

                <th>
                  Expense
                </th>

                <th>
                  Date
                </th>

                <th>
                  Title
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
                  Reference
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Status
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

                      <strong>
                        {
                          expense.expenseNumber
                        }
                      </strong>

                    </td>

                    <td>
                      {formatDate(
                        expense.date
                      )}
                    </td>

                    <td>

                      <strong>
                        {
                          expense.title
                        }
                      </strong>

                    </td>

                    <td>
                      {
                        expense.category
                      }
                    </td>

                    <td>
                      {
                        expense.vendor ||
                        '—'
                      }
                    </td>

                    <td>
                      {
                        expense.paymentMethod
                      }
                    </td>

                    <td>
                      {
                        expense.reference ||
                        '—'
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
                            ? 'expense-report-status paid'
                            : 'expense-report-status pending'
                        }
                      >

                        {
                          expense.status
                        }

                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {/* EMPTY */}

        {filteredExpenses.length ===
          0 && (

          <div className="report-empty">

            <Wallet
              size={40}
            />

            <h3>
              No expenses found
            </h3>

            <p>
              No expense records match
              the selected filters.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}