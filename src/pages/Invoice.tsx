import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  ArrowLeft,
  Printer,
  ShoppingCart,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'

import {
  useSales,
} from '../context/SaleContext'

import {
  useCustomers,
} from '../context/CustomerContext'

import {
  useSettings,
} from '../context/SettingsContext'

import {
  useBranches,
} from '../context/BranchContext'

export default function Invoice() {
  const navigate =
    useNavigate()

  const {
    id,
  } = useParams()

  const {
    sales,
  } = useSales()

  const {
    getCustomerById,
  } = useCustomers()

  const {
    businessProfile,
    taxSettings,
    invoiceSettings,
  } = useSettings()

  const {
    currentBranch,
  } = useBranches()

  /* =========================================
     FIND SALE
  ========================================= */

  const sale =
    sales.find(
      (item) =>
        item.id ===
        Number(id)
    )

  /* =========================================
     MONEY FORMAT
  ========================================= */

  function formatMoney(
    value: number
  ) {
    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency:
          businessProfile.currency ||
          'INR',
        minimumFractionDigits: 2,
      }
    ).format(
      value
    )
  }

  /* =========================================
     DATE FORMAT
  ========================================= */

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

  /* =========================================
     PRINT
  ========================================= */

  function handlePrint() {
    window.print()
  }

  /* =========================================
     INVOICE NOT FOUND
  ========================================= */

  if (!sale) {
    return (
      <div className="invoice-not-found">

        <h2>
          Invoice Not Found
        </h2>

        <p>
          The requested invoice could
          not be found.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate(
              '/sales'
            )
          }
        >
          Go to Sales
        </button>

      </div>
    )
  }

  /* =========================================
     CUSTOMER
  ========================================= */

  const registeredCustomer =
    sale.customerId !==
    undefined
      ? getCustomerById(
          sale.customerId
        )
      : undefined

  const isRegisteredCustomer =
    Boolean(
      registeredCustomer
    )

  /* =========================================
     ITEM COUNT
  ========================================= */

  const totalItems =
    sale.items.reduce(
      (
        total,
        item
      ) =>
        total +
        item.quantity,
      0
    )

  /* =========================================
     BUSINESS DETAILS
  ========================================= */

  const businessName =
    businessProfile
      .businessName
      .trim() ||
    'RK Supermarket'

  const ownerInitials =
    businessName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (word) =>
          word.charAt(0)
      )
      .join('')
      .toUpperCase() ||
    'RK'

  const branchName =
    currentBranch?.name
      ?.trim() ||
    ''

  const branchAddress =
    currentBranch?.address
      ?.trim() ||
    businessProfile.address
      .trim()

  const branchCity =
    currentBranch?.city
      ?.trim() ||
    businessProfile.city
      .trim()

  const branchState =
    currentBranch?.state
      ?.trim() ||
    businessProfile.state
      .trim()

  const branchPincode =
    currentBranch?.pincode
      ?.trim() ||
    businessProfile.pincode
      .trim()

  const businessPhone =
    currentBranch?.phone
      ?.trim() ||
    businessProfile.phone
      .trim()

  /*
    Branch GSTIN is the most specific.
    Then use GST settings.
    Finally fall back to Business Profile.
  */

  const businessGSTIN =
    currentBranch?.gstin
      ?.trim() ||
    taxSettings.gstin
      .trim() ||
    businessProfile.gstin
      .trim()

  const locationLine = [
    branchCity,
    branchState,
    branchPincode,
  ]
    .filter(Boolean)
    .join(', ')

  /* =========================================
     PAPER CLASS
  ========================================= */

  const paperClassName =
    invoiceSettings.paperSize ===
    '80mm'
      ? 'invoice-paper invoice-paper-80mm'
      : 'invoice-paper invoice-paper-a4'

  return (
    <div className="invoice-page">

      {/* =====================================
          ACTION BAR
      ====================================== */}

      <div className="invoice-action-bar no-print">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate(
              '/sales'
            )
          }
        >
          <ArrowLeft
            size={17}
          />

          Back to Sales
        </button>

        <div className="invoice-actions">

          {registeredCustomer && (

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate(
                  `/customers/${registeredCustomer.id}`
                )
              }
            >
              <User
                size={17}
              />

              View Customer
            </button>

          )}

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate(
                '/pos'
              )
            }
          >
            <ShoppingCart
              size={17}
            />

            New Bill
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={
              handlePrint
            }
          >
            <Printer
              size={17}
            />

            Print Invoice
          </button>

        </div>

      </div>

      {/* =====================================
          INVOICE PAPER
      ====================================== */}

      <div
        className={
          paperClassName
        }
      >

        {/* ===================================
            HEADER
        ==================================== */}

        <div className="invoice-header">

          <div className="invoice-brand">

            {invoiceSettings.showLogo && (

              <div className="invoice-logo">
                {ownerInitials}
              </div>

            )}

            <div>

              {invoiceSettings.showBusinessName && (

                <h1>
                  {businessName}
                </h1>

              )}

              {branchName && (

                <p>
                  {branchName}
                </p>

              )}

            </div>

          </div>

          <div className="invoice-title">

            <h2>
              {invoiceSettings
                .receiptTitle ||
                'Tax Invoice'}
            </h2>

            <span>
              {sale.invoiceNumber}
            </span>

          </div>

        </div>

        {/* ===================================
            BUSINESS + CUSTOMER INFORMATION
        ==================================== */}

        <div className="invoice-information">

          {/* BUSINESS */}

          <div>

            <h4>
              From
            </h4>

            {invoiceSettings.showBusinessName && (

              <strong>
                {businessName}
              </strong>

            )}

            {branchName && (

              <p>
                {branchName}
              </p>

            )}

            {invoiceSettings.showBusinessAddress && (
              <>
                {branchAddress && (

                  <p>
                    {branchAddress}
                  </p>

                )}

                {locationLine && (

                  <p>
                    {locationLine}
                  </p>

                )}
              </>
            )}

            {invoiceSettings.showGSTIN &&
              businessGSTIN && (

                <p>
                  GSTIN:{' '}
                  {businessGSTIN}
                </p>

              )}

            {invoiceSettings.showBusinessPhone &&
              businessPhone && (

                <p>
                  Phone:{' '}
                  {businessPhone}
                </p>

              )}

          </div>

          {/* CUSTOMER */}

          {(invoiceSettings.showCustomerName ||
            invoiceSettings.showCustomerPhone) && (

            <div>

              <h4>
                Bill To
              </h4>

              {invoiceSettings.showCustomerName && (
                <>
                  <strong>
                    {sale.customer}
                  </strong>

                  <p>
                    {isRegisteredCustomer
                      ? 'Registered Customer'
                      : 'Walk-in Customer'}
                  </p>
                </>
              )}

              {invoiceSettings.showCustomerPhone &&
                registeredCustomer?.phone && (

                  <p className="invoice-customer-detail">

                    <Phone
                      size={13}
                    />

                    {
                      registeredCustomer
                        .phone
                    }

                  </p>

                )}

              {registeredCustomer?.email && (

                <p className="invoice-customer-detail">

                  <Mail
                    size={13}
                  />

                  {
                    registeredCustomer
                      .email
                  }

                </p>

              )}

              {registeredCustomer?.city && (

                <p className="invoice-customer-detail">

                  <MapPin
                    size={13}
                  />

                  {
                    registeredCustomer
                      .city
                  }

                </p>

              )}

              {registeredCustomer?.gstin && (

                <p>
                  Customer GSTIN:{' '}
                  {
                    registeredCustomer
                      .gstin
                  }
                </p>

              )}

            </div>

          )}

          {/* INVOICE DETAILS */}

          <div>

            <h4>
              Invoice Details
            </h4>

            <p>
              Invoice:{' '}

              <strong>
                {sale.invoiceNumber}
              </strong>
            </p>

            {invoiceSettings.showInvoiceDate && (

              <p>
                Date:{' '}

                <strong>
                  {formatDate(
                    sale.date
                  )}
                </strong>
              </p>

            )}

            {invoiceSettings.showPaymentMethod && (

              <p>
                Payment:{' '}

                <strong>
                  {sale.paymentMethod}
                </strong>
              </p>

            )}

            <p>
              Items:{' '}

              <strong>
                {totalItems}
              </strong>
            </p>

          </div>

        </div>

        {/* ===================================
            ITEMS
        ==================================== */}

        <div className="invoice-table-wrapper">

          <table className="invoice-table">

            <thead>

              <tr>

                <th>
                  #
                </th>

                <th>
                  Item
                </th>

                <th>
                  Qty
                </th>

                <th>
                  Rate
                </th>

                {taxSettings.showTaxOnInvoice && (

                  <th>
                    GST
                  </th>

                )}

                <th>
                  Amount
                </th>

              </tr>

            </thead>

            <tbody>

              {sale.items.map(
                (
                  item,
                  index
                ) => (

                  <tr
                    key={
                      item.productId
                    }
                  >

                    <td>
                      {index + 1}
                    </td>

                    <td>

                      <strong>
                        {item.name}
                      </strong>

                    </td>

                    <td>
                      {item.quantity}
                    </td>

                    <td>
                      {formatMoney(
                        item.price
                      )}
                    </td>

                    {taxSettings.showTaxOnInvoice && (

                      <td>
                        {item.gst}%
                      </td>

                    )}

                    <td>

                      <strong>
                        {formatMoney(
                          item.total
                        )}
                      </strong>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {/* ===================================
            BOTTOM
        ==================================== */}

        <div className="invoice-bottom">

          {/* PAYMENT */}

          <div className="invoice-payment-info">

            <div className="invoice-paid-badge">

              <CheckCircle2
                size={17}
              />

              Payment Completed

            </div>

            <h4>
              Payment Information
            </h4>

            {invoiceSettings.showPaymentMethod && (

              <p>
                Payment Method:{' '}

                <strong>
                  {sale.paymentMethod}
                </strong>
              </p>

            )}

            <p>
              Amount Paid:{' '}

              <strong>
                {formatMoney(
                  sale.grandTotal
                )}
              </strong>
            </p>

            {sale.paymentMethod ===
              'Cash' && (

              <>

                <p>
                  Amount Received:{' '}

                  <strong>
                    {formatMoney(
                      sale.amountReceived ??
                      sale.grandTotal
                    )}
                  </strong>
                </p>

                <p>
                  Change:{' '}

                  <strong>
                    {formatMoney(
                      sale.changeAmount ??
                      0
                    )}
                  </strong>
                </p>

              </>

            )}

          </div>

          {/* TOTAL */}

          <div className="invoice-total-box">

            <div>

              <span>
                Subtotal
              </span>

              <strong>
                {formatMoney(
                  sale.subtotal
                )}
              </strong>

            </div>

            <div>

              <span>
                Discount (
                {sale.discountPercent}
                %)
              </span>

              <strong className="invoice-discount">

                -{' '}

                {formatMoney(
                  sale.discountAmount
                )}

              </strong>

            </div>

            {taxSettings.showTaxOnInvoice && (

              <div>

                <span>
                  GST
                </span>

                <strong>
                  {formatMoney(
                    sale.taxAmount
                  )}
                </strong>

              </div>

            )}

            <div className="invoice-grand-total">

              <span>
                Grand Total
              </span>

              <strong>
                {formatMoney(
                  sale.grandTotal
                )}
              </strong>

            </div>

          </div>

        </div>

        {/* ===================================
            FOOTER
        ==================================== */}

        <div className="invoice-footer">

          {invoiceSettings.footerMessage && (

            <strong>
              {
                invoiceSettings
                  .footerMessage
              }
            </strong>

          )}

          <p>
            This invoice was generated
            using RK BillPro.
          </p>

          <span>
            Smart Billing • Inventory
            • Reports
          </span>

        </div>

      </div>

    </div>
  )
}