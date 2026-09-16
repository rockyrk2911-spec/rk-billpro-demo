import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Truck,
  UserCheck,
  IndianRupee,
  ReceiptText,
  Search,
  Crown,
  TrendingUp,
  Eye,
  UserPlus,
  PackagePlus,
} from 'lucide-react'

import {
  useSuppliers,
} from '../context/SupplierContext'

import {
  usePurchases,
} from '../context/PurchaseContext'

type DateFilter =
  | 'All'
  | 'Today'
  | '7 Days'
  | '30 Days'

type StatusFilter =
  | 'All'
  | 'Active'
  | 'Inactive'

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
   SUPPLIER REPORT
========================================= */

export default function SupplierReport() {
  const navigate =
    useNavigate()

  const {
    suppliers,
  } = useSuppliers()

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
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      'All'
    )

  const [
    search,
    setSearch,
  ] =
    useState('')

  /* =========================================
     PURCHASES FOR SELECTED PERIOD
  ========================================= */

  const periodPurchases =
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
     SUPPLIER ANALYSIS

     Supports:
     1. New purchases with supplierId
     2. Old localStorage purchases with
        supplier name only
  ========================================= */

  const supplierAnalysis =
    useMemo(() => {
      return suppliers.map(
        (supplier) => {
          const supplierPurchases =
            periodPurchases.filter(
              (purchase) =>
                purchase.supplierId ===
                  supplier.id ||
                (
                  purchase.supplierId ==
                    null &&
                  purchase.supplier ===
                    supplier.name
                )
            )

          const totalPurchaseValue =
            supplierPurchases.reduce(
              (
                total,
                purchase
              ) =>
                total +
                purchase.grandTotal,
              0
            )

          const purchaseCount =
            supplierPurchases.length

          const averagePurchase =
            purchaseCount > 0
              ? totalPurchaseValue /
                purchaseCount
              : 0

          const totalQuantity =
            supplierPurchases.reduce(
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

          const totalGST =
            supplierPurchases.reduce(
              (
                total,
                purchase
              ) =>
                total +
                purchase.taxAmount,
              0
            )

          return {
            supplier,
            totalPurchaseValue,
            purchaseCount,
            averagePurchase,
            totalQuantity,
            totalGST,
          }
        }
      )
    }, [
      suppliers,
      periodPurchases,
    ])

  /* =========================================
     FILTER SUPPLIER TABLE
  ========================================= */

  const filteredSuppliers =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase()

      return supplierAnalysis.filter(
        (row) => {
          const {
            supplier,
          } = row

          const matchesStatus =
            statusFilter ===
              'All' ||
            supplier.status ===
              statusFilter

          const matchesSearch =
            searchText === '' ||
            supplier.name
              .toLowerCase()
              .includes(
                searchText
              ) ||
            supplier.contactPerson
              .toLowerCase()
              .includes(
                searchText
              ) ||
            supplier.phone
              .toLowerCase()
              .includes(
                searchText
              ) ||
            supplier.email
              .toLowerCase()
              .includes(
                searchText
              ) ||
            supplier.city
              .toLowerCase()
              .includes(
                searchText
              ) ||
            supplier.gstin
              .toLowerCase()
              .includes(
                searchText
              )

          return (
            matchesStatus &&
            matchesSearch
          )
        }
      )
    }, [
      supplierAnalysis,
      statusFilter,
      search,
    ])

  /* =========================================
     SUMMARY
  ========================================= */

  const totalSuppliers =
    suppliers.length

  const activeSuppliers =
    suppliers.filter(
      (supplier) =>
        supplier.status ===
        'Active'
    ).length

  /* =========================================
     REGISTERED SUPPLIER PURCHASES
  ========================================= */

  const registeredPurchases =
    periodPurchases.filter(
      (purchase) =>
        suppliers.some(
          (supplier) =>
            purchase.supplierId ===
              supplier.id ||
            (
              purchase.supplierId ==
                null &&
              purchase.supplier ===
                supplier.name
            )
        )
    )

  const totalPurchaseValue =
    registeredPurchases.reduce(
      (
        total,
        purchase
      ) =>
        total +
        purchase.grandTotal,
      0
    )

  const purchaseRecords =
    registeredPurchases.length

  const averagePurchase =
    purchaseRecords > 0
      ? totalPurchaseValue /
        purchaseRecords
      : 0

  const totalPurchasedQuantity =
    registeredPurchases.reduce(
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
     TOP SUPPLIERS
  ========================================= */

  const topSuppliers =
    useMemo(() => {
      return [
        ...supplierAnalysis,
      ]
        .filter(
          (row) =>
            row.purchaseCount > 0
        )
        .sort(
          (a, b) =>
            b.totalPurchaseValue -
            a.totalPurchaseValue
        )
        .slice(0, 5)
    }, [
      supplierAnalysis,
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
        style:
          'currency',
        currency:
          'INR',
        minimumFractionDigits:
          2,
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
              Supplier Report
            </h1>

            <p>
              Analyse suppliers, purchase
              value, purchase frequency and
              supplier activity.
            </p>

          </div>

        </div>

        <div className="supplier-report-header-actions">

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
            className="supplier-report-open-button"
            onClick={() =>
              navigate(
                '/suppliers'
              )
            }
          >

            <Truck
              size={17}
            />

            Suppliers

          </button>

        </div>

      </div>

      {/* =====================================
          KPI CARDS
      ====================================== */}

      <div className="report-kpi-grid">

        {/* TOTAL SUPPLIERS */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <Truck
              size={21}
            />

          </div>

          <div>

            <span>
              Total Suppliers
            </span>

            <strong>
              {totalSuppliers}
            </strong>

            <small>
              Registered suppliers
            </small>

          </div>

        </div>

        {/* ACTIVE */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <UserCheck
              size={21}
            />

          </div>

          <div>

            <span>
              Active Suppliers
            </span>

            <strong>
              {activeSuppliers}
            </strong>

            <small>
              Active supplier accounts
            </small>

          </div>

        </div>

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
              Registered supplier purchases
            </small>

          </div>

        </div>

        {/* PURCHASE RECORDS */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <ReceiptText
              size={21}
            />

          </div>

          <div>

            <span>
              Purchase Records
            </span>

            <strong>
              {purchaseRecords}
            </strong>

            <small>
              Supplier purchase entries
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          SECONDARY SUMMARY
      ====================================== */}

      <div className="supplier-report-summary">

        <div>

          <TrendingUp
            size={18}
          />

          <span>
            Average Purchase
          </span>

          <strong>
            {formatMoney(
              averagePurchase
            )}
          </strong>

        </div>

        <div>

          <PackagePlus
            size={18}
          />

          <span>
            Units Purchased
          </span>

          <strong>
            {totalPurchasedQuantity}
          </strong>

        </div>

      </div>

      {/* =====================================
          TOP SUPPLIERS
      ====================================== */}

      <div className="report-data-card supplier-top-card">

        <div className="report-data-header">

          <div>

            <h3>
              Top Suppliers
            </h3>

            <p>
              Ranked by purchase value for
              the selected period.
            </p>

          </div>

          <Crown
            size={19}
          />

        </div>

        {topSuppliers.length >
        0 ? (

          <div className="supplier-top-list">

            {topSuppliers.map(
              (
                row,
                index
              ) => (

                <div
                  key={
                    row.supplier.id
                  }
                  className="supplier-top-item"
                >

                  {/* RANK */}

                  <div className="supplier-top-rank">

                    {index + 1}

                  </div>

                  {/* SUPPLIER */}

                  <div className="supplier-top-info">

                    <div>

                      <strong>
                        {
                          row.supplier.name
                        }
                      </strong>

                      <small>

                        {
                          row.supplier
                            .contactPerson ||
                          'No contact person'
                        }

                        {' • '}

                        {
                          row.purchaseCount
                        }

                        {' '}

                        {row.purchaseCount ===
                        1
                          ? 'purchase'
                          : 'purchases'}

                      </small>

                    </div>

                    {/* VALUES */}

                    <div className="supplier-top-values">

                      <div>

                        <span>
                          Units
                        </span>

                        <strong>
                          {
                            row.totalQuantity
                          }
                        </strong>

                      </div>

                      <div>

                        <span>
                          GST
                        </span>

                        <strong>
                          {formatMoney(
                            row.totalGST
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Avg Purchase
                        </span>

                        <strong>
                          {formatMoney(
                            row.averagePurchase
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Total
                        </span>

                        <strong>
                          {formatMoney(
                            row.totalPurchaseValue
                          )}
                        </strong>

                      </div>

                    </div>

                  </div>

                  {/* VIEW */}

                  <button
                    type="button"
                    className="supplier-report-view-button"
                    onClick={() =>
                      navigate(
                        `/suppliers/${row.supplier.id}`
                      )
                    }
                    title="View supplier"
                  >

                    <Eye
                      size={16}
                    />

                  </button>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="report-empty-small">

            No registered supplier
            purchases are available for
            this period.

          </div>

        )}

      </div>

      {/* =====================================
          SUPPLIER PERFORMANCE
      ====================================== */}

      <div className="report-data-card report-transactions-card">

        <div className="report-data-header report-transaction-header">

          <div>

            <h3>
              Supplier Performance
            </h3>

            <p>
              Supplier-wise purchase
              activity and totals.
            </p>

          </div>

          <span className="report-record-count">

            {filteredSuppliers.length}

            {' '}

            {filteredSuppliers.length ===
            1
              ? 'supplier'
              : 'suppliers'}

          </span>

        </div>

        {/* ===================================
            TOOLBAR
        ==================================== */}

        <div className="supplier-report-toolbar">

          {/* SEARCH */}

          <div className="report-search supplier-report-search">

            <Search
              size={18}
            />

            <input
              type="text"
              placeholder="Search supplier, phone, GSTIN, city..."
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

          {/* STATUS */}

          <select
            className="supplier-report-select"
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

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

          {/* ADD SUPPLIER */}

          <button
            type="button"
            className="supplier-report-add-button"
            onClick={() =>
              navigate(
                '/suppliers/add'
              )
            }
          >

            <UserPlus
              size={16}
            />

            Add Supplier

          </button>

        </div>

        {/* ===================================
            TABLE
        ==================================== */}

        <div className="report-table-wrapper">

          <table className="report-table supplier-performance-table">

            <thead>

              <tr>

                <th>
                  Supplier
                </th>

                <th>
                  Phone
                </th>

                <th>
                  City
                </th>

                <th>
                  Purchases
                </th>

                <th>
                  Units
                </th>

                <th>
                  Avg Purchase
                </th>

                <th>
                  GST
                </th>

                <th>
                  Purchase Value
                </th>

                <th>
                  Opening Balance
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

              {filteredSuppliers.map(
                (row) => (

                  <tr
                    key={
                      row.supplier.id
                    }
                  >

                    {/* SUPPLIER */}

                    <td>

                      <div className="supplier-report-name">

                        <strong>
                          {
                            row.supplier.name
                          }
                        </strong>

                        <small>
                          {
                            row.supplier
                              .contactPerson ||
                            'No contact person'
                          }
                        </small>

                      </div>

                    </td>

                    {/* PHONE */}

                    <td>
                      {
                        row.supplier.phone ||
                        '—'
                      }
                    </td>

                    {/* CITY */}

                    <td>
                      {
                        row.supplier.city ||
                        '—'
                      }
                    </td>

                    {/* PURCHASES */}

                    <td>

                      <strong>
                        {
                          row.purchaseCount
                        }
                      </strong>

                    </td>

                    {/* UNITS */}

                    <td>
                      {
                        row.totalQuantity
                      }
                    </td>

                    {/* AVERAGE */}

                    <td>
                      {formatMoney(
                        row.averagePurchase
                      )}
                    </td>

                    {/* GST */}

                    <td>
                      {formatMoney(
                        row.totalGST
                      )}
                    </td>

                    {/* TOTAL */}

                    <td>

                      <strong>
                        {formatMoney(
                          row.totalPurchaseValue
                        )}
                      </strong>

                    </td>

                    {/* OPENING BALANCE */}

                    <td>
                      {formatMoney(
                        row.supplier
                          .openingBalance
                      )}
                    </td>

                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          row.supplier.status ===
                          'Active'
                            ? 'supplier-report-status active'
                            : 'supplier-report-status inactive'
                        }
                      >

                        {
                          row.supplier.status
                        }

                      </span>

                    </td>

                    {/* ACTION */}

                    <td>

                      <button
                        type="button"
                        className="supplier-report-table-action"
                        onClick={() =>
                          navigate(
                            `/suppliers/${row.supplier.id}`
                          )
                        }
                      >

                        <Eye
                          size={14}
                        />

                        View

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {/* ===================================
            EMPTY STATE
        ==================================== */}

        {filteredSuppliers.length ===
          0 && (

          <div className="report-empty">

            <Truck
              size={40}
            />

            <h3>
              No suppliers found
            </h3>

            <p>
              No registered suppliers match
              the selected filters.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}