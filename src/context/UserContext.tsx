import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type {
  AppUser,
  NewAppUser,
  UserPermission,
} from '../types/user'

type UserContextType = {
  users: AppUser[]

  currentUser:
    AppUser | undefined

  currentUserId:
    number | null

  addUser: (
    user: NewAppUser
  ) => void

  updateUser: (
    user: AppUser
  ) => void

  getUserById: (
    id: number
  ) => AppUser | undefined

  setCurrentUser:
    (id: number) => void

  hasPermission: (
    permission:
      UserPermission
  ) => boolean
}

const UserContext =
  createContext<
    UserContextType | undefined
  >(undefined)

/* =========================================
   STORAGE KEYS
========================================= */

const USERS_STORAGE_KEY =
  'rk-billpro-users'

const CURRENT_USER_STORAGE_KEY =
  'rk-billpro-current-user'

/* =========================================
   DEFAULT USERS
========================================= */

const defaultUsers:
  AppUser[] = [
    {
      id: 1,

      name: 'Rakesh',

      email:
        'owner@rkbillpro.demo',

      phone: '',

      role:
        'Owner / Admin',

      permissions: [
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

      status: 'Active',

      createdAt:
        new Date()
          .toISOString(),
    },

    {
      id: 2,

      name:
        'Demo Cashier',

      email:
        'cashier@rkbillpro.demo',

      phone: '',

      role: 'Cashier',

      permissions: [
        'dashboard',
        'pos',
        'sales',
        'customers',
      ],

      status: 'Active',

      createdAt:
        new Date()
          .toISOString(),
    },
  ]

/* =========================================
   LOAD USERS
========================================= */

function loadUsers():
  AppUser[] {
  const saved =
    localStorage.getItem(
      USERS_STORAGE_KEY
    )

  if (!saved) {
    return defaultUsers
  }

  try {
    const parsed:
      unknown =
        JSON.parse(saved)

    if (
      Array.isArray(parsed)
    ) {
      return parsed
    }

    return defaultUsers
  } catch {
    return defaultUsers
  }
}

/* =========================================
   LOAD CURRENT USER ID
========================================= */

function loadCurrentUserId():
  number | null {
  const saved =
    localStorage.getItem(
      CURRENT_USER_STORAGE_KEY
    )

  if (!saved) {
    return 1
  }

  const parsed =
    Number(saved)

  return Number.isFinite(
    parsed
  )
    ? parsed
    : 1
}

/* =========================================
   PROVIDER
========================================= */

export function UserProvider({
  children,
}: {
  children: ReactNode
}) {
  /* =======================================
     USERS
  ======================================== */

  const [
    users,
    setUsers,
  ] =
    useState<AppUser[]>(
      loadUsers
    )

  /* =======================================
     SELECTED USER ID
  ======================================== */

  const [
    selectedUserId,
    setSelectedUserId,
  ] =
    useState<number | null>(
      loadCurrentUserId
    )

  /* =======================================
     SAVE USERS
  ======================================== */

  useEffect(() => {
    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(
        users
      )
    )
  }, [users])

  /* =======================================
     CURRENT ACTIVE USER
  ======================================== */

  const currentUser =
    useMemo(() => {
      /*
        First try to use the
        currently selected user.
      */

      const selected =
        users.find(
          (user) =>
            user.id ===
              selectedUserId &&
            user.status ===
              'Active'
        )

      if (selected) {
        return selected
      }

      /*
        If the selected user no
        longer exists or becomes
        inactive, use the first
        active user as fallback.

        No setState is required
        during an effect.
      */

      return users.find(
        (user) =>
          user.status ===
          'Active'
      )
    }, [
      users,
      selectedUserId,
    ])

  /* =======================================
     EFFECTIVE CURRENT USER ID
  ======================================== */

  const currentUserId =
    currentUser?.id ??
    null

  /* =======================================
     SAVE EFFECTIVE CURRENT USER
  ======================================== */

  useEffect(() => {
    if (
      currentUserId ===
      null
    ) {
      localStorage.removeItem(
        CURRENT_USER_STORAGE_KEY
      )

      return
    }

    localStorage.setItem(
      CURRENT_USER_STORAGE_KEY,
      String(
        currentUserId
      )
    )
  }, [currentUserId])

  /* =======================================
     ADD USER
  ======================================== */

  function addUser(
    user: NewAppUser
  ) {
    const newUser:
      AppUser = {
        ...user,

        id:
          Date.now(),

        createdAt:
          new Date()
            .toISOString(),
      }

    setUsers(
      (current) => [
        ...current,
        newUser,
      ]
    )
  }

  /* =======================================
     UPDATE USER
  ======================================== */

  function updateUser(
    user: AppUser
  ) {
    setUsers(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            user.id
              ? user
              : item
        )
    )
  }

  /* =======================================
     GET USER BY ID
  ======================================== */

  function getUserById(
    id: number
  ) {
    return users.find(
      (user) =>
        user.id === id
    )
  }

  /* =======================================
     SWITCH DEMO USER
  ======================================== */

  function setCurrentUser(
    id: number
  ) {
    const user =
      users.find(
        (item) =>
          item.id === id
      )

    /*
      Only active users can
      become the current user.
    */

    if (
      !user ||
      user.status !==
        'Active'
    ) {
      return
    }

    setSelectedUserId(
      id
    )

    /*
      Save immediately so the
      selected demo user survives
      a browser refresh.
    */

    localStorage.setItem(
      CURRENT_USER_STORAGE_KEY,
      String(id)
    )
  }

  /* =======================================
     PERMISSION CHECK
  ======================================== */

  function hasPermission(
    permission:
      UserPermission
  ) {
    if (!currentUser) {
      return false
    }

    return (
      currentUser.status ===
        'Active' &&
      currentUser.permissions.includes(
        permission
      )
    )
  }

  /* =======================================
     CONTEXT VALUE
  ======================================== */

  const value:
    UserContextType = {
      users,

      currentUser,

      currentUserId,

      addUser,

      updateUser,

      getUserById,

      setCurrentUser,

      hasPermission,
    }

  return (
    <UserContext.Provider
      value={value}
    >
      {children}
    </UserContext.Provider>
  )
}

/* =========================================
   HOOK
========================================= */

export function useUsers() {
  const context =
    useContext(
      UserContext
    )

  if (!context) {
    throw new Error(
      'useUsers must be used inside UserProvider'
    )
  }

  return context
}