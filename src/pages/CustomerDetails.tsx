import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  ReceiptText,
  Star,
  ShoppingBag,
} from 'lucide-react'

import {
  useCustomers,
} from '../context/CustomerContext'

import {
  useSales,
} from '../context/SaleContext'

export default function CustomerDetails() {
  const navigate = useNavigate()

  const { id } = useParams()

  const {
    getCustomerById,
  } = useCustomers()

  const {
    sales,
  } = useSales()

  const customer =
    getCustomerById(
      Number(id)
    )

  if (!customer) {
    return (
      <div className="customer-details-page">

        <div className="customers-empty">

          <h2>
            Customer not found
          </h2>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate('/customers')
            }
          >
            Back to Customers
          </button>

        </div>

      </div>
    )
  }

  const customerSales =
    sales.filter(
      (sale) =>
        sale.customerId ===
          customer.id ||
        (
          !sale.customerId &&
          sale.customer ===
            customer.name
        )
    )

  const totalSpent =
    customerSales.reduce(
      (total, sale) =>
        total +
        sale.grandTotal,
      0
    )

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

  function formatDate(
    date: string
  ) {
    return new Intl.DateTimeFormat(
      'en-IN',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      }
    ).format(
      new Date(date)
    )
  }

  return (
    <div className="customer-details-page">

      <div className="customer-details-header">

        <div>

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate('/customers')
            }
          >
            <ArrowLeft size={18} />

            Back
          </button>

          <div className="page-header">

            <h1>
              {customer.name}
            </h1>

            <p>
              Customer profile and
              sales history.
            </p>

          </div>

        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate('/pos')
          }
        >
          <ShoppingBag size={17} />

          New Bill
        </button>

      </div>

      <div className="customer-profile-card">

        <div className="customer-profile-avatar">
          {customer.name
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="customer-profile-info">

          <h2>
            {customer.name}
          </h2>

          <span
            className={
              customer.status ===
              'Active'
                ? 'customer-status active'
                : 'customer-status inactive'
            }
          >
            {customer.status}
          </span>

        </div>

      </div>

      <div className="customer-detail-summary-grid">

        <div className="customer-detail-summary-card">

          <ReceiptText size={20} />

          <span>
            Total Bills
          </span>

          <strong>
            {customerSales.length}
          </strong>

        </div>

        <div className="customer-detail-summary-card">

          <ShoppingBag size={20} />

          <span>
            Total Spent
          </span>

          <strong>
            {formatMoney(
              totalSpent
            )}
          </strong>

        </div>

        <div className="customer-detail-summary-card">

          <Star size={20} />

          <span>
            Loyalty Points
          </span>

          <strong>
            {customer.loyaltyPoints}
          </strong>

        </div>

      </div>

      <div className="customer-information-card">

        <h3>
          Customer Information
        </h3>

        <div className="customer-information-grid">

          <div>
            <Phone size={16} />

            <span>
              Phone
            </span>

            <strong>
              {customer.phone ||
                'Not provided'}
            </strong>
          </div>

          <div>
            <Mail size={16} />

            <span>
              Email
            </span>

            <strong>
              {customer.email ||
                'Not provided'}
            </strong>
          </div>

          <div>
            <MapPin size={16} />

            <span>
              City
            </span>

            <strong>
              {customer.city ||
                'Not provided'}
            </strong>
          </div>

          <div>
            <span>
              GSTIN
            </span>

            <strong>
              {customer.gstin ||
                'Not provided'}
            </strong>
          </div>

          <div>
            <span>
              Opening Balance
            </span>

            <strong>
              {formatMoney(
                customer.openingBalance
              )}
            </strong>
          </div>

          <div>
            <span>
              Address
            </span>

            <strong>
              {customer.address ||
                'Not provided'}
            </strong>
          </div>

        </div>

      </div>

      <div className="customer-history-card">

        <div className="customer-history-header">

          <div>
            <h3>
              Sales History
            </h3>

            <p>
              Bills linked to this
              customer.
            </p>
          </div>

        </div>

        {customerSales.length > 0 ? (

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>
                    Invoice
                  </th>

                  <th>
                    Date
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
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {customerSales.map(
                  (sale) => (

                    <tr key={sale.id}>

                      <td>
                        <strong>
                          {sale.invoiceNumber}
                        </strong>
                      </td>

                      <td>
                        {formatDate(
                          sale.date
                        )}
                      </td>

                      <td>
                        {sale.items.reduce(
                          (
                            total,
                            item
                          ) =>
                            total +
                            item.quantity,
                          0
                        )}
                      </td>

                      <td>
                        {sale.paymentMethod}
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
                          className="table-action-button"
                          onClick={() =>
                            navigate(
                              `/invoice/${sale.id}`
                            )
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="customers-empty">

            <ReceiptText size={38} />

            <h3>
              No sales yet
            </h3>

            <p>
              Bills linked to this
              customer will appear here.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}