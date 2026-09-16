import {
  useState,
  type FormEvent,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Check,
  ShieldCheck,
  UserPlus,
} from 'lucide-react'

import {
  useUsers,
} from '../context/UserContext'

import type {
  NewAppUser,
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
   ROLE DEFAULT PERMISSIONS
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
   ADD USER
========================================= */

export default function AddUser() {
  const navigate =
    useNavigate()

  const {
    addUser,
    users,
  } = useUsers()

  const [
    form,
    setForm,
  ] =
    useState<NewAppUser>({
      name: '',
      email: '',
      phone: '',

      role:
        'Cashier',

      permissions:
        rolePermissions.Cashier,

      status:
        'Active',
    })

  const [
    error,
    setError,
  ] = useState('')

  /* =======================================
     INPUT
  ======================================== */

  function updateField<
    K extends keyof NewAppUser
  >(
    field: K,
    value: NewAppUser[K]
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )
  }

  /* =======================================
     ROLE
  ======================================== */

  function handleRoleChange(
    role: UserRole
  ) {
    setForm(
      (current) => ({
        ...current,
        role,

        permissions: [
          ...rolePermissions[
            role
          ],
        ],
      })
    )
  }

  /* =======================================
     PERMISSION
  ======================================== */

  function togglePermission(
    permission:
      UserPermission
  ) {
    setForm(
      (current) => {
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
  }

  /* =======================================
     SELECT ALL
  ======================================== */

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
     SUBMIT
  ======================================== */

  function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError('')

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

    const emailExists =
      users.some(
        (user) =>
          user.email
            .trim()
            .toLowerCase() ===
          email
      )

    if (emailExists) {
      setError(
        'A user with this email already exists.'
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

    addUser({
      ...form,

      name,
      email,
      phone,
    })

    navigate(
      '/settings/users'
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
          Add User
        </h1>

        <p>
          Create a staff profile and
          configure its demo
          permissions.
        </p>

      </div>

      <form
        className="user-form-layout"
        onSubmit={
          handleSubmit
        }
      >

        {/* =================================
            LEFT
        ================================== */}

        <div className="user-form-main">

          <div className="user-form-card">

            <div className="user-form-title">

              <UserPlus
                size={21}
              />

              <div>
                <h3>
                  User Information
                </h3>

                <p>
                  Basic staff account
                  information.
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
                  placeholder="Example: Arun Kumar"
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
                  placeholder="9876543210"
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
                  placeholder="staff@example.com"
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
                        .value as
                        UserRole
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
                        .value as
                        UserStatus
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
                    Choose which modules
                    this user can access.
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
                      type="button"
                      key={
                        permission.value
                      }
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

        {/* =================================
            RIGHT SUMMARY
        ================================== */}

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
              'New User'}
          </strong>

          <span className="user-preview-email">
            {form.email.trim() ||
              'No email entered'}
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

          <button
            type="submit"
            className="complete-payment-button"
          >
            <UserPlus
              size={18}
            />

            Create User
          </button>

          <p className="user-security-note">
            Demo profile only. No
            password or real login
            credentials are stored in
            localStorage.
          </p>

        </aside>

      </form>

    </div>
  )
}