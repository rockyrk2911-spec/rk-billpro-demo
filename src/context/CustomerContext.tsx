import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type {
  Customer,
  NewCustomer,
} from '../types/customer'

import {
  useBackup,
} from './BackupContext'

type CustomerContextType = {
  customers: Customer[]

  addCustomer: (
    customer: NewCustomer
  ) => void

  updateCustomer: (
    customer: Customer
  ) => void

  getCustomerById: (
    id: number
  ) => Customer | undefined

  addLoyaltyPoints: (
    customerId: number,
    points: number
  ) => void
}

/* =========================================
   DEFAULT DEMO CUSTOMERS
========================================= */

const defaultCustomers: Customer[] = [
  {
    id: 1,

    name: 'Ramesh Kumar',

    phone: '9876543210',

    email: 'ramesh@example.com',

    gstin: '',

    address: 'Tambaram',

    city: 'Chennai',

    openingBalance: 0,

    loyaltyPoints: 120,

    status: 'Active',

    createdAt:
      new Date()
        .toISOString(),
  },

  {
    id: 2,

    name: 'Priya S',

    phone: '9840012345',

    email: 'priya@example.com',

    gstin: '',

    address: 'Chromepet',

    city: 'Chennai',

    openingBalance: 0,

    loyaltyPoints: 85,

    status: 'Active',

    createdAt:
      new Date()
        .toISOString(),
  },

  {
    id: 3,

    name: 'Kumar R',

    phone: '9790012345',

    email: '',

    gstin: '',

    address: 'Pallavaram',

    city: 'Chennai',

    openingBalance: 0,

    loyaltyPoints: 45,

    status: 'Active',

    createdAt:
      new Date()
        .toISOString(),
  },
]

/* =========================================
   CONTEXT
========================================= */

const CustomerContext =
  createContext<
    CustomerContextType | undefined
  >(undefined)

/* =========================================
   PROVIDER
========================================= */

export function CustomerProvider({
  children,
}: {
  children: ReactNode
}) {
  /* =======================================
     BACKUP / OFFLINE SYNC
  ======================================== */

  const {
    connectionStatus,
    addPendingChange,
  } = useBackup()

  /* =======================================
     CUSTOMER STATE
  ======================================== */

  const [
    customers,
    setCustomers,
  ] =
    useState<Customer[]>(
      () => {
        const savedCustomers =
          localStorage.getItem(
            'rk-billpro-customers'
          )

        if (!savedCustomers) {
          return defaultCustomers
        }

        try {
          const parsed:
            unknown =
              JSON.parse(
                savedCustomers
              )

          if (
            !Array.isArray(
              parsed
            )
          ) {
            return defaultCustomers
          }

          /*
            Normalize older localStorage
            customer data so older demo
            records continue working.
          */

          return parsed.map(
            (customer) => {
              const saved =
                customer as
                  Partial<Customer>

              return {
                id:
                  typeof saved.id ===
                  'number'
                    ? saved.id
                    : Date.now() +
                      Math.floor(
                        Math.random() *
                          10000
                      ),

                name:
                  saved.name ??
                  '',

                phone:
                  saved.phone ??
                  '',

                email:
                  saved.email ??
                  '',

                gstin:
                  saved.gstin ??
                  '',

                address:
                  saved.address ??
                  '',

                city:
                  saved.city ??
                  '',

                openingBalance:
                  saved.openingBalance ??
                  0,

                loyaltyPoints:
                  saved.loyaltyPoints ??
                  0,

                status:
                  saved.status ===
                  'Inactive'
                    ? 'Inactive'
                    : 'Active',

                createdAt:
                  saved.createdAt ??
                  new Date()
                    .toISOString(),
              }
            }
          )
        } catch {
          return defaultCustomers
        }
      }
    )

  /* =======================================
     SAVE CUSTOMERS
  ======================================== */

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-customers',
      JSON.stringify(
        customers
      )
    )
  }, [customers])

  /* =======================================
     ADD CUSTOMER
  ======================================== */

  function addCustomer(
    customer: NewCustomer
  ) {
    const newCustomer:
      Customer = {
        ...customer,

        id:
          Date.now(),

        loyaltyPoints:
          0,

        createdAt:
          new Date()
            .toISOString(),
      }

    /*
      Customer is always stored locally,
      including while RK BillPro is
      operating offline.
    */

    setCustomers(
      (
        currentCustomers
      ) => [
        newCustomer,
        ...currentCustomers,
      ]
    )

    /*
      When offline, also create a
      synchronization queue record.
    */

    if (
      connectionStatus ===
      'Offline'
    ) {
      const customerContact =
        newCustomer.phone
          .trim() ||
        newCustomer.email
          .trim() ||
        'No contact'

      addPendingChange(
        'Customer',
        `Added ${newCustomer.name || 'Unnamed Customer'} • ${customerContact}`
      )
    }
  }

  /* =======================================
     UPDATE CUSTOMER
  ======================================== */

  function updateCustomer(
    updatedCustomer:
      Customer
  ) {
    setCustomers(
      (
        currentCustomers
      ) =>
        currentCustomers.map(
          (customer) =>
            customer.id ===
            updatedCustomer.id
              ? updatedCustomer
              : customer
        )
    )

    /*
      An offline edit is another
      unsynchronized local operation.
    */

    if (
      connectionStatus ===
      'Offline'
    ) {
      const customerContact =
        updatedCustomer.phone
          .trim() ||
        updatedCustomer.email
          .trim() ||
        'No contact'

      addPendingChange(
        'Customer',
        `Updated ${updatedCustomer.name || 'Unnamed Customer'} • ${customerContact}`
      )
    }
  }

  /* =======================================
     GET CUSTOMER BY ID
  ======================================== */

  function getCustomerById(
    id: number
  ) {
    return customers.find(
      (customer) =>
        customer.id === id
    )
  }

  /* =======================================
     ADD LOYALTY POINTS
  ======================================== */

  function addLoyaltyPoints(
    customerId: number,
    points: number
  ) {
    /*
      Ignore invalid or zero
      loyalty additions.

      We intentionally do NOT create
      another pending sync item here.

      Loyalty points may later be part
      of a sale/customer transaction,
      and separately queueing them could
      duplicate the same business event.
    */

    if (
      !Number.isFinite(
        points
      ) ||
      points <= 0
    ) {
      return
    }

    const safePoints =
      Math.floor(
        points
      )

    if (
      safePoints <= 0
    ) {
      return
    }

    setCustomers(
      (
        currentCustomers
      ) =>
        currentCustomers.map(
          (customer) => {
            if (
              customer.id !==
              customerId
            ) {
              return customer
            }

            return {
              ...customer,

              loyaltyPoints:
                customer
                  .loyaltyPoints +
                safePoints,
            }
          }
        )
    )
  }

  /* =======================================
     PROVIDER
  ======================================== */

  return (
    <CustomerContext.Provider
      value={{
        customers,

        addCustomer,

        updateCustomer,

        getCustomerById,

        addLoyaltyPoints,
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

/* =========================================
   CUSTOM HOOK
========================================= */

export function useCustomers() {
  const context =
    useContext(
      CustomerContext
    )

  if (!context) {
    throw new Error(
      'useCustomers must be used inside CustomerProvider'
    )
  }

  return context
}