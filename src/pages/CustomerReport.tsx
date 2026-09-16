import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Users,
  UserCheck,
  IndianRupee,
  ReceiptText,
  Search,
  Crown,
  Gift,
  TrendingUp,
  Eye,
  UserPlus,
} from 'lucide-react'

import {
  useCustomers,
} from '../context/CustomerContext'

import {
  useSales,
} from '../context/SaleContext'

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
    saleDate >=
      startDate &&
    saleDate <=
      now
  )
}

/* =========================================
   CUSTOMER REPORT
========================================= */

export default function CustomerReport() {
  const navigate =
    useNavigate()

  const {
    customers,
  } = useCustomers()

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
     SALES IN SELECTED PERIOD
  ========================================= */

  const periodSales =
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
     CUSTOMER ANALYSIS

     Supports:
     1. New sales with customerId
     2. Old localStorage sales with name only
  ========================================= */

  const customerAnalysis =
    useMemo(() => {
      return customers.map(
        (customer) => {
          const customerSales =
            periodSales.filter(
              (sale) =>
                sale.customerId ===
                  customer.id ||
                (
                  sale.customerId ==
                    null &&
                  sale.customer ===
                    customer.name
                )
            )

          const totalSpent =
            customerSales.reduce(
              (
                total,
                sale
              ) =>
                total +
                sale.grandTotal,
              0
            )

          const bills =
            customerSales.length

          const averageBill =
            bills > 0
              ? totalSpent /
                bills
              : 0

          const itemsPurchased =
            customerSales.reduce(
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

          return {
            customer,
            totalSpent,
            bills,
            averageBill,
            itemsPurchased,
          }
        }
      )
    }, [
      customers,
      periodSales,
    ])

  /* =========================================
     FILTER CUSTOMER TABLE
  ========================================= */

  const filteredCustomers =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase()

      return customerAnalysis.filter(
        (row) => {
          const {
            customer,
          } = row

          const matchesStatus =
            statusFilter ===
              'All' ||
            customer.status ===
              statusFilter

          const matchesSearch =
            searchText === '' ||
            customer.name
              .toLowerCase()
              .includes(
                searchText
              ) ||
            customer.phone
              .toLowerCase()
              .includes(
                searchText
              ) ||
            customer.email
              .toLowerCase()
              .includes(
                searchText
              ) ||
            customer.city
              .toLowerCase()
              .includes(
                searchText
              ) ||
            customer.gstin
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
      customerAnalysis,
      statusFilter,
      search,
    ])

  /* =========================================
     TOTAL CUSTOMERS
  ========================================= */

  const totalCustomers =
    customers.length

  /* =========================================
     ACTIVE CUSTOMERS
  ========================================= */

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status ===
        'Active'
    ).length

  /* =========================================
     REGISTERED CUSTOMER SALES
  ========================================= */

  const registeredCustomerSales =
    periodSales.filter(
      (sale) => {
        return customers.some(
          (customer) =>
            sale.customerId ===
              customer.id ||
            (
              sale.customerId ==
                null &&
              sale.customer ===
                customer.name
            )
        )
      }
    )

  /* =========================================
     CUSTOMER REVENUE
  ========================================= */

  const customerRevenue =
    registeredCustomerSales.reduce(
      (
        total,
        sale
      ) =>
        total +
        sale.grandTotal,
      0
    )

  /* =========================================
     CUSTOMER BILLS
  ========================================= */

  const customerBills =
    registeredCustomerSales.length

  /* =========================================
     AVERAGE CUSTOMER BILL
  ========================================= */

  const averageCustomerBill =
    customerBills > 0
      ? customerRevenue /
        customerBills
      : 0

  /* =========================================
     LOYALTY POINTS

     We only display existing stored points.
     No automatic earning rule is invented.
  ========================================= */

  const totalLoyaltyPoints =
    customers.reduce(
      (
        total,
        customer
      ) =>
        total +
        customer.loyaltyPoints,
      0
    )

  /* =========================================
     TOP CUSTOMERS
  ========================================= */

  const topCustomers =
    useMemo(() => {
      return [
        ...customerAnalysis,
      ]
        .filter(
          (row) =>
            row.bills > 0
        )
        .sort(
          (a, b) =>
            b.totalSpent -
            a.totalSpent
        )
        .slice(0, 5)
    }, [customerAnalysis])

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
              Customer Report
            </h1>

            <p>
              Analyse registered customers,
              bills, spending and customer
              purchase activity.
            </p>

          </div>

        </div>

        <div className="customer-report-header-actions">

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
            className="customer-report-open-button"
            onClick={() =>
              navigate(
                '/customers'
              )
            }
          >

            <Users
              size={17}
            />

            Customers

          </button>

        </div>

      </div>

      {/* =====================================
          KPI CARDS
      ====================================== */}

      <div className="report-kpi-grid">

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <Users
              size={21}
            />

          </div>

          <div>

            <span>
              Total Customers
            </span>

            <strong>
              {totalCustomers}
            </strong>

            <small>
              Registered customers
            </small>

          </div>

        </div>

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <UserCheck
              size={21}
            />

          </div>

          <div>

            <span>
              Active Customers
            </span>

            <strong>
              {activeCustomers}
            </strong>

            <small>
              Active accounts
            </small>

          </div>

        </div>

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <IndianRupee
              size={21}
            />

          </div>

          <div>

            <span>
              Customer Revenue
            </span>

            <strong>
              {formatMoney(
                customerRevenue
              )}
            </strong>

            <small>
              Registered customer sales
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
              Customer Bills
            </span>

            <strong>
              {customerBills}
            </strong>

            <small>
              Registered customer bills
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          SECONDARY SUMMARY
      ====================================== */}

      <div className="customer-report-summary">

        <div>

          <TrendingUp
            size={18}
          />

          <span>
            Average Customer Bill
          </span>

          <strong>
            {formatMoney(
              averageCustomerBill
            )}
          </strong>

        </div>

        <div>

          <Gift
            size={18}
          />

          <span>
            Stored Loyalty Points
          </span>

          <strong>
            {totalLoyaltyPoints}
          </strong>

        </div>

      </div>

      {/* =====================================
          TOP CUSTOMERS
      ====================================== */}

      <div className="report-data-card customer-top-card">

        <div className="report-data-header">

          <div>

            <h3>
              Top Customers
            </h3>

            <p>
              Ranked by sales value for
              the selected period.
            </p>

          </div>

          <Crown
            size={19}
          />

        </div>

        {topCustomers.length >
        0 ? (

          <div className="customer-top-list">

            {topCustomers.map(
              (
                row,
                index
              ) => (

                <div
                  key={
                    row.customer.id
                  }
                  className="customer-top-item"
                >

                  <div className="customer-top-rank">

                    {index + 1}

                  </div>

                  <div className="customer-top-info">

                    <div>

                      <strong>
                        {
                          row.customer.name
                        }
                      </strong>

                      <small>
                        {
                          row.customer.phone
                        }

                        {' • '}

                        {
                          row.bills
                        }

                        {' '}

                        {row.bills === 1
                          ? 'bill'
                          : 'bills'}
                      </small>

                    </div>

                    <div className="customer-top-values">

                      <div>

                        <span>
                          Items
                        </span>

                        <strong>
                          {
                            row.itemsPurchased
                          }
                        </strong>

                      </div>

                      <div>

                        <span>
                          Avg Bill
                        </span>

                        <strong>
                          {formatMoney(
                            row.averageBill
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Total Spent
                        </span>

                        <strong>
                          {formatMoney(
                            row.totalSpent
                          )}
                        </strong>

                      </div>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="customer-report-view-button"
                    onClick={() =>
                      navigate(
                        `/customers/${row.customer.id}`
                      )
                    }
                    title="View customer"
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

            No registered customer sales
            are available for this period.

          </div>

        )}

      </div>

      {/* =====================================
          CUSTOMER PERFORMANCE TABLE
      ====================================== */}

      <div className="report-data-card report-transactions-card">

        <div className="report-data-header report-transaction-header">

          <div>

            <h3>
              Customer Performance
            </h3>

            <p>
              Registered customer activity
              and spending.
            </p>

          </div>

          <span className="report-record-count">

            {filteredCustomers.length}

            {' '}

            {filteredCustomers.length ===
            1
              ? 'customer'
              : 'customers'}

          </span>

        </div>

        {/* FILTER TOOLBAR */}

        <div className="customer-report-toolbar">

          <div className="report-search customer-report-search">

            <Search
              size={18}
            />

            <input
              type="text"
              placeholder="Search customer, phone, email, city..."
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
            className="customer-report-select"
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

          <button
            type="button"
            className="customer-report-add-button"
            onClick={() =>
              navigate(
                '/customers/add'
              )
            }
          >

            <UserPlus
              size={16}
            />

            Add Customer

          </button>

        </div>

        {/* TABLE */}

        <div className="report-table-wrapper">

          <table className="report-table customer-report-table">

            <thead>

              <tr>

                <th>
                  Customer
                </th>

                <th>
                  Phone
                </th>

                <th>
                  City
                </th>

                <th>
                  Bills
                </th>

                <th>
                  Items
                </th>

                <th>
                  Avg Bill
                </th>

                <th>
                  Total Spent
                </th>

                <th>
                  Loyalty
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

              {filteredCustomers.map(
                (row) => (

                  <tr
                    key={
                      row.customer.id
                    }
                  >

                    <td>

                      <div className="customer-report-name">

                        <strong>
                          {
                            row.customer.name
                          }
                        </strong>

                        <small>
                          {
                            row.customer.email ||
                            'No email'
                          }
                        </small>

                      </div>

                    </td>

                    <td>
                      {
                        row.customer.phone
                      }
                    </td>

                    <td>
                      {
                        row.customer.city ||
                        '—'
                      }
                    </td>

                    <td>

                      <strong>
                        {
                          row.bills
                        }
                      </strong>

                    </td>

                    <td>
                      {
                        row.itemsPurchased
                      }
                    </td>

                    <td>
                      {formatMoney(
                        row.averageBill
                      )}
                    </td>

                    <td>

                      <strong>
                        {formatMoney(
                          row.totalSpent
                        )}
                      </strong>

                    </td>

                    <td>

                      <span className="customer-loyalty-badge">

                        <Gift
                          size={12}
                        />

                        {
                          row.customer
                            .loyaltyPoints
                        }

                      </span>

                    </td>

                    <td>

                      <span
                        className={
                          row.customer.status ===
                          'Active'
                            ? 'customer-report-status active'
                            : 'customer-report-status inactive'
                        }
                      >

                        {
                          row.customer.status
                        }

                      </span>

                    </td>

                    <td>

                      <button
                        type="button"
                        className="customer-report-table-action"
                        onClick={() =>
                          navigate(
                            `/customers/${row.customer.id}`
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

        {/* EMPTY STATE */}

        {filteredCustomers.length ===
          0 && (

          <div className="report-empty">

            <Users
              size={40}
            />

            <h3>
              No customers found
            </h3>

            <p>
              No registered customers
              match the selected filters.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}