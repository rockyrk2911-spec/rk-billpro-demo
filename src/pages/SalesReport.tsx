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
  ReceiptText,
  ShoppingBag,
  Landmark,
  Search,
  Eye,
  TrendingUp,
} from 'lucide-react'

import {
  useSales,
} from '../context/SaleContext'

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

  const saleDate =
    new Date(dateString)

  if (
    Number.isNaN(
      saleDate.getTime()
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
      saleDate.getFullYear() ===
        now.getFullYear() &&
      saleDate.getMonth() ===
        now.getMonth() &&
      saleDate.getDate() ===
        now.getDate()
    )
  }

  const millisecondsPerDay =
    24 * 60 * 60 * 1000

  const days =
    dateFilter === '7 Days'
      ? 7
      : 30

  const startDate =
    new Date(
      now.getTime() -
        (days - 1) *
          millisecondsPerDay
    )

  startDate.setHours(
    0,
    0,
    0,
    0
  )

  return (
    saleDate >= startDate &&
    saleDate <= now
  )
}

/* =========================================
   SALES REPORT
========================================= */

export default function SalesReport() {
  const navigate =
    useNavigate()

  const {
    sales,
  } = useSales()

  const [
    dateFilter,
    setDateFilter,
  ] =
    useState<DateFilter>(
      'All'
    )

  const [
    search,
    setSearch,
  ] =
    useState('')

  /* =========================================
     FILTER SALES
  ========================================= */

  const filteredSales =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase()

      return sales.filter(
        (sale) => {
          const matchesDate =
            matchesDateFilter(
              sale.date,
              dateFilter
            )

          const matchesSearch =
            searchText === '' ||
            sale.invoiceNumber
              .toLowerCase()
              .includes(
                searchText
              ) ||
            sale.customer
              .toLowerCase()
              .includes(
                searchText
              )

          return (
            matchesDate &&
            matchesSearch
          )
        }
      )
    }, [
      sales,
      dateFilter,
      search,
    ])

  /* =========================================
     KPI
  ========================================= */

  const totalRevenue =
    filteredSales.reduce(
      (
        total,
        sale
      ) =>
        total +
        sale.grandTotal,
      0
    )

  const totalBills =
    filteredSales.length

  const totalItemsSold =
    filteredSales.reduce(
      (
        total,
        sale
      ) =>
        total +
        sale.items.reduce(
          (
            itemTotal,
            item
          ) =>
            itemTotal +
            item.quantity,
          0
        ),
      0
    )

  const totalGST =
    filteredSales.reduce(
      (
        total,
        sale
      ) =>
        total +
        sale.taxAmount,
      0
    )

  const averageBill =
    totalBills > 0
      ? totalRevenue /
        totalBills
      : 0

  /* =========================================
     PAYMENT BREAKDOWN
  ========================================= */

  const paymentBreakdown =
    useMemo(() => {
      const methods = [
        'Cash',
        'UPI',
        'Card',
      ] as const

      return methods.map(
        (method) => {
          const methodSales =
            filteredSales.filter(
              (sale) =>
                sale.paymentMethod ===
                method
            )

          const amount =
            methodSales.reduce(
              (
                total,
                sale
              ) =>
                total +
                sale.grandTotal,
              0
            )

          return {
            method,
            bills:
              methodSales.length,
            amount,
          }
        }
      )
    }, [
      filteredSales,
    ])

  /* =========================================
     TOP PRODUCTS
  ========================================= */

  const topProducts =
    useMemo(() => {
      const productMap =
        new Map<
          number,
          {
            id: number
            name: string
            quantity: number
            revenue: number
          }
        >()

      filteredSales.forEach(
        (sale) => {
          sale.items.forEach(
            (item) => {
              const existing =
                productMap.get(
                  item.productId
                )

              if (existing) {
                existing.quantity +=
                  item.quantity

                existing.revenue +=
                  item.total
              } else {
                productMap.set(
                  item.productId,
                  {
                    id:
                      item.productId,

                    name:
                      item.name,

                    quantity:
                      item.quantity,

                    revenue:
                      item.total,
                  }
                )
              }
            }
          )
        }
      )

      return Array.from(
        productMap.values()
      )
        .sort(
          (a, b) =>
            b.quantity -
            a.quantity
        )
        .slice(0, 5)
    }, [
      filteredSales,
    ])

  /* =========================================
     FORMATTERS
  ========================================= */

  function formatMoney(
    value: number
  ) {
    return new Intl.NumberFormat(
      'en-IN',
      {
        style:
          'currency',
        currency:
          'INR',
        minimumFractionDigits:
          2,
      }
    ).format(value)
  }

  function formatDate(
    date: string
  ) {
    const parsed =
      new Date(date)

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return 'Invalid date'
    }

    return new Intl.DateTimeFormat(
      'en-IN',
      {
        dateStyle:
          'medium',
        timeStyle:
          'short',
      }
    ).format(parsed)
  }

  return (
    <div className="detailed-report-page">

      {/* HEADER */}

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
              Sales Report
            </h1>

            <p>
              Analyse sales revenue,
              bills, products and
              payment methods.
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

      {/* KPI */}

      <div className="report-kpi-grid">

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <IndianRupee
              size={21}
            />

          </div>

          <div>

            <span>
              Revenue
            </span>

            <strong>
              {formatMoney(
                totalRevenue
              )}
            </strong>

            <small>
              Filtered sales
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
              Bills
            </span>

            <strong>
              {totalBills}
            </strong>

            <small>
              Completed invoices
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
              Items Sold
            </span>

            <strong>
              {totalItemsSold}
            </strong>

            <small>
              Product quantity
            </small>

          </div>

        </div>

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <Landmark
              size={21}
            />

          </div>

          <div>

            <span>
              GST Collected
            </span>

            <strong>
              {formatMoney(
                totalGST
              )}
            </strong>

            <small>
              Recorded sale tax
            </small>

          </div>

        </div>

      </div>

      {/* AVERAGE */}

      <div className="report-average-card">

        <div>

          <TrendingUp
            size={21}
          />

          <span>
            Average Bill Value
          </span>

        </div>

        <strong>
          {formatMoney(
            averageBill
          )}
        </strong>

      </div>

      {/* TWO COLUMNS */}

      <div className="report-two-column">

        {/* PAYMENT */}

        <div className="report-data-card">

          <div className="report-data-header">

            <div>

              <h3>
                Payment Breakdown
              </h3>

              <p>
                Sales by payment
                method.
              </p>

            </div>

          </div>

          <div className="payment-report-list">

            {paymentBreakdown.map(
              (payment) => {
                const percentage =
                  totalRevenue > 0
                    ? (
                        payment.amount /
                        totalRevenue
                      ) *
                      100
                    : 0

                return (
                  <div
                    key={
                      payment.method
                    }
                    className="payment-report-item"
                  >

                    <div className="payment-report-top">

                      <div>

                        <strong>
                          {
                            payment.method
                          }
                        </strong>

                        <small>
                          {payment.bills}
                          {' '}
                          bills
                        </small>

                      </div>

                      <div className="payment-report-amount">

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

        </div>

        {/* TOP PRODUCTS */}

        <div className="report-data-card">

          <div className="report-data-header">

            <div>

              <h3>
                Top Selling Products
              </h3>

              <p>
                Ranked by quantity
                sold.
              </p>

            </div>

          </div>

          {topProducts.length >
          0 ? (

            <div className="top-product-report-list">

              {topProducts.map(
                (
                  product,
                  index
                ) => (

                  <div
                    key={
                      product.id
                    }
                    className="top-product-report-item"
                  >

                    <span className="top-product-rank">
                      {index + 1}
                    </span>

                    <div>

                      <strong>
                        {
                          product.name
                        }
                      </strong>

                      <small>
                        {
                          product.quantity
                        }
                        {' '}
                        units sold
                      </small>

                    </div>

                    <strong className="top-product-revenue">

                      {formatMoney(
                        product.revenue
                      )}

                    </strong>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="report-empty-small">

              No product sales
              available.

            </div>

          )}

        </div>

      </div>

      {/* TRANSACTIONS */}

      <div className="report-data-card report-transactions-card">

        <div className="report-data-header report-transaction-header">

          <div>

            <h3>
              Sales Transactions
            </h3>

            <p>
              Invoices included in
              this report.
            </p>

          </div>

          <span className="report-record-count">

            {filteredSales.length}
            {' '}
            records

          </span>

        </div>

        <div className="report-search">

          <Search
            size={18}
          />

          <input
            type="text"
            placeholder="Search invoice or customer..."
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

        <div className="report-table-wrapper">

          <table className="report-table">

            <thead>

              <tr>

                <th>
                  Invoice
                </th>

                <th>
                  Date
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Items
                </th>

                <th>
                  Payment
                </th>

                <th>
                  GST
                </th>

                <th>
                  Total
                </th>

                <th>
                  View
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredSales.map(
                (sale) => {
                  const itemCount =
                    sale.items.reduce(
                      (
                        total,
                        item
                      ) =>
                        total +
                        item.quantity,
                      0
                    )

                  return (
                    <tr
                      key={
                        sale.id
                      }
                    >

                      <td>

                        <strong>
                          {
                            sale.invoiceNumber
                          }
                        </strong>

                      </td>

                      <td>

                        {formatDate(
                          sale.date
                        )}

                      </td>

                      <td>
                        {sale.customer}
                      </td>

                      <td>
                        {itemCount}
                      </td>

                      <td>

                        <span className="payment-badge">

                          {
                            sale.paymentMethod
                          }

                        </span>

                      </td>

                      <td>

                        {formatMoney(
                          sale.taxAmount
                        )}

                      </td>

                      <td>

                        <strong>

                          {formatMoney(
                            sale.grandTotal
                          )}

                        </strong>

                      </td>

                      <td>

                        <button
                          type="button"
                          className="view-invoice-button"
                          title="View invoice"
                          onClick={() =>
                            navigate(
                              `/invoice/${sale.id}`
                            )
                          }
                        >

                          <Eye
                            size={16}
                          />

                        </button>

                      </td>

                    </tr>
                  )
                }
              )}

            </tbody>

          </table>

        </div>

        {filteredSales.length ===
          0 && (

          <div className="report-empty">

            <ReceiptText
              size={40}
            />

            <h3>
              No sales found
            </h3>

            <p>
              No transactions match
              the selected report
              filters.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}