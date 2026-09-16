import {
  IndianRupee,
  ReceiptText,
  TrendingUp,
  Wallet,
  ShoppingCart,
  PackagePlus,
  UserPlus,
  Plus,
  AlertTriangle,
  ArrowUpRight,
  Package,
  BarChart3,
  Store,
  Wifi,
  WifiOff,
  RefreshCw,
} from 'lucide-react'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import { useNavigate } from 'react-router-dom'

import { useSales } from '../context/SaleContext'
import { useProducts } from '../context/ProductContext'
import { useExpenses } from '../context/ExpenseContext'
import { useBackup } from '../context/BackupContext'

/* =========================================
   HELPERS
========================================= */

function isSameDay(
  firstDate: Date,
  secondDate: Date
) {
  return (
    firstDate.getFullYear() ===
      secondDate.getFullYear() &&
    firstDate.getMonth() ===
      secondDate.getMonth() &&
    firstDate.getDate() ===
      secondDate.getDate()
  )
}

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    'en-IN',
    {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }
  ).format(value)
}

function formatCompactCurrency(
  value: number
) {
  if (value >= 100000) {
    return `₹${(
      value / 100000
    ).toFixed(1)}L`
  }

  if (value >= 1000) {
    return `₹${(
      value / 1000
    ).toFixed(1)}K`
  }

  return `₹${Math.round(value)}`
}

function getStartOfDay(
  date: Date
) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  )
}

function getGreeting(
  hour: number
) {
  if (hour < 12) {
    return 'Good Morning'
  }

  if (hour < 17) {
    return 'Good Afternoon'
  }

  return 'Good Evening'
}

/* =========================================
   DASHBOARD
========================================= */

export default function Dashboard() {
  const navigate =
    useNavigate()

  const {
    sales,
  } = useSales()

  const {
    products,
  } = useProducts()

  const {
    expenses,
  } = useExpenses()

  const {
    connectionStatus,
    syncStatus,
    pendingChanges,
  } = useBackup()

  /* =========================================
     CURRENT DATE
  ========================================= */

  const now =
    new Date()

  const today =
    getStartOfDay(now)

  const greeting =
    getGreeting(
      now.getHours()
    )

  const formattedDate =
    new Intl.DateTimeFormat(
      'en-IN',
      {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    ).format(now)

  /* =========================================
     TODAY SALES
  ========================================= */

  const todaySales =
    sales.filter(
      (sale) => {
        const saleDate =
          new Date(
            sale.date
          )

        if (
          Number.isNaN(
            saleDate.getTime()
          )
        ) {
          return false
        }

        return isSameDay(
          saleDate,
          now
        )
      }
    )

  const todaySalesAmount =
    todaySales.reduce(
      (
        total,
        sale
      ) =>
        total +
        sale.grandTotal,
      0
    )

  const todayBills =
    todaySales.length

  /* =========================================
     TODAY EXPENSES
  ========================================= */

  const todayExpenses =
    expenses.filter(
      (expense) => {
        const expenseDate =
          new Date(
            expense.date
          )

        if (
          Number.isNaN(
            expenseDate.getTime()
          )
        ) {
          return false
        }

        return isSameDay(
          expenseDate,
          now
        )
      }
    )

  const todayExpenseAmount =
    todayExpenses.reduce(
      (
        total,
        expense
      ) =>
        total +
        expense.amount,
      0
    )

  /* =========================================
     ESTIMATED GROSS PROFIT
  ========================================= */

  const estimatedGrossProfit =
    todaySales.reduce(
      (
        saleTotal,
        sale
      ) => {
        const saleProfit =
          sale.items.reduce(
            (
              itemTotal,
              item
            ) => {
              const product =
                products.find(
                  (
                    currentProduct
                  ) =>
                    currentProduct.id ===
                    item.productId
                )

              if (!product) {
                return itemTotal
              }

              const profitPerUnit =
                item.price -
                product.purchasePrice

              const itemProfit =
                profitPerUnit *
                item.quantity

              return (
                itemTotal +
                itemProfit
              )
            },
            0
          )

        return (
          saleTotal +
          saleProfit
        )
      },
      0
    )

  /* =========================================
     STOCK INFORMATION
  ========================================= */

  const lowStockProducts =
    products
      .filter(
        (product) =>
          product.stock <=
          product.minimumStock
      )
      .sort(
        (
          first,
          second
        ) =>
          first.stock -
          second.stock
      )

  const lowStockCount =
    lowStockProducts.length

  const outOfStockCount =
    products.filter(
      (product) =>
        product.stock <= 0
    ).length

  const totalProducts =
    products.length

  const totalStockUnits =
    products.reduce(
      (
        total,
        product
      ) =>
        total +
        product.stock,
      0
    )

  /* =========================================
     WEEKLY SALES CHART
  ========================================= */

  const salesData =
    Array.from(
      {
        length: 7,
      },
      (
        _,
        index
      ) => {
        const date =
          new Date(today)

        date.setDate(
          today.getDate() -
            (6 - index)
        )

        const amount =
          sales.reduce(
            (
              total,
              sale
            ) => {
              const saleDate =
                new Date(
                  sale.date
                )

              if (
                Number.isNaN(
                  saleDate.getTime()
                )
              ) {
                return total
              }

              if (
                isSameDay(
                  saleDate,
                  date
                )
              ) {
                return (
                  total +
                  sale.grandTotal
                )
              }

              return total
            },
            0
          )

        return {
          day:
            new Intl.DateTimeFormat(
              'en-IN',
              {
                weekday: 'short',
              }
            ).format(date),

          sales:
            Number(
              amount.toFixed(2)
            ),
        }
      }
    )

  /* =========================================
     TOP PRODUCTS TODAY
  ========================================= */

  const productSalesMap =
    new Map<
      number,
      {
        name: string
        sold: number
        amount: number
      }
    >()

  todaySales.forEach(
    (sale) => {
      sale.items.forEach(
        (item) => {
          const existing =
            productSalesMap.get(
              item.productId
            )

          if (existing) {
            existing.sold +=
              item.quantity

            existing.amount +=
              item.total

            return
          }

          productSalesMap.set(
            item.productId,
            {
              name:
                item.name,

              sold:
                item.quantity,

              amount:
                item.total,
            }
          )
        }
      )
    }
  )

  const topProducts =
    Array.from(
      productSalesMap.values()
    )
      .sort(
        (
          first,
          second
        ) =>
          second.sold -
          first.sold
      )
      .slice(
        0,
        4
      )

  /* =========================================
     RECENT SALES
  ========================================= */

  const recentSales =
    [...sales]
      .sort(
        (
          first,
          second
        ) => {
          const firstTime =
            new Date(
              first.date
            ).getTime()

          const secondTime =
            new Date(
              second.date
            ).getTime()

          const safeFirstTime =
            Number.isNaN(
              firstTime
            )
              ? 0
              : firstTime

          const safeSecondTime =
            Number.isNaN(
              secondTime
            )
              ? 0
              : secondTime

          return (
            safeSecondTime -
            safeFirstTime
          )
        }
      )
      .slice(
        0,
        5
      )

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="dashboard">

      {/* =====================================
          PAGE HEADING
      ====================================== */}

      <div className="dashboard-heading">

        <div className="page-header">

          <h1>
            {greeting}, Rakesh 👋
          </h1>

          <p>
            Here's what's happening
            with RK Supermarket today.
          </p>

        </div>

        <div className="dashboard-date">
          Today • {formattedDate}
        </div>

      </div>

      {/* =====================================
          BUSINESS STATUS
      ====================================== */}

      <div className="dashboard-business-bar">

        <div className="dashboard-business-identity">

          <div className="dashboard-business-icon">
            <Store size={20} />
          </div>

          <div>

            <strong>
              RK Supermarket
            </strong>

            <span>
              Tambaram Branch
            </span>

          </div>

        </div>

        <div className="dashboard-business-status">

          <span
            className={
              connectionStatus ===
              'Online'
                ? 'dashboard-status online'
                : 'dashboard-status offline'
            }
          >

            {connectionStatus ===
            'Online' ? (
              <Wifi size={15} />
            ) : (
              <WifiOff size={15} />
            )}

            {connectionStatus}

          </span>

          <span className="dashboard-sync-status">

            <RefreshCw size={14} />

            {syncStatus}

            {pendingChanges > 0 &&
              ` • ${pendingChanges} pending`}

          </span>

        </div>

      </div>

      {/* =====================================
          QUICK ACTIONS
      ====================================== */}

      <div className="quick-actions">

        <button
          type="button"
          onClick={() =>
            navigate('/pos')
          }
        >
          <ShoppingCart size={18} />
          New Sale
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              '/products/add'
            )
          }
        >
          <PackagePlus size={18} />
          Add Product
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              '/customers/add'
            )
          }
        >
          <UserPlus size={18} />
          Add Customer
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              '/expenses/add'
            )
          }
        >
          <Plus size={18} />
          Add Expense
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              '/reports'
            )
          }
        >
          <BarChart3 size={18} />
          Reports
        </button>

      </div>

      {/* =====================================
          STAT CARDS
      ====================================== */}

      <div className="stats-grid">

        {/* SALES */}

        <div className="stat-card">

          <div className="stat-icon sales-icon">
            <IndianRupee size={22} />
          </div>

          <div className="stat-content">

            <p>
              Today's Sales
            </p>

            <h2>
              {formatCurrency(
                todaySalesAmount
              )}
            </h2>

            <span className="positive">

              <TrendingUp size={14} />

              {todayBills}{' '}

              {todayBills === 1
                ? 'bill'
                : 'bills'}{' '}

              today

            </span>

          </div>

        </div>

        {/* BILLS */}

        <div className="stat-card">

          <div className="stat-icon bills-icon">
            <ReceiptText size={22} />
          </div>

          <div className="stat-content">

            <p>
              Today's Bills
            </p>

            <h2>
              {todayBills}
            </h2>

            <span className="neutral">
              Saved transactions
            </span>

          </div>

        </div>

        {/* PROFIT */}

        <div className="stat-card">

          <div className="stat-icon profit-icon">
            <TrendingUp size={22} />
          </div>

          <div className="stat-content">

            <p>
              Est. Gross Profit
            </p>

            <h2>
              {formatCurrency(
                estimatedGrossProfit
              )}
            </h2>

            <span className="neutral">
              Based on current
              purchase prices
            </span>

          </div>

        </div>

        {/* EXPENSES */}

        <div className="stat-card">

          <div className="stat-icon expense-icon">
            <Wallet size={22} />
          </div>

          <div className="stat-content">

            <p>
              Today's Expenses
            </p>

            <h2>
              {formatCurrency(
                todayExpenseAmount
              )}
            </h2>

            <span className="neutral">

              {todayExpenses.length}{' '}

              {todayExpenses.length ===
              1
                ? 'expense'
                : 'expenses'}

            </span>

          </div>

        </div>

      </div>

      {/* =====================================
          SALES CHART + BUSINESS SUMMARY
      ====================================== */}

      <div className="dashboard-main-grid">

        {/* SALES CHART */}

        <div className="dashboard-card sales-chart-card">

          <div className="card-heading">

            <div>

              <h3>
                Sales Overview
              </h3>

              <p>
                Last 7 days sales
                performance
              </p>

            </div>

            <button
              type="button"
              className="view-button"
              onClick={() =>
                navigate(
                  '/reports/sales'
                )
              }
            >
              View Report
            </button>

          </div>

          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={salesData}
              >

                <defs>

                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="var(--rk-primary)"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="95%"
                      stopColor="var(--rk-primary)"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={
                    formatCompactCurrency
                  }
                />

                <Tooltip
                  formatter={(
                    value
                  ) => [
                    formatCurrency(
                      Number(value)
                    ),
                    'Sales',
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--rk-primary)"
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* BUSINESS SUMMARY */}

        <div className="dashboard-card">

          <div className="card-heading">

            <div>

              <h3>
                Business Summary
              </h3>

              <p>
                Current inventory
                overview
              </p>

            </div>

            <button
              type="button"
              className="view-button"
              onClick={() =>
                navigate(
                  '/inventory'
                )
              }
            >
              Inventory
            </button>

          </div>

          <div className="dashboard-summary-list">

            {/* PRODUCTS */}

            <div className="dashboard-summary-item">

              <div className="dashboard-summary-icon">
                <Package size={19} />
              </div>

              <div>

                <span>
                  Products
                </span>

                <strong>
                  {totalProducts}
                </strong>

              </div>

            </div>

            {/* STOCK */}

            <div className="dashboard-summary-item">

              <div className="dashboard-summary-icon">
                <PackagePlus size={19} />
              </div>

              <div>

                <span>
                  Stock Units
                </span>

                <strong>
                  {totalStockUnits}
                </strong>

              </div>

            </div>

            {/* LOW STOCK */}

            <div className="dashboard-summary-item">

              <div className="dashboard-summary-icon warning">
                <AlertTriangle size={19} />
              </div>

              <div>

                <span>
                  Low Stock
                </span>

                <strong>
                  {lowStockCount}
                </strong>

              </div>

            </div>

            {/* OUT OF STOCK */}

            <div className="dashboard-summary-item">

              <div className="dashboard-summary-icon danger">
                <AlertTriangle size={19} />
              </div>

              <div>

                <span>
                  Out of Stock
                </span>

                <strong>
                  {outOfStockCount}
                </strong>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          TOP PRODUCTS + LOW STOCK
      ====================================== */}

      <div className="dashboard-bottom-grid">

        {/* TOP PRODUCTS */}

        <div className="dashboard-card">

          <div className="card-heading">

            <div>

              <h3>
                Top Products
              </h3>

              <p>
                Best selling products
                today
              </p>

            </div>

            <button
              type="button"
              className="view-button"
              onClick={() =>
                navigate(
                  '/sales'
                )
              }
            >
              View Sales
            </button>

          </div>

          {topProducts.length > 0 ? (

            <div className="product-list">

              {topProducts.map(
                (
                  product,
                  index
                ) => (

                  <div
                    className="top-product"
                    key={product.name}
                  >

                    <div className="product-number">
                      {index + 1}
                    </div>

                    <div className="product-details">

                      <strong>
                        {product.name}
                      </strong>

                      <span>

                        {product.sold}{' '}

                        {product.sold === 1
                          ? 'unit'
                          : 'units'}{' '}

                        sold

                      </span>

                    </div>

                    <strong className="product-amount">

                      {formatCurrency(
                        product.amount
                      )}

                    </strong>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="dashboard-empty-state">

              <ShoppingCart size={30} />

              <strong>
                No sales today
              </strong>

              <span>
                Complete a POS bill
                to see top products.
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate('/pos')
                }
              >
                Create Sale
              </button>

            </div>

          )}

        </div>

        {/* LOW STOCK */}

        <div className="dashboard-card">

          <div className="card-heading">

            <div>

              <h3>
                Low Stock Alert
              </h3>

              <p>
                Products requiring
                attention
              </p>

            </div>

            <span className="alert-count">
              {lowStockCount}
            </span>

          </div>

          {lowStockCount > 0 ? (

            <div className="low-stock-list">

              {lowStockProducts
                .slice(
                  0,
                  5
                )
                .map(
                  (product) => (

                    <div
                      className="low-stock-item"
                      key={product.id}
                    >

                      <div className="warning-icon">
                        <AlertTriangle
                          size={18}
                        />
                      </div>

                      <div>

                        <strong>
                          {product.name}
                        </strong>

                        <span>
                          Minimum stock:{' '}
                          {
                            product.minimumStock
                          }
                        </span>

                      </div>

                      <div className="stock-value">

                        {product.stock}{' '}

                        {product.stock === 1
                          ? 'left'
                          : 'left'}

                      </div>

                    </div>

                  )
                )}

            </div>

          ) : (

            <div className="dashboard-empty-state">

              <Package size={30} />

              <strong>
                Stock looks good
              </strong>

              <span>
                No products are
                currently at or below
                their minimum stock
                level.
              </span>

            </div>

          )}

          <button
            type="button"
            className="full-view-button"
            onClick={() =>
              navigate(
                '/inventory'
              )
            }
          >
            View Inventory

            <ArrowUpRight size={16} />
          </button>

        </div>

      </div>

      {/* =====================================
          RECENT SALES
      ====================================== */}

      <div className="dashboard-card recent-sales-card dashboard-recent-full">

        <div className="card-heading">

          <div>

            <h3>
              Recent Sales
            </h3>

            <p>
              Latest billing
              transactions
            </p>

          </div>

          <button
            type="button"
            className="view-button"
            onClick={() =>
              navigate('/sales')
            }
          >
            View All
          </button>

        </div>

        {recentSales.length > 0 ? (

          <div className="table-wrapper">

            <table className="recent-table">

              <thead>

                <tr>
                  <th>
                    Invoice
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Total
                  </th>
                </tr>

              </thead>

              <tbody>

                {recentSales.map(
                  (sale) => (

                    <tr
                      key={sale.id}
                      className="dashboard-sale-row"
                      onClick={() =>
                        navigate(
                          `/invoice/${sale.id}`
                        )
                      }
                    >

                      <td className="invoice-number">
                        {sale.invoiceNumber}
                      </td>

                      <td>
                        {sale.customer ||
                          'Walk-in Customer'}
                      </td>

                      <td>

                        <span className="payment-badge">
                          {sale.paymentMethod}
                        </span>

                      </td>

                      <td>

                        <strong>
                          {formatCurrency(
                            sale.grandTotal
                          )}
                        </strong>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        ) : (

          <div className="dashboard-empty-state dashboard-sales-empty">

            <ReceiptText size={32} />

            <strong>
              No invoices yet
            </strong>

            <span>
              Create your first POS
              sale and the invoice
              will appear here.
            </span>

            <button
              type="button"
              onClick={() =>
                navigate('/pos')
              }
            >
              Start Billing
            </button>

          </div>

        )}

      </div>

      {/* =====================================
          DEMO GUIDE
      ====================================== */}

      <section className="dashboard-demo-guide">

        <div className="dashboard-demo-guide-heading">

          <div>

            <span>
              RK BILLPRO DEMO
            </span>

            <h3>
              Try the complete billing
              workflow
            </h3>

            <p>
              Follow these steps to
              demonstrate the main
              RK BillPro business
              workflow.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate('/pos')
            }
          >
            <ShoppingCart size={17} />

            Start Demo Bill
          </button>

        </div>

        <div className="dashboard-demo-steps">

          <div>
            <strong>1</strong>
            <span>Create Bill</span>
          </div>

          <div>
            <strong>2</strong>
            <span>Take Payment</span>
          </div>

          <div>
            <strong>3</strong>
            <span>View Invoice</span>
          </div>

          <div>
            <strong>4</strong>
            <span>Check Inventory</span>
          </div>

          <div>
            <strong>5</strong>
            <span>View Reports</span>
          </div>

          <div>
            <strong>6</strong>
            <span>Test Offline Sync</span>
          </div>

        </div>

      </section>

    </div>
  )
}