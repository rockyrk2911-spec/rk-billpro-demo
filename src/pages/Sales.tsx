import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  Search,
  ReceiptText,
  IndianRupee,
  ShoppingBag,
  Eye,
  Plus,
  User,
} from 'lucide-react'

import {
  useSales,
} from '../context/SaleContext'

import {
  useCustomers,
} from '../context/CustomerContext'

export default function Sales() {
  const navigate =
    useNavigate()

  const {
    sales,
  } = useSales()

  const {
    getCustomerById,
  } = useCustomers()

  // ==========================================
  // FILTER STATE
  // ==========================================

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    paymentFilter,
    setPaymentFilter,
  ] = useState('All')

  // ==========================================
  // FILTER SALES
  // ==========================================

  const filteredSales =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase()

      return sales.filter(
        (sale) => {
          const registeredCustomer =
            sale.customerId != null
              ? getCustomerById(
                  sale.customerId
                )
              : undefined

          const customerPhone =
            registeredCustomer
              ?.phone
              ?.toLowerCase() ??
            ''

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
              ) ||
            customerPhone.includes(
              searchText
            )

          const matchesPayment =
            paymentFilter ===
              'All' ||
            sale.paymentMethod ===
              paymentFilter

          return (
            matchesSearch &&
            matchesPayment
          )
        }
      )
    }, [
      sales,
      search,
      paymentFilter,
      getCustomerById,
    ])

  // ==========================================
  // TOTAL REVENUE
  // ==========================================

  const totalRevenue =
    sales.reduce(
      (total, sale) =>
        total +
        sale.grandTotal,
      0
    )

  // ==========================================
  // TOTAL BILLS
  // ==========================================

  const totalBills =
    sales.length

  // ==========================================
  // TOTAL ITEMS SOLD
  // ==========================================

  const totalItemsSold =
    sales.reduce(
      (total, sale) =>
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

  // ==========================================
  // REGISTERED CUSTOMER SALES
  // ==========================================

  const registeredSales =
    sales.filter(
      (sale) =>
        sale.customerId != null
    ).length

  // ==========================================
  // MONEY FORMAT
  // ==========================================

  function formatMoney(
    value: number
  ) {
    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',

        minimumFractionDigits:
          2,
      }
    ).format(value)
  }

  // ==========================================
  // DATE FORMAT
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
        timeStyle: 'short',
      }
    ).format(
      parsedDate
    )
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="sales-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="sales-header">

        <div className="page-header">

          <h1>
            Sales
          </h1>

          <p>
            View completed bills,
            customers and payment
            transactions.
          </p>

        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate('/pos')
          }
        >
          <Plus
            size={17}
          />

          New Sale
        </button>

      </div>

      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="sales-summary-grid">

        {/* SALES */}

        <div className="sales-summary-card">

          <div className="sales-summary-icon sales-blue">

            <IndianRupee
              size={21}
            />

          </div>

          <div>

            <span>
              Total Sales
            </span>

            <strong>
              {formatMoney(
                totalRevenue
              )}
            </strong>

            <small>
              Completed transactions
            </small>

          </div>

        </div>

        {/* BILLS */}

        <div className="sales-summary-card">

          <div className="sales-summary-icon sales-purple">

            <ReceiptText
              size={21}
            />

          </div>

          <div>

            <span>
              Total Bills
            </span>

            <strong>
              {totalBills}
            </strong>

            <small>
              Generated invoices
            </small>

          </div>

        </div>

        {/* ITEMS */}

        <div className="sales-summary-card">

          <div className="sales-summary-icon sales-green">

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
              Total product quantity
            </small>

          </div>

        </div>

        {/* REGISTERED CUSTOMERS */}

        <div className="sales-summary-card">

          <div className="sales-summary-icon sales-blue">

            <User
              size={21}
            />

          </div>

          <div>

            <span>
              Customer Bills
            </span>

            <strong>
              {registeredSales}
            </strong>

            <small>
              Registered customer sales
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          SALES HISTORY
      ====================================== */}

      <div className="sales-card">

        <div className="sales-card-header">

          <div>

            <h3>
              Sales History
            </h3>

            <p>
              Completed RK BillPro
              transactions.
            </p>

          </div>

          <span className="sales-count">

            {filteredSales.length}
            {' '}

            {filteredSales.length ===
            1
              ? 'Bill'
              : 'Bills'}

          </span>

        </div>

        {/* ===================================
            TOOLBAR
        ==================================== */}

        <div className="sales-toolbar">

          <div className="sales-search">

            <Search
              size={18}
            />

            <input
              type="text"
              placeholder="Search invoice, customer or phone..."
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

          <select
            value={
              paymentFilter
            }
            onChange={(
              event
            ) =>
              setPaymentFilter(
                event.target.value
              )
            }
          >

            <option value="All">
              All Payments
            </option>

            <option value="Cash">
              Cash
            </option>

            <option value="UPI">
              UPI
            </option>

            <option value="Card">
              Card
            </option>

          </select>

        </div>

        {/* ===================================
            TABLE
        ==================================== */}

        <div className="sales-table-wrapper">

          <table className="sales-table">

            <thead>

              <tr>

                <th>
                  Invoice
                </th>

                <th>
                  Date & Time
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
                  Total
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
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

                  const registeredCustomer =
                    sale.customerId !=
                    null
                      ? getCustomerById(
                          sale.customerId
                        )
                      : undefined

                  return (
                    <tr
                      key={
                        sale.id
                      }
                    >

                      {/* INVOICE */}

                      <td>

                        <strong className="sale-invoice-number">
                          {
                            sale.invoiceNumber
                          }
                        </strong>

                      </td>

                      {/* DATE */}

                      <td>
                        {formatDate(
                          sale.date
                        )}
                      </td>

                      {/* CUSTOMER */}

                      <td>

                        <div className="sale-customer-cell">

                          <strong>
                            {
                              sale.customer
                            }
                          </strong>

                          {registeredCustomer ? (

                            <>

                              <small>
                                {
                                  registeredCustomer
                                    .phone
                                }
                              </small>

                              <span className="registered-customer-badge">
                                Registered
                              </span>

                            </>

                          ) : (

                            <small>
                              Walk-in
                            </small>

                          )}

                        </div>

                      </td>

                      {/* ITEMS */}

                      <td>
                        {itemCount}
                      </td>

                      {/* PAYMENT */}

                      <td>

                        <span className="payment-badge">
                          {
                            sale.paymentMethod
                          }
                        </span>

                      </td>

                      {/* TOTAL */}

                      <td>

                        <strong>
                          {formatMoney(
                            sale.grandTotal
                          )}
                        </strong>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span className="sale-paid-badge">
                          Paid
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="sale-actions">

                          {registeredCustomer && (

                            <button
                              type="button"
                              className="view-customer-button"
                              title="View customer"
                              onClick={() =>
                                navigate(
                                  `/customers/${registeredCustomer.id}`
                                )
                              }
                            >
                              <User
                                size={16}
                              />
                            </button>

                          )}

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
                              size={17}
                            />
                          </button>

                        </div>

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

        {filteredSales.length ===
          0 && (

          <div className="sales-empty">

            <ReceiptText
              size={42}
            />

            <h3>
              No sales found
            </h3>

            <p>
              {sales.length === 0
                ? 'Complete a transaction from POS and it will appear here.'
                : 'No sales match the current search or payment filter.'}
            </p>

            {sales.length ===
              0 && (

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  navigate('/pos')
                }
              >
                <Plus
                  size={17}
                />

                Create First Sale
              </button>

            )}

          </div>

        )}

      </div>

    </div>
  )
}