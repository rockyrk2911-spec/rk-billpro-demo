export type BusinessProfile = {
  businessName: string
  ownerName: string
  phone: string
  email: string
  gstin: string
  address: string
  city: string
  state: string
  pincode: string
  currency: string
  financialYearStart: string
}

export type TaxCalculationMode =
  | 'Exclusive'
  | 'Inclusive'

export type TaxSettings = {
  gstEnabled: boolean
  gstin: string
  businessState: string
  calculationMode: TaxCalculationMode
  defaultTaxRate: number
  availableTaxRates: number[]
  showTaxOnInvoice: boolean
  showHSNOnInvoice: boolean
}

export type InvoicePaperSize =
  | '80mm'
  | 'A4'

export type InvoiceSettings = {
  invoicePrefix: string
  startingNumber: number
  receiptTitle: string
  footerMessage: string
  paperSize: InvoicePaperSize

  showBusinessName: boolean
  showBusinessAddress: boolean
  showBusinessPhone: boolean
  showGSTIN: boolean

  showCustomerName: boolean
  showCustomerPhone: boolean

  showPaymentMethod: boolean
  showInvoiceDate: boolean

  showLogo: boolean
  autoPrintAfterSale: boolean
}

export type PrinterType =
  | 'Thermal'
  | 'A4'

export type ThermalPaperWidth =
  | '58mm'
  | '80mm'

export type PrintOrientation =
  | 'Portrait'
  | 'Landscape'

export type PrinterSettings = {
  printerName: string
  printerType: PrinterType
  thermalPaperWidth: ThermalPaperWidth
  orientation: PrintOrientation
  copies: number
  topMargin: number
  bottomMargin: number
  leftMargin: number
  rightMargin: number
  autoPrintAfterSale: boolean
  openPrintDialog: boolean
  printCustomerCopy: boolean
  printBusinessCopy: boolean
}

export type ConfigurablePaymentMethod =
  | 'Cash'
  | 'UPI'
  | 'Card'
  | 'Bank Transfer'

export type PaymentMethodConfig = {
  method: ConfigurablePaymentMethod
  enabled: boolean
}

export type PaymentSettings = {
  defaultMethod: ConfigurablePaymentMethod

  methods: PaymentMethodConfig[]

  upiId: string
  upiDisplayName: string

  bankName: string
  accountName: string
  accountNumber: string
  ifscCode: string

  allowSplitPayment: boolean
  showPaymentReference: boolean
}
