import {
  useState,
  type FormEvent,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Printer,
  Save,
  CheckCircle2,
  MonitorCog,
  ReceiptText,
  Copy,
  Maximize2,
  Info,
  TestTube2,
} from 'lucide-react'

import {
  useSettings,
} from '../context/SettingsContext'

import type {
  PrinterSettings as PrinterSettingsType,
  PrinterType,
  ThermalPaperWidth,
  PrintOrientation,
} from '../types/settings'

export default function PrinterSettings() {
  const navigate =
    useNavigate()

  const {
    businessProfile,
    printerSettings,
    updatePrinterSettings,
  } = useSettings()

  const [
    form,
    setForm,
  ] =
    useState<PrinterSettingsType>(
      printerSettings
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
    K extends keyof PrinterSettingsType
  >(
    field: K,
    value: PrinterSettingsType[K]
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

    const printerName =
      form.printerName.trim()

    if (!printerName) {
      alert(
        'Enter a printer name.'
      )

      return
    }

    if (
      form.copies < 1 ||
      form.copies > 5
    ) {
      alert(
        'Number of copies must be between 1 and 5.'
      )

      return
    }

    updatePrinterSettings({
      ...form,

      printerName,

      copies:
        Math.max(
          1,
          Math.min(
            5,
            form.copies
          )
        ),
    })

    setSaved(true)
  }

  /* =======================================
     TEST PRINT
  ======================================== */

  function handleTestPrint() {
    window.print()
  }

  return (
    <div className="printer-settings-page">

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
                Printer Settings
              </h1>

              <p>
                Configure receipt and
                invoice printing
                preferences.
              </p>

            </div>

          </div>

        </div>

        <div className="business-settings-header-icon">

          <Printer
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

          Printer settings saved
          successfully.

        </div>

      )}

      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* PRINTER */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <MonitorCog
              size={19}
            />

            <div>

              <h3>
                Printer
              </h3>

              <p>
                Configure the printer
                used at this billing
                counter.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label>

              Printer Name

              <input
                type="text"
                value={
                  form.printerName
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'printerName',
                    event.target.value
                  )
                }
                placeholder="Default Printer"
              />

            </label>

            <label>

              Printer Type

              <select
                value={
                  form.printerType
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'printerType',
                    event.target
                      .value as PrinterType
                  )
                }
              >
                <option value="Thermal">
                  Thermal Receipt Printer
                </option>

                <option value="A4">
                  A4 Printer
                </option>
              </select>

            </label>

          </div>

          <div className="printer-browser-note">

            <Info
              size={16}
            />

            <p>
              RK BillPro's browser demo
              stores this printer name as
              a preference. The browser
              print dialog controls the
              physical printer selection.
            </p>

          </div>

        </div>

        {/* PAPER */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <ReceiptText
              size={19}
            />

            <div>

              <h3>
                Paper Configuration
              </h3>

              <p>
                Select receipt width and
                print orientation.
              </p>

            </div>

          </div>

          <div className="printer-type-options">

            <button
              type="button"
              className={
                form.printerType ===
                'Thermal'
                  ? 'printer-type-card selected'
                  : 'printer-type-card'
              }
              onClick={() =>
                updateField(
                  'printerType',
                  'Thermal'
                )
              }
            >
              <ReceiptText
                size={21}
              />

              <strong>
                Thermal
              </strong>

              <span>
                POS receipt printer
              </span>
            </button>

            <button
              type="button"
              className={
                form.printerType ===
                'A4'
                  ? 'printer-type-card selected'
                  : 'printer-type-card'
              }
              onClick={() =>
                updateField(
                  'printerType',
                  'A4'
                )
              }
            >
              <Maximize2
                size={21}
              />

              <strong>
                A4
              </strong>

              <span>
                Full-size invoice
              </span>
            </button>

          </div>

          <div className="settings-form-grid">

            {form.printerType ===
              'Thermal' && (

              <label>

                Thermal Paper Width

                <select
                  value={
                    form.thermalPaperWidth
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'thermalPaperWidth',
                      event.target
                        .value as ThermalPaperWidth
                    )
                  }
                >
                  <option value="58mm">
                    58mm
                  </option>

                  <option value="80mm">
                    80mm
                  </option>
                </select>

              </label>

            )}

            <label>

              Orientation

              <select
                value={
                  form.orientation
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'orientation',
                    event.target
                      .value as PrintOrientation
                  )
                }
              >
                <option value="Portrait">
                  Portrait
                </option>

                <option value="Landscape">
                  Landscape
                </option>
              </select>

            </label>

          </div>

        </div>

        {/* COPIES */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <Copy
              size={19}
            />

            <div>

              <h3>
                Copies
              </h3>

              <p>
                Configure default invoice
                copy preferences.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label>

              Number of Copies

              <input
                type="number"
                min="1"
                max="5"
                value={
                  form.copies
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'copies',
                    Number(
                      event.target.value
                    )
                  )
                }
              />

            </label>

          </div>

          <div className="invoice-option-list">

            <PrinterToggle
              title="Customer Copy"
              description="Prepare a receipt copy for the customer."
              checked={
                form.printCustomerCopy
              }
              onChange={(
                value
              ) =>
                updateField(
                  'printCustomerCopy',
                  value
                )
              }
            />

            <PrinterToggle
              title="Business Copy"
              description="Prepare an additional copy for business records."
              checked={
                form.printBusinessCopy
              }
              onChange={(
                value
              ) =>
                updateField(
                  'printBusinessCopy',
                  value
                )
              }
            />

          </div>

        </div>

        {/* MARGINS */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <Maximize2
              size={19}
            />

            <div>

              <h3>
                Print Margins
              </h3>

              <p>
                Set preferred margins in
                millimetres.
              </p>

            </div>

          </div>

          <div className="printer-margin-grid">

            <MarginField
              label="Top"
              value={
                form.topMargin
              }
              onChange={(
                value
              ) =>
                updateField(
                  'topMargin',
                  value
                )
              }
            />

            <MarginField
              label="Bottom"
              value={
                form.bottomMargin
              }
              onChange={(
                value
              ) =>
                updateField(
                  'bottomMargin',
                  value
                )
              }
            />

            <MarginField
              label="Left"
              value={
                form.leftMargin
              }
              onChange={(
                value
              ) =>
                updateField(
                  'leftMargin',
                  value
                )
              }
            />

            <MarginField
              label="Right"
              value={
                form.rightMargin
              }
              onChange={(
                value
              ) =>
                updateField(
                  'rightMargin',
                  value
                )
              }
            />

          </div>

        </div>

        {/* PRINT BEHAVIOUR */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <Printer
              size={19}
            />

            <div>

              <h3>
                Print Behaviour
              </h3>

              <p>
                Configure what should
                happen after billing.
              </p>

            </div>

          </div>

          <div className="invoice-option-list">

            <PrinterToggle
              title="Auto Print After Sale"
              description="Save the preference to print after successful billing."
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

            <PrinterToggle
              title="Open Browser Print Dialog"
              description="Use the browser print window when printing invoices."
              checked={
                form.openPrintDialog
              }
              onChange={(
                value
              ) =>
                updateField(
                  'openPrintDialog',
                  value
                )
              }
            />

          </div>

        </div>

        {/* TEST RECEIPT */}

        <div className="printer-test-card no-print">

          <div className="printer-test-header">

            <div>

              <span>
                PRINT PREVIEW
              </span>

              <h3>
                Test Receipt
              </h3>

            </div>

            <TestTube2
              size={21}
            />

          </div>

          <div
            className={
              form.printerType ===
              'Thermal'
                ? `printer-test-receipt printer-test-${form.thermalPaperWidth}`
                : 'printer-test-receipt printer-test-a4'
            }
          >
            <strong>
              {businessProfile.businessName ||
                'RK Supermarket'}
            </strong>

            <span>
              TEST RECEIPT
            </span>

            <div className="printer-test-line" />

            <p>
              Printer:{' '}
              {form.printerName ||
                'Default Printer'}
            </p>

            <p>
              Type:{' '}
              {form.printerType}
            </p>

            {form.printerType ===
              'Thermal' && (

              <p>
                Paper:{' '}
                {form.thermalPaperWidth}
              </p>

            )}

            <p>
              Copies: {form.copies}
            </p>

            <div className="printer-test-line" />

            <strong>
              RK BillPro
            </strong>

            <small>
              Printer configuration test
            </small>

          </div>

          <button
            type="button"
            className="printer-test-button"
            onClick={
              handleTestPrint
            }
          >
            <Printer
              size={17}
            />

            Open Print Test
          </button>

        </div>

        {/* NOTE */}

        <div className="invoice-settings-note">

          <Info
            size={18}
          />

          <div>

            <strong>
              Browser demo limitation
            </strong>

            <p>
              These settings are stored
              locally for the RK BillPro
              demo. Direct silent printing,
              USB printer discovery and
              automatic hardware control
              require additional desktop or
              device integration in the
              production version.
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

            Save Printer Settings
          </button>

        </div>

      </form>

    </div>
  )
}

/* =========================================
   TOGGLE
========================================= */

type PrinterToggleProps = {
  title: string
  description: string
  checked: boolean

  onChange: (
    value: boolean
  ) => void
}

function PrinterToggle({
  title,
  description,
  checked,
  onChange,
}: PrinterToggleProps) {
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

/* =========================================
   MARGIN FIELD
========================================= */

type MarginFieldProps = {
  label: string
  value: number

  onChange: (
    value: number
  ) => void
}

function MarginField({
  label,
  value,
  onChange,
}: MarginFieldProps) {
  return (
    <label>

      {label}

      <div className="printer-margin-input">

        <input
          type="number"
          min="0"
          max="50"
          value={
            value
          }
          onChange={(
            event
          ) =>
            onChange(
              Math.max(
                0,
                Number(
                  event.target.value
                )
              )
            )
          }
        />

        <span>
          mm
        </span>

      </div>

    </label>
  )
}