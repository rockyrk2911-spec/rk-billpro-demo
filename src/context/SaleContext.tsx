import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type {
  Sale,
} from '../types/sale'

import {
  useSettings,
} from './SettingsContext'

import {
  useBackup,
} from './BackupContext'

type SaleContextType = {
  sales: Sale[]

  addSale: (
    sale: Sale
  ) => void

  getNextInvoiceNumber:
    () => string
}

const SaleContext =
  createContext<
    SaleContextType | undefined
  >(undefined)

/* =========================================
   SALE PROVIDER
========================================= */

export function SaleProvider({
  children,
}: {
  children: ReactNode
}) {
  /* =======================================
     SETTINGS
  ======================================== */

  const {
    invoiceSettings,
  } = useSettings()

  /* =======================================
     BACKUP / OFFLINE SYNC
  ======================================== */

  const {
    connectionStatus,
    addPendingChange,
  } = useBackup()

  /* =======================================
     SALES
  ======================================== */

  const [
    sales,
    setSales,
  ] =
    useState<Sale[]>(
      () => {
        const savedSales =
          localStorage.getItem(
            'rk-billpro-sales'
          )

        if (!savedSales) {
          return []
        }

        try {
          const parsed =
            JSON.parse(
              savedSales
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
     SAVE SALES
  ========================================= */

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-sales',
      JSON.stringify(
        sales
      )
    )
  }, [sales])

  /* =========================================
     ADD SALE
  ========================================= */

  function addSale(
    sale: Sale
  ) {
    /*
      The sale is ALWAYS saved locally.

      Online:
      - Save locally
      - No pending queue item

      Offline:
      - Save locally
      - Billing continues normally
      - Add the sale to the simulated
        synchronization queue
    */

    setSales(
      (currentSales) => [
        sale,
        ...currentSales,
      ]
    )

    if (
      connectionStatus ===
      'Offline'
    ) {
      addPendingChange(
        'Sale',
        `${sale.invoiceNumber} • ${sale.customer || 'Walk-in Customer'} • ₹${sale.grandTotal.toFixed(
          2
        )}`
      )
    }
  }

  /* =========================================
     NEXT INVOICE NUMBER
  ========================================= */

  function getNextInvoiceNumber() {
    const prefix =
      invoiceSettings
        .invoicePrefix
        .trim() ||
      'INV-'

    const startingNumber =
      Math.max(
        1,
        invoiceSettings
          .startingNumber
      )

    /*
      Historical invoices keep their
      original invoice numbers.

      Only invoice numbers using the
      CURRENT prefix are considered when
      calculating the next number.
    */

    const matchingNumbers =
      sales
        .map(
          (sale) => {
            if (
              !sale.invoiceNumber.startsWith(
                prefix
              )
            ) {
              return null
            }

            const numberPart =
              sale.invoiceNumber.slice(
                prefix.length
              )

            if (
              !/^\d+$/.test(
                numberPart
              )
            ) {
              return null
            }

            return Number(
              numberPart
            )
          }
        )
        .filter(
          (
            value
          ): value is number =>
            value !== null
        )

    const highestExistingNumber =
      matchingNumbers.length >
      0
        ? Math.max(
            ...matchingNumbers
          )
        : startingNumber - 1

    const nextNumber =
      Math.max(
        startingNumber,
        highestExistingNumber +
          1
      )

    return `${prefix}${nextNumber
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
    <SaleContext.Provider
      value={{
        sales,
        addSale,
        getNextInvoiceNumber,
      }}
    >
      {children}
    </SaleContext.Provider>
  )
}

/* =========================================
   HOOK
========================================= */

export function useSales() {
  const context =
    useContext(
      SaleContext
    )

  if (!context) {
    throw new Error(
      'useSales must be used inside SaleProvider'
    )
  }

  return context
}