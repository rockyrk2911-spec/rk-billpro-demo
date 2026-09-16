import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type {
  BusinessProfile,
  TaxSettings,
  InvoiceSettings,
  PrinterSettings,
  PaymentSettings,
} from '../types/settings'

type SettingsContextType = {
  businessProfile: BusinessProfile

  updateBusinessProfile: (
    profile: BusinessProfile
  ) => void

  taxSettings: TaxSettings

  updateTaxSettings: (
    settings: TaxSettings
  ) => void

  invoiceSettings: InvoiceSettings

  updateInvoiceSettings: (
    settings: InvoiceSettings
  ) => void

  printerSettings: PrinterSettings

  updatePrinterSettings: (
    settings: PrinterSettings
  ) => void

  paymentSettings: PaymentSettings

  updatePaymentSettings: (
    settings: PaymentSettings
  ) => void
}

const SettingsContext =
  createContext<
    SettingsContextType | undefined
  >(undefined)

/* =========================================
   DEFAULT BUSINESS PROFILE
========================================= */

const defaultBusinessProfile:
  BusinessProfile = {
    businessName:
      'RK Supermarket',

    ownerName:
      'Rakesh',

    phone: '',

    email: '',

    gstin: '',

    address: '',

    city:
      'Tambaram',

    state:
      'Tamil Nadu',

    pincode: '',

    currency:
      'INR',

    financialYearStart:
      'April',
  }

/* =========================================
   DEFAULT TAX SETTINGS
========================================= */

const defaultTaxSettings:
  TaxSettings = {
    gstEnabled: true,

    gstin: '',

    businessState:
      'Tamil Nadu',

    calculationMode:
      'Exclusive',

    defaultTaxRate: 5,

    availableTaxRates: [
      0,
      5,
      12,
      18,
      28,
    ],

    showTaxOnInvoice:
      true,

    showHSNOnInvoice:
      false,
  }

/* =========================================
   DEFAULT INVOICE SETTINGS
========================================= */

const defaultInvoiceSettings:
  InvoiceSettings = {
    invoicePrefix:
      'INV-',

    startingNumber:
      129,

    receiptTitle:
      'Tax Invoice',

    footerMessage:
      'Thank you for shopping with us!',

    paperSize:
      '80mm',

    showBusinessName:
      true,

    showBusinessAddress:
      true,

    showBusinessPhone:
      true,

    showGSTIN:
      true,

    showCustomerName:
      true,

    showCustomerPhone:
      true,

    showPaymentMethod:
      true,

    showInvoiceDate:
      true,

    showLogo:
      true,

    autoPrintAfterSale:
      false,
  }

/* =========================================
   DEFAULT PRINTER SETTINGS
========================================= */

const defaultPrinterSettings:
  PrinterSettings = {
    printerName:
      'Default Printer',

    printerType:
      'Thermal',

    thermalPaperWidth:
      '80mm',

    orientation:
      'Portrait',

    copies:
      1,

    topMargin:
      5,

    bottomMargin:
      5,

    leftMargin:
      5,

    rightMargin:
      5,

    autoPrintAfterSale:
      false,

    openPrintDialog:
      true,

    printCustomerCopy:
      true,

    printBusinessCopy:
      false,
  }

/* =========================================
   DEFAULT PAYMENT SETTINGS
========================================= */

const defaultPaymentSettings:
  PaymentSettings = {
    defaultMethod:
      'Cash',

    methods: [
      {
        method:
          'Cash',
        enabled:
          true,
      },
      {
        method:
          'UPI',
        enabled:
          true,
      },
      {
        method:
          'Card',
        enabled:
          true,
      },
      {
        method:
          'Bank Transfer',
        enabled:
          false,
      },
    ],

    upiId: '',

    upiDisplayName:
      'RK Supermarket',

    bankName: '',

    accountName: '',

    accountNumber: '',

    ifscCode: '',

    allowSplitPayment:
      false,

    showPaymentReference:
      true,
  }

/* =========================================
   SETTINGS PROVIDER
========================================= */

export function SettingsProvider({
  children,
}: {
  children: ReactNode
}) {
  /* =======================================
     BUSINESS PROFILE
  ======================================== */

  const [
    businessProfile,
    setBusinessProfile,
  ] =
    useState<BusinessProfile>(
      () => {
        const saved =
          localStorage.getItem(
            'rk-billpro-business-profile'
          )

        if (saved) {
          try {
            return {
              ...defaultBusinessProfile,
              ...JSON.parse(saved),
            }
          } catch {
            return defaultBusinessProfile
          }
        }

        return defaultBusinessProfile
      }
    )

  /* =======================================
     TAX SETTINGS
  ======================================== */

  const [
    taxSettings,
    setTaxSettings,
  ] =
    useState<TaxSettings>(
      () => {
        const saved =
          localStorage.getItem(
            'rk-billpro-tax-settings'
          )

        if (saved) {
          try {
            return {
              ...defaultTaxSettings,
              ...JSON.parse(saved),
            }
          } catch {
            return defaultTaxSettings
          }
        }

        return defaultTaxSettings
      }
    )

  /* =======================================
     INVOICE SETTINGS
  ======================================== */

  const [
    invoiceSettings,
    setInvoiceSettings,
  ] =
    useState<InvoiceSettings>(
      () => {
        const saved =
          localStorage.getItem(
            'rk-billpro-invoice-settings'
          )

        if (saved) {
          try {
            return {
              ...defaultInvoiceSettings,
              ...JSON.parse(saved),
            }
          } catch {
            return defaultInvoiceSettings
          }
        }

        return defaultInvoiceSettings
      }
    )

  /* =======================================
     PRINTER SETTINGS
  ======================================== */

  const [
    printerSettings,
    setPrinterSettings,
  ] =
    useState<PrinterSettings>(
      () => {
        const saved =
          localStorage.getItem(
            'rk-billpro-printer-settings'
          )

        if (saved) {
          try {
            return {
              ...defaultPrinterSettings,
              ...JSON.parse(saved),
            }
          } catch {
            return defaultPrinterSettings
          }
        }

        return defaultPrinterSettings
      }
    )

  /* =======================================
     PAYMENT SETTINGS
  ======================================== */

  const [
    paymentSettings,
    setPaymentSettings,
  ] =
    useState<PaymentSettings>(
      () => {
        const saved =
          localStorage.getItem(
            'rk-billpro-payment-settings'
          )

        if (saved) {
          try {
            return {
              ...defaultPaymentSettings,
              ...JSON.parse(saved),
            }
          } catch {
            return defaultPaymentSettings
          }
        }

        return defaultPaymentSettings
      }
    )

  /* =======================================
     LOCAL STORAGE
  ======================================== */

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-business-profile',
      JSON.stringify(
        businessProfile
      )
    )
  }, [businessProfile])

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-tax-settings',
      JSON.stringify(
        taxSettings
      )
    )
  }, [taxSettings])

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-invoice-settings',
      JSON.stringify(
        invoiceSettings
      )
    )
  }, [invoiceSettings])

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-printer-settings',
      JSON.stringify(
        printerSettings
      )
    )
  }, [printerSettings])

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-payment-settings',
      JSON.stringify(
        paymentSettings
      )
    )
  }, [paymentSettings])

  /* =======================================
     UPDATE FUNCTIONS
  ======================================== */

  function updateBusinessProfile(
    profile: BusinessProfile
  ) {
    setBusinessProfile(
      profile
    )
  }

  function updateTaxSettings(
    settings: TaxSettings
  ) {
    setTaxSettings(
      settings
    )
  }

  function updateInvoiceSettings(
    settings: InvoiceSettings
  ) {
    setInvoiceSettings(
      settings
    )
  }

  function updatePrinterSettings(
    settings: PrinterSettings
  ) {
    setPrinterSettings(
      settings
    )
  }

  function updatePaymentSettings(
    settings: PaymentSettings
  ) {
    setPaymentSettings(
      settings
    )
  }

  /* =======================================
     PROVIDER
  ======================================== */

  return (
    <SettingsContext.Provider
      value={{
        businessProfile,
        updateBusinessProfile,

        taxSettings,
        updateTaxSettings,

        invoiceSettings,
        updateInvoiceSettings,

        printerSettings,
        updatePrinterSettings,

        paymentSettings,
        updatePaymentSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

/* =========================================
   SETTINGS HOOK
========================================= */

export function useSettings() {
  const context =
    useContext(
      SettingsContext
    )

  if (!context) {
    throw new Error(
      'useSettings must be used inside SettingsProvider'
    )
  }

  return context
}