import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Package,
  Boxes,
  IndianRupee,
  TrendingUp,
  Search,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Layers3,
} from 'lucide-react'

import {
  useProducts,
} from '../context/ProductContext'

type StockFilter =
  | 'All'
  | 'In Stock'
  | 'Low Stock'
  | 'Out of Stock'

export default function InventoryReport() {
  const navigate = useNavigate()

  const {
    products,
  } = useProducts()

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    stockFilter,
    setStockFilter,
  ] = useState<StockFilter>('All')

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState('All')

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories =
    useMemo(() => {
      return Array.from(
        new Set(
          products
            .map(
              (product) =>
                product.category
            )
            .filter(Boolean)
        )
      ).sort()
    }, [products])

  // ==========================================
  // FILTERED PRODUCTS
  // ==========================================

  const filteredProducts =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase()

      return products.filter(
        (product) => {
          const matchesSearch =
            searchText === '' ||
            product.name
              .toLowerCase()
              .includes(
                searchText
              ) ||
            product.barcode
              .toLowerCase()
              .includes(
                searchText
              ) ||
            product.category
              .toLowerCase()
              .includes(
                searchText
              )

          const matchesStock =
            stockFilter === 'All' ||
            product.status ===
              stockFilter

          const matchesCategory =
            categoryFilter === 'All' ||
            product.category ===
              categoryFilter

          return (
            matchesSearch &&
            matchesStock &&
            matchesCategory
          )
        }
      )
    }, [
      products,
      search,
      stockFilter,
      categoryFilter,
    ])

  // ==========================================
  // TOTAL PRODUCTS
  // ==========================================

  const totalProducts =
    products.length

  // ==========================================
  // TOTAL STOCK UNITS
  // ==========================================

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

  // ==========================================
  // INVENTORY COST VALUE
  // ==========================================

  const inventoryCostValue =
    products.reduce(
      (
        total,
        product
      ) =>
        total +
        product.stock *
          product.purchasePrice,
      0
    )

  // ==========================================
  // RETAIL VALUE
  // ==========================================

  const retailStockValue =
    products.reduce(
      (
        total,
        product
      ) =>
        total +
        product.stock *
          product.price,
      0
    )

  // ==========================================
  // POTENTIAL GROSS MARGIN
  // ==========================================

  /*
    This is not realised profit.

    It is only the difference between
    current retail stock value and
    current inventory cost value.
  */

  const potentialMargin =
    retailStockValue -
    inventoryCostValue

  const potentialMarginPercent =
    retailStockValue > 0
      ? (
          potentialMargin /
          retailStockValue
        ) *
        100
      : 0

  // ==========================================
  // STOCK STATUS
  // ==========================================

  const inStockCount =
    products.filter(
      (product) =>
        product.status ===
        'In Stock'
    ).length

  const lowStockCount =
    products.filter(
      (product) =>
        product.status ===
        'Low Stock'
    ).length

  const outOfStockCount =
    products.filter(
      (product) =>
        product.status ===
        'Out of Stock'
    ).length

  // ==========================================
  // CATEGORY BREAKDOWN
  // ==========================================

  const categoryBreakdown =
    useMemo(() => {
      const map =
        new Map<
          string,
          {
            category: string
            products: number
            stock: number
            costValue: number
            retailValue: number
          }
        >()

      products.forEach(
        (product) => {
          const existing =
            map.get(
              product.category
            )

          const costValue =
            product.stock *
            product.purchasePrice

          const retailValue =
            product.stock *
            product.price

          if (existing) {
            existing.products += 1

            existing.stock +=
              product.stock

            existing.costValue +=
              costValue

            existing.retailValue +=
              retailValue
          } else {
            map.set(
              product.category,
              {
                category:
                  product.category,

                products: 1,

                stock:
                  product.stock,

                costValue,

                retailValue,
              }
            )
          }
        }
      )

      return Array.from(
        map.values()
      ).sort(
        (a, b) =>
          b.costValue -
          a.costValue
      )
    }, [products])

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

  return (
    <div className="detailed-report-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="report-page-top">

        <div>

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate(
                '/reports'
              )
            }
          >

            <ArrowLeft
              size={17}
            />

            Back to Reports

          </button>

          <div className="page-header report-page-title">

            <h1>
              Inventory Report
            </h1>

            <p>
              Analyse current stock,
              inventory value and
              stock availability.
            </p>

          </div>

        </div>

        <button
          type="button"
          className="inventory-report-open-button"
          onClick={() =>
            navigate(
              '/inventory'
            )
          }
        >

          <Boxes
            size={17}
          />

          Open Inventory

        </button>

      </div>

      {/* =====================================
          MAIN KPI
      ====================================== */}

      <div className="report-kpi-grid">

        {/* PRODUCTS */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <Package
              size={21}
            />

          </div>

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {totalProducts}
            </strong>

            <small>
              Product records
            </small>

          </div>

        </div>

        {/* STOCK */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <Boxes
              size={21}
            />

          </div>

          <div>

            <span>
              Stock Units
            </span>

            <strong>
              {totalStockUnits}
            </strong>

            <small>
              Current quantity
            </small>

          </div>

        </div>

        {/* COST */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <IndianRupee
              size={21}
            />

          </div>

          <div>

            <span>
              Inventory Cost
            </span>

            <strong>
              {formatMoney(
                inventoryCostValue
              )}
            </strong>

            <small>
              Stock × purchase price
            </small>

          </div>

        </div>

        {/* RETAIL */}

        <div className="report-kpi-card">

          <div className="report-kpi-icon">

            <TrendingUp
              size={21}
            />

          </div>

          <div>

            <span>
              Retail Stock Value
            </span>

            <strong>
              {formatMoney(
                retailStockValue
              )}
            </strong>

            <small>
              Stock × selling price
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          POTENTIAL MARGIN
      ====================================== */}

      <div className="inventory-margin-card">

        <div className="inventory-margin-left">

          <div className="inventory-margin-icon">

            <TrendingUp
              size={22}
            />

          </div>

          <div>

            <span>
              Potential Gross Margin
            </span>

            <strong>
              {formatMoney(
                potentialMargin
              )}
            </strong>

            <small>
              If all current stock were
              sold at the recorded selling
              price.
            </small>

          </div>

        </div>

        <div className="inventory-margin-percent">

          <span>
            Potential Margin
          </span>

          <strong>
            {potentialMarginPercent.toFixed(
              1
            )}
            %
          </strong>

        </div>

      </div>

      {/* =====================================
          STOCK STATUS
      ====================================== */}

      <div className="inventory-status-grid">

        <button
          type="button"
          className={
            stockFilter ===
            'In Stock'
              ? 'inventory-status-card active'
              : 'inventory-status-card'
          }
          onClick={() =>
            setStockFilter(
              stockFilter ===
                'In Stock'
                ? 'All'
                : 'In Stock'
            )
          }
        >

          <div className="inventory-status-icon in-stock">

            <CheckCircle2
              size={20}
            />

          </div>

          <div>

            <span>
              In Stock
            </span>

            <strong>
              {inStockCount}
            </strong>

          </div>

        </button>

        <button
          type="button"
          className={
            stockFilter ===
            'Low Stock'
              ? 'inventory-status-card active'
              : 'inventory-status-card'
          }
          onClick={() =>
            setStockFilter(
              stockFilter ===
                'Low Stock'
                ? 'All'
                : 'Low Stock'
            )
          }
        >

          <div className="inventory-status-icon low-stock">

            <AlertTriangle
              size={20}
            />

          </div>

          <div>

            <span>
              Low Stock
            </span>

            <strong>
              {lowStockCount}
            </strong>

          </div>

        </button>

        <button
          type="button"
          className={
            stockFilter ===
            'Out of Stock'
              ? 'inventory-status-card active'
              : 'inventory-status-card'
          }
          onClick={() =>
            setStockFilter(
              stockFilter ===
                'Out of Stock'
                ? 'All'
                : 'Out of Stock'
            )
          }
        >

          <div className="inventory-status-icon out-stock">

            <XCircle
              size={20}
            />

          </div>

          <div>

            <span>
              Out of Stock
            </span>

            <strong>
              {outOfStockCount}
            </strong>

          </div>

        </button>

      </div>

      {/* =====================================
          CATEGORY BREAKDOWN
      ====================================== */}

      <div className="report-data-card inventory-category-card">

        <div className="report-data-header">

          <div>

            <h3>
              Category Breakdown
            </h3>

            <p>
              Current stock and inventory
              value by category.
            </p>

          </div>

        </div>

        {categoryBreakdown.length >
        0 ? (

          <div className="inventory-category-list">

            {categoryBreakdown.map(
              (category) => {

                const percentage =
                  inventoryCostValue > 0
                    ? (
                        category.costValue /
                        inventoryCostValue
                      ) *
                      100
                    : 0

                return (
                  <div
                    key={
                      category.category
                    }
                    className="inventory-category-item"
                  >

                    <div className="inventory-category-top">

                      <div className="inventory-category-name">

                        <div className="inventory-category-icon">

                          <Layers3
                            size={17}
                          />

                        </div>

                        <div>

                          <strong>
                            {
                              category.category
                            }
                          </strong>

                          <small>
                            {
                              category.products
                            }
                            {' '}
                            products •{' '}
                            {
                              category.stock
                            }
                            {' '}
                            units
                          </small>

                        </div>

                      </div>

                      <div className="inventory-category-values">

                        <div>

                          <span>
                            Cost
                          </span>

                          <strong>
                            {formatMoney(
                              category.costValue
                            )}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Retail
                          </span>

                          <strong>
                            {formatMoney(
                              category.retailValue
                            )}
                          </strong>

                        </div>

                      </div>

                    </div>

                    <div className="report-progress">

                      <div
                        className="report-progress-value"
                        style={{
                          width:
                            `${Math.min(
                              percentage,
                              100
                            )}%`,
                        }}
                      />

                    </div>

                  </div>
                )
              }
            )}

          </div>

        ) : (

          <div className="report-empty-small">

            No inventory categories
            available.

          </div>

        )}

      </div>

      {/* =====================================
          INVENTORY TABLE
      ====================================== */}

      <div className="report-data-card report-transactions-card">

        <div className="report-data-header report-transaction-header">

          <div>

            <h3>
              Inventory Details
            </h3>

            <p>
              Current product stock and
              valuation.
            </p>

          </div>

          <span className="report-record-count">

            {filteredProducts.length}
            {' '}
            {filteredProducts.length ===
            1
              ? 'product'
              : 'products'}

          </span>

        </div>

        {/* FILTERS */}

        <div className="inventory-report-toolbar">

          <div className="report-search inventory-report-search">

            <Search
              size={18}
            />

            <input
              type="text"
              placeholder="Search product, barcode or category..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <select
            value={
              categoryFilter
            }
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            className="inventory-report-select"
          >

            <option value="All">
              All Categories
            </option>

            {categories.map(
              (category) => (

                <option
                  key={
                    category
                  }
                  value={
                    category
                  }
                >
                  {category}
                </option>

              )
            )}

          </select>

          <select
            value={
              stockFilter
            }
            onChange={(event) =>
              setStockFilter(
                event.target
                  .value as StockFilter
              )
            }
            className="inventory-report-select"
          >

            <option value="All">
              All Stock
            </option>

            <option value="In Stock">
              In Stock
            </option>

            <option value="Low Stock">
              Low Stock
            </option>

            <option value="Out of Stock">
              Out of Stock
            </option>

          </select>

        </div>

        {/* TABLE */}

        <div className="report-table-wrapper">

          <table className="report-table inventory-report-table">

            <thead>

              <tr>

                <th>
                  Product
                </th>

                <th>
                  Barcode
                </th>

                <th>
                  Category
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Min Stock
                </th>

                <th>
                  Purchase
                </th>

                <th>
                  Selling
                </th>

                <th>
                  Cost Value
                </th>

                <th>
                  Retail Value
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.map(
                (product) => {

                  const costValue =
                    product.stock *
                    product.purchasePrice

                  const retailValue =
                    product.stock *
                    product.price

                  return (
                    <tr
                      key={
                        product.id
                      }
                    >

                      <td>

                        <strong>
                          {
                            product.name
                          }
                        </strong>

                        <small className="inventory-product-unit">
                          {
                            product.unit
                          }
                        </small>

                      </td>

                      <td>
                        {
                          product.barcode
                        }
                      </td>

                      <td>
                        {
                          product.category
                        }
                      </td>

                      <td>

                        <strong>
                          {
                            product.stock
                          }
                        </strong>

                      </td>

                      <td>
                        {
                          product.minimumStock
                        }
                      </td>

                      <td>
                        {formatMoney(
                          product.purchasePrice
                        )}
                      </td>

                      <td>
                        {formatMoney(
                          product.price
                        )}
                      </td>

                      <td>

                        <strong>
                          {formatMoney(
                            costValue
                          )}
                        </strong>

                      </td>

                      <td>

                        <strong>
                          {formatMoney(
                            retailValue
                          )}
                        </strong>

                      </td>

                      <td>

                        <span
                          className={
                            product.status ===
                            'In Stock'
                              ? 'inventory-report-status in-stock'
                              : product.status ===
                                'Low Stock'
                              ? 'inventory-report-status low-stock'
                              : 'inventory-report-status out-stock'
                          }
                        >

                          {
                            product.status
                          }

                        </span>

                      </td>

                    </tr>
                  )
                }
              )}

            </tbody>

          </table>

        </div>

        {/* EMPTY */}

        {filteredProducts.length ===
          0 && (

          <div className="report-empty">

            <Package
              size={40}
            />

            <h3>
              No products found
            </h3>

            <p>
              No inventory products match
              the selected filters.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}