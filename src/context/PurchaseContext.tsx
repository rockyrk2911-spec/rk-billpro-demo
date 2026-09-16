import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type {
  Purchase,
} from '../types/purchase'

import {
  useBackup,
} from './BackupContext'

type PurchaseContextType = {
  purchases: Purchase[]

  addPurchase: (
    purchase: Purchase
  ) => void

  getNextPurchaseNumber:
    () => string
}

const PurchaseContext =
  createContext<
    PurchaseContextType | undefined
  >(undefined)

/* =========================================
   PURCHASE PROVIDER
========================================= */

export function PurchaseProvider({
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
     PURCHASES
  ======================================== */

  const [
    purchases,
    setPurchases,
  ] =
    useState<Purchase[]>(
      () => {
        const savedPurchases =
          localStorage.getItem(
            'rk-billpro-purchases'
          )

        if (!savedPurchases) {
          return []
        }

        try {
          const parsed =
            JSON.parse(
              savedPurchases
            )

          return Array.isArray(
            parsed
          )
            ? parsed
            : []
        } catch {
          return []
        }
      }
    )

  /* =========================================
     SAVE PURCHASES
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-purchases',
      JSON.stringify(
        purchases
      )
    )
  }, [purchases])

  /* =========================================
     ADD PURCHASE
  ========================================= */

  function addPurchase(
    purchase: Purchase
  ) {
    /*
      Purchase always saves locally.

      ONLINE:
      - Purchase saved normally
      - No pending sync item

      OFFLINE:
      - Purchase saved locally
      - Stock can still be increased
        by the existing New Purchase flow
      - Purchase added to pending queue
    */

    setPurchases(
      (
        currentPurchases
      ) => [
        purchase,
        ...currentPurchases,
      ]
    )

    if (
      connectionStatus ===
      'Offline'
    ) {
      addPendingChange(
        'Purchase',
        `${purchase.purchaseNumber} • ${
          purchase.supplier ||
          'Unknown Supplier'
        } • ₹${purchase.grandTotal.toFixed(
          2
        )}`
      )
    }
  }

  /* =========================================
     NEXT PURCHASE NUMBER
  ========================================= */

  function getNextPurchaseNumber() {
    let highestNumber = 0

    purchases.forEach(
      (purchase) => {
        const match =
          purchase
            .purchaseNumber
            ?.match(
              /^PUR-(\d+)$/
            )

        if (!match) {
          return
        }

        const number =
          Number(
            match[1]
          )

        if (
          Number.isFinite(
            number
          ) &&
          number >
            highestNumber
        ) {
          highestNumber =
            number
        }
      }
    )

    const nextNumber =
      highestNumber + 1

    return `PUR-${nextNumber
      .toString()
      .padStart(
        5,
        '0'
      )}`
  }

  /* =========================================
     PROVIDER
  ========================================= */

  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        addPurchase,
        getNextPurchaseNumber,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  )
}

/* =========================================
   HOOK
========================================= */

export function usePurchases() {
  const context =
    useContext(
      PurchaseContext
    )

  if (!context) {
    throw new Error(
      'usePurchases must be used inside PurchaseProvider'
    )
  }

  return context
}