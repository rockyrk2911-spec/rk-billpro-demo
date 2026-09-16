import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  Search,
  ScanBarcode,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  UserPlus,
  CreditCard,
  PackageX,
} from 'lucide-react'

import {
  useProducts,
} from '../context/ProductContext'

import {
  useCustomers,
} from '../context/CustomerContext'

import {
  useSales,
} from '../context/SaleContext'

import type {
  Product,
} from '../types/product'

type CartItem = {
  product: Product
  quantity: number
}

export default function POS() {
  const navigate = useNavigate()

  const {
    products,
  } = useProducts()

  const {
    customers,
  } = useCustomers()

  const {
    getNextInvoiceNumber,
  } = useSales()

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    category,
    setCategory,
  ] = useState('All')

  const [
    cart,
    setCart,
  ] = useState<CartItem[]>([])

  const [
    discount,
    setDiscount,
  ] = useState(0)

  /*
    Empty string means:
    Walk-in Customer
  */
  const [
    customerId,
    setCustomerId,
  ] = useState('')

  // ==========================================
  // ACTIVE CUSTOMERS
  // ==========================================

  const activeCustomers =
    useMemo(
      () =>
        customers.filter(
          (customer) =>
            customer.status ===
            'Active'
        ),
      [customers]
    )

  // ==========================================
  // SELECTED CUSTOMER
  // ==========================================

  const selectedCustomer =
    customers.find(
      (customer) =>
        customer.id ===
        Number(customerId)
    )

  // ==========================================
  // CURRENT INVOICE NUMBER
  // ==========================================

  const invoiceNumber =
    getNextInvoiceNumber()

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories =
    useMemo(() => {
      return [
        'All',

        ...Array.from(
          new Set(
            products.map(
              (product) =>
                product.category
            )
          )
        ),
      ]
    }, [products])

  // ==========================================
  // PRODUCT SEARCH + CATEGORY FILTER
  // ==========================================

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

  // ==========================================
  // ADD PRODUCT TO CART
  // ==========================================

  function addToCart(
    product: Product
  ) {
    if (product.stock <= 0) {
      return
    }

    setCart(
      (currentCart) => {
        const existingItem =
          currentCart.find(
            (item) =>
              item.product.id ===
              product.id
          )

        if (existingItem) {
          if (
            existingItem.quantity >=
            product.stock
          ) {
            return currentCart
          }

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
          },
        ]
      }
    )
  }

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  function increaseQuantity(
    productId: number
  ) {
    setCart(
      (currentCart) =>
        currentCart.map(
          (item) => {
            if (
              item.product.id !==
              productId
            ) {
              return item
            }

            if (
              item.quantity >=
              item.product.stock
            ) {
              return item
            }

            return {
              ...item,

              quantity:
                item.quantity +
                1,
            }
          }
        )
    )
  }

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

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

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  function removeFromCart(
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

  // ==========================================
  // CLEAR CART
  // ==========================================

  function clearCart() {
    setCart([])

    setDiscount(0)
  }

  // ==========================================
  // BILL CALCULATIONS
  // ==========================================

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        item.product.price *
          item.quantity,
      0
    )

  const discountAmount =
    subtotal *
    (discount / 100)

  const taxableAmount =
    Math.max(
      0,
      subtotal -
        discountAmount
    )

  /*
    GST is calculated per product.

    The total bill discount is
    proportionally distributed
    across the cart before GST.
  */
  const taxAmount =
    cart.reduce(
      (total, item) => {
        const itemSubtotal =
          item.product.price *
          item.quantity

        const itemDiscount =
          subtotal > 0
            ? discountAmount *
              (
                itemSubtotal /
                subtotal
              )
            : 0

        const taxableItem =
          Math.max(
            0,
            itemSubtotal -
              itemDiscount
          )

        return (
          total +
          taxableItem *
            (
              item.product.gst /
              100
            )
        )
      },
      0
    )

  const grandTotal =
    taxableAmount +
    taxAmount

  const totalItems =
    cart.reduce(
      (total, item) =>
        total +
        item.quantity,
      0
    )

  // ==========================================
  // MONEY FORMAT
  // ==========================================

  function formatMoney(
    value: number
  ) {
    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR',

        minimumFractionDigits:
          2,
      }
    ).format(value)
  }

  // ==========================================
  // ADD CUSTOMER
  // ==========================================

  function goToAddCustomer() {
    navigate(
      '/customers/add'
    )
  }

  // ==========================================
  // GO TO PAYMENT
  // ==========================================

  function goToPayment() {
    if (
      cart.length === 0
    ) {
      return
    }

    navigate(
      '/payment',
      {
        state: {
          /*
            Registered customer:
            customerId = ID

            Walk-in customer:
            customerId = undefined
          */
          customerId:
            selectedCustomer?.id,

          customer:
            selectedCustomer?.name ??
            'Walk-in Customer',

          items:
            cart.map(
              (item) => ({
                productId:
                  item.product.id,

                name:
                  item.product.name,

                price:
                  item.product.price,

                gst:
                  item.product.gst,

                quantity:
                  item.quantity,

                total:
                  item.product.price *
                  item.quantity,
              })
            ),

          subtotal,

          discountPercent:
            discount,

          discountAmount,

          taxAmount,

          grandTotal,
        },
      }
    )
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="pos-page">

      {/* =====================================
          LEFT SIDE
      ====================================== */}

      <section className="pos-products-section">

        {/* PAGE HEADING */}

        <div className="pos-heading">

          <div>

            <h1>
              POS Billing
            </h1>

            <p>
              Search, scan and add
              products to the bill.
            </p>

          </div>

          <div className="pos-bill-number">

            Bill #{invoiceNumber}

          </div>

        </div>

        {/* ===================================
            SEARCH
        ==================================== */}

        <div className="pos-search-row">

          <div className="pos-search">

            <Search
              size={19}
            />

            <input
              type="text"
              placeholder="Search product or scan barcode..."
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <button
            type="button"
            className="pos-scan-button"
            title="Barcode scanner demo"
          >
            <ScanBarcode
              size={20}
            />
          </button>

        </div>

        {/* ===================================
            CATEGORY FILTER
        ==================================== */}

        <div className="pos-categories">

          {categories.map(
            (item) => (

              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? 'pos-category active'
                    : 'pos-category'
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

        {/* ===================================
            PRODUCT GRID
        ==================================== */}

        <div className="pos-product-grid">

          {filteredProducts.map(
            (product) => (

              <button
                key={product.id}
                type="button"
                className={
                  `pos-product-card ${
                    product.stock <= 0
                      ? 'pos-product-disabled'
                      : ''
                  }`
                }
                onClick={() =>
                  addToCart(
                    product
                  )
                }
                disabled={
                  product.stock <= 0
                }
              >

                <div className="pos-product-image">

                  {product.name
                    .charAt(0)
                    .toUpperCase()}

                </div>

                <div className="pos-product-info">

                  <strong>
                    {product.name}
                  </strong>

                  <span>
                    {product.category}
                  </span>

                  <div className="pos-product-bottom">

                    <b>
                      ₹
                      {product.price
                        .toFixed(2)}
                    </b>

                    <small
                      className={
                        product.stock <=
                        0
                          ? 'stock-danger'
                          : product.stock <=
                            product.minimumStock
                          ? 'stock-warning'
                          : ''
                      }
                    >
                      {product.stock <=
                      0
                        ? 'Out of stock'
                        : `${product.stock} left`}
                    </small>

                  </div>

                </div>

              </button>

            )
          )}

        </div>

        {/* ===================================
            NO PRODUCTS
        ==================================== */}

        {filteredProducts.length ===
          0 && (

          <div className="pos-no-products">

            <PackageX
              size={40}
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

      {/* =====================================
          RIGHT SIDE CART
      ====================================== */}

      <aside className="pos-cart">

        {/* ===================================
            CART HEADER
        ==================================== */}

        <div className="pos-cart-header">

          <div>

            <div className="pos-cart-title">

              <ShoppingCart
                size={19}
              />

              <h2>
                Current Bill
              </h2>

            </div>

            <span>
              {totalItems}
              {' '}
              item
              {totalItems === 1
                ? ''
                : 's'}
            </span>

          </div>

          {cart.length >
            0 && (

            <button
              type="button"
              className="clear-cart-button"
              onClick={
                clearCart
              }
            >
              Clear
            </button>

          )}

        </div>

        {/* ===================================
            CUSTOMER
        ==================================== */}

        <div className="pos-customer">

          <div className="pos-section-label">
            Customer
          </div>

          <div className="customer-row">

            <select
              value={
                customerId
              }
              onChange={(
                event
              ) =>
                setCustomerId(
                  event.target.value
                )
              }
            >

              <option value="">
                Walk-in Customer
              </option>

              {activeCustomers.map(
                (customer) => (

                  <option
                    key={
                      customer.id
                    }
                    value={
                      customer.id
                    }
                  >
                    {customer.name}
                    {' • '}
                    {customer.phone}
                  </option>

                )
              )}

            </select>

            <button
              type="button"
              className="customer-add-button"
              title="Add customer"
              onClick={
                goToAddCustomer
              }
            >
              <UserPlus
                size={17}
              />
            </button>

          </div>

          {selectedCustomer && (

            <div className="pos-selected-customer">

              <span>
                Selected:
              </span>

              <strong>
                {selectedCustomer.name}
              </strong>

              <small>
                {selectedCustomer.phone}
              </small>

            </div>

          )}

        </div>

        {/* ===================================
            CART ITEMS
        ==================================== */}

        <div className="pos-cart-items">

          {cart.length ===
          0 ? (

            <div className="empty-cart">

              <div className="empty-cart-icon">

                <ShoppingCart
                  size={30}
                />

              </div>

              <h3>
                Your cart is empty
              </h3>

              <p>
                Search or select a
                product to start
                billing.
              </p>

            </div>

          ) : (

            cart.map(
              (item) => (

                <div
                  className="pos-cart-item"
                  key={
                    item.product.id
                  }
                >

                  {/* ITEM TOP */}

                  <div className="cart-item-top">

                    <div>

                      <strong>
                        {item.product.name}
                      </strong>

                      <span>
                        ₹
                        {item.product.price
                          .toFixed(2)}
                        {' × '}
                        {item.quantity}
                      </span>

                    </div>

                    <button
                      type="button"
                      className="cart-delete-button"
                      title="Remove product"
                      onClick={() =>
                        removeFromCart(
                          item.product.id
                        )
                      }
                    >
                      <Trash2
                        size={15}
                      />
                    </button>

                  </div>

                  {/* ITEM BOTTOM */}

                  <div className="cart-item-bottom">

                    <div className="quantity-control">

                      <button
                        type="button"
                        title="Decrease quantity"
                        onClick={() =>
                          decreaseQuantity(
                            item.product.id
                          )
                        }
                      >
                        <Minus
                          size={14}
                        />
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        title="Increase quantity"
                        onClick={() =>
                          increaseQuantity(
                            item.product.id
                          )
                        }
                        disabled={
                          item.quantity >=
                          item.product.stock
                        }
                      >
                        <Plus
                          size={14}
                        />
                      </button>

                    </div>

                    <strong>
                      {formatMoney(
                        item.product.price *
                        item.quantity
                      )}
                    </strong>

                  </div>

                </div>

              )
            )

          )}

        </div>

        {/* ===================================
            BILL SUMMARY
        ==================================== */}

        <div className="pos-summary">

          {/* DISCOUNT */}

          <div className="discount-field">

            <label>
              Discount
            </label>

            <div>

              <input
                type="number"
                min="0"
                max="100"
                value={
                  discount
                }
                onChange={(
                  event
                ) => {
                  const value =
                    Number(
                      event.target
                        .value
                    )

                  setDiscount(
                    Math.min(
                      100,

                      Math.max(
                        0,
                        value
                      )
                    )
                  )
                }}
              />

              <span>
                %
              </span>

            </div>

          </div>

          {/* SUBTOTAL */}

          <div className="summary-line">

            <span>
              Subtotal
            </span>

            <strong>
              {formatMoney(
                subtotal
              )}
            </strong>

          </div>

          {/* DISCOUNT */}

          <div className="summary-line discount-line">

            <span>
              Discount
            </span>

            <strong>
              -{' '}
              {formatMoney(
                discountAmount
              )}
            </strong>

          </div>

          {/* GST */}

          <div className="summary-line">

            <span>
              GST
            </span>

            <strong>
              {formatMoney(
                taxAmount
              )}
            </strong>

          </div>

          {/* GRAND TOTAL */}

          <div className="grand-total">

            <div>

              <span>
                Grand Total
              </span>

              <small>
                Final billing amount
              </small>

            </div>

            <strong>
              {formatMoney(
                grandTotal
              )}
            </strong>

          </div>

          {/* PAY */}

          <button
            type="button"
            className="pay-now-button"
            disabled={
              cart.length === 0
            }
            onClick={
              goToPayment
            }
          >

            <CreditCard
              size={19}
            />

            Pay{' '}
            {formatMoney(
              grandTotal
            )}

          </button>

        </div>

      </aside>

    </div>
  )
}