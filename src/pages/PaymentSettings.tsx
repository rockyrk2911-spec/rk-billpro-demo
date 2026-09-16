import {
  useState,
  type FormEvent,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Save,
  CheckCircle2,
  WalletCards,
  Banknote,
  Smartphone,
  CreditCard,
  Landmark,
  Star,
  ReceiptText,
  Info,
} from 'lucide-react'

import {
  useSettings,
} from '../context/SettingsContext'

import type {
  ConfigurablePaymentMethod,
  PaymentSettings as PaymentSettingsType,
} from '../types/settings'

const paymentMethods:
  ConfigurablePaymentMethod[] = [
    'Cash',
    'UPI',
    'Card',
    'Bank Transfer',
  ]

export default function PaymentSettings() {
  const navigate =
    useNavigate()

  const {
    paymentSettings,
    updatePaymentSettings,
  } = useSettings()

  const [
    form,
    setForm,
  ] =
    useState<PaymentSettingsType>(
      paymentSettings
    )

  const [
    saved,
    setSaved,
  ] =
    useState(false)

  /* =======================================
     UPDATE FIELD
  ======================================== */

  function updateField<
    K extends keyof PaymentSettingsType
  >(
    field: K,
    value: PaymentSettingsType[K]
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )

    setSaved(false)
  }

  /* =======================================
     CHECK PAYMENT METHOD
  ======================================== */

  function isMethodEnabled(
    method:
      ConfigurablePaymentMethod
  ) {
    return (
      form.methods.find(
        (item) =>
          item.method ===
          method
      )?.enabled ??
      false
    )
  }

  /* =======================================
     ENABLE / DISABLE METHOD
  ======================================== */

  function toggleMethod(
    method:
      ConfigurablePaymentMethod
  ) {
    setForm(
      (current) => {
        const updatedMethods =
          current.methods.map(
            (item) =>
              item.method ===
              method
                ? {
                    ...item,
                    enabled:
                      !item.enabled,
                  }
                : item
          )

        const enabledMethods =
          updatedMethods.filter(
            (item) =>
              item.enabled
          )

        let nextDefault =
          current.defaultMethod

        const defaultStillEnabled =
          enabledMethods.some(
            (item) =>
              item.method ===
              nextDefault
          )

        if (
          !defaultStillEnabled &&
          enabledMethods.length > 0
        ) {
          nextDefault =
            enabledMethods[0]
              .method
        }

        return {
          ...current,

          methods:
            updatedMethods,

          defaultMethod:
            nextDefault,
        }
      }
    )

    setSaved(false)
  }

  /* =======================================
     SAVE SETTINGS
  ======================================== */

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const enabledMethods =
      form.methods.filter(
        (item) =>
          item.enabled
      )

    if (
      enabledMethods.length ===
      0
    ) {
      alert(
        'Enable at least one payment method.'
      )

      return
    }

    const defaultEnabled =
      enabledMethods.some(
        (item) =>
          item.method ===
          form.defaultMethod
      )

    if (!defaultEnabled) {
      alert(
        'The default payment method must be enabled.'
      )

      return
    }

    updatePaymentSettings({
      ...form,

      upiId:
        form.upiId.trim(),

      upiDisplayName:
        form.upiDisplayName.trim(),

      bankName:
        form.bankName.trim(),

      accountName:
        form.accountName.trim(),

      accountNumber:
        form.accountNumber.trim(),

      ifscCode:
        form.ifscCode
          .trim()
          .toUpperCase(),
    })

    setSaved(true)
  }

  /* =======================================
     PAYMENT METHOD ICON
  ======================================== */

  function getMethodIcon(
    method:
      ConfigurablePaymentMethod
  ) {
    switch (method) {
      case 'Cash':
        return (
          <Banknote
            size={21}
          />
        )

      case 'UPI':
        return (
          <Smartphone
            size={21}
          />
        )

      case 'Card':
        return (
          <CreditCard
            size={21}
          />
        )

      case 'Bank Transfer':
        return (
          <Landmark
            size={21}
          />
        )
    }
  }

  return (
    <div className="payment-settings-page">

      {/* HEADER */}

      <div className="settings-detail-header">

        <div>

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate(
                '/settings'
              )
            }
          >
            <ArrowLeft
              size={17}
            />

            Back to Settings
          </button>

          <div className="page-header">

            <div>

              <h1>
                Payment Methods
              </h1>

              <p>
                Configure payment options
                available during billing.
              </p>

            </div>

          </div>

        </div>

        <div className="business-settings-header-icon">

          <WalletCards
            size={23}
          />

        </div>

      </div>

      {/* SUCCESS */}

      {saved && (

        <div className="settings-success-message">

          <CheckCircle2
            size={18}
          />

          Payment settings saved
          successfully.

        </div>

      )}

      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* PAYMENT METHODS */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <WalletCards
              size={19}
            />

            <div>

              <h3>
                Accepted Payments
              </h3>

              <p>
                Enable the payment methods
                your business accepts.
              </p>

            </div>

          </div>

          <div className="payment-method-settings-grid">

            {paymentMethods.map(
              (method) => {
                const enabled =
                  isMethodEnabled(
                    method
                  )

                return (
                  <button
                    key={method}
                    type="button"
                    className={
                      enabled
                        ? 'payment-setting-card selected'
                        : 'payment-setting-card'
                    }
                    onClick={() =>
                      toggleMethod(
                        method
                      )
                    }
                  >

                    <div className="payment-setting-icon">

                      {getMethodIcon(
                        method
                      )}

                    </div>

                    <div className="payment-setting-content">

                      <strong>
                        {method}
                      </strong>

                      <span>
                        {enabled
                          ? 'Enabled'
                          : 'Disabled'}
                      </span>

                    </div>

                    <div
                      className={
                        enabled
                          ? 'payment-method-status enabled'
                          : 'payment-method-status'
                      }
                    >
                      {enabled
                        ? 'ON'
                        : 'OFF'}
                    </div>

                  </button>
                )
              }
            )}

          </div>

        </div>

        {/* DEFAULT PAYMENT */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <Star
              size={19}
            />

            <div>

              <h3>
                Default Payment
              </h3>

              <p>
                Choose the payment method
                selected first at checkout.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label>

              Default Method

              <select
                value={
                  form.defaultMethod
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'defaultMethod',
                    event.target
                      .value as ConfigurablePaymentMethod
                  )
                }
              >

                {form.methods
                  .filter(
                    (item) =>
                      item.enabled
                  )
                  .map(
                    (item) => (

                      <option
                        key={
                          item.method
                        }
                        value={
                          item.method
                        }
                      >
                        {
                          item.method
                        }
                      </option>

                    )
                  )}

              </select>

            </label>

          </div>

        </div>

        {/* UPI */}

        <div
          className={
            isMethodEnabled(
              'UPI'
            )
              ? 'settings-form-card'
              : 'settings-form-card payment-config-disabled'
          }
        >

          <div className="settings-form-card-header">

            <Smartphone
              size={19}
            />

            <div>

              <h3>
                UPI Configuration
              </h3>

              <p>
                Configure the UPI
                information displayed
                during payment.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label>

              UPI ID

              <input
                type="text"
                disabled={
                  !isMethodEnabled(
                    'UPI'
                  )
                }
                value={
                  form.upiId
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'upiId',
                    event.target.value
                  )
                }
                placeholder="business@upi"
              />

            </label>

            <label>

              Display Name

              <input
                type="text"
                disabled={
                  !isMethodEnabled(
                    'UPI'
                  )
                }
                value={
                  form.upiDisplayName
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'upiDisplayName',
                    event.target.value
                  )
                }
                placeholder="RK Supermarket"
              />

            </label>

          </div>

          <div className="payment-upi-preview">

            <div className="payment-qr-placeholder">

              <span>
                QR
              </span>

            </div>

            <div>

              <strong>
                UPI QR Placeholder
              </strong>

              <p>
                A real payment QR will be
                generated only when payment
                integration is added.
              </p>

            </div>

          </div>

        </div>

        {/* BANK TRANSFER */}

        <div
          className={
            isMethodEnabled(
              'Bank Transfer'
            )
              ? 'settings-form-card'
              : 'settings-form-card payment-config-disabled'
          }
        >

          <div className="settings-form-card-header">

            <Landmark
              size={19}
            />

            <div>

              <h3>
                Bank Account
              </h3>

              <p>
                Optional bank transfer
                information.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label>

              Bank Name

              <input
                type="text"
                disabled={
                  !isMethodEnabled(
                    'Bank Transfer'
                  )
                }
                value={
                  form.bankName
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'bankName',
                    event.target.value
                  )
                }
                placeholder="Bank name"
              />

            </label>

            <label>

              Account Name

              <input
                type="text"
                disabled={
                  !isMethodEnabled(
                    'Bank Transfer'
                  )
                }
                value={
                  form.accountName
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'accountName',
                    event.target.value
                  )
                }
                placeholder="Account holder"
              />

            </label>

            <label>

              Account Number

              <input
                type="text"
                disabled={
                  !isMethodEnabled(
                    'Bank Transfer'
                  )
                }
                value={
                  form.accountNumber
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'accountNumber',
                    event.target.value
                  )
                }
                placeholder="Account number"
              />

            </label>

            <label>

              IFSC Code

              <input
                type="text"
                disabled={
                  !isMethodEnabled(
                    'Bank Transfer'
                  )
                }
                value={
                  form.ifscCode
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'ifscCode',
                    event.target.value
                  )
                }
                placeholder="IFSC code"
              />

            </label>

          </div>

        </div>

        {/* PAYMENT OPTIONS */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <ReceiptText
              size={19}
            />

            <div>

              <h3>
                Payment Options
              </h3>

              <p>
                Additional checkout
                preferences.
              </p>

            </div>

          </div>

          <div className="invoice-option-list">

            <PaymentToggle
              title="Split Payment"
              description="Prepare RK BillPro to support payment using more than one method."
              checked={
                form.allowSplitPayment
              }
              onChange={(
                value
              ) =>
                updateField(
                  'allowSplitPayment',
                  value
                )
              }
            />

            <PaymentToggle
              title="Payment Reference"
              description="Show a reference or transaction ID field during supported payments."
              checked={
                form.showPaymentReference
              }
              onChange={(
                value
              ) =>
                updateField(
                  'showPaymentReference',
                  value
                )
              }
            />

          </div>

        </div>

        {/* DEMO NOTE */}

        <div className="invoice-settings-note">

          <Info
            size={18}
          />

          <div>

            <strong>
              Demo payment configuration
            </strong>

            <p>
              These settings control the
              RK BillPro demo preferences.
              No real UPI, card or bank
              transaction is processed by
              this page. We will connect
              enabled methods to the billing
              payment screen separately.
            </p>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="settings-form-actions">

          <button
            type="button"
            className="settings-cancel-button"
            onClick={() =>
              navigate(
                '/settings'
              )
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="settings-save-button"
          >
            <Save
              size={17}
            />

            Save Payment Settings
          </button>

        </div>

      </form>

    </div>
  )
}

/* =========================================
   TOGGLE COMPONENT
========================================= */

type PaymentToggleProps = {
  title: string
  description: string
  checked: boolean

  onChange: (
    value: boolean
  ) => void
}

function PaymentToggle({
  title,
  description,
  checked,
  onChange,
}: PaymentToggleProps) {
  return (
    <div className="invoice-toggle-row">

      <div>

        <strong>
          {title}
        </strong>

        <p>
          {description}
        </p>

      </div>

      <label className="settings-switch">

        <input
          type="checkbox"
          checked={
            checked
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target.checked
            )
          }
        />

        <span className="settings-switch-slider" />

      </label>

    </div>
  )
}