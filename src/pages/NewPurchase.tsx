import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  PackagePlus,
  CheckCircle2,
  Truck,
} from 'lucide-react'

import {
  useProducts,
} from '../context/ProductContext'

import {
  usePurchases,
} from '../context/PurchaseContext'

import {
  useSuppliers,
} from '../context/SupplierContext'

import type {
  Product,
} from '../types/product'

import type {
  PurchaseItem,
} from '../types/purchase'

type CartItem = {
  product: Product
  quantity: number
  purchasePrice: number
}

/* =========================================
   PURCHASE EVENT DATA

   This helper is outside the React component.
   It is called only when the user completes
   a purchase.

   The timestamp is reused for:
   1. Purchase numeric ID
   2. Purchase saved date
========================================= */

function createPurchaseEventData() {
  const now =
    new Date()

  return {
    id:
      now.getTime(),

    date:
      now.toISOString(),
  }
}

/* =========================================
   NEW PURCHASE
========================================= */

export default function NewPurchase() {
  const navigate =
    useNavigate()

  const {
    products,
    increaseStock,
  } = useProducts()

  const {
    addPurchase,
    getNextPurchaseNumber,
  } = usePurchases()

  const {
    suppliers,
  } = useSuppliers()

  /* =========================================
     PURCHASE NUMBER

     Generate once for this purchase page.
     The same number is displayed and saved.
  ========================================= */

  const [
    purchaseNumber,
  ] = useState(
    () =>
      getNextPurchaseNumber()
  )

  /* =========================================
     FORM STATE
  ========================================= */

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    category,
    setCategory,
  ] = useState('All')

  const [
    supplier,
    setSupplier,
  ] = useState('')

  const [
    supplierInvoice,
    setSupplierInvoice,
  ] = useState('')

  const [
    cart,
    setCart,
  ] =
    useState<CartItem[]>([])

  const [
    completed,
    setCompleted,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  /* =========================================
     ACTIVE SUPPLIERS
  ========================================= */

  const activeSuppliers =
    useMemo(
      () =>
        suppliers.filter(
          (item) =>
            item.status ===
            'Active'
        ),
      [suppliers]
    )

  /* =========================================
     PRODUCT CATEGORIES
  ========================================= */

  const categories =
    useMemo(
      () => [
        'All',

        ...Array.from(
          new Set(
            products.map(
              (product) =>
                product.category
            )
          )
        ),
      ],
      [products]
    )

  /* =========================================
     PRODUCT FILTER
  ========================================= */

  const filteredProducts =
    products.filter(
      (product) => {
        const searchText =
          search
            .trim()
            .toLowerCase()

        const matchesSearch =
          product.name
            .toLowerCase()
            .includes(
              searchText
            ) ||
          product.barcode
            .toLowerCase()
            .includes(
              searchText
            )

        const matchesCategory =
          category === 'All' ||
          product.category ===
            category

        return (
          matchesSearch &&
          matchesCategory
        )
      }
    )

  /* =========================================
     ADD PRODUCT
  ========================================= */

  function addToPurchase(
    product: Product
  ) {
    setError('')

    setCart(
      (currentCart) => {
        const existing =
          currentCart.find(
            (item) =>
              item.product.id ===
              product.id
          )

        if (existing) {
          return currentCart.map(
            (item) =>
              item.product.id ===
              product.id
                ? {
                    ...item,

                    quantity:
                      item.quantity +
                      1,
                  }
                : item
          )
        }

        return [
          ...currentCart,

          {
            product,
            quantity: 1,

            purchasePrice:
              product.purchasePrice,
          },
        ]
      }
    )
  }

  /* =========================================
     INCREASE QUANTITY
  ========================================= */

  function increaseQuantity(
    productId: number
  ) {
    setCart(
      (currentCart) =>
        currentCart.map(
          (item) =>
            item.product.id ===
            productId
              ? {
                  ...item,

                  quantity:
                    item.quantity +
                    1,
                }
              : item
        )
    )
  }

  /* =========================================
     DECREASE QUANTITY
  ========================================= */

  function decreaseQuantity(
    productId: number
  ) {
    setCart(
      (currentCart) =>
        currentCart
          .map(
            (item) =>
              item.product.id ===
              productId
                ? {
                    ...item,

                    quantity:
                      item.quantity -
                      1,
                  }
                : item
          )
          .filter(
            (item) =>
              item.quantity > 0
          )
    )
  }

  /* =========================================
     REMOVE PRODUCT
  ========================================= */

  function removeItem(
    productId: number
  ) {
    setCart(
      (currentCart) =>
        currentCart.filter(
          (item) =>
            item.product.id !==
            productId
        )
    )
  }

  /* =========================================
     UPDATE PURCHASE PRICE
  ========================================= */

  function updatePurchasePrice(
    productId: number,
    value: number
  ) {
    setCart(
      (currentCart) =>
        currentCart.map(
          (item) =>
            item.product.id ===
            productId
              ? {
                  ...item,

                  purchasePrice:
                    Math.max(
                      0,
                      value
                    ),
                }
              : item
        )
    )
  }

  /* =========================================
     CALCULATIONS
  ========================================= */

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        item.purchasePrice *
          item.quantity,
      0
    )

  const taxAmount =
    cart.reduce(
      (total, item) => {
        const itemSubtotal =
          item.purchasePrice *
          item.quantity

        const itemTax =
          itemSubtotal *
          (item.product.gst /
            100)

        return (
          total +
          itemTax
        )
      },
      0
    )

  const grandTotal =
    subtotal +
    taxAmount

  const totalQuantity =
    cart.reduce(
      (total, item) =>
        total +
        item.quantity,
      0
    )

  /* =========================================
     MONEY FORMAT
  ========================================= */

  function formatMoney(
    value: number
  ) {
    return new Intl.NumberFormat(
      'en-IN',
      {
        style:
          'currency',

        currency:
          'INR',

        minimumFractionDigits:
          2,
      }
    ).format(value)
  }

  /* =========================================
     COMPLETE PURCHASE
  ========================================= */

  function completePurchase() {
    setError('')

    if (!supplier) {
      setError(
        'Please select a supplier.'
      )

      return
    }

    if (
      cart.length === 0
    ) {
      setError(
        'Please add at least one product.'
      )

      return
    }

    const selectedSupplier =
      suppliers.find(
        (item) =>
          item.name ===
          supplier
      )

    if (
      !selectedSupplier ||
      selectedSupplier.status !==
        'Active'
    ) {
      setError(
        'Please select a valid active supplier.'
      )

      return
    }

    const purchaseItems:
      PurchaseItem[] =
      cart.map(
        (item) => {
          const itemSubtotal =
            item.purchasePrice *
            item.quantity

          const itemTax =
            itemSubtotal *
            (item.product.gst /
              100)

          return {
            productId:
              item.product.id,

            name:
              item.product.name,

            quantity:
              item.quantity,

            purchasePrice:
              item.purchasePrice,

            gst:
              item.product.gst,

            subtotal:
              itemSubtotal,

            taxAmount:
              itemTax,

            total:
              itemSubtotal +
              itemTax,
          }
        }
      )

    /* =======================================
       CREATE PURCHASE EVENT INFORMATION

       This happens only after the user clicks
       Complete Purchase.
    ======================================== */

    const purchaseEvent =
      createPurchaseEventData()

    /* =======================================
       SAVE PURCHASE
    ======================================== */

    addPurchase({
      id:
        purchaseEvent.id,

      purchaseNumber,

      supplierId:
        selectedSupplier.id,

      supplier:
        selectedSupplier.name,

      supplierInvoice:
        supplierInvoice.trim(),

      date:
        purchaseEvent.date,

      items:
        purchaseItems,

      subtotal,

      taxAmount,

      grandTotal,

      status:
        'Completed',
    })

    /* =======================================
       INCREASE INVENTORY
    ======================================== */

    increaseStock(
      cart.map(
        (item) => ({
          productId:
            item.product.id,

          quantity:
            item.quantity,
        })
      )
    )

    setCompleted(true)
  }

  /* =========================================
     SUCCESS SCREEN
  ========================================= */

  if (completed) {
    return (
      <div className="purchase-success-page">

        <div className="purchase-success-card">

          <div className="purchase-success-icon">

            <CheckCircle2
              size={42}
            />

          </div>

          <h1>
            Purchase Completed!
          </h1>

          <p>
            The purchase has been
            saved and inventory stock
            has been updated
            successfully.
          </p>

          <div className="purchase-success-detail">

            <span>
              Purchase Number
            </span>

            <strong>
              {purchaseNumber}
            </strong>

          </div>

          <div className="purchase-success-detail">

            <span>
              Supplier
            </span>

            <strong>
              {supplier}
            </strong>

          </div>

          <div className="purchase-success-detail">

            <span>
              Items Received
            </span>

            <strong>
              {totalQuantity}
            </strong>

          </div>

          <div className="purchase-success-detail">

            <span>
              Purchase Total
            </span>

            <strong>
              {formatMoney(
                grandTotal
              )}
            </strong>

          </div>

          <div className="purchase-success-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate(
                  '/inventory'
                )
              }
            >
              View Inventory
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate(
                  '/purchases'
                )
              }
            >
              Purchase History
            </button>

          </div>

        </div>

      </div>
    )
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="new-purchase-page">

      {/* BACK */}

      <button
        type="button"
        className="back-button"
        onClick={() =>
          navigate(
            '/purchases'
          )
        }
      >
        <ArrowLeft
          size={17}
        />

        Back to Purchases
      </button>

      {/* HEADER */}

      <div className="new-purchase-header">

        <div className="page-header">

          <h1>
            New Purchase
          </h1>

          <p>
            Receive products from a
            supplier and automatically
            update inventory.
          </p>

        </div>

        <div className="purchase-number">
          {purchaseNumber}
        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="purchase-form-error">
          {error}
        </div>
      )}

      {/* =====================================
          PURCHASE INFORMATION
      ====================================== */}

      <div className="purchase-info-card">

        <div className="purchase-info-title">

          <div>

            <h3>
              Purchase Information
            </h3>

            <p>
              Select the supplier and
              enter supplier invoice
              information.
            </p>

          </div>

          <Truck
            size={20}
          />

        </div>

        <div className="purchase-info-grid">

          {/* SUPPLIER */}

          <div className="form-group">

            <label>
              Supplier *
            </label>

            <select
              value={
                supplier
              }
              onChange={(
                event
              ) => {
                setSupplier(
                  event.target.value
                )

                setError('')
              }}
            >

              <option value="">
                Select Supplier
              </option>

              {activeSuppliers.map(
                (item) => (

                  <option
                    key={
                      item.id
                    }
                    value={
                      item.name
                    }
                  >
                    {item.name}
                  </option>

                )
              )}

            </select>

            {activeSuppliers.length ===
              0 && (

              <small className="purchase-field-message">
                No active suppliers
                available.
              </small>

            )}

          </div>

          {/* SUPPLIER INVOICE */}

          <div className="form-group">

            <label>
              Supplier Invoice
            </label>

            <input
              type="text"
              placeholder="Example: SUP-4587"
              value={
                supplierInvoice
              }
              onChange={(
                event
              ) =>
                setSupplierInvoice(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        {/* ADD SUPPLIER SHORTCUT */}

        <button
          type="button"
          className="purchase-add-supplier"
          onClick={() =>
            navigate(
              '/suppliers/add'
            )
          }
        >
          <Plus
            size={15}
          />

          Add New Supplier
        </button>

      </div>

      {/* =====================================
          PURCHASE WORKSPACE
      ====================================== */}

      <div className="purchase-workspace">

        {/* ===================================
            LEFT - PRODUCTS
        ==================================== */}

        <section className="purchase-products">

          <div className="purchase-products-header">

            <div>

              <h3>
                Add Products
              </h3>

              <p>
                Select products received
                from the supplier.
              </p>

            </div>

          </div>

          {/* SEARCH */}

          <div className="purchase-search">

            <Search
              size={18}
            />

            <input
              type="text"
              placeholder="Search product or barcode..."
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          {/* CATEGORIES */}

          <div className="purchase-categories">

            {categories.map(
              (item) => (

                <button
                  type="button"
                  key={item}
                  className={
                    category ===
                    item
                      ? 'purchase-category active'
                      : 'purchase-category'
                  }
                  onClick={() =>
                    setCategory(
                      item
                    )
                  }
                >
                  {item}
                </button>

              )
            )}

          </div>

          {/* PRODUCT GRID */}

          <div className="purchase-product-grid">

            {filteredProducts.map(
              (product) => (

                <button
                  type="button"
                  key={
                    product.id
                  }
                  className="purchase-product-card"
                  onClick={() =>
                    addToPurchase(
                      product
                    )
                  }
                >

                  <div className="purchase-product-icon">

                    {product.name
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                  <div>

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      Current Stock:
                      {' '}
                      {product.stock}
                      {' '}
                      {product.unit}
                    </span>

                    <small>
                      Purchase Price:
                      {' '}
                      {formatMoney(
                        product.purchasePrice
                      )}
                    </small>

                  </div>

                  <Plus
                    size={16}
                  />

                </button>

              )
            )}

          </div>

          {filteredProducts.length ===
            0 && (

            <div className="purchase-products-empty">

              <PackagePlus
                size={36}
              />

              <h3>
                No products found
              </h3>

              <p>
                Try another product
                name, barcode or
                category.
              </p>

            </div>

          )}

        </section>

        {/* ===================================
            RIGHT - PURCHASE CART
        ==================================== */}

        <aside className="purchase-cart">

          {/* CART HEADER */}

          <div className="purchase-cart-header">

            <div>

              <h3>
                Purchase Items
              </h3>

              <p>
                {totalQuantity}
                {' '}
                unit
                {totalQuantity ===
                1
                  ? ''
                  : 's'}
              </p>

            </div>

            <PackagePlus
              size={20}
            />

          </div>

          {/* ITEMS */}

          <div className="purchase-cart-items">

            {cart.length ===
            0 ? (

              <div className="purchase-empty-cart">

                <PackagePlus
                  size={36}
                />

                <h3>
                  No products added
                </h3>

                <p>
                  Select products from
                  the product list.
                </p>

              </div>

            ) : (

              cart.map(
                (item) => {
                  const itemSubtotal =
                    item.purchasePrice *
                    item.quantity

                  const itemTax =
                    itemSubtotal *
                    (item.product.gst /
                      100)

                  const itemTotal =
                    itemSubtotal +
                    itemTax

                  return (
                    <div
                      className="purchase-cart-item"
                      key={
                        item.product.id
                      }
                    >

                      {/* ITEM HEADER */}

                      <div className="purchase-item-heading">

                        <div>

                          <strong>
                            {
                              item.product
                                .name
                            }
                          </strong>

                          <span>
                            GST
                            {' '}
                            {
                              item.product
                                .gst
                            }
                            %
                          </span>

                        </div>

                        <button
                          type="button"
                          title="Remove product"
                          onClick={() =>
                            removeItem(
                              item.product
                                .id
                            )
                          }
                        >
                          <Trash2
                            size={15}
                          />
                        </button>

                      </div>

                      {/* CONTROLS */}

                      <div className="purchase-item-controls">

                        <div className="purchase-quantity">

                          <button
                            type="button"
                            title="Decrease quantity"
                            onClick={() =>
                              decreaseQuantity(
                                item.product
                                  .id
                              )
                            }
                          >
                            <Minus
                              size={13}
                            />
                          </button>

                          <span>
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            type="button"
                            title="Increase quantity"
                            onClick={() =>
                              increaseQuantity(
                                item.product
                                  .id
                              )
                            }
                          >
                            <Plus
                              size={13}
                            />
                          </button>

                        </div>

                        <div className="purchase-price-input">

                          <span>
                            ₹
                          </span>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              item.purchasePrice
                            }
                            onChange={(
                              event
                            ) =>
                              updatePurchasePrice(
                                item.product
                                  .id,

                                Number(
                                  event
                                    .target
                                    .value
                                )
                              )
                            }
                          />

                        </div>

                      </div>

                      {/* LINE DETAILS */}

                      <div className="purchase-line-breakdown">

                        <div>

                          <span>
                            Base
                          </span>

                          <strong>
                            {formatMoney(
                              itemSubtotal
                            )}
                          </strong>

                        </div>

                        <div>

                          <span>
                            GST
                          </span>

                          <strong>
                            {formatMoney(
                              itemTax
                            )}
                          </strong>

                        </div>

                      </div>

                      <div className="purchase-line-total">

                        <span>
                          Line Total
                        </span>

                        <strong>
                          {formatMoney(
                            itemTotal
                          )}
                        </strong>

                      </div>

                    </div>
                  )
                }
              )

            )}

          </div>

          {/* =================================
              TOTALS
          ================================== */}

          <div className="purchase-totals">

            <div>

              <span>
                Subtotal
              </span>

              <strong>
                {formatMoney(
                  subtotal
                )}
              </strong>

            </div>

            <div>

              <span>
                GST
              </span>

              <strong>
                {formatMoney(
                  taxAmount
                )}
              </strong>

            </div>

            <div className="purchase-grand-total">

              <span>
                Grand Total
              </span>

              <strong>
                {formatMoney(
                  grandTotal
                )}
              </strong>

            </div>

            <button
              type="button"
              className="complete-purchase-button"
              disabled={
                cart.length ===
                  0 ||
                !supplier
              }
              onClick={
                completePurchase
              }
            >

              <CheckCircle2
                size={18}
              />

              Complete Purchase

            </button>

          </div>

        </aside>

      </div>

    </div>
  )
}