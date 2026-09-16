import { useMemo, useState } from 'react'
import {
  Search,
  Boxes,
  PackageCheck,
  AlertTriangle,
  PackageX,
  IndianRupee,
  ArrowDownToLine,
  RefreshCw,
} from 'lucide-react'

import { useProducts } from '../context/ProductContext'

export default function Inventory() {
  const { products } = useProducts()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [stockFilter, setStockFilter] = useState('All')

  const categories = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(products.map((product) => product.category))
      ),
    ]
  }, [products])

  const filteredProducts = products.filter((product) => {
    const searchText = search.trim().toLowerCase()

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.barcode.toLowerCase().includes(searchText)

    const matchesCategory =
      category === 'All' ||
      product.category === category

    const matchesStock =
      stockFilter === 'All' ||
      product.status === stockFilter

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStock
    )
  })

  const totalUnits = products.reduce(
    (total, product) => total + product.stock,
    0
  )

  const lowStockCount = products.filter(
    (product) => product.status === 'Low Stock'
  ).length

  const outOfStockCount = products.filter(
    (product) => product.status === 'Out of Stock'
  ).length

  const inventoryValue = products.reduce(
    (total, product) =>
      total + product.purchasePrice * product.stock,
    0
  )

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)

  return (
    <div className="inventory-page">

      {/* HEADER */}

      <div className="inventory-header">

        <div className="page-header">
          <h1>Inventory</h1>

          <p>
            Monitor stock levels and inventory value across
            your store.
          </p>
        </div>

        <div className="inventory-header-actions">

          <button
            type="button"
            className="secondary-button"
          >
            <ArrowDownToLine size={17} />
            Export
          </button>

          <button
            type="button"
            className="primary-button"
          >
            <RefreshCw size={17} />
            Stock Adjustment
          </button>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="inventory-summary-grid">

        <div className="inventory-summary-card">

          <div className="inventory-summary-icon inventory-blue">
            <Boxes size={21} />
          </div>

          <div>
            <span>Total Stock</span>

            <strong>
              {totalUnits.toLocaleString('en-IN')}
            </strong>

            <small>Units available</small>
          </div>

        </div>

        <div className="inventory-summary-card">

          <div className="inventory-summary-icon inventory-green">
            <IndianRupee size={21} />
          </div>

          <div>
            <span>Inventory Value</span>

            <strong>
              {formatCurrency(inventoryValue)}
            </strong>

            <small>Based on purchase price</small>
          </div>

        </div>

        <div className="inventory-summary-card">

          <div className="inventory-summary-icon inventory-orange">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>Low Stock</span>

            <strong>
              {lowStockCount}
            </strong>

            <small>Needs attention</small>
          </div>

        </div>

        <div className="inventory-summary-card">

          <div className="inventory-summary-icon inventory-red">
            <PackageX size={21} />
          </div>

          <div>
            <span>Out of Stock</span>

            <strong>
              {outOfStockCount}
            </strong>

            <small>Unavailable products</small>
          </div>

        </div>

      </div>

      {/* TABLE CARD */}

      <div className="inventory-card">

        <div className="inventory-card-header">

          <div>
            <h3>Stock Overview</h3>

            <p>
              Current inventory levels for all products.
            </p>
          </div>

          <span className="inventory-product-count">
            {products.length} Products
          </span>

        </div>

        {/* FILTERS */}

        <div className="inventory-toolbar">

          <div className="inventory-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search product or barcode..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <div className="inventory-filters">

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === 'All'
                    ? 'All Categories'
                    : item}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(event.target.value)
              }
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

        </div>

        {/* INVENTORY TABLE */}

        <div className="inventory-table-wrapper">

          <table className="inventory-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min. Stock</th>
                <th>Purchase Price</th>
                <th>Stock Value</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.map((product) => {

                const stockValue =
                  product.purchasePrice *
                  product.stock

                return (
                  <tr key={product.id}>

                    <td>

                      <div className="inventory-product">

                        <div className="inventory-product-icon">
                          {product.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.barcode}
                          </span>

                        </div>

                      </div>

                    </td>

                    <td>
                      {product.category}
                    </td>

                    <td>

                      <div className="current-stock">

                        <strong>
                          {product.stock}
                        </strong>

                        <span>
                          {product.unit}
                        </span>

                      </div>

                    </td>

                    <td>
                      {product.minimumStock}
                    </td>

                    <td>
                      ₹{product.purchasePrice.toFixed(2)}
                    </td>

                    <td>

                      <strong>
                        {formatCurrency(stockValue)}
                      </strong>

                    </td>

                    <td>

                      <span
                        className={
                          product.status === 'In Stock'
                            ? 'status-badge status-good'
                            : product.status === 'Low Stock'
                            ? 'status-badge status-low'
                            : 'status-badge status-out'
                        }
                      >
                        {product.status}
                      </span>

                    </td>

                  </tr>
                )
              })}

            </tbody>

          </table>

        </div>

        {filteredProducts.length === 0 && (

          <div className="inventory-empty">

            <PackageCheck size={42} />

            <h3>No inventory found</h3>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}