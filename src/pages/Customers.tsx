import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Search,
  Plus,
  Users,
  Phone,
  Mail,
  MapPin,
  Eye,
  Star,
} from 'lucide-react'

import {
  useCustomers,
} from '../context/CustomerContext'

import {
  useSales,
} from '../context/SaleContext'

export default function Customers() {
  const navigate = useNavigate()

  const { customers } =
    useCustomers()

  const { sales } =
    useSales()

  const [search, setSearch] =
    useState('')

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('All')

  const filteredCustomers =
    customers.filter((customer) => {
      const searchText =
        search
          .trim()
          .toLowerCase()

      const matchesSearch =
        customer.name
          .toLowerCase()
          .includes(searchText) ||
        customer.phone
          .toLowerCase()
          .includes(searchText) ||
        customer.email
          .toLowerCase()
          .includes(searchText) ||
        customer.city
          .toLowerCase()
          .includes(searchText)

      const matchesStatus =
        statusFilter === 'All' ||
        customer.status ===
          statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    })

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status ===
        'Active'
    ).length

  const totalLoyaltyPoints =
    customers.reduce(
      (total, customer) =>
        total +
        customer.loyaltyPoints,
      0
    )

  const totalCustomerSales =
    sales.reduce(
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

  function getCustomerSales(
    customerId: number,
    customerName: string
  ) {
    const customerSales =
      sales.filter(
        (sale) =>
          sale.customerId ===
            customerId ||
          (
            !sale.customerId &&
            sale.customer ===
              customerName
          )
      )

    return {
      count:
        customerSales.length,

      value:
        customerSales.reduce(
          (total, sale) =>
            total +
            sale.grandTotal,
          0
        ),
    }
  }

  return (
    <div className="customers-page">

      <div className="customers-header">

        <div className="page-header">

          <h1>
            Customers
          </h1>

          <p>
            Manage customer information,
            purchase history and loyalty.
          </p>

        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate(
              '/customers/add'
            )
          }
        >
          <Plus size={17} />

          Add Customer
        </button>

      </div>

      {/* SUMMARY */}

      <div className="customer-summary-grid">

        <div className="customer-summary-card">

          <div className="customer-summary-icon customer-blue">
            <Users size={21} />
          </div>

          <div>
            <span>
              Total Customers
            </span>

            <strong>
              {customers.length}
            </strong>

            <small>
              Registered customers
            </small>
          </div>

        </div>

        <div className="customer-summary-card">

          <div className="customer-summary-icon customer-green">
            <Users size={21} />
          </div>

          <div>
            <span>
              Active Customers
            </span>

            <strong>
              {activeCustomers}
            </strong>

            <small>
              Available for billing
            </small>
          </div>

        </div>

        <div className="customer-summary-card">

          <div className="customer-summary-icon customer-purple">
            ₹
          </div>

          <div>
            <span>
              Customer Sales
            </span>

            <strong>
              {formatMoney(
                totalCustomerSales
              )}
            </strong>

            <small>
              Total recorded sales
            </small>
          </div>

        </div>

        <div className="customer-summary-card">

          <div className="customer-summary-icon customer-orange">
            <Star size={21} />
          </div>

          <div>
            <span>
              Loyalty Points
            </span>

            <strong>
              {totalLoyaltyPoints}
            </strong>

            <small>
              Across customers
            </small>
          </div>

        </div>

      </div>

      {/* CUSTOMER DIRECTORY */}

      <div className="customers-card">

        <div className="customers-card-header">

          <div>
            <h3>
              Customer Directory
            </h3>

            <p>
              Customer details and
              purchase activity.
            </p>
          </div>

          <span className="customer-count">
            {filteredCustomers.length}
            {' '}
            Customers
          </span>

        </div>

        {/* SEARCH */}

        <div className="customers-toolbar">

          <div className="customer-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search customer, phone, email or city..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
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

        </div>

        {/* CUSTOMER CARDS */}

        <div className="customer-grid">

          {filteredCustomers.map(
            (customer) => {
              const customerSales =
                getCustomerSales(
                  customer.id,
                  customer.name
                )

              return (
                <div
                  className="customer-card"
                  key={customer.id}
                >

                  <div className="customer-card-top">

                    <div className="customer-avatar">
                      {customer.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="customer-main-info">

                      <strong>
                        {customer.name}
                      </strong>

                      <span>
                        Customer
                      </span>

                    </div>

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

                  <div className="customer-contact-list">

                    <div>
                      <Phone size={14} />

                      <span>
                        {customer.phone ||
                          'No phone'}
                      </span>
                    </div>

                    <div>
                      <Mail size={14} />

                      <span>
                        {customer.email ||
                          'No email'}
                      </span>
                    </div>

                    <div>
                      <MapPin size={14} />

                      <span>
                        {customer.city ||
                          'No city'}
                      </span>
                    </div>

                  </div>

                  <div className="customer-sales-stats">

                    <div>
                      <span>
                        Bills
                      </span>

                      <strong>
                        {customerSales.count}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Total Spent
                      </span>

                      <strong>
                        {formatMoney(
                          customerSales.value
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Points
                      </span>

                      <strong>
                        {customer.loyaltyPoints}
                      </strong>
                    </div>

                  </div>

                  <button
                    type="button"
                    className="customer-view-button"
                    onClick={() =>
                      navigate(
                        `/customers/${customer.id}`
                      )
                    }
                  >
                    <Eye size={15} />

                    View Customer
                  </button>

                </div>
              )
            }
          )}

        </div>

        {filteredCustomers.length ===
          0 && (

          <div className="customers-empty">

            <Users size={42} />

            <h3>
              No customers found
            </h3>

            <p>
              Try another search or add
              a new customer.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}