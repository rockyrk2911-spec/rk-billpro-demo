import {
  useState,
  type FormEvent,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  ReceiptText,
  Save,
  CheckCircle2,
  Hash,
  FileText,
  Building2,
  UserRound,
  Printer,
  Eye,
} from 'lucide-react'

import {
  useSettings,
} from '../context/SettingsContext'

import type {
  InvoicePaperSize,
  InvoiceSettings as InvoiceSettingsType,
} from '../types/settings'

export default function InvoiceSettings() {
  const navigate =
    useNavigate()

  const {
    businessProfile,
    invoiceSettings,
    updateInvoiceSettings,
  } = useSettings()

  const [
    form,
    setForm,
  ] =
    useState<InvoiceSettingsType>(
      invoiceSettings
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
    K extends keyof InvoiceSettingsType
  >(
    field: K,
    value: InvoiceSettingsType[K]
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
     SAVE SETTINGS
  ======================================== */

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const prefix =
      form.invoicePrefix.trim()

    const receiptTitle =
      form.receiptTitle.trim()

    if (!prefix) {
      alert(
        'Invoice prefix is required.'
      )

      return
    }

    if (
      form.startingNumber < 1
    ) {
      alert(
        'Starting invoice number must be at least 1.'
      )

      return
    }

    if (!receiptTitle) {
      alert(
        'Receipt title is required.'
      )

      return
    }

    updateInvoiceSettings({
      ...form,

      invoicePrefix:
        prefix.toUpperCase(),

      receiptTitle,

      footerMessage:
        form.footerMessage.trim(),
    })

    setSaved(true)
  }

  /* =======================================
     INVOICE NUMBER PREVIEW
  ======================================== */

  const previewNumber =
    `${form.invoicePrefix || 'INV-'}${String(
      Math.max(
        form.startingNumber,
        1
      )
    ).padStart(
      5,
      '0'
    )}`

  return (
    <div className="invoice-settings-page">

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
                Invoice Settings
              </h1>

              <p>
                Customize invoice
                numbering, layout and
                receipt information.
              </p>

            </div>

          </div>

        </div>

        <div className="business-settings-header-icon">

          <ReceiptText
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

          Invoice settings saved
          successfully.

        </div>

      )}

      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* INVOICE NUMBERING */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <Hash
              size={19}
            />

            <div>

              <h3>
                Invoice Numbering
              </h3>

              <p>
                Configure how new invoice
                numbers should appear.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label>

              Invoice Prefix *

              <input
                type="text"
                value={
                  form.invoicePrefix
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'invoicePrefix',
                    event.target.value
                  )
                }
                placeholder="INV-"
              />

            </label>

            <label>

              Starting Number *

              <input
                type="number"
                min="1"
                value={
                  form.startingNumber
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'startingNumber',
                    Number(
                      event.target.value
                    )
                  )
                }
              />

            </label>

          </div>

          <div className="invoice-number-preview">

            <span>
              NEXT NUMBER PREVIEW
            </span>

            <strong>
              {previewNumber}
            </strong>

          </div>

        </div>

        {/* RECEIPT CONTENT */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <FileText
              size={19}
            />

            <div>

              <h3>
                Receipt Content
              </h3>

              <p>
                Customize invoice title
                and footer message.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label>

              Receipt Title *

              <input
                type="text"
                value={
                  form.receiptTitle
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'receiptTitle',
                    event.target.value
                  )
                }
                placeholder="Tax Invoice"
              />

            </label>

            <label>

              Paper Format

              <select
                value={
                  form.paperSize
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'paperSize',
                    event.target
                      .value as InvoicePaperSize
                  )
                }
              >
                <option value="80mm">
                  80mm Thermal
                </option>

                <option value="A4">
                  A4 Invoice
                </option>
              </select>

            </label>

            <label className="settings-full-field">

              Footer Message

              <textarea
                rows={3}
                value={
                  form.footerMessage
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'footerMessage',
                    event.target.value
                  )
                }
                placeholder="Thank you for shopping with us!"
              />

            </label>

          </div>

        </div>

        {/* BUSINESS DETAILS */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <Building2
              size={19}
            />

            <div>

              <h3>
                Business Information
              </h3>

              <p>
                Choose which business
                details appear on the
                invoice.
              </p>

            </div>

          </div>

          <div className="invoice-option-list">

            <InvoiceToggle
              title="Show Business Name"
              description={
                businessProfile.businessName ||
                'Business name'
              }
              checked={
                form.showBusinessName
              }
              onChange={(
                value
              ) =>
                updateField(
                  'showBusinessName',
                  value
                )
              }
            />

            <InvoiceToggle
              title="Show Business Address"
              description="Display address and business location."
              checked={
                form.showBusinessAddress
              }
              onChange={(
                value
              ) =>
                updateField(
                  'showBusinessAddress',
                  value
                )
              }
            />

            <InvoiceToggle
              title="Show Business Phone"
              description="Display business contact number."
              checked={
                form.showBusinessPhone
              }
              onChange={(
                value
              ) =>
                updateField(
                  'showBusinessPhone',
                  value
                )
              }
            />

            <InvoiceToggle
              title="Show GSTIN"
              description="Display the configured GST registration number."
              checked={
                form.showGSTIN
              }
              onChange={(
                value
              ) =>
                updateField(
                  'showGSTIN',
                  value
                )
              }
            />

            <InvoiceToggle
              title="Show Logo"
              description="Reserve the invoice header for your business logo."
              checked={
                form.showLogo
              }
              onChange={(
                value
              ) =>
                updateField(
                  'showLogo',
                  value
                )
              }
            />

          </div>

        </div>

        {/* CUSTOMER DETAILS */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <UserRound
              size={19}
            />

            <div>

              <h3>
                Customer Information
              </h3>

              <p>
                Choose customer details
                shown on invoices.
              </p>

            </div>

          </div>

          <div className="invoice-option-list">

            <InvoiceToggle
              title="Show Customer Name"
              description="Display the selected customer's name."
              checked={
                form.showCustomerName
              }
              onChange={(
                value
              ) =>
                updateField(
                  'showCustomerName',
                  value
                )
              }
            />

            <InvoiceToggle
              title="Show Customer Phone"
              description="Display customer phone when available."
              checked={
                form.showCustomerPhone
              }
              onChange={(
                value
              ) =>
                updateField(
                  'showCustomerPhone',
                  value
                )
              }
            />

          </div>

        </div>

        {/* TRANSACTION DETAILS */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <Eye
              size={19}
            />

            <div>

              <h3>
                Transaction Information
              </h3>

              <p>
                Control additional billing
                details shown on invoices.
              </p>

            </div>

          </div>

          <div className="invoice-option-list">

            <InvoiceToggle
              title="Show Payment Method"
              description="Display Cash, UPI or Card payment method."
              checked={
                form.showPaymentMethod
              }
              onChange={(
                value
              ) =>
                updateField(
                  'showPaymentMethod',
                  value
                )
              }
            />

            <InvoiceToggle
              title="Show Invoice Date"
              description="Display invoice date and time."
              checked={
                form.showInvoiceDate
              }
              onChange={(
                value
              ) =>
                updateField(
                  'showInvoiceDate',
                  value
                )
              }
            />

          </div>

        </div>

        {/* PRINTING */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <Printer
              size={19}
            />

            <div>

              <h3>
                Printing Behaviour
              </h3>

              <p>
                Configure invoice printing
                preferences.
              </p>

            </div>

          </div>

          <div className="invoice-option-list">

            <InvoiceToggle
              title="Auto Print After Sale"
              description="Automatically prepare printing after a successful sale."
              checked={
                form.autoPrintAfterSale
              }
              onChange={(
                value
              ) =>
                updateField(
                  'autoPrintAfterSale',
                  value
                )
              }
            />

          </div>

        </div>

        {/* DEMO NOTE */}

        <div className="invoice-settings-note">

          <ReceiptText
            size={18}
          />

          <div>

            <strong>
              Invoice integration
            </strong>

            <p>
              These preferences are saved
              now. We will connect them to
              the actual Invoice page in
              the next stage without
              changing previously saved
              sales records.
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

            Save Invoice Settings
          </button>

        </div>

      </form>

    </div>
  )
}

/* =========================================
   REUSABLE TOGGLE
========================================= */

type InvoiceToggleProps = {
  title: string
  description: string
  checked: boolean

  onChange: (
    value: boolean
  ) => void
}

function InvoiceToggle({
  title,
  description,
  checked,
  onChange,
}: InvoiceToggleProps) {
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