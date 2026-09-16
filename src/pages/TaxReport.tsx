import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  ReceiptText,
  TrendingUp,
  TrendingDown,
  Scale,
  AlertCircle,
  ShoppingCart,
  ShoppingBag,
} from 'lucide-react'

import {
  useSales,
} from '../context/SaleContext'

import {
  usePurchases,
} from '../context/PurchaseContext'

type DateFilter =
  | 'All'
  | 'Today'
  | '7 Days'
  | '30 Days'

type TaxRateRow = {
  rate: number
  salesTax: number
  purchaseTax: number
  salesValue: number
  purchaseValue: number
}

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
   TAX REPORT
========================================= */

export default function TaxReport() {
  const navigate =
    useNavigate()

  const {
    sales,
  } = useSales()

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
     FILTER PURCHASES
  ========================================= */

  const filteredPurchases =
    useMemo(
      () =>
        purchases.filter(
          (purchase) =>
            matchesDateFilter(
              purchase.date,
              dateFilter
            )
        ),
      [
        purchases,
        dateFilter,
      ]
    )

  /* =========================================
     SALES TOTAL
  ========================================= */

  const totalSalesValue =
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
     OUTPUT GST
  ========================================= */

  const outputGST =
    filteredSales.reduce(
      (
        total,
        sale
      ) =>
        total +
        sale.taxAmount,
      0
    )

  /* =========================================
     PURCHASE TOTAL
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
     INPUT GST
  ========================================= */

  const inputGST =
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
     ESTIMATED NET GST
  ========================================= */

  const estimatedNetGST =
    outputGST -
    inputGST

  /* =========================================
     TAXABLE VALUES
  ========================================= */

  const salesBeforeTax =
    Math.max(
      totalSalesValue -
        outputGST,
      0
    )

  const purchasesBeforeTax =
    Math.max(
      totalPurchaseValue -
        inputGST,
      0
    )

  /* =========================================
     GST RATE BREAKDOWN
  ========================================= */

  const taxRateBreakdown =
    useMemo(() => {
      const taxMap =
        new Map<
          number,
          TaxRateRow
        >()

      function getRow(
        rate: number
      ) {
        const existing =
          taxMap.get(rate)

        if (existing) {
          return existing
        }

        const newRow: TaxRateRow = {
          rate,
          salesTax: 0,
          purchaseTax: 0,
          salesValue: 0,
          purchaseValue: 0,
        }

        taxMap.set(
          rate,
          newRow
        )

        return newRow
      }

      /* ======================================
         SALES ITEMS
      ====================================== */

      filteredSales.forEach(
        (sale) => {
          sale.items.forEach(
            (item) => {
              const rate =
                Number(
                  item.gst
                ) || 0

              const row =
                getRow(rate)

              /*
                Current SaleItem total is
                used as the recorded item
                value.

                To avoid claiming an exact
                tax split that may not match
                historical rounding/discount
                rules, we calculate this
                rate breakdown as an estimate.
              */

              const grossValue =
                item.total

              const tax =
                rate > 0
                  ? grossValue -
                    grossValue /
                      (
                        1 +
                        rate /
                          100
                      )
                  : 0

              row.salesValue +=
                Math.max(
                  grossValue -
                    tax,
                  0
                )

              row.salesTax +=
                tax
            }
          )
        }
      )

      /* ======================================
         PURCHASE ITEMS
      ====================================== */

      filteredPurchases.forEach(
        (purchase) => {
          purchase.items.forEach(
            (item) => {
              const rate =
                Number(
                  item.gst
                ) || 0

              const row =
                getRow(rate)

              /*
                PurchaseItem already stores
                taxAmount, so use that
                recorded value directly.
              */

              row.purchaseTax +=
                item.taxAmount

              row.purchaseValue +=
                item.subtotal
            }
          )
        }
      )

      return Array.from(
        taxMap.values()
      ).sort(
        (a, b) =>
          a.rate -
          b.rate
      )
    }, [
      filteredSales,
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
              GST / Tax Report
            </h1>

            <p>
              Review recorded sales GST,
              purchase GST and an estimated
              net GST position.
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
          NOTICE
      ====================================== */}

      <div className="tax-demo-note">

        <AlertCircle
          size={19}
        />

        <div>

          <strong>
            Demo GST summary
          </strong>

          <p>
            This page summarises GST stored
            in the demo transactions. The net
            GST figure is an estimate and is
            not a GST return or filing
            calculation.
          </p>

        </div>

      </div>

      {/* =====================================
          KPI
      ====================================== */}

      <div className="report-kpi-grid">

        {/* OUTPUT GST */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <TrendingUp
              size={21}
            />

          </div>

          <div>

            <span>
              Output GST
            </span>

            <strong>
              {formatMoney(
                outputGST
              )}
            </strong>

            <small>
              Recorded sales tax
            </small>

          </div>

        </div>

        {/* INPUT GST */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <TrendingDown
              size={21}
            />

          </div>

          <div>

            <span>
              Input GST
            </span>

            <strong>
              {formatMoney(
                inputGST
              )}
            </strong>

            <small>
              Recorded purchase tax
            </small>

          </div>

        </div>

        {/* SALES */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <ShoppingBag
              size={21}
            />

          </div>

          <div>

            <span>
              Sales Before Tax
            </span>

            <strong>
              {formatMoney(
                salesBeforeTax
              )}
            </strong>

            <small>
              Based on recorded totals
            </small>

          </div>

        </div>

        {/* PURCHASES */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <ShoppingCart
              size={21}
            />

          </div>

          <div>

            <span>
              Purchases Before Tax
            </span>

            <strong>
              {formatMoney(
                purchasesBeforeTax
              )}
            </strong>

            <small>
              Based on recorded totals
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          NET GST
      ====================================== */}

      <div
        className={
          estimatedNetGST >= 0
            ? 'tax-net-card payable'
            : 'tax-net-card credit'
        }
      >

        <div className="tax-net-main">

          <div className="tax-net-icon">

            <Scale
              size={24}
            />

          </div>

          <div>

            <span>
              {estimatedNetGST >= 0
                ? 'Estimated Net GST'
                : 'Estimated Input GST Excess'}
            </span>

            <strong>
              {formatMoney(
                Math.abs(
                  estimatedNetGST
                )
              )}
            </strong>

            <small>
              Output GST − Input GST
            </small>

          </div>

        </div>

        <div className="tax-net-equation">

          <div>

            <span>
              Output
            </span>

            <strong>
              {formatMoney(
                outputGST
              )}
            </strong>

          </div>

          <span>
            −
          </span>

          <div>

            <span>
              Input
            </span>

            <strong>
              {formatMoney(
                inputGST
              )}
            </strong>

          </div>

          <span>
            =
          </span>

          <div>

            <span>
              Estimate
            </span>

            <strong>
              {formatMoney(
                estimatedNetGST
              )}
            </strong>

          </div>

        </div>

      </div>

      {/* =====================================
          GST RATE BREAKDOWN
      ====================================== */}

      <div className="report-data-card tax-rate-card">

        <div className="report-data-header">

          <div>

            <h3>
              GST Rate Breakdown
            </h3>

            <p>
              Estimated sales tax breakdown
              and recorded purchase tax by
              GST rate.
            </p>

          </div>

        </div>

        <div className="report-table-wrapper">

          <table className="report-table tax-rate-table">

            <thead>

              <tr>

                <th>
                  GST Rate
                </th>

                <th>
                  Sales Value
                </th>

                <th>
                  Est. Sales GST
                </th>

                <th>
                  Purchase Value
                </th>

                <th>
                  Purchase GST
                </th>

                <th>
                  Difference
                </th>

              </tr>

            </thead>

            <tbody>

              {taxRateBreakdown.map(
                (row) => {

                  const difference =
                    row.salesTax -
                    row.purchaseTax

                  return (
                    <tr
                      key={
                        row.rate
                      }
                    >

                      <td>

                        <span className="tax-rate-badge">

                          {row.rate}%

                        </span>

                      </td>

                      <td>
                        {formatMoney(
                          row.salesValue
                        )}
                      </td>

                      <td>

                        <strong>
                          {formatMoney(
                            row.salesTax
                          )}
                        </strong>

                      </td>

                      <td>
                        {formatMoney(
                          row.purchaseValue
                        )}
                      </td>

                      <td>

                        <strong>
                          {formatMoney(
                            row.purchaseTax
                          )}
                        </strong>

                      </td>

                      <td>

                        <strong
                          className={
                            difference >= 0
                              ? 'tax-positive'
                              : 'tax-negative'
                          }
                        >
                          {formatMoney(
                            difference
                          )}
                        </strong>

                      </td>

                    </tr>
                  )
                }
              )}

            </tbody>

          </table>

        </div>

        {taxRateBreakdown.length ===
          0 && (

          <div className="report-empty">

            <ReceiptText
              size={40}
            />

            <h3>
              No GST data
            </h3>

            <p>
              There are no tax records for
              the selected period.
            </p>

          </div>

        )}

      </div>

      {/* =====================================
          SALES GST TRANSACTIONS
      ====================================== */}

      <div className="report-data-card tax-transactions-card">

        <div className="report-data-header report-transaction-header">

          <div>

            <h3>
              Sales GST Transactions
            </h3>

            <p>
              GST recorded on sales invoices.
            </p>

          </div>

          <span className="report-record-count">

            {filteredSales.length}
            {' '}
            {filteredSales.length === 1
              ? 'sale'
              : 'sales'}

          </span>

        </div>

        <div className="report-table-wrapper">

          <table className="report-table tax-transaction-table">

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
                  Total
                </th>

                <th>
                  GST
                </th>

                <th>
                  Before Tax
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredSales.map(
                (sale) => {

                  const beforeTax =
                    Math.max(
                      sale.grandTotal -
                        sale.taxAmount,
                      0
                    )

                  return (
                    <tr
                      key={
                        sale.id
                      }
                    >

                      <td>

                        <button
                          type="button"
                          className="tax-record-link"
                          onClick={() =>
                            navigate(
                              `/invoice/${sale.id}`
                            )
                          }
                        >
                          {
                            sale.invoiceNumber
                          }
                        </button>

                      </td>

                      <td>
                        {formatDate(
                          sale.date
                        )}
                      </td>

                      <td>
                        {
                          sale.customer
                        }
                      </td>

                      <td>

                        <strong>
                          {formatMoney(
                            sale.grandTotal
                          )}
                        </strong>

                      </td>

                      <td>
                        {formatMoney(
                          sale.taxAmount
                        )}
                      </td>

                      <td>
                        {formatMoney(
                          beforeTax
                        )}
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

          <div className="report-empty-small">
            No sales GST transactions
            available.
          </div>

        )}

      </div>

      {/* =====================================
          PURCHASE GST TRANSACTIONS
      ====================================== */}

      <div className="report-data-card tax-transactions-card">

        <div className="report-data-header report-transaction-header">

          <div>

            <h3>
              Purchase GST Transactions
            </h3>

            <p>
              GST recorded on supplier
              purchases.
            </p>

          </div>

          <span className="report-record-count">

            {filteredPurchases.length}
            {' '}
            {filteredPurchases.length === 1
              ? 'purchase'
              : 'purchases'}

          </span>

        </div>

        <div className="report-table-wrapper">

          <table className="report-table tax-transaction-table">

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
                  Total
                </th>

                <th>
                  GST
                </th>

                <th>
                  Before Tax
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPurchases.map(
                (purchase) => {

                  const beforeTax =
                    Math.max(
                      purchase.grandTotal -
                        purchase.taxAmount,
                      0
                    )

                  return (
                    <tr
                      key={
                        purchase.id
                      }
                    >

                      <td>

                        <strong>
                          {
                            purchase.purchaseNumber
                          }
                        </strong>

                      </td>

                      <td>
                        {formatDate(
                          purchase.date
                        )}
                      </td>

                      <td>
                        {
                          purchase.supplier
                        }
                      </td>

                      <td>
                        {
                          purchase.supplierInvoice ||
                          '—'
                        }
                      </td>

                      <td>

                        <strong>
                          {formatMoney(
                            purchase.grandTotal
                          )}
                        </strong>

                      </td>

                      <td>
                        {formatMoney(
                          purchase.taxAmount
                        )}
                      </td>

                      <td>
                        {formatMoney(
                          beforeTax
                        )}
                      </td>

                    </tr>
                  )
                }
              )}

            </tbody>

          </table>

        </div>

        {filteredPurchases.length ===
          0 && (

          <div className="report-empty-small">
            No purchase GST transactions
            available.
          </div>

        )}

      </div>

    </div>
  )
}