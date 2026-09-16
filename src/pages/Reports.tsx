import {
  useMemo,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  BarChart3,
  ShoppingCart,
  Package,
  Wallet,
  Users,
  Truck,
  ReceiptText,
  TrendingUp,
  ArrowRight,
  IndianRupee,
} from 'lucide-react'

import {
  useSales,
} from '../context/SaleContext'

import {
  usePurchases,
} from '../context/PurchaseContext'

import {
  useProducts,
} from '../context/ProductContext'

import {
  useExpenses,
} from '../context/ExpenseContext'

import {
  useCustomers,
} from '../context/CustomerContext'

import {
  useSuppliers,
} from '../context/SupplierContext'

export default function Reports() {
  const navigate =
    useNavigate()

  const {
    sales,
  } = useSales()

  const {
    purchases,
  } = usePurchases()

  const {
    products,
  } = useProducts()

  const {
    expenses,
  } = useExpenses()

  const {
    customers,
  } = useCustomers()

  const {
    suppliers,
  } = useSuppliers()

  // ==========================================
  // SALES
  // ==========================================

  const totalSales =
    useMemo(
      () =>
        sales.reduce(
          (total, sale) =>
            total +
            sale.grandTotal,
          0
        ),
      [sales]
    )

  // ==========================================
  // PURCHASES
  // ==========================================

  const totalPurchases =
    useMemo(
      () =>
        purchases.reduce(
          (
            total,
            purchase
          ) =>
            total +
            purchase.grandTotal,
          0
        ),
      [purchases]
    )

  // ==========================================
  // PAID EXPENSES
  // ==========================================

  const totalPaidExpenses =
    useMemo(
      () =>
        expenses
          .filter(
            (expense) =>
              expense.status ===
              'Paid'
          )
          .reduce(
            (
              total,
              expense
            ) =>
              total +
              expense.amount,
            0
          ),
      [expenses]
    )

  // ==========================================
  // INVENTORY VALUE
  // ==========================================

  const inventoryValue =
    useMemo(
      () =>
        products.reduce(
          (
            total,
            product
          ) =>
            total +
            product.stock *
              product.purchasePrice,
          0
        ),
      [products]
    )

  // ==========================================
  // ITEMS SOLD
  // ==========================================

  const itemsSold =
    useMemo(
      () =>
        sales.reduce(
          (
            total,
            sale
          ) =>
            total +
            sale.items.reduce(
              (
                itemTotal,
                item
              ) =>
                itemTotal +
                item.quantity,
              0
            ),
          0
        ),
      [sales]
    )

  // ==========================================
  // SIMPLE NET CASH VIEW
  // ==========================================

  /*
    This is NOT accounting profit.

    It is only:
    Sales
    - Purchases
    - Paid Expenses

    Proper P&L will be calculated
    separately using cost of goods sold.
  */

  const netCashPosition =
    totalSales -
    totalPurchases -
    totalPaidExpenses

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  function formatMoney(
    value: number
  ) {
    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
      }
    ).format(value)
  }

  // ==========================================
  // REPORT CARDS
  // ==========================================

  const reportCards = [
    {
      title:
        'Sales Report',

      description:
        'Revenue, bills, products sold and payment methods.',

      icon:
        BarChart3,

      path:
        '/reports/sales',
    },

    {
      title:
        'Purchase Report',

      description:
        'Supplier purchases, purchase value and stock additions.',

      icon:
        ShoppingCart,

      path:
        '/reports/purchases',
    },

    {
      title:
        'Profit & Loss',

      description:
        'Revenue, product cost and operating expenses.',

      icon:
        TrendingUp,

      path:
        '/reports/profit-loss',
    },

    {
      title:
        'Inventory Report',

      description:
        'Stock quantity, inventory value and low-stock products.',

      icon:
        Package,

      path:
        '/reports/inventory',
    },

    {
      title:
        'GST / Tax Report',

      description:
        'GST collected from completed sales.',

      icon:
        ReceiptText,

      path:
        '/reports/tax',
    },

    {
      title:
        'Expense Report',

      description:
        'Business expenses grouped by category and payment status.',

      icon:
        Wallet,

      path:
        '/reports/expenses',
    },

    {
      title:
        'Customer Report',

      description:
        'Registered customers, sales history and spending.',

      icon:
        Users,

      path:
        '/reports/customers',
    },

    {
      title:
        'Supplier Report',

      description:
        'Suppliers, purchases and supplier transaction history.',

      icon:
        Truck,

      path:
        '/reports/suppliers',
    },
  ]

  return (
    <div className="reports-page">

      {/* HEADER */}

      <div className="page-header">

        <h1>
          Reports
        </h1>

        <p>
          Analyse sales, purchases,
          inventory, expenses and
          business performance.
        </p>

      </div>

      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="reports-summary-grid">

        <div className="report-summary-card">

          <div className="report-summary-icon">

            <IndianRupee
              size={21}
            />

          </div>

          <div>

            <span>
              Total Sales
            </span>

            <strong>
              {formatMoney(
                totalSales
              )}
            </strong>

            <small>
              {sales.length}
              {' '}
              completed bills
            </small>

          </div>

        </div>

        <div className="report-summary-card">

          <div className="report-summary-icon">

            <ShoppingCart
              size={21}
            />

          </div>

          <div>

            <span>
              Purchases
            </span>

            <strong>
              {formatMoney(
                totalPurchases
              )}
            </strong>

            <small>
              {purchases.length}
              {' '}
              purchase records
            </small>

          </div>

        </div>

        <div className="report-summary-card">

          <div className="report-summary-icon">

            <Wallet
              size={21}
            />

          </div>

          <div>

            <span>
              Paid Expenses
            </span>

            <strong>
              {formatMoney(
                totalPaidExpenses
              )}
            </strong>

            <small>
              Operating expenses
            </small>

          </div>

        </div>

        <div className="report-summary-card">

          <div className="report-summary-icon">

            <Package
              size={21}
            />

          </div>

          <div>

            <span>
              Inventory Value
            </span>

            <strong>
              {formatMoney(
                inventoryValue
              )}
            </strong>

            <small>
              Current stock cost
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          BUSINESS SNAPSHOT
      ====================================== */}

      <div className="report-snapshot">

        <div>

          <span>
            Sales
          </span>

          <strong>
            {formatMoney(
              totalSales
            )}
          </strong>

        </div>

        <div>

          <span>
            Items Sold
          </span>

          <strong>
            {itemsSold}
          </strong>

        </div>

        <div>

          <span>
            Customers
          </span>

          <strong>
            {customers.length}
          </strong>

        </div>

        <div>

          <span>
            Suppliers
          </span>

          <strong>
            {suppliers.length}
          </strong>

        </div>

        <div>

          <span>
            Net Cash View
          </span>

          <strong>
            {formatMoney(
              netCashPosition
            )}
          </strong>

        </div>

      </div>

      <p className="report-accounting-note">
        Net Cash View is a simple demo
        calculation of sales minus purchases
        and paid expenses. It is not the
        accounting Profit &amp; Loss figure.
      </p>

      {/* =====================================
          REPORTS
      ====================================== */}

      <div className="reports-section-header">

        <div>

          <h2>
            Business Reports
          </h2>

          <p>
            Select a report to view
            detailed business data.
          </p>

        </div>

      </div>

      <div className="reports-grid">

        {reportCards.map(
          (report) => {
            const Icon =
              report.icon

            return (
              <button
                key={
                  report.path
                }
                type="button"
                className="report-card"
                onClick={() =>
                  navigate(
                    report.path
                  )
                }
              >

                <div className="report-card-icon">

                  <Icon
                    size={23}
                  />

                </div>

                <div className="report-card-content">

                  <h3>
                    {report.title}
                  </h3>

                  <p>
                    {
                      report.description
                    }
                  </p>

                  <span>
                    View Report

                    <ArrowRight
                      size={15}
                    />
                  </span>

                </div>

              </button>
            )
          }
        )}

      </div>

    </div>
  )
}