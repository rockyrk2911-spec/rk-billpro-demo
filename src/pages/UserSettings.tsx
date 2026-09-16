import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Edit3,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react'

import {
  useUsers,
} from '../context/UserContext'

export default function UserSettings() {
  const navigate =
    useNavigate()

  const {
    users,
    updateUser,
  } = useUsers()

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<
      'All' |
      'Active' |
      'Inactive'
    >('All')

  const filteredUsers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      return users.filter(
        (user) => {
          const matchesSearch =
            !query ||
            user.name
              .toLowerCase()
              .includes(query) ||
            user.email
              .toLowerCase()
              .includes(query) ||
            user.phone
              .toLowerCase()
              .includes(query) ||
            user.role
              .toLowerCase()
              .includes(query)

          const matchesStatus =
            statusFilter ===
              'All' ||
            user.status ===
              statusFilter

          return (
            matchesSearch &&
            matchesStatus
          )
        }
      )
    }, [
      users,
      search,
      statusFilter,
    ])

  const activeCount =
    users.filter(
      (user) =>
        user.status ===
        'Active'
    ).length

  const inactiveCount =
    users.length -
    activeCount

  function toggleStatus(
    id: number
  ) {
    const user =
      users.find(
        (item) =>
          item.id === id
      )

    if (!user) {
      return
    }

    updateUser({
      ...user,

      status:
        user.status ===
        'Active'
          ? 'Inactive'
          : 'Active',
    })
  }

  return (
    <div className="users-settings-page">

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

      <div className="page-header users-settings-header">

        <div>
          <h1>
            Users & Roles
          </h1>

          <p>
            Manage staff accounts,
            roles and demo
            permissions.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate(
              '/settings/users/add'
            )
          }
        >
          <Plus
            size={18}
          />

          Add User
        </button>

      </div>

      {/* SUMMARY */}

      <div className="user-summary-grid">

        <div className="user-summary-card">

          <Users
            size={22}
          />

          <div>
            <span>
              Total Users
            </span>

            <strong>
              {users.length}
            </strong>
          </div>

        </div>

        <div className="user-summary-card">

          <UserCheck
            size={22}
          />

          <div>
            <span>
              Active
            </span>

            <strong>
              {activeCount}
            </strong>
          </div>

        </div>

        <div className="user-summary-card">

          <UserX
            size={22}
          />

          <div>
            <span>
              Inactive
            </span>

            <strong>
              {inactiveCount}
            </strong>
          </div>

        </div>

        <div className="user-summary-card">

          <ShieldCheck
            size={22}
          />

          <div>
            <span>
              Roles
            </span>

            <strong>
              4
            </strong>
          </div>

        </div>

      </div>

      {/* FILTERS */}

      <div className="users-filter-card">

        <div className="users-search">

          <Search
            size={18}
          />

          <input
            type="text"
            placeholder="Search user, email or role..."
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
              )
            }
          />

        </div>

        <select
          value={
            statusFilter
          }
          onChange={(
            event
          ) =>
            setStatusFilter(
              event.target
                .value as
                | 'All'
                | 'Active'
                | 'Inactive'
            )
          }
        >
          <option value="All">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>

      </div>

      {/* TABLE */}

      <div className="users-table-card">

        <div className="table-responsive">

          <table className="users-table">

            <thead>
              <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Role</th>
                <th>
                  Permissions
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.map(
                (user) => (

                <tr key={user.id}>

                  <td>

                    <div className="user-cell">

                      <div className="user-avatar">

                        {user.name
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <div>
                        <strong>
                          {user.name}
                        </strong>

                        <span>
                          {user.email}
                        </span>
                      </div>

                    </div>

                  </td>

                  <td>
                    {user.phone ||
                      '—'}
                  </td>

                  <td>

                    <span className="role-badge">
                      {user.role}
                    </span>

                  </td>

                  <td>

                    <strong>
                      {
                        user
                          .permissions
                          .length
                      }
                    </strong>

                    {' '}modules

                  </td>

                  <td>

                    <span
                      className={
                        user.status ===
                        'Active'
                          ? 'user-status active'
                          : 'user-status inactive'
                      }
                    >
                      {user.status}
                    </span>

                  </td>

                  <td>

                    <div className="user-actions">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/settings/users/${user.id}/edit`
                          )
                        }
                      >
                        <Edit3
                          size={16}
                        />

                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleStatus(
                            user.id
                          )
                        }
                      >
                        {user.status ===
                        'Active'
                          ? 'Deactivate'
                          : 'Activate'}
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

              {filteredUsers.length ===
                0 && (

                <tr>
                  <td
                    colSpan={6}
                    className="users-empty"
                  >
                    No users found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      <div className="settings-demo-note">

        <ShieldCheck
          size={18}
        />

        <p>
          This demo stores staff
          configuration locally in the
          browser. Production authentication
          will require secure backend
          authentication and authorization.
        </p>

      </div>

    </div>
  )
}