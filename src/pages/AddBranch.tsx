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
  Store,
  MapPin,
  Phone,
  Mail,
  ReceiptText,
} from 'lucide-react'

import {
  useBranches,
} from '../context/BranchContext'

import type {
  BranchStatus,
  NewBranch,
} from '../types/branch'

export default function AddBranch() {
  const navigate =
    useNavigate()

  const {
    addBranch,
    branches,
  } = useBranches()

  const [
    form,
    setForm,
  ] =
    useState<NewBranch>({
      name: '',
      code: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state:
        'Tamil Nadu',
      pincode: '',
      gstin: '',
      status:
        'Active',
      isCurrent:
        branches.length === 0,
    })

  function updateField<
    K extends keyof NewBranch
  >(
    field: K,
    value: NewBranch[K]
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (
      !form.name.trim()
    ) {
      alert(
        'Branch name is required.'
      )

      return
    }

    if (
      !form.code.trim()
    ) {
      alert(
        'Branch code is required.'
      )

      return
    }

    const codeExists =
      branches.some(
        (branch) =>
          branch.code
            .trim()
            .toLowerCase() ===
          form.code
            .trim()
            .toLowerCase()
      )

    if (codeExists) {
      alert(
        'This branch code already exists.'
      )

      return
    }

    addBranch({
      ...form,

      name:
        form.name.trim(),

      code:
        form.code
          .trim()
          .toUpperCase(),

      phone:
        form.phone.trim(),

      email:
        form.email.trim(),

      address:
        form.address.trim(),

      city:
        form.city.trim(),

      state:
        form.state.trim(),

      pincode:
        form.pincode.trim(),

      gstin:
        form.gstin
          .trim()
          .toUpperCase(),
    })

    navigate(
      '/settings/branches'
    )
  }

  return (
    <div className="add-branch-page">

      <button
        type="button"
        className="back-button"
        onClick={() =>
          navigate(
            '/settings/branches'
          )
        }
      >

        <ArrowLeft
          size={17}
        />

        Back to Branches

      </button>

      <div className="page-header">

        <div>

          <h1>
            Add Branch
          </h1>

          <p>
            Add another business
            location to RK BillPro.
          </p>

        </div>

      </div>

      <form
        onSubmit={
          handleSubmit
        }
      >

        {/* BRANCH INFO */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <Store
              size={19}
            />

            <div>

              <h3>
                Branch Information
              </h3>

              <p>
                Basic details for this
                business location.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label>

              Branch Name *

              <input
                type="text"
                value={
                  form.name
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'name',
                    event.target.value
                  )
                }
                placeholder="Chromepet Branch"
              />

            </label>

            <label>

              Branch Code *

              <input
                type="text"
                value={
                  form.code
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'code',
                    event.target.value
                  )
                }
                placeholder="CHR-002"
              />

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
                  placeholder="branch@example.com"
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
                  placeholder="GSTIN"
                />

              </div>

            </label>

            <label>

              Status

              <select
                value={
                  form.status
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'status',
                    event.target
                      .value as BranchStatus
                  )
                }
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </label>

          </div>

        </div>

        {/* LOCATION */}

        <div className="settings-form-card">

          <div className="settings-form-card-header">

            <MapPin
              size={19}
            />

            <div>

              <h3>
                Branch Location
              </h3>

              <p>
                Address information for
                this branch.
              </p>

            </div>

          </div>

          <div className="settings-form-grid">

            <label className="settings-full-field">

              Address

              <textarea
                rows={3}
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
                placeholder="Chromepet"
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
                placeholder="600044"
              />

            </label>

            <label className="branch-current-checkbox">

              <input
                type="checkbox"
                checked={
                  form.isCurrent
                }
                disabled={
                  form.status ===
                  'Inactive'
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'isCurrent',
                    event.target.checked
                  )
                }
              />

              <span>

                <strong>
                  Make Current Branch
                </strong>

                <small>
                  Use this branch as the
                  currently selected store.
                </small>

              </span>

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
                '/settings/branches'
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

            Save Branch

          </button>

        </div>

      </form>

    </div>
  )
}