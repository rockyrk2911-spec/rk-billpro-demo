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
  Percent,
  Building2,
  FileText,
  BadgeIndianRupee,
} from 'lucide-react'

import {
  useSettings,
} from '../context/SettingsContext'

import type {
  TaxSettings as TaxSettingsType,
} from '../types/settings'

const supportedTaxRates = [
  0,
  5,
  12,
  18,
  28,
]

export default function TaxSettings() {
  const navigate =
    useNavigate()

  const {
    businessProfile,
    taxSettings,
    updateTaxSettings,
  } = useSettings()

  const [
    form,
    setForm,
  ] =
    useState<TaxSettingsType>(
      taxSettings
    )

  const [
    saved,
    setSaved,
  ] =
    useState(false)

  /* =========================================
     UPDATE FIELD
  ========================================= */

  function updateField<
    K extends keyof TaxSettingsType
  >(
    field: K,
    value: TaxSettingsType[K]
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )

    setSaved(false)
  }

  /* =========================================
     ENABLE / DISABLE TAX RATE
  ========================================= */

  function toggleTaxRate(
    rate: number
  ) {
    setForm(
      (current) => {
        const exists =
          current.availableTaxRates.includes(
            rate
          )

        let updatedRates =
          exists
            ? current.availableTaxRates.filter(
                (item) =>
                  item !== rate
              )
            : [
                ...current.availableTaxRates,
                rate,
              ]

        updatedRates =
          updatedRates.sort(
            (a, b) =>
              a - b
          )

        let nextDefaultRate =
          current.defaultTaxRate

        if (
          !updatedRates.includes(
            nextDefaultRate
          )
        ) {
          nextDefaultRate =
            updatedRates[0] ?? 0
        }

        return {
          ...current,

          availableTaxRates:
            updatedRates,

          defaultTaxRate:
            nextDefaultRate,
        }
      }
    )

    setSaved(false)
  }

  /* =========================================
     SAVE TAX SETTINGS
  ========================================= */

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (
      form.gstEnabled &&
      form.availableTaxRates.length ===
        0
    ) {
      alert(
        'Select at least one GST rate.'
      )

      return
    }

    if (
      form.gstEnabled &&
      !form.availableTaxRates.includes(
        form.defaultTaxRate
      )
    ) {
      alert(
        'Default GST rate must be one of the enabled tax rates.'
      )

      return
    }

    updateTaxSettings({
      ...form,

      gstin:
        form.gstin
          .trim()
          .toUpperCase(),

      businessState:
        form.businessState.trim(),
    })

    setSaved(true)
  }

  return (
    <div className="tax-settings-page">

      {/* =====================================
          HEADER
      ====================================== */}

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
                GST & Tax
              </h1>

              <p>
                Configure tax preferences
                used by RK BillPro.
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

      {/* =====================================
          SUCCESS MESSAGE
      ====================================== */}

      {saved && (

        <div className="settings-success-message">

          <CheckCircle2
            size={18}
          />

          GST & tax settings saved
          successfully.

        </div>

      )}

      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* ===================================
            GST STATUS
        ==================================== */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <BadgeIndianRupee
              size={19}
            />

            <div>

              <h3>
                GST Configuration
              </h3>

              <p>
                Enable or disable GST
                calculations for billing.
              </p>

            </div>

          </div>

          <div className="tax-settings-body">

            <div className="tax-toggle-row">

              <div>

                <strong>
                  Enable GST
                </strong>

                <p>
                  Allow GST configuration
                  for products, billing and
                  invoices.
                </p>

              </div>

              <label className="settings-switch">

                <input
                  type="checkbox"
                  checked={
                    form.gstEnabled
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'gstEnabled',
                      event.target.checked
                    )
                  }
                />

                <span className="settings-switch-slider" />

              </label>

            </div>

          </div>

        </div>

        {/* ===================================
            GST REGISTRATION
        ==================================== */}

        <div
          className={
            form.gstEnabled
              ? 'settings-form-card'
              : 'settings-form-card tax-settings-disabled'
          }
        >

          <div className="settings-form-card-header">

            <Building2
              size={19}
            />

            <div>

              <h3>
                GST Registration
              </h3>

              <p>
                Business tax registration
                information.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label>

              GSTIN

              <input
                type="text"
                value={
                  form.gstin
                }
                disabled={
                  !form.gstEnabled
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'gstin',
                    event.target.value
                  )
                }
                placeholder={
                  businessProfile.gstin ||
                  'Enter GSTIN'
                }
              />

            </label>

            <label>

              Business State

              <input
                type="text"
                value={
                  form.businessState
                }
                disabled={
                  !form.gstEnabled
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'businessState',
                    event.target.value
                  )
                }
                placeholder={
                  businessProfile.state ||
                  'Tamil Nadu'
                }
              />

            </label>

          </div>

        </div>

        {/* ===================================
            TAX CALCULATION MODE
        ==================================== */}

        <div
          className={
            form.gstEnabled
              ? 'settings-form-card'
              : 'settings-form-card tax-settings-disabled'
          }
        >

          <div className="settings-form-card-header">

            <Percent
              size={19}
            />

            <div>

              <h3>
                Tax Calculation
              </h3>

              <p>
                Choose how product prices
                should be interpreted.
              </p>

            </div>

          </div>

          <div className="tax-calculation-options">

            {/* EXCLUSIVE */}

            <button
              type="button"
              disabled={
                !form.gstEnabled
              }
              className={
                form.calculationMode ===
                'Exclusive'
                  ? 'tax-mode-card selected'
                  : 'tax-mode-card'
              }
              onClick={() =>
                updateField(
                  'calculationMode',
                  'Exclusive'
                )
              }
            >

              <div className="tax-mode-radio">

                {form.calculationMode ===
                  'Exclusive' && (

                  <span />

                )}

              </div>

              <div>

                <strong>
                  Tax Exclusive
                </strong>

                <p>
                  GST is calculated and
                  added on top of the
                  product price.
                </p>

                <small>
                  Example: ₹100 + 18% GST
                  = ₹118
                </small>

              </div>

            </button>

            {/* INCLUSIVE */}

            <button
              type="button"
              disabled={
                !form.gstEnabled
              }
              className={
                form.calculationMode ===
                'Inclusive'
                  ? 'tax-mode-card selected'
                  : 'tax-mode-card'
              }
              onClick={() =>
                updateField(
                  'calculationMode',
                  'Inclusive'
                )
              }
            >

              <div className="tax-mode-radio">

                {form.calculationMode ===
                  'Inclusive' && (

                  <span />

                )}

              </div>

              <div>

                <strong>
                  Tax Inclusive
                </strong>

                <p>
                  The displayed product
                  price already contains
                  GST.
                </p>

                <small>
                  Example: ₹118 includes
                  18% GST
                </small>

              </div>

            </button>

          </div>

        </div>

        {/* ===================================
            GST RATES
        ==================================== */}

        <div
          className={
            form.gstEnabled
              ? 'settings-form-card'
              : 'settings-form-card tax-settings-disabled'
          }
        >

          <div className="settings-form-card-header">

            <Percent
              size={19}
            />

            <div>

              <h3>
                GST Rates
              </h3>

              <p>
                Select the rates available
                while configuring products.
              </p>

            </div>

          </div>

          <div className="tax-rate-section">

            <span className="tax-section-label">
              AVAILABLE RATES
            </span>

            <div className="tax-rate-grid">

              {supportedTaxRates.map(
                (rate) => {
                  const enabled =
                    form.availableTaxRates.includes(
                      rate
                    )

                  return (
                    <button
                      key={rate}
                      type="button"
                      disabled={
                        !form.gstEnabled
                      }
                      className={
                        enabled
                          ? 'tax-rate-button selected'
                          : 'tax-rate-button'
                      }
                      onClick={() =>
                        toggleTaxRate(
                          rate
                        )
                      }
                    >

                      <span>
                        {rate}%
                      </span>

                      <small>
                        {enabled
                          ? 'Enabled'
                          : 'Disabled'}
                      </small>

                    </button>
                  )
                }
              )}

            </div>

            {/* DEFAULT RATE */}

            <div className="tax-default-rate">

              <label>

                Default GST Rate

                <select
                  value={
                    form.defaultTaxRate
                  }
                  disabled={
                    !form.gstEnabled ||
                    form.availableTaxRates.length ===
                      0
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'defaultTaxRate',
                      Number(
                        event.target.value
                      )
                    )
                  }
                >

                  {form.availableTaxRates.map(
                    (rate) => (

                      <option
                        key={rate}
                        value={rate}
                      >
                        {rate}% GST
                      </option>

                    )
                  )}

                </select>

              </label>

            </div>

          </div>

        </div>

        {/* ===================================
            INVOICE TAX OPTIONS
        ==================================== */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <FileText
              size={19}
            />

            <div>

              <h3>
                Invoice Tax Display
              </h3>

              <p>
                Choose which tax
                information appears on
                invoices.
              </p>

            </div>

          </div>

          <div className="tax-settings-body">

            {/* SHOW TAX */}

            <div className="tax-toggle-row">

              <div>

                <strong>
                  Show Tax on Invoice
                </strong>

                <p>
                  Display GST amounts in
                  the invoice summary.
                </p>

              </div>

              <label className="settings-switch">

                <input
                  type="checkbox"
                  checked={
                    form.showTaxOnInvoice
                  }
                  disabled={
                    !form.gstEnabled
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'showTaxOnInvoice',
                      event.target.checked
                    )
                  }
                />

                <span className="settings-switch-slider" />

              </label>

            </div>

            {/* SHOW HSN */}

            <div className="tax-toggle-row">

              <div>

                <strong>
                  Show HSN on Invoice
                </strong>

                <p>
                  Prepare the invoice
                  layout to display HSN
                  information.
                </p>

              </div>

              <label className="settings-switch">

                <input
                  type="checkbox"
                  checked={
                    form.showHSNOnInvoice
                  }
                  disabled={
                    !form.gstEnabled
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'showHSNOnInvoice',
                      event.target.checked
                    )
                  }
                />

                <span className="settings-switch-slider" />

              </label>

            </div>

          </div>

        </div>

        {/* ===================================
            INFORMATION NOTE
        ==================================== */}

        <div className="tax-settings-note">

          <ReceiptText
            size={18}
          />

          <div>

            <strong>
              Demo configuration
            </strong>

            <p>
              These GST settings are saved
              in RK BillPro. Existing sales
              and purchase records are not
              automatically recalculated.
              Billing integration will be
              connected separately.
            </p>

          </div>

        </div>

        {/* ===================================
            ACTION BUTTONS
        ==================================== */}

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

            Save Tax Settings
          </button>

        </div>

      </form>

    </div>
  )
}