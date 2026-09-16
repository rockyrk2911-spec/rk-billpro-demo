import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  ShoppingCart,
  IndianRupee,
  PackagePlus,
  ReceiptText,
  Search,
  Truck,
} from 'lucide-react'

import {
  usePurchases,
} from '../context/PurchaseContext'

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

  const purchaseDate =
    new Date(dateString)

  if (
    Number.isNaN(
      purchaseDate.getTime()
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
      purchaseDate.getFullYear() ===
        now.getFullYear() &&
      purchaseDate.getMonth() ===
        now.getMonth() &&
      purchaseDate.getDate() ===
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
    purchaseDate >=
      startDate &&
    purchaseDate <=
      now
  )
}

/* =========================================
   PURCHASE REPORT
========================================= */

export default function PurchaseReport() {
  const navigate =
    useNavigate()

  const {
    purchases,
  } = usePurchases()

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
     FILTER PURCHASES
  ========================================= */

  const filteredPurchases =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase()

      return purchases.filter(
        (purchase) => {
          const matchesDate =
            matchesDateFilter(
              purchase.date,
              dateFilter
            )

          const matchesSearch =
            searchText === '' ||
            purchase.purchaseNumber
              .toLowerCase()
              .includes(
                searchText
              ) ||
            purchase.supplier
              .toLowerCase()
              .includes(
                searchText
              ) ||
            purchase.supplierInvoice
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
      purchases,
      dateFilter,
      search,
    ])

  /* =========================================
     TOTAL PURCHASE VALUE
  ========================================= */

  const totalPurchaseValue =
    filteredPurchases.reduce(
      (
        total,
        purchase
      ) =>
        total +
        purchase.grandTotal,
      0
    )

  /* =========================================
     TOTAL PURCHASE RECORDS
  ========================================= */

  const totalPurchaseRecords =
    filteredPurchases.length

  /* =========================================
     TOTAL QUANTITY PURCHASED
  ========================================= */

  const totalQuantity =
    filteredPurchases.reduce(
      (
        total,
        purchase
      ) =>
        total +
        purchase.items.reduce(
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

  /* =========================================
     TOTAL PURCHASE GST
  ========================================= */

  const totalGST =
    filteredPurchases.reduce(
      (
        total,
        purchase
      ) =>
        total +
        purchase.taxAmount,
      0
    )

  /* =========================================
     AVERAGE PURCHASE
  ========================================= */

  const averagePurchase =
    totalPurchaseRecords > 0
      ? totalPurchaseValue /
        totalPurchaseRecords
      : 0

  /* =========================================
     SUPPLIER BREAKDOWN
  ========================================= */

  const supplierBreakdown =
    useMemo(() => {
      const supplierMap =
        new Map<
          string,
          {
            name: string
            purchases: number
            amount: number
          }
        >()

      filteredPurchases.forEach(
        (purchase) => {
          const key =
            purchase.supplier

          const existing =
            supplierMap.get(key)

          if (existing) {
            existing.purchases +=
              1

            existing.amount +=
              purchase.grandTotal
          } else {
            supplierMap.set(
              key,
              {
                name:
                  purchase.supplier,

                purchases: 1,

                amount:
                  purchase.grandTotal,
              }
            )
          }
        }
      )

      return Array.from(
        supplierMap.values()
      ).sort(
        (a, b) =>
          b.amount -
          a.amount
      )
    }, [
      filteredPurchases,
    ])

  /* =========================================
     TOP PURCHASED PRODUCTS
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
            amount: number
          }
        >()

      filteredPurchases.forEach(
        (purchase) => {
          purchase.items.forEach(
            (item) => {
              const existing =
                productMap.get(
                  item.productId
                )

              if (existing) {
                existing.quantity +=
                  item.quantity

                existing.amount +=
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

                    amount:
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
      filteredPurchases,
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

  /* =========================================
     FORMAT DATE
  ========================================= */

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
    ).format(parsedDate)
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
              Purchase Report
            </h1>

            <p>
              Analyse supplier
              purchases, stock additions
              and purchase tax.
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
          KPI CARDS
      ====================================== */}

      <div className="report-kpi-grid">

        {/* PURCHASE VALUE */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <IndianRupee
              size={21}
            />

          </div>

          <div>

            <span>
              Purchase Value
            </span>

            <strong>
              {formatMoney(
                totalPurchaseValue
              )}
            </strong>

            <small>
              Filtered purchases
            </small>

          </div>

        </div>

        {/* PURCHASE RECORDS */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <ShoppingCart
              size={21}
            />

          </div>

          <div>

            <span>
              Purchases
            </span>

            <strong>
              {
                totalPurchaseRecords
              }
            </strong>

            <small>
              Purchase records
            </small>

          </div>

        </div>

        {/* QUANTITY */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <PackagePlus
              size={21}
            />

          </div>

          <div>

            <span>
              Quantity Added
            </span>

            <strong>
              {totalQuantity}
            </strong>

            <small>
              Purchased units
            </small>

          </div>

        </div>

        {/* GST */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <ReceiptText
              size={21}
            />

          </div>

          <div>

            <span>
              Purchase GST
            </span>

            <strong>
              {formatMoney(
                totalGST
              )}
            </strong>

            <small>
              Recorded purchase tax
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          AVERAGE PURCHASE
      ====================================== */}

      <div className="report-average-card">

        <div>

          <ShoppingCart
            size={21}
          />

          <span>
            Average Purchase Value
          </span>

        </div>

        <strong>
          {formatMoney(
            averagePurchase
          )}
        </strong>

      </div>

      {/* =====================================
          SUPPLIER + PRODUCT ANALYSIS
      ====================================== */}

      <div className="report-two-column">

        {/* ===================================
            SUPPLIER BREAKDOWN
        ==================================== */}

        <div className="report-data-card">

          <div className="report-data-header">

            <div>

              <h3>
                Supplier Breakdown
              </h3>

              <p>
                Purchase value by
                supplier.
              </p>

            </div>

          </div>

          {supplierBreakdown.length >
          0 ? (

            <div className="supplier-report-list">

              {supplierBreakdown
                .slice(0, 5)
                .map(
                  (supplier) => {
                    const percentage =
                      totalPurchaseValue >
                      0
                        ? (
                            supplier.amount /
                            totalPurchaseValue
                          ) *
                          100
                        : 0

                    return (
                      <div
                        key={
                          supplier.name
                        }
                        className="supplier-report-item"
                      >

                        <div className="supplier-report-main">

                          <div className="supplier-report-rank">

                            <Truck
                              size={16}
                            />

                          </div>

                          <div>

                            <strong>
                              {
                                supplier.name
                              }
                            </strong>

                            <small>
                              {
                                supplier.purchases
                              }
                              {' '}
                              {supplier.purchases ===
                              1
                                ? 'purchase'
                                : 'purchases'}
                            </small>

                          </div>

                          <div className="supplier-report-amount">

                            <strong>
                              {formatMoney(
                                supplier.amount
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

              No supplier purchases
              available.

            </div>

          )}

        </div>

        {/* ===================================
            TOP PURCHASED PRODUCTS
        ==================================== */}

        <div className="report-data-card">

          <div className="report-data-header">

            <div>

              <h3>
                Top Purchased Products
              </h3>

              <p>
                Ranked by purchased
                quantity.
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
                        units purchased
                      </small>

                    </div>

                    <strong className="top-product-revenue">

                      {formatMoney(
                        product.amount
                      )}

                    </strong>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="report-empty-small">

              No purchased products
              available.

            </div>

          )}

        </div>

      </div>

      {/* =====================================
          PURCHASE TRANSACTIONS
      ====================================== */}

      <div className="report-data-card report-transactions-card">

        <div className="report-data-header report-transaction-header">

          <div>

            <h3>
              Purchase Transactions
            </h3>

            <p>
              Purchase records included
              in this report.
            </p>

          </div>

          <span className="report-record-count">

            {filteredPurchases.length}
            {' '}
            {filteredPurchases.length ===
            1
              ? 'record'
              : 'records'}

          </span>

        </div>

        {/* ===================================
            SEARCH
        ==================================== */}

        <div className="report-search">

          <Search
            size={18}
          />

          <input
            type="text"
            placeholder="Search purchase, supplier or invoice..."
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

        {/* ===================================
            TABLE
        ==================================== */}

        <div className="report-table-wrapper">

          <table className="report-table purchase-report-table">

            <thead>

              <tr>

                <th>
                  Purchase
                </th>

                <th>
                  Date
                </th>

                <th>
                  Supplier
                </th>

                <th>
                  Supplier Invoice
                </th>

                <th>
                  Qty
                </th>

                <th>
                  GST
                </th>

                <th>
                  Total
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPurchases.map(
                (purchase) => {
                  const quantity =
                    purchase.items.reduce(
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
                        purchase.id
                      }
                    >

                      {/* PURCHASE NUMBER */}

                      <td>

                        <strong>
                          {
                            purchase.purchaseNumber
                          }
                        </strong>

                      </td>

                      {/* DATE */}

                      <td>

                        {formatDate(
                          purchase.date
                        )}

                      </td>

                      {/* SUPPLIER */}

                      <td>

                        {
                          purchase.supplier
                        }

                      </td>

                      {/* SUPPLIER INVOICE */}

                      <td>

                        {
                          purchase.supplierInvoice ||
                          '—'
                        }

                      </td>

                      {/* QUANTITY */}

                      <td>

                        {quantity}

                      </td>

                      {/* GST */}

                      <td>

                        {formatMoney(
                          purchase.taxAmount
                        )}

                      </td>

                      {/* TOTAL */}

                      <td>

                        <strong>

                          {formatMoney(
                            purchase.grandTotal
                          )}

                        </strong>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            purchase.status ===
                            'Completed'
                              ? 'purchase-report-status completed'
                              : 'purchase-report-status pending'
                          }
                        >

                          {
                            purchase.status
                          }

                        </span>

                      </td>

                    </tr>
                  )
                }
              )}

            </tbody>

          </table>

        </div>

        {/* ===================================
            EMPTY STATE
        ==================================== */}

        {filteredPurchases.length ===
          0 && (

          <div className="report-empty">

            <ShoppingCart
              size={40}
            />

            <h3>
              No purchases found
            </h3>

            <p>
              No purchase records match
              the selected report
              filters.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}