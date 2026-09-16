import { useState } from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Building2,
  Save,
  MapPin,
  Phone,
  Mail,
  BadgeIndianRupee,
  ReceiptText,
  User,
  CheckCircle2,
} from 'lucide-react'

import {
  useSettings,
} from '../context/SettingsContext'

import type {
  BusinessProfile,
} from '../types/settings'

export default function BusinessSettings() {
  const navigate =
    useNavigate()

  const {
    businessProfile,
    updateBusinessProfile,
  } = useSettings()

  const [
    form,
    setForm,
  ] =
    useState<BusinessProfile>(
      businessProfile
    )

  const [
    saved,
    setSaved,
  ] =
    useState(false)

  /* =======================================
     UPDATE FIELD
  ======================================== */

  function updateField(
    field: keyof BusinessProfile,
    value: string
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
     SAVE BUSINESS PROFILE
  ======================================== */

  function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (
      !form.businessName.trim()
    ) {
      alert(
        'Business name is required.'
      )

      return
    }

    if (
      !form.ownerName.trim()
    ) {
      alert(
        'Owner name is required.'
      )

      return
    }

    updateBusinessProfile({
      ...form,

      businessName:
        form.businessName.trim(),

      ownerName:
        form.ownerName.trim(),

      phone:
        form.phone.trim(),

      email:
        form.email.trim(),

      gstin:
        form.gstin
          .trim()
          .toUpperCase(),

      address:
        form.address.trim(),

      city:
        form.city.trim(),

      state:
        form.state.trim(),

      pincode:
        form.pincode.trim(),
    })

    setSaved(true)
  }

  return (
    <div className="business-settings-page">

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
                Business Profile
              </h1>

              <p>
                Configure your business
                identity and contact
                information.
              </p>

            </div>

          </div>

        </div>

        <div className="business-settings-header-icon">

          <Building2
            size={23}
          />

        </div>

      </div>

      {/* SAVED MESSAGE */}

      {saved && (

        <div className="settings-success-message">

          <CheckCircle2
            size={18}
          />

          Business profile saved
          successfully.

        </div>

      )}

      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* BUSINESS INFORMATION */}

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
                Main information about
                your business.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label>

              Business Name *

              <div className="settings-input">

                <Building2
                  size={16}
                />

                <input
                  type="text"
                  value={
                    form.businessName
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'businessName',
                      event.target.value
                    )
                  }
                  placeholder="Business name"
                />

              </div>

            </label>

            <label>

              Owner Name *

              <div className="settings-input">

                <User
                  size={16}
                />

                <input
                  type="text"
                  value={
                    form.ownerName
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'ownerName',
                      event.target.value
                    )
                  }
                  placeholder="Owner name"
                />

              </div>

            </label>

            <label>

              Phone

              <div className="settings-input">

                <Phone
                  size={16}
                />

                <input
                  type="tel"
                  value={
                    form.phone
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'phone',
                      event.target.value
                    )
                  }
                  placeholder="+91 98765 43210"
                />

              </div>

            </label>

            <label>

              Email

              <div className="settings-input">

                <Mail
                  size={16}
                />

                <input
                  type="email"
                  value={
                    form.email
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'email',
                      event.target.value
                    )
                  }
                  placeholder="business@example.com"
                />

              </div>

            </label>

            <label>

              GSTIN

              <div className="settings-input">

                <ReceiptText
                  size={16}
                />

                <input
                  type="text"
                  value={
                    form.gstin
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'gstin',
                      event.target.value
                    )
                  }
                  placeholder="GST registration number"
                />

              </div>

            </label>

            <label>

              Currency

              <div className="settings-input">

                <BadgeIndianRupee
                  size={16}
                />

                <select
                  value={
                    form.currency
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'currency',
                      event.target.value
                    )
                  }
                >
                  <option value="INR">
                    INR — Indian Rupee
                  </option>
                </select>

              </div>

            </label>

          </div>

        </div>

        {/* ADDRESS */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <MapPin
              size={19}
            />

            <div>

              <h3>
                Business Address
              </h3>

              <p>
                Location information used
                for business records and
                invoices.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label className="settings-full-field">

              Address

              <textarea
                value={
                  form.address
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'address',
                    event.target.value
                  )
                }
                placeholder="Street, area, building..."
                rows={3}
              />

            </label>

            <label>

              City

              <input
                type="text"
                value={
                  form.city
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'city',
                    event.target.value
                  )
                }
              />

            </label>

            <label>

              State

              <input
                type="text"
                value={
                  form.state
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'state',
                    event.target.value
                  )
                }
              />

            </label>

            <label>

              Pincode

              <input
                type="text"
                value={
                  form.pincode
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'pincode',
                    event.target.value
                  )
                }
                placeholder="600000"
              />

            </label>

            <label>

              Financial Year Starts

              <select
                value={
                  form.financialYearStart
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'financialYearStart',
                    event.target.value
                  )
                }
              >
                <option value="April">
                  April
                </option>

                <option value="January">
                  January
                </option>
              </select>

            </label>

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

            Save Changes
          </button>

        </div>

      </form>

    </div>
  )
}