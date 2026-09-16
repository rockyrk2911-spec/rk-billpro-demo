import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Search,
  Plus,
  Upload,
  MoreVertical,
  Package,
  AlertTriangle,
  PackageX,
} from 'lucide-react'

import { useProducts } from '../context/ProductContext'

export default function Products() {
  const navigate = useNavigate()

  // Products now come from ProductContext/localStorage
  const { products } = useProducts()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [stockFilter, setStockFilter] = useState('All')

  // ==============================
  // FILTER PRODUCTS
  // ==============================

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase().trim()

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

  // ==============================
  // SUMMARY
  // ==============================

  const totalProducts = products.length

  const lowStockCount = products.filter(
    (product) => product.status === 'Low Stock'
  ).length

  const outOfStockCount = products.filter(
    (product) => product.status === 'Out of Stock'
  ).length

  // ==============================
  // UI
  // ==============================

  return (
    <div className="products-page">

      {/* HEADER */}

      <div className="products-header">

        <div className="page-header">
          <h1>Products</h1>

          <p>
            Manage your products, prices and stock.
          </p>
        </div>

        <div className="products-header-actions">

          <button
            type="button"
            className="secondary-button"
          >
            <Upload size={17} />
            Import
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/products/add')}
          >
            <Plus size={18} />
            Add Product
          </button>

        </div>

      </div>

      {/* PRODUCT SUMMARY */}

      <div className="product-summary-grid">

        {/* TOTAL PRODUCTS */}

        <div className="product-summary-card">

          <div className="summary-icon summary-blue">
            <Package size={21} />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{totalProducts}</strong>
          </div>

        </div>

        {/* LOW STOCK */}

        <div className="product-summary-card">

          <div className="summary-icon summary-orange">
            <AlertTriangle size={21} />
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{lowStockCount}</strong>
          </div>

        </div>

        {/* OUT OF STOCK */}

        <div className="product-summary-card">

          <div className="summary-icon summary-red">
            <PackageX size={21} />
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>{outOfStockCount}</strong>
          </div>

        </div>

      </div>

      {/* PRODUCTS TABLE CARD */}

      <div className="products-card">

        {/* SEARCH + FILTER */}

        <div className="products-toolbar">

          <div className="product-search">

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

          <div className="product-filters">

            {/* CATEGORY FILTER */}

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              <option value="All">
                All Categories
              </option>

              <option value="Beverages">
                Beverages
              </option>

              <option value="Dairy">
                Dairy
              </option>

              <option value="Bakery">
                Bakery
              </option>

              <option value="Grocery">
                Grocery
              </option>

              <option value="Snacks">
                Snacks
              </option>

              <option value="Personal Care">
                Personal Care
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            {/* STOCK FILTER */}

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

        {/* TABLE */}

        <div className="products-table-wrapper">

          <table className="products-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Barcode</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>GST</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.map((product) => (

                <tr key={product.id}>

                  {/* PRODUCT */}

                  <td>

                    <div className="table-product">

                      <div className="product-placeholder">
                        {product.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {product.name}
                        </strong>

                        <span>
                          SKU-
                          {product.id
                            .toString()
                            .padStart(4, '0')}
                        </span>

                      </div>

                    </div>

                  </td>

                  {/* BARCODE */}

                  <td>

                    <span className="barcode-text">
                      {product.barcode}
                    </span>

                  </td>

                  {/* CATEGORY */}

                  <td>
                    {product.category}
                  </td>

                  {/* STOCK */}

                  <td>

                    <strong>
                      {product.stock}
                    </strong>

                    <span className="product-unit-text">
                      {' '}
                      {product.unit}
                    </span>

                  </td>

                  {/* SELLING PRICE */}

                  <td>

                    <strong>
                      ₹{product.price.toFixed(2)}
                    </strong>

                  </td>

                  {/* GST */}

                  <td>
                    {product.gst}%
                  </td>

                  {/* STATUS */}

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

                  {/* ACTION */}

                  <td>

                    <button
                      type="button"
                      className="table-menu-button"
                      title="Product options"
                    >
                      <MoreVertical size={17} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* EMPTY RESULT */}

        {filteredProducts.length === 0 && (

          <div className="no-products">

            <Package size={38} />

            <h3>
              No products found
            </h3>

            <p>
              Try another product name,
              barcode, category or stock status.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}