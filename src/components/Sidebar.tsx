import {
  useEffect,
  useState,
} from 'react'

import {
  NavLink,
  useNavigate,
} from 'react-router-dom'

import {
  LayoutDashboard,
  ShoppingCart,
  ReceiptText,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  Truck,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  UserRound,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import {
  useUsers,
} from '../context/UserContext'

import type {
  UserPermission,
} from '../types/user'

/* =========================================
   MENU ITEM TYPE
========================================= */

type MenuItem = {
  name: string
  path: string
  icon: typeof LayoutDashboard
  permission: UserPermission
}

/* =========================================
   SIDEBAR MENU
========================================= */

const menuItems:
  MenuItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      permission: 'dashboard',
    },

    {
      name: 'POS Billing',
      path: '/pos',
      icon: ShoppingCart,
      permission: 'pos',
    },

    {
      name: 'Sales',
      path: '/sales',
      icon: ReceiptText,
      permission: 'sales',
    },

    {
      name: 'Products',
      path: '/products',
      icon: Package,
      permission: 'products',
    },

    {
      name: 'Inventory',
      path: '/inventory',
      icon: Boxes,
      permission: 'inventory',
    },

    {
      name: 'Purchases',
      path: '/purchases',
      icon: ShoppingBag,
      permission: 'purchases',
    },

    {
      name: 'Customers',
      path: '/customers',
      icon: Users,
      permission: 'customers',
    },

    {
      name: 'Suppliers',
      path: '/suppliers',
      icon: Truck,
      permission: 'suppliers',
    },

    {
      name: 'Expenses',
      path: '/expenses',
      icon: Wallet,
      permission: 'expenses',
    },

    {
      name: 'Reports',
      path: '/reports',
      icon: BarChart3,
      permission: 'reports',
    },

    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      permission: 'settings',
    },
  ]

/* =========================================
   STORAGE
========================================= */

const SIDEBAR_STORAGE_KEY =
  'rk-billpro-sidebar-collapsed'

/* =========================================
   SIDEBAR
========================================= */

export default function Sidebar() {
  const navigate =
    useNavigate()

  const {
    users,
    currentUser,
    setCurrentUser,
    hasPermission,
  } = useUsers()

  /* =======================================
     COLLAPSED STATE
  ======================================== */

  const [
    collapsed,
    setCollapsed,
  ] =
    useState<boolean>(
      () =>
        localStorage.getItem(
          SIDEBAR_STORAGE_KEY
        ) === 'true'
    )

  /* =======================================
     APPLY SIDEBAR STATE TO DOCUMENT
  ======================================== */

  useEffect(
    () => {
      localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(collapsed)
      )

      document.documentElement
        .classList.toggle(
          'rk-sidebar-collapsed',
          collapsed
        )

      return () => {
        document.documentElement
          .classList.remove(
            'rk-sidebar-collapsed'
          )
      }
    },
    [collapsed]
  )

  /* =======================================
     TOGGLE SIDEBAR
  ======================================== */

  function toggleSidebar() {
    setCollapsed(
      (current) =>
        !current
    )
  }

  /* =======================================
     ACTIVE USERS
  ======================================== */

  const activeUsers =
    users.filter(
      (user) =>
        user.status ===
        'Active'
    )

  /* =======================================
     PERMISSION BASED MENU
  ======================================== */

  const visibleMenuItems =
    menuItems.filter(
      (item) =>
        hasPermission(
          item.permission
        )
    )

  /* =======================================
     SWITCH DEMO USER
  ======================================== */

  function handleUserChange(
    value: string
  ) {
    const id =
      Number(value)

    const selectedUser =
      users.find(
        (user) =>
          user.id === id
      )

    if (
      !selectedUser ||
      selectedUser.status !==
        'Active'
    ) {
      return
    }

    setCurrentUser(id)

    const firstAllowedItem =
      menuItems.find(
        (item) =>
          selectedUser
            .permissions
            .includes(
              item.permission
            )
      )

    if (firstAllowedItem) {
      navigate(
        firstAllowedItem.path
      )

      return
    }

    navigate('/')
  }

  /* =======================================
     LOGOUT
  ======================================== */

  function handleLogout() {
    navigate('/')
  }

  return (
    <aside
      className={
        `sidebar ${
          collapsed
            ? 'sidebar-collapsed'
            : ''
        }`
      }
    >

      {/* ===================================
          COLLAPSE BUTTON
      ==================================== */}

      <button
        type="button"
        className="sidebar-collapse-toggle"
        onClick={
          toggleSidebar
        }
        aria-label={
          collapsed
            ? 'Expand sidebar'
            : 'Collapse sidebar'
        }
        title={
          collapsed
            ? 'Expand sidebar'
            : 'Collapse sidebar'
        }
      >

        {collapsed ? (
          <ChevronRight
            size={17}
          />
        ) : (
          <ChevronLeft
            size={17}
          />
        )}

      </button>

      {/* ===================================
          LOGO
      ==================================== */}

      <div className="sidebar-logo">

        <div className="logo-icon">
          R
        </div>

        <div className="sidebar-logo-content">

          <h2>
            RK BillPro
          </h2>

          <span>
            Smart Billing
          </span>

        </div>

      </div>

      {/* ===================================
          DEMO USER SWITCHER
      ==================================== */}

      {!collapsed ? (

        <div className="sidebar-user-switcher">

          <div className="sidebar-user-label">

            <UserRound
              size={15}
            />

            <span>
              Demo User
            </span>

          </div>

          {activeUsers.length >
          0 ? (

            <>

              <div className="sidebar-user-select-wrap">

                <select
                  aria-label="Select demo user"
                  value={
                    currentUser?.id ??
                    ''
                  }
                  onChange={(
                    event
                  ) =>
                    handleUserChange(
                      event.target
                        .value
                    )
                  }
                >

                  {activeUsers.map(
                    (user) => (

                      <option
                        key={
                          user.id
                        }
                        value={
                          user.id
                        }
                      >
                        {user.name}
                        {' — '}
                        {user.role}
                      </option>

                    )
                  )}

                </select>

                <ChevronDown
                  size={15}
                />

              </div>

              {currentUser && (

                <div className="sidebar-current-role">

                  <span>
                    {
                      currentUser
                        .role
                    }
                  </span>

                  <strong>
                    {
                      currentUser
                        .permissions
                        .length
                    }
                    {' '}
                    permissions
                  </strong>

                </div>

              )}

            </>

          ) : (

            <div className="sidebar-no-users">
              No active users
            </div>

          )}

        </div>

      ) : (

        <div
          className="sidebar-collapsed-user"
          title={
            currentUser
              ? `${currentUser.name} — ${currentUser.role}`
              : 'Demo User'
          }
        >

          <UserRound
            size={20}
          />

        </div>

      )}

      {/* ===================================
          NAVIGATION
      ==================================== */}

      <nav className="sidebar-menu">

        {visibleMenuItems.map(
          (item) => {
            const Icon =
              item.icon

            return (
              <NavLink
                key={
                  item.path
                }
                to={
                  item.path
                }
                title={
                  collapsed
                    ? item.name
                    : undefined
                }
                aria-label={
                  item.name
                }
                className={({
                  isActive,
                }) =>
                  `sidebar-link ${
                    isActive
                      ? 'active'
                      : ''
                  }`
                }
              >

                <Icon
                  size={20}
                  className="sidebar-link-icon"
                />

                <span className="sidebar-link-text">
                  {item.name}
                </span>

              </NavLink>
            )
          }
        )}

        {currentUser &&
          visibleMenuItems.length ===
            0 && (

            <div className="sidebar-no-permissions">

              <span>
                No module access
              </span>

              <small>
                Ask an administrator
                to assign permissions.
              </small>

            </div>

          )}

      </nav>

      {/* ===================================
          LOGOUT
      ==================================== */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className="sidebar-link logout-link sidebar-logout-button"
          onClick={
            handleLogout
          }
          title={
            collapsed
              ? 'Logout'
              : undefined
          }
          aria-label="Logout"
        >

          <LogOut
            size={20}
            className="sidebar-link-icon"
          />

          <span className="sidebar-link-text">
            Logout
          </span>

        </button>

      </div>

    </aside>
  )
}