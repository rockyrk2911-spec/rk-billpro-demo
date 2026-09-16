import type {
  ReactNode,
} from 'react'

import {
  ShieldX,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  useUsers,
} from '../context/UserContext'

import type {
  UserPermission,
} from '../types/user'

type ProtectedRouteProps = {
  permission:
    UserPermission

  children:
    ReactNode
}

export default function ProtectedRoute({
  permission,
  children,
}: ProtectedRouteProps) {
  const navigate =
    useNavigate()

  const {
    currentUser,
    hasPermission,
  } = useUsers()

  if (
    hasPermission(
      permission
    )
  ) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <div className="access-denied-page">

      <div className="access-denied-card">

        <div className="access-denied-icon">
          <ShieldX
            size={34}
          />
        </div>

        <span className="access-denied-label">
          Permission Required
        </span>

        <h1>
          Access Denied
        </h1>

        <p>
          {currentUser
            ? `${currentUser.name} does not have permission to access this module.`
            : 'There is no active demo user available.'}
        </p>

        {currentUser && (

          <div className="access-denied-user">

            <span>
              Current User
            </span>

            <strong>
              {
                currentUser
                  .name
              }
            </strong>

            <small>
              {
                currentUser
                  .role
              }
            </small>

          </div>

        )}

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate(
              '/dashboard'
            )
          }
        >
          Go to Dashboard
        </button>

      </div>

    </div>
  )
}