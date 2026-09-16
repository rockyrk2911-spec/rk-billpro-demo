import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type {
  Supplier,
  NewSupplier,
} from '../types/supplier'

import {
  useBackup,
} from './BackupContext'

type SupplierContextType = {
  suppliers: Supplier[]

  addSupplier: (
    supplier: NewSupplier
  ) => void

  updateSupplier: (
    supplier: Supplier
  ) => void

  getSupplierById: (
    id: number
  ) => Supplier | undefined
}

/* =========================================
   DEFAULT DEMO SUPPLIERS
========================================= */

const defaultSuppliers: Supplier[] = [
  {
    id: 1,

    name:
      'ABC Distributors',

    contactPerson:
      'Arun Kumar',

    phone:
      '9876543210',

    email:
      'abc@example.com',

    gstin:
      '33ABCDE1234F1Z5',

    address:
      '12 Market Road',

    city:
      'Chennai',

    openingBalance:
      0,

    status:
      'Active',

    createdAt:
      new Date()
        .toISOString(),
  },

  {
    id: 2,

    name:
      'Chennai Wholesale',

    contactPerson:
      'Suresh',

    phone:
      '9876501234',

    email:
      'chennai@example.com',

    gstin:
      '33ABCDE5678G1Z2',

    address:
      '45 Wholesale Market',

    city:
      'Chennai',

    openingBalance:
      2500,

    status:
      'Active',

    createdAt:
      new Date()
        .toISOString(),
  },

  {
    id: 3,

    name:
      'RK Food Suppliers',

    contactPerson:
      'Kumar',

    phone:
      '9840012345',

    email:
      'rkfoods@example.com',

    gstin:
      '33ABCDE9012H1Z7',

    address:
      '78 GST Road',

    city:
      'Tambaram',

    openingBalance:
      0,

    status:
      'Active',

    createdAt:
      new Date()
        .toISOString(),
  },

  {
    id: 4,

    name:
      'Metro Agencies',

    contactPerson:
      'Rajesh',

    phone:
      '9790012345',

    email:
      'metro@example.com',

    gstin:
      '33ABCDE3456J1Z4',

    address:
      '20 Station Road',

    city:
      'Tambaram',

    openingBalance:
      1200,

    status:
      'Active',

    createdAt:
      new Date()
        .toISOString(),
  },
]

/* =========================================
   CONTEXT
========================================= */

type SupplierContextValue =
  SupplierContextType | undefined

const SupplierContext =
  createContext<
    SupplierContextValue
  >(undefined)

/* =========================================
   PROVIDER
========================================= */

export function SupplierProvider({
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
     SUPPLIER STATE
  ======================================== */

  const [
    suppliers,
    setSuppliers,
  ] =
    useState<Supplier[]>(
      () => {
        const savedSuppliers =
          localStorage.getItem(
            'rk-billpro-suppliers'
          )

        if (!savedSuppliers) {
          return defaultSuppliers
        }

        try {
          const parsed:
            unknown =
              JSON.parse(
                savedSuppliers
              )

          if (
            !Array.isArray(
              parsed
            )
          ) {
            return defaultSuppliers
          }

          /*
            Normalize older supplier
            records stored in the browser.
          */

          return parsed.map(
            (supplier) => {
              const saved =
                supplier as
                  Partial<Supplier>

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

                contactPerson:
                  saved.contactPerson ??
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
          return defaultSuppliers
        }
      }
    )

  /* =======================================
     SAVE SUPPLIERS
  ======================================== */

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-suppliers',
      JSON.stringify(
        suppliers
      )
    )
  }, [suppliers])

  /* =======================================
     ADD SUPPLIER
  ======================================== */

  function addSupplier(
    supplier: NewSupplier
  ) {
    const newSupplier:
      Supplier = {
        ...supplier,

        id:
          Date.now(),

        createdAt:
          new Date()
            .toISOString(),
      }

    /*
      Supplier is always saved locally.

      This means supplier management
      continues normally while the
      RK BillPro demo is offline.
    */

    setSuppliers(
      (
        currentSuppliers
      ) => [
        newSupplier,
        ...currentSuppliers,
      ]
    )

    /*
      Only offline operations need
      to enter the pending sync queue.
    */

    if (
      connectionStatus ===
      'Offline'
    ) {
      const contact =
        newSupplier.phone
          .trim() ||
        newSupplier.email
          .trim() ||
        'No contact'

      addPendingChange(
        'Supplier',
        `Added ${newSupplier.name || 'Unnamed Supplier'} • ${contact}`
      )
    }
  }

  /* =======================================
     UPDATE SUPPLIER
  ======================================== */

  function updateSupplier(
    updatedSupplier:
      Supplier
  ) {
    setSuppliers(
      (
        currentSuppliers
      ) =>
        currentSuppliers.map(
          (supplier) =>
            supplier.id ===
            updatedSupplier.id
              ? updatedSupplier
              : supplier
        )
    )

    /*
      Editing a supplier while offline
      is another local change waiting
      for synchronization.
    */

    if (
      connectionStatus ===
      'Offline'
    ) {
      const contact =
        updatedSupplier.phone
          .trim() ||
        updatedSupplier.email
          .trim() ||
        'No contact'

      addPendingChange(
        'Supplier',
        `Updated ${updatedSupplier.name || 'Unnamed Supplier'} • ${contact}`
      )
    }
  }

  /* =======================================
     GET SUPPLIER BY ID
  ======================================== */

  function getSupplierById(
    id: number
  ) {
    return suppliers.find(
      (supplier) =>
        supplier.id === id
    )
  }

  /* =======================================
     PROVIDER
  ======================================== */

  return (
    <SupplierContext.Provider
      value={{
        suppliers,

        addSupplier,

        updateSupplier,

        getSupplierById,
      }}
    >
      {children}
    </SupplierContext.Provider>
  )
}

/* =========================================
   CUSTOM HOOK
========================================= */

export function useSuppliers() {
  const context =
    useContext(
      SupplierContext
    )

  if (!context) {
    throw new Error(
      'useSuppliers must be used inside SupplierProvider'
    )
  }

  return context
}