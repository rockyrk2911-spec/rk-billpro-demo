import {
  useState,
  type FormEvent,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  ArrowLeft,
  Check,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

import {
  useUsers,
} from '../context/UserContext'

import type {
  AppUser,
  UserPermission,
  UserRole,
  UserStatus,
} from '../types/user'

/* =========================================
   PERMISSIONS
========================================= */

const allPermissions: {
  value: UserPermission
  label: string
  description: string
}[] = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    description:
      'View business dashboard and summary.',
  },
  {
    value: 'pos',
    label: 'POS Billing',
    description:
      'Create bills and process sales.',
  },
  {
    value: 'sales',
    label: 'Sales',
    description:
      'View sales history and invoices.',
  },
  {
    value: 'products',
    label: 'Products',
    description:
      'View and manage products.',
  },
  {
    value: 'inventory',
    label: 'Inventory',
    description:
      'View stock and inventory information.',
  },
  {
    value: 'purchases',
    label: 'Purchases',
    description:
      'Create and view purchase records.',
  },
  {
    value: 'customers',
    label: 'Customers',
    description:
      'View and manage customers.',
  },
  {
    value: 'suppliers',
    label: 'Suppliers',
    description:
      'View and manage suppliers.',
  },
  {
    value: 'expenses',
    label: 'Expenses',
    description:
      'Create and manage expenses.',
  },
  {
    value: 'reports',
    label: 'Reports',
    description:
      'View business reports.',
  },
  {
    value: 'settings',
    label: 'Settings',
    description:
      'Access business configuration.',
  },
]

/* =========================================
   ROLE PRESETS
========================================= */

const rolePermissions:
  Record<
    UserRole,
    UserPermission[]
  > = {
    'Owner / Admin': [
      'dashboard',
      'pos',
      'sales',
      'products',
      'inventory',
      'purchases',
      'customers',
      'suppliers',
      'expenses',
      'reports',
      'settings',
    ],

    Manager: [
      'dashboard',
      'pos',
      'sales',
      'products',
      'inventory',
      'purchases',
      'customers',
      'suppliers',
      'expenses',
      'reports',
    ],

    Cashier: [
      'dashboard',
      'pos',
      'sales',
      'customers',
    ],

    Accountant: [
      'dashboard',
      'sales',
      'purchases',
      'expenses',
      'reports',
    ],
  }

/* =========================================
   CREATE EDITABLE USER COPY
========================================= */

function createEditableUser(
  user: AppUser | undefined
): AppUser | null {
  if (!user) {
    return null
  }

  return {
    ...user,

    permissions: [
      ...user.permissions,
    ],
  }
}

/* =========================================
   EDIT USER
========================================= */

export default function EditUser() {
  const navigate =
    useNavigate()

  const {
    id,
  } = useParams()

  const {
    users,
    getUserById,
    updateUser,
  } = useUsers()

  const userId =
    Number(id)

  const existingUser =
    getUserById(userId)

  const [
    form,
    setForm,
  ] =
    useState<AppUser | null>(
      () =>
        createEditableUser(
          existingUser
        )
    )

  const [
    error,
    setError,
  ] = useState('')

  const [
    saved,
    setSaved,
  ] = useState(false)

  /* =======================================
     FIELD UPDATE
  ======================================== */

  function updateField<
    K extends keyof AppUser
  >(
    field: K,
    value: AppUser[K]
  ) {
    setForm(
      (current) => {
        if (!current) {
          return current
        }

        return {
          ...current,
          [field]: value,
        }
      }
    )

    setSaved(false)
  }

  /* =======================================
     ROLE
  ======================================== */

  function handleRoleChange(
    role: UserRole
  ) {
    setForm(
      (current) => {
        if (!current) {
          return current
        }

        return {
          ...current,

          role,

          permissions: [
            ...rolePermissions[
              role
            ],
          ],
        }
      }
    )

    setSaved(false)
  }

  /* =======================================
     PERMISSIONS
  ======================================== */

  function togglePermission(
    permission: UserPermission
  ) {
    setForm(
      (current) => {
        if (!current) {
          return current
        }

        const exists =
          current.permissions.includes(
            permission
          )

        return {
          ...current,

          permissions:
            exists
              ? current.permissions.filter(
                  (item) =>
                    item !==
                    permission
                )
              : [
                  ...current.permissions,
                  permission,
                ],
        }
      }
    )

    setSaved(false)
  }

  function selectAllPermissions() {
    updateField(
      'permissions',
      allPermissions.map(
        (item) =>
          item.value
      )
    )
  }

  function clearPermissions() {
    updateField(
      'permissions',
      []
    )
  }

  /* =======================================
     SAVE
  ======================================== */

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!form) {
      return
    }

    setError('')
    setSaved(false)

    const name =
      form.name.trim()

    const email =
      form.email
        .trim()
        .toLowerCase()

    const phone =
      form.phone.trim()

    if (!name) {
      setError(
        'Please enter the user name.'
      )

      return
    }

    if (!email) {
      setError(
        'Please enter the user email.'
      )

      return
    }

    const duplicateEmail =
      users.some(
        (user) =>
          user.id !==
            form.id &&
          user.email
            .trim()
            .toLowerCase() ===
            email
      )

    if (duplicateEmail) {
      setError(
        'Another user already uses this email.'
      )

      return
    }

    if (
      form.permissions.length ===
      0
    ) {
      setError(
        'Select at least one permission.'
      )

      return
    }

    updateUser({
      ...form,
      name,
      email,
      phone,
    })

    setSaved(true)

    window.setTimeout(
      () => {
        navigate(
          '/settings/users'
        )
      },
      500
    )
  }

  /* =======================================
     USER NOT FOUND
  ======================================== */

  if (!form) {
    return (
      <div className="add-user-page">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate(
              '/settings/users'
            )
          }
        >
          <ArrowLeft
            size={17}
          />

          Back to Users
        </button>

        <div className="user-not-found-card">

          <UserRound
            size={34}
          />

          <h2>
            User Not Found
          </h2>

          <p>
            This user does not exist
            or may have been removed
            from local demo data.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate(
                '/settings/users'
              )
            }
          >
            Return to Users
          </button>

        </div>

      </div>
    )
  }

  /* =======================================
     PAGE
  ======================================== */

  return (
    <div className="add-user-page">

      <button
        type="button"
        className="back-button"
        onClick={() =>
          navigate(
            '/settings/users'
          )
        }
      >
        <ArrowLeft
          size={17}
        />

        Back to Users
      </button>

      <div className="page-header">

        <h1>
          Edit User
        </h1>

        <p>
          Update staff information,
          role, status and demo
          permissions.
        </p>

      </div>

      <form
        className="user-form-layout"
        onSubmit={
          handleSubmit
        }
      >

        <div className="user-form-main">

          {/* USER DETAILS */}

          <div className="user-form-card">

            <div className="user-form-title">

              <UserRound
                size={21}
              />

              <div>

                <h3>
                  User Information
                </h3>

                <p>
                  Update this staff
                  profile.
                </p>

              </div>

            </div>

            <div className="user-form-grid">

              <div className="form-group">

                <label>
                  Full Name *
                </label>

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
                      event.target
                        .value
                    )
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Phone
                </label>

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
                      event.target
                        .value
                    )
                  }
                />

              </div>

              <div className="form-group user-form-full">

                <label>
                  Email *
                </label>

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
                      event.target
                        .value
                    )
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Role
                </label>

                <select
                  value={
                    form.role
                  }
                  onChange={(
                    event
                  ) =>
                    handleRoleChange(
                      event.target
                        .value as UserRole
                    )
                  }
                >
                  <option value="Owner / Admin">
                    Owner / Admin
                  </option>

                  <option value="Manager">
                    Manager
                  </option>

                  <option value="Cashier">
                    Cashier
                  </option>

                  <option value="Accountant">
                    Accountant
                  </option>
                </select>

              </div>

              <div className="form-group">

                <label>
                  Status
                </label>

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
                        .value as UserStatus
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

              </div>

            </div>

          </div>

          {/* PERMISSIONS */}

          <div className="user-form-card">

            <div className="permission-header">

              <div className="user-form-title">

                <ShieldCheck
                  size={21}
                />

                <div>

                  <h3>
                    Permissions
                  </h3>

                  <p>
                    Change which
                    modules this user
                    can access.
                  </p>

                </div>

              </div>

              <div className="permission-actions">

                <button
                  type="button"
                  onClick={
                    selectAllPermissions
                  }
                >
                  Select All
                </button>

                <button
                  type="button"
                  onClick={
                    clearPermissions
                  }
                >
                  Clear
                </button>

              </div>

            </div>

            <div className="permission-grid">

              {allPermissions.map(
                (permission) => {
                  const selected =
                    form.permissions.includes(
                      permission.value
                    )

                  return (
                    <button
                      key={
                        permission.value
                      }
                      type="button"
                      className={
                        selected
                          ? 'permission-card selected'
                          : 'permission-card'
                      }
                      onClick={() =>
                        togglePermission(
                          permission.value
                        )
                      }
                    >

                      <div className="permission-check">

                        {selected && (
                          <Check
                            size={15}
                          />
                        )}

                      </div>

                      <div>

                        <strong>
                          {
                            permission
                              .label
                          }
                        </strong>

                        <span>
                          {
                            permission
                              .description
                          }
                        </span>

                      </div>

                    </button>
                  )
                }
              )}

            </div>

          </div>

        </div>

        {/* SUMMARY */}

        <aside className="user-form-summary">

          <h3>
            User Summary
          </h3>

          <div className="user-preview-avatar">

            {form.name
              .trim()
              .charAt(0)
              .toUpperCase() ||
              'U'}

          </div>

          <strong className="user-preview-name">
            {form.name.trim() ||
              'User'}
          </strong>

          <span className="user-preview-email">
            {form.email.trim() ||
              'No email'}
          </span>

          <div className="user-summary-row">

            <span>
              Role
            </span>

            <strong>
              {form.role}
            </strong>

          </div>

          <div className="user-summary-row">

            <span>
              Status
            </span>

            <strong>
              {form.status}
            </strong>

          </div>

          <div className="user-summary-row">

            <span>
              Permissions
            </span>

            <strong>
              {
                form.permissions
                  .length
              }
              /
              {
                allPermissions
                  .length
              }
            </strong>

          </div>

          {error && (
            <div className="user-form-error">
              {error}
            </div>
          )}

          {saved && (
            <div className="user-form-success">
              User updated successfully.
            </div>
          )}

          <button
            type="submit"
            className="complete-payment-button"
          >
            <Save
              size={18}
            />

            Save Changes
          </button>

          <p className="user-security-note">
            Role permissions are
            stored locally for this
            frontend demo.
          </p>

        </aside>

      </form>

    </div>
  )
}