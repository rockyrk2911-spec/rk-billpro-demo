import {
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  Search,
  Plus,
  ShoppingBag,
  IndianRupee,
  PackagePlus,
} from 'lucide-react'

import {
  usePurchases,
} from '../context/PurchaseContext'

export default function Purchases() {
  const navigate = useNavigate()

  const {
    purchases,
  } = usePurchases()

  const [
    search,
    setSearch,
  ] = useState('')

  const filteredPurchases =
    purchases.filter(
      (purchase) => {
        const searchText =
          search
            .trim()
            .toLowerCase()

        return (
          purchase.purchaseNumber
            .toLowerCase()
            .includes(searchText) ||
          purchase.supplier
            .toLowerCase()
            .includes(searchText) ||
          purchase.supplierInvoice
            .toLowerCase()
            .includes(searchText)
        )
      }
    )

  const totalPurchaseValue =
    purchases.reduce(
      (total, purchase) =>
        total +
        purchase.grandTotal,
      0
    )

  const totalUnits =
    purchases.reduce(
      (total, purchase) =>
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
    <div className="purchases-page">

      {/* HEADER */}

      <div className="purchases-header">

        <div className="page-header">

          <h1>
            Purchases
          </h1>

          <p>
            Manage supplier purchases
            and incoming inventory.
          </p>

        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate(
              '/purchases/new'
            )
          }
        >
          <Plus size={17} />

          New Purchase
        </button>

      </div>

      {/* SUMMARY */}

      <div className="purchase-summary-grid">

        <div className="purchase-summary-card">

          <div className="purchase-summary-icon purchase-blue">

            <ShoppingBag
              size={21}
            />

          </div>

          <div>

            <span>
              Total Purchases
            </span>

            <strong>
              {purchases.length}
            </strong>

            <small>
              Purchase bills
            </small>

          </div>

        </div>

        <div className="purchase-summary-card">

          <div className="purchase-summary-icon purchase-green">

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
              Total purchase amount
            </small>

          </div>

        </div>

        <div className="purchase-summary-card">

          <div className="purchase-summary-icon purchase-purple">

            <PackagePlus
              size={21}
            />

          </div>

          <div>

            <span>
              Units Received
            </span>

            <strong>
              {totalUnits}
            </strong>

            <small>
              Added to inventory
            </small>

          </div>

        </div>

      </div>

      {/* HISTORY */}

      <div className="purchases-card">

        <div className="purchases-card-header">

          <div>

            <h3>
              Purchase History
            </h3>

            <p>
              Completed supplier
              purchases.
            </p>

          </div>

          <span className="purchase-count">

            {purchases.length}
            {' '}
            Purchases

          </span>

        </div>

        <div className="purchases-toolbar">

          <div className="purchases-search">

            <Search
              size={18}
            />

            <input
              type="text"
              placeholder="Search purchase, supplier or invoice..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        <div className="purchases-table-wrapper">

          <table className="purchases-table">

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
                  Items
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

                      <td>

                        <strong className="purchase-id">

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
                        {quantity}
                      </td>

                      <td>

                        {formatMoney(
                          purchase.taxAmount
                        )}

                      </td>

                      <td>

                        <strong>

                          {formatMoney(
                            purchase.grandTotal
                          )}

                        </strong>

                      </td>

                      <td>

                        <span className="purchase-completed-badge">

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

        {filteredPurchases.length ===
          0 && (

          <div className="purchases-empty">

            <ShoppingBag
              size={42}
            />

            <h3>
              No purchases found
            </h3>

            <p>
              Create a purchase to
              receive products into
              inventory.
            </p>

            {purchases.length ===
              0 && (

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  navigate(
                    '/purchases/new'
                  )
                }
              >
                <Plus
                  size={17}
                />

                Create First Purchase
              </button>

            )}

          </div>

        )}

      </div>

    </div>
  )
}