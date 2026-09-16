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
  Plus,
} from 'lucide-react'

import {
  useSuppliers,
} from '../context/SupplierContext'

import {
  usePurchases,
} from '../context/PurchaseContext'

export default function SupplierDetails() {
  const navigate = useNavigate()

  const { id } = useParams()

  const {
    getSupplierById,
  } = useSuppliers()

  const {
    purchases,
  } = usePurchases()

  const supplier =
    getSupplierById(
      Number(id)
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
      }
    ).format(
      new Date(date)
    )
  }

  if (!supplier) {
    return (
      <div className="supplier-not-found">

        <h2>
          Supplier Not Found
        </h2>

        <p>
          This supplier does not
          exist.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate('/suppliers')
          }
        >
          Back to Suppliers
        </button>

      </div>
    )
  }

  const supplierPurchases =
  purchases.filter(
    (purchase) =>
      purchase.supplierId ===
        supplier.id ||
      (
        !purchase.supplierId &&
        purchase.supplier ===
          supplier.name
      )
  )

  const purchaseValue =
    supplierPurchases.reduce(
      (total, purchase) =>
        total +
        purchase.grandTotal,
      0
    )

  return (
    <div className="supplier-details-page">

      <div className="supplier-details-actions">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate('/suppliers')
          }
        >
          <ArrowLeft size={17} />
          Back to Suppliers
        </button>

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

      <div className="supplier-profile-card">

        <div className="supplier-profile-header">

          <div className="supplier-profile-avatar">
            {supplier.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <h1>
              {supplier.name}
            </h1>

            <p>
              {supplier.contactPerson ||
                'Supplier'}
            </p>

          </div>

          <span
            className={
              supplier.status ===
              'Active'
                ? 'supplier-status active'
                : 'supplier-status inactive'
            }
          >
            {supplier.status}
          </span>

        </div>

        <div className="supplier-profile-info">

          <div>
            <Phone size={16} />

            <span>
              {supplier.phone}
            </span>
          </div>

          <div>
            <Mail size={16} />

            <span>
              {supplier.email ||
                'No email'}
            </span>
          </div>

          <div>
            <MapPin size={16} />

            <span>
              {supplier.address ||
                supplier.city ||
                'No address'}
            </span>
          </div>

        </div>

      </div>

      <div className="supplier-detail-summary">

        <div>

          <span>
            Total Purchases
          </span>

          <strong>
            {supplierPurchases.length}
          </strong>

        </div>

        <div>

          <span>
            Purchase Value
          </span>

          <strong>
            {formatMoney(
              purchaseValue
            )}
          </strong>

        </div>

        <div>

          <span>
            Opening Balance
          </span>

          <strong>
            {formatMoney(
              supplier.openingBalance
            )}
          </strong>

        </div>

      </div>

      <div className="supplier-business-card">

        <h3>
          Business Details
        </h3>

        <div className="supplier-business-grid">

          <div>
            <span>GSTIN</span>

            <strong>
              {supplier.gstin ||
                'Not provided'}
            </strong>
          </div>

          <div>
            <span>City</span>

            <strong>
              {supplier.city ||
                'Not provided'}
            </strong>
          </div>

          <div>
            <span>Address</span>

            <strong>
              {supplier.address ||
                'Not provided'}
            </strong>
          </div>

        </div>

      </div>

      <div className="supplier-history-card">

        <div className="supplier-history-header">

          <div>

            <h3>
              Purchase History
            </h3>

            <p>
              Purchases from this
              supplier.
            </p>

          </div>

          <ReceiptText size={20} />

        </div>

        {supplierPurchases.length ===
        0 ? (

          <div className="supplier-no-purchases">

            <ReceiptText size={35} />

            <h3>
              No purchases yet
            </h3>

            <p>
              Create a purchase from
              this supplier.
            </p>

          </div>

        ) : (

          <div className="supplier-history-table-wrapper">

            <table className="supplier-history-table">

              <thead>

                <tr>
                  <th>
                    Purchase
                  </th>

                  <th>
                    Date
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
                </tr>

              </thead>

              <tbody>

                {supplierPurchases.map(
                  (purchase) => (

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
                          purchase.items.length
                        }
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

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}