import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react'

import {
  useSales,
} from '../context/SaleContext'

import {
  useProducts,
} from '../context/ProductContext'

import {
  useExpenses,
} from '../context/ExpenseContext'

type DateFilter =
  | 'All'
  | 'Today'
  | '7 Days'
  | '30 Days'

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

  const recordDate =
    new Date(dateString)

  if (
    Number.isNaN(
      recordDate.getTime()
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
      recordDate.getFullYear() ===
        now.getFullYear() &&
      recordDate.getMonth() ===
        now.getMonth() &&
      recordDate.getDate() ===
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
    recordDate >=
      startDate &&
    recordDate <=
      now
  )
}

/* =========================================
   PROFIT & LOSS REPORT
========================================= */

export default function ProfitLossReport() {
  const navigate =
    useNavigate()

  const {
    sales,
  } = useSales()

  const {
    products,
  } = useProducts()

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

  /* =========================================
     FILTER SALES
  ========================================= */

  const filteredSales =
    useMemo(
      () =>
        sales.filter(
          (sale) =>
            matchesDateFilter(
              sale.date,
              dateFilter
            )
        ),
      [
        sales,
        dateFilter,
      ]
    )

  /* =========================================
     FILTER PAID EXPENSES
  ========================================= */

  const filteredExpenses =
    useMemo(
      () =>
        expenses.filter(
          (expense) =>
            expense.status ===
              'Paid' &&
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
     SALES REVENUE
  ========================================= */

  const salesRevenue =
    filteredSales.reduce(
      (
        total,
        sale
      ) =>
        total +
        sale.grandTotal,
      0
    )

  /* =========================================
     TAX
  ========================================= */

  const salesTax =
    filteredSales.reduce(
      (
        total,
        sale
      ) =>
        total +
        sale.taxAmount,
      0
    )

  /*
    Revenue before recorded sale tax.

    This gives us a cleaner base
    for the demo gross-profit
    calculation.
  */

  const revenueBeforeTax =
    Math.max(
      salesRevenue -
        salesTax,
      0
    )

  /* =========================================
     ESTIMATED COGS
  ========================================= */

  /*
    IMPORTANT:

    Current SaleItem does not store
    historical purchase/cost price.

    Therefore this demo estimates
    COGS using each product's current
    purchasePrice.

    Production version should store
    costPrice inside SaleItem when
    the bill is completed.
  */

  const estimatedCOGS =
    useMemo(() => {
      return filteredSales.reduce(
        (
          saleTotal,
          sale
        ) => {
          const saleCost =
            sale.items.reduce(
              (
                itemTotal,
                item
              ) => {
                const product =
                  products.find(
                    (
                      currentProduct
                    ) =>
                      currentProduct.id ===
                      item.productId
                  )

                const costPrice =
                  product?.purchasePrice ??
                  0

                return (
                  itemTotal +
                  costPrice *
                    item.quantity
                )
              },
              0
            )

          return (
            saleTotal +
            saleCost
          )
        },
        0
      )
    }, [
      filteredSales,
      products,
    ])

  /* =========================================
     GROSS PROFIT
  ========================================= */

  const grossProfit =
    revenueBeforeTax -
    estimatedCOGS

  /* =========================================
     OPERATING EXPENSES
  ========================================= */

  const operatingExpenses =
    filteredExpenses.reduce(
      (
        total,
        expense
      ) =>
        total +
        expense.amount,
      0
    )

  /* =========================================
     NET PROFIT
  ========================================= */

  const netProfit =
    grossProfit -
    operatingExpenses

  /* =========================================
     MARGINS
  ========================================= */

  const grossMargin =
    revenueBeforeTax > 0
      ? (
          grossProfit /
          revenueBeforeTax
        ) *
        100
      : 0

  const netMargin =
    revenueBeforeTax > 0
      ? (
          netProfit /
          revenueBeforeTax
        ) *
        100
      : 0

  /* =========================================
     EXPENSE BREAKDOWN
  ========================================= */

  const expenseBreakdown =
    useMemo(() => {
      const map =
        new Map<
          string,
          number
        >()

      filteredExpenses.forEach(
        (expense) => {
          const current =
            map.get(
              expense.category
            ) ?? 0

          map.set(
            expense.category,
            current +
              expense.amount
          )
        }
      )

      return Array.from(
        map.entries()
      )
        .map(
          ([
            category,
            amount,
          ]) => ({
            category,
            amount,
          })
        )
        .sort(
          (a, b) =>
            b.amount -
            a.amount
        )
    }, [
      filteredExpenses,
    ])

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
              Profit &amp; Loss
            </h1>

            <p>
              Analyse estimated gross
              profit, operating expenses
              and net profit.
            </p>

          </div>

        </div>

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

      </div>

      {/* =====================================
          IMPORTANT NOTE
      ====================================== */}

      <div className="pnl-estimate-note">

        <AlertCircle
          size={18}
        />

        <div>

          <strong>
            Demo estimated profit
          </strong>

          <p>
            Historical sale items do not
            currently store their cost
            price. COGS is therefore
            estimated using each
            product&apos;s current purchase
            price.
          </p>

        </div>

      </div>

      {/* =====================================
          KPI
      ====================================== */}

      <div className="report-kpi-grid">

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <IndianRupee
              size={21}
            />

          </div>

          <div>

            <span>
              Revenue Before Tax
            </span>

            <strong>
              {formatMoney(
                revenueBeforeTax
              )}
            </strong>

            <small>
              Sales excluding recorded GST
            </small>

          </div>

        </div>

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <ShoppingBag
              size={21}
            />

          </div>

          <div>

            <span>
              Estimated COGS
            </span>

            <strong>
              {formatMoney(
                estimatedCOGS
              )}
            </strong>

            <small>
              Estimated product cost
            </small>

          </div>

        </div>

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <TrendingUp
              size={21}
            />

          </div>

          <div>

            <span>
              Gross Profit
            </span>

            <strong>
              {formatMoney(
                grossProfit
              )}
            </strong>

            <small>
              Margin{' '}
              {grossMargin.toFixed(
                1
              )}
              %
            </small>

          </div>

        </div>

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <Wallet
              size={21}
            />

          </div>

          <div>

            <span>
              Paid Expenses
            </span>

            <strong>
              {formatMoney(
                operatingExpenses
              )}
            </strong>

            <small>
              Operating costs
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          NET PROFIT
      ====================================== */}

      <div
        className={
          netProfit >= 0
            ? 'pnl-net-card profit'
            : 'pnl-net-card loss'
        }
      >

        <div className="pnl-net-left">

          {netProfit >= 0 ? (

            <TrendingUp
              size={27}
            />

          ) : (

            <TrendingDown
              size={27}
            />

          )}

          <div>

            <span>
              Estimated Net{' '}
              {netProfit >= 0
                ? 'Profit'
                : 'Loss'}
            </span>

            <strong>
              {formatMoney(
                netProfit
              )}
            </strong>

          </div>

        </div>

        <div className="pnl-margin">

          <span>
            Net Margin
          </span>

          <strong>
            {netMargin.toFixed(
              1
            )}
            %
          </strong>

        </div>

      </div>

      {/* =====================================
          P&L STATEMENT
      ====================================== */}

      <div className="report-two-column">

        <div className="report-data-card">

          <div className="report-data-header">

            <h3>
              Profit &amp; Loss Statement
            </h3>

            <p>
              Simplified demo calculation.
            </p>

          </div>

          <div className="pnl-statement">

            <div className="pnl-line">

              <span>
                Total Sales
              </span>

              <strong>
                {formatMoney(
                  salesRevenue
                )}
              </strong>

            </div>

            <div className="pnl-line">

              <span>
                Less: Recorded GST
              </span>

              <strong>
                - {formatMoney(
                  salesTax
                )}
              </strong>

            </div>

            <div className="pnl-line pnl-subtotal">

              <span>
                Revenue Before Tax
              </span>

              <strong>
                {formatMoney(
                  revenueBeforeTax
                )}
              </strong>

            </div>

            <div className="pnl-line">

              <span>
                Less: Estimated COGS
              </span>

              <strong>
                - {formatMoney(
                  estimatedCOGS
                )}
              </strong>

            </div>

            <div className="pnl-line pnl-subtotal">

              <span>
                Gross Profit
              </span>

              <strong>
                {formatMoney(
                  grossProfit
                )}
              </strong>

            </div>

            <div className="pnl-line">

              <span>
                Less: Paid Operating Expenses
              </span>

              <strong>
                - {formatMoney(
                  operatingExpenses
                )}
              </strong>

            </div>

            <div className="pnl-line pnl-final">

              <span>
                Estimated Net Profit
              </span>

              <strong>
                {formatMoney(
                  netProfit
                )}
              </strong>

            </div>

          </div>

        </div>

        {/* =================================
            EXPENSE BREAKDOWN
        ================================== */}

        <div className="report-data-card">

          <div className="report-data-header">

            <h3>
              Expense Breakdown
            </h3>

            <p>
              Paid operating expenses
              by category.
            </p>

          </div>

          {expenseBreakdown.length >
          0 ? (

            <div className="pnl-expense-list">

              {expenseBreakdown.map(
                (expense) => {

                  const percentage =
                    operatingExpenses >
                    0
                      ? (
                          expense.amount /
                          operatingExpenses
                        ) *
                        100
                      : 0

                  return (
                    <div
                      key={
                        expense.category
                      }
                      className="pnl-expense-item"
                    >

                      <div className="pnl-expense-top">

                        <div>

                          <strong>
                            {
                              expense.category
                            }
                          </strong>

                          <small>
                            {percentage.toFixed(
                              1
                            )}
                            % of expenses
                          </small>

                        </div>

                        <strong>
                          {formatMoney(
                            expense.amount
                          )}
                        </strong>

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
              No paid expenses available
              for this period.
            </div>

          )}

        </div>

      </div>

    </div>
  )
}