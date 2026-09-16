import {
  useMemo,
  useState,
} from 'react'

import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Smartphone,
} from 'lucide-react'

import {
  useProducts,
} from '../context/ProductContext'

import {
  useSales,
} from '../context/SaleContext'

import {
  useSettings,
} from '../context/SettingsContext'

import type {
  PaymentMethod,
  Sale,
  SaleItem,
} from '../types/sale'

import type {
  ConfigurablePaymentMethod,
} from '../types/settings'

/* =========================================
   PAYMENT STATE FROM POS
========================================= */

type PaymentState = {
  customerId?: number

  customer: string

  items: SaleItem[]

  subtotal: number

  discountPercent: number

  discountAmount: number

  taxAmount: number

  grandTotal: number
}

/* =========================================
   PAYMENT METHOD DETAILS
========================================= */

const paymentMethodDetails: Record<
  ConfigurablePaymentMethod,
  {
    title: string
    description: string
  }
> = {
  Cash: {
    title: 'Cash',
    description:
      'Cash payment',
  },

  UPI: {
    title: 'UPI',
    description:
      'Google Pay / PhonePe',
  },

  Card: {
    title: 'Card',
    description:
      'Debit / Credit Card',
  },

  'Bank Transfer': {
    title: 'Bank Transfer',
    description:
      'Direct bank payment',
  },
}

/* =========================================
   PAYMENT PAGE
========================================= */

export default function Payment() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  /* =======================================
     CONTEXTS
  ======================================== */

  const {
    reduceStock,
  } = useProducts()

  const {
    addSale,
    getNextInvoiceNumber,
  } = useSales()

  const {
    paymentSettings,
    businessProfile,
  } = useSettings()

  /* =======================================
     PAYMENT DATA FROM POS
  ======================================== */

  const paymentData =
    location.state as
      | PaymentState
      | null

  /* =======================================
     ENABLED PAYMENT METHODS
  ======================================== */

  const enabledMethods =
    useMemo(
      () =>
        paymentSettings.methods
          .filter(
            (item) =>
              item.enabled
          )
          .map(
            (item) =>
              item.method
          ),
      [
        paymentSettings.methods,
      ]
    )

  /* =======================================
     INITIAL PAYMENT METHOD
  ======================================== */

  function getInitialPaymentMethod():
    PaymentMethod {
    if (
      enabledMethods.includes(
        paymentSettings.defaultMethod
      )
    ) {
      return paymentSettings
        .defaultMethod
    }

    return (
      enabledMethods[0] ??
      'Cash'
    )
  }

  /* =======================================
     STATE
  ======================================== */

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>(
      getInitialPaymentMethod
    )

  const [
    amountReceived,
    setAmountReceived,
  ] = useState('')

  const [
    paymentReference,
    setPaymentReference,
  ] = useState('')

  const [
    paymentComplete,
    setPaymentComplete,
  ] = useState(false)

  const [
    createdSale,
    setCreatedSale,
  ] =
    useState<Sale | null>(
      null
    )

  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false)

  /* =======================================
     EFFECTIVE PAYMENT METHOD

     If settings change while this page is
     open and the selected method becomes
     disabled, use the configured default
     or first enabled method without a
     state-setting effect.
  ======================================== */

  const effectivePaymentMethod:
    PaymentMethod =
      enabledMethods.includes(
        paymentMethod
      )
        ? paymentMethod
        : enabledMethods.includes(
              paymentSettings.defaultMethod
            )
          ? paymentSettings.defaultMethod
          : enabledMethods[0] ??
            'Cash'

  /* =======================================
     SELECT PAYMENT METHOD

     Method-specific values are cleared
     here instead of inside useEffect.
  ======================================== */

  function handlePaymentMethodChange(
    method:
      ConfigurablePaymentMethod
  ) {
    if (isProcessing) {
      return
    }

    if (
      !enabledMethods.includes(
        method
      )
    ) {
      return
    }

    setPaymentMethod(
      method
    )

    if (
      method !==
      'Cash'
    ) {
      setAmountReceived('')
    }

    setPaymentReference('')
  }

  /* =======================================
     NO ACTIVE BILL
  ======================================== */

  if (!paymentData) {
    return (
      <div className="payment-missing">

        <h2>
          No active bill found
        </h2>

        <p>
          Please create a bill from
          POS first.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate('/pos')
          }
        >
          Go to POS
        </button>

      </div>
    )
  }

  /* =======================================
     PAYMENT DATA
  ======================================== */

  const {
    customerId,
    customer,
    items,
    subtotal,
    discountPercent,
    discountAmount,
    taxAmount,
    grandTotal,
  } = paymentData

  /* =======================================
     CASH CALCULATION
  ======================================== */

  const received =
    Number(
      amountReceived
    ) || 0

  const changeAmount =
    effectivePaymentMethod ===
    'Cash'
      ? Math.max(
          0,
          received -
            grandTotal
        )
      : 0

  /* =======================================
     VALIDATION
  ======================================== */

  const hasEnabledMethods =
    enabledMethods.length > 0

  const cashValid =
    effectivePaymentMethod !==
      'Cash' ||
    received >=
      grandTotal

  const canCompletePayment =
    hasEnabledMethods &&
    cashValid

  /* =======================================
     MONEY FORMAT
  ======================================== */

  function formatMoney(
    value: number
  ) {
    return new Intl.NumberFormat(
      'en-IN',
      {
        style:
          'currency',

        currency:
          businessProfile
            .currency ||
          'INR',

        minimumFractionDigits:
          2,
      }
    ).format(value)
  }

  /* =======================================
     ICON
  ======================================== */

  function renderMethodIcon(
    method:
      ConfigurablePaymentMethod
  ) {
    switch (method) {
      case 'Cash':
        return (
          <Banknote
            size={25}
          />
        )

      case 'UPI':
        return (
          <Smartphone
            size={25}
          />
        )

      case 'Card':
        return (
          <CreditCard
            size={25}
          />
        )

      case 'Bank Transfer':
        return (
          <Building2
            size={25}
          />
        )
    }
  }

  /* =======================================
     COMPLETE PAYMENT
  ======================================== */

  function completePayment() {
    if (isProcessing) {
      return
    }

    if (
      !canCompletePayment
    ) {
      return
    }

    setIsProcessing(true)

    try {
      const invoiceNumber =
        getNextInvoiceNumber()

      /* ===================================
         CREATE SALE
      =================================== */

      const sale: Sale = {
        id:
          Date.now(),

        invoiceNumber,

        date:
          new Date()
            .toISOString(),

        customerId,

        customer,

        items,

        subtotal,

        discountPercent,

        discountAmount,

        taxAmount,

        grandTotal,

        paymentMethod:
          effectivePaymentMethod,

        paymentReference:
          paymentSettings
            .showPaymentReference &&
          paymentReference
            .trim()
            ? paymentReference
                .trim()
            : undefined,

        amountReceived:
          effectivePaymentMethod ===
          'Cash'
            ? received
            : grandTotal,

        changeAmount:
          effectivePaymentMethod ===
          'Cash'
            ? changeAmount
            : 0,
      }

      /* ===================================
         SAVE SALE
      =================================== */

      addSale(sale)

      /* ===================================
         REDUCE INVENTORY
      =================================== */

      reduceStock(
        items.map(
          (item) => ({
            productId:
              item.productId,

            quantity:
              item.quantity,
          })
        )
      )

      /*
        Loyalty points are intentionally
        not automatically calculated here.

        We can add a configurable loyalty
        system later instead of hard-coding
        a business rule.
      */

      /* ===================================
         SUCCESS
      =================================== */

      setCreatedSale(
        sale
      )

      setPaymentComplete(
        true
      )
    } catch (error) {
      console.error(
        'Payment failed:',
        error
      )

      setIsProcessing(
        false
      )

      alert(
        'Unable to complete payment. Please try again.'
      )
    }
  }

  /* =======================================
     PAYMENT SUCCESS
  ======================================== */

  if (
    paymentComplete &&
    createdSale
  ) {
    return (
      <div className="payment-success-page">

        <div className="payment-success-card">

          <div className="success-check">

            <CheckCircle2
              size={42}
            />

          </div>

          <h1>
            Payment Successful!
          </h1>

          <p>
            The sale has been completed
            and inventory has been
            updated.
          </p>

          <div className="success-invoice">

            <span>
              Customer
            </span>

            <strong>
              {createdSale.customer}
            </strong>

          </div>

          <div className="success-invoice">

            <span>
              Invoice Number
            </span>

            <strong>
              {
                createdSale
                  .invoiceNumber
              }
            </strong>

          </div>

          <div className="success-total">

            <span>
              Amount Paid
            </span>

            <strong>
              {formatMoney(
                createdSale
                  .grandTotal
              )}
            </strong>

          </div>

          <div className="success-payment-method">

            Paid via{' '}

            <strong>
              {
                createdSale
                  .paymentMethod
              }
            </strong>

          </div>

          {createdSale
            .paymentReference && (

            <div className="success-payment-method">

              Payment Reference:{' '}

              <strong>
                {
                  createdSale
                    .paymentReference
                }
              </strong>

            </div>

          )}

          {createdSale
            .paymentMethod ===
            'Cash' && (

            <div className="success-change">

              Change to Customer:

              <strong>
                {' '}
                {formatMoney(
                  createdSale
                    .changeAmount ||
                    0
                )}
              </strong>

            </div>

          )}

          <div className="success-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate(
                  `/invoice/${createdSale.id}`
                )
              }
            >
              View Invoice
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate('/pos')
              }
            >
              New Bill
            </button>

          </div>

        </div>

      </div>
    )
  }

  /* =======================================
     PAYMENT PAGE
  ======================================== */

  return (
    <div className="payment-page">

      {/* BACK */}

      <button
        type="button"
        className="back-button"
        onClick={() =>
          navigate(-1)
        }
        disabled={
          isProcessing
        }
      >
        <ArrowLeft
          size={17}
        />

        Back to POS
      </button>

      {/* HEADER */}

      <div className="page-header">

        <h1>
          Payment
        </h1>

        <p>
          Choose a payment method and
          complete the transaction.
        </p>

      </div>

      <div className="payment-layout">

        {/* =================================
            LEFT
        ================================== */}

        <div className="payment-main-card">

          <h3>
            Select Payment Method
          </h3>

          {!hasEnabledMethods && (

            <div className="payment-settings-warning">

              <strong>
                No payment methods enabled
              </strong>

              <p>
                Enable at least one payment
                method from Settings →
                Payment Methods.
              </p>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate(
                    '/settings/payments'
                  )
                }
              >
                Open Payment Settings
              </button>

            </div>

          )}

          {hasEnabledMethods && (

            <div className="payment-method-grid">

              {enabledMethods.map(
                (method) => {
                  const details =
                    paymentMethodDetails[
                      method
                    ]

                  return (
                    <button
                      type="button"
                      key={method}
                      className={
                        effectivePaymentMethod ===
                        method
                          ? 'payment-method active'
                          : 'payment-method'
                      }
                      onClick={() =>
                        handlePaymentMethodChange(
                          method
                        )
                      }
                      disabled={
                        isProcessing
                      }
                    >

                      {renderMethodIcon(
                        method
                      )}

                      <strong>
                        {details.title}
                      </strong>

                      <span>
                        {
                          details
                            .description
                        }
                      </span>

                    </button>
                  )
                }
              )}

            </div>

          )}

          {/* =================================
              CASH
          ================================== */}

          {effectivePaymentMethod ===
            'Cash' &&
            hasEnabledMethods && (

            <div className="cash-payment-box">

              <label>
                Amount Received
              </label>

              <div className="cash-input">

                <span>
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter received amount"
                  value={
                    amountReceived
                  }
                  disabled={
                    isProcessing
                  }
                  onChange={(
                    event
                  ) =>
                    setAmountReceived(
                      event.target
                        .value
                    )
                  }
                />

              </div>

              <div className="quick-cash-buttons">

                <button
                  type="button"
                  disabled={
                    isProcessing
                  }
                  onClick={() =>
                    setAmountReceived(
                      String(
                        Math.ceil(
                          grandTotal /
                            100
                        ) *
                          100
                      )
                    )
                  }
                >
                  ₹
                  {Math.ceil(
                    grandTotal /
                      100
                  ) * 100}
                </button>

                <button
                  type="button"
                  disabled={
                    isProcessing
                  }
                  onClick={() =>
                    setAmountReceived(
                      '500'
                    )
                  }
                >
                  ₹500
                </button>

                <button
                  type="button"
                  disabled={
                    isProcessing
                  }
                  onClick={() =>
                    setAmountReceived(
                      '1000'
                    )
                  }
                >
                  ₹1000
                </button>

              </div>

              <div className="change-box">

                <span>
                  Change
                </span>

                <strong>
                  {formatMoney(
                    changeAmount
                  )}
                </strong>

              </div>

            </div>

          )}

          {/* =================================
              UPI
          ================================== */}

          {effectivePaymentMethod ===
            'UPI' &&
            hasEnabledMethods && (

            <div className="digital-payment-box">

              <Smartphone
                size={32}
              />

              <h3>
                UPI Payment
              </h3>

              <p>
                Demo payment only. No real
                transaction is processed.
              </p>

              {paymentSettings
                .upiDisplayName && (

                <div className="payment-config-detail">

                  <span>
                    Payee
                  </span>

                  <strong>
                    {
                      paymentSettings
                        .upiDisplayName
                    }
                  </strong>

                </div>

              )}

              {paymentSettings
                .upiId && (

                <div className="payment-config-detail">

                  <span>
                    UPI ID
                  </span>

                  <strong>
                    {
                      paymentSettings
                        .upiId
                    }
                  </strong>

                </div>

              )}

              <div className="payment-demo-qr">

                <Smartphone
                  size={34}
                />

                <strong>
                  Demo QR
                </strong>

                <span>
                  QR payment placeholder
                </span>

              </div>

              {paymentSettings
                .showPaymentReference && (

                <div className="payment-reference-field">

                  <label>
                    UPI Reference
                  </label>

                  <input
                    type="text"
                    placeholder="Enter transaction / UTR reference"
                    value={
                      paymentReference
                    }
                    disabled={
                      isProcessing
                    }
                    onChange={(
                      event
                    ) =>
                      setPaymentReference(
                        event.target
                          .value
                      )
                    }
                  />

                </div>

              )}

            </div>

          )}

          {/* =================================
              CARD
          ================================== */}

          {effectivePaymentMethod ===
            'Card' &&
            hasEnabledMethods && (

            <div className="digital-payment-box">

              <CreditCard
                size={32}
              />

              <h3>
                Card Payment
              </h3>

              <p>
                Demo mode: confirm the card
                payment from the external
                POS terminal.
              </p>

              {paymentSettings
                .showPaymentReference && (

                <div className="payment-reference-field">

                  <label>
                    Transaction Reference
                  </label>

                  <input
                    type="text"
                    placeholder="Enter card transaction reference"
                    value={
                      paymentReference
                    }
                    disabled={
                      isProcessing
                    }
                    onChange={(
                      event
                    ) =>
                      setPaymentReference(
                        event.target
                          .value
                      )
                    }
                  />

                </div>

              )}

            </div>

          )}

          {/* =================================
              BANK TRANSFER
          ================================== */}

          {effectivePaymentMethod ===
            'Bank Transfer' &&
            hasEnabledMethods && (

            <div className="digital-payment-box">

              <Building2
                size={32}
              />

              <h3>
                Bank Transfer
              </h3>

              <p>
                Demo mode: verify the bank
                transfer before completing
                the sale.
              </p>

              {paymentSettings
                .bankName && (

                <div className="payment-config-detail">

                  <span>
                    Bank
                  </span>

                  <strong>
                    {
                      paymentSettings
                        .bankName
                    }
                  </strong>

                </div>

              )}

              {paymentSettings
                .accountName && (

                <div className="payment-config-detail">

                  <span>
                    Account Name
                  </span>

                  <strong>
                    {
                      paymentSettings
                        .accountName
                    }
                  </strong>

                </div>

              )}

              {paymentSettings
                .accountNumber && (

                <div className="payment-config-detail">

                  <span>
                    Account Number
                  </span>

                  <strong>
                    {
                      paymentSettings
                        .accountNumber
                    }
                  </strong>

                </div>

              )}

              {paymentSettings
                .ifscCode && (

                <div className="payment-config-detail">

                  <span>
                    IFSC
                  </span>

                  <strong>
                    {
                      paymentSettings
                        .ifscCode
                    }
                  </strong>

                </div>

              )}

              {paymentSettings
                .showPaymentReference && (

                <div className="payment-reference-field">

                  <label>
                    Transfer Reference
                  </label>

                  <input
                    type="text"
                    placeholder="Enter UTR / transfer reference"
                    value={
                      paymentReference
                    }
                    disabled={
                      isProcessing
                    }
                    onChange={(
                      event
                    ) =>
                      setPaymentReference(
                        event.target
                          .value
                      )
                    }
                  />

                </div>

              )}

            </div>

          )}

          {/* =================================
              SPLIT PAYMENT
          ================================== */}

          {paymentSettings
            .allowSplitPayment && (

            <div className="split-payment-note">

              <strong>
                Split Payment
              </strong>

              <span>
                Enabled in settings. Full
                split-payment allocation
                will be added separately.
              </span>

            </div>

          )}

        </div>

        {/* =================================
            BILL SUMMARY
        ================================== */}

        <aside className="payment-summary-card">

          <h3>
            Bill Summary
          </h3>

          <div className="payment-customer">

            <span>
              Customer
            </span>

            <strong>
              {customer}
            </strong>

          </div>

          <div className="payment-customer">

            <span>
              Customer Type
            </span>

            <strong>
              {customerId !==
              undefined
                ? 'Registered'
                : 'Walk-in'}
            </strong>

          </div>

          <div className="payment-items">

            {items.map(
              (item) => (

                <div
                  className="payment-item"
                  key={
                    item.productId
                  }
                >

                  <div>

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.quantity}
                      {' × '}
                      {formatMoney(
                        item.price
                      )}
                    </span>

                  </div>

                  <strong>
                    {formatMoney(
                      item.total
                    )}
                  </strong>

                </div>

              )
            )}

          </div>

          <div className="payment-totals">

            <div>

              <span>
                Subtotal
              </span>

              <strong>
                {formatMoney(
                  subtotal
                )}
              </strong>

            </div>

            <div>

              <span>
                Discount{' '}
                (
                {discountPercent}
                %)
              </span>

              <strong>
                -
                {formatMoney(
                  discountAmount
                )}
              </strong>

            </div>

            <div>

              <span>
                GST
              </span>

              <strong>
                {formatMoney(
                  taxAmount
                )}
              </strong>

            </div>

          </div>

          <div className="payment-grand-total">

            <span>
              Total Amount
            </span>

            <strong>
              {formatMoney(
                grandTotal
              )}
            </strong>

          </div>

          <div className="payment-customer">

            <span>
              Payment Method
            </span>

            <strong>
              {effectivePaymentMethod}
            </strong>

          </div>

          <button
            type="button"
            className="complete-payment-button"
            disabled={
              !canCompletePayment ||
              isProcessing
            }
            onClick={
              completePayment
            }
          >

            <CheckCircle2
              size={19}
            />

            {isProcessing
              ? 'Processing...'
              : 'Complete Payment'}

          </button>

          {!canCompletePayment &&
            effectivePaymentMethod ===
              'Cash' &&
            hasEnabledMethods && (

            <p className="payment-warning">

              Enter at least{' '}

              {formatMoney(
                grandTotal
              )}

              {' '}to complete
              payment.

            </p>

          )}

        </aside>

      </div>

    </div>
  )
}