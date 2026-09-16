import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type {
  Product,
} from '../types/product'

import {
  useBackup,
} from './BackupContext'

type NewProduct =
  Omit<
    Product,
    'id' | 'status'
  >

type StockItem = {
  productId: number
  quantity: number
}

type ProductContextType = {
  products: Product[]

  addProduct: (
    product: NewProduct
  ) => void

  reduceStock: (
    items: StockItem[]
  ) => void

  increaseStock: (
    items: StockItem[]
  ) => void
}

/* =========================================
   DEFAULT PRODUCTS
========================================= */

const defaultProducts:
  Product[] = [
    {
      id: 1,
      name:
        'Coca-Cola 750ml',
      barcode:
        '890123456789',
      category:
        'Beverages',
      stock: 120,
      minimumStock: 10,
      purchasePrice: 30,
      price: 40,
      gst: 18,
      unit: 'Bottle',
      status:
        'In Stock',
    },

    {
      id: 2,
      name:
        'Amul Milk 1L',
      barcode:
        '890123456790',
      category:
        'Dairy',
      stock: 65,
      minimumStock: 10,
      purchasePrice: 27,
      price: 32,
      gst: 5,
      unit: 'Packet',
      status:
        'In Stock',
    },

    {
      id: 3,
      name:
        'White Bread',
      barcode:
        '890123456791',
      category:
        'Bakery',
      stock: 4,
      minimumStock: 10,
      purchasePrice: 35,
      price: 45,
      gst: 5,
      unit: 'Packet',
      status:
        'Low Stock',
    },

    {
      id: 4,
      name:
        'Pepsi 750ml',
      barcode:
        '890123456792',
      category:
        'Beverages',
      stock: 0,
      minimumStock: 10,
      purchasePrice: 30,
      price: 40,
      gst: 18,
      unit: 'Bottle',
      status:
        'Out of Stock',
    },

    {
      id: 5,
      name:
        'Eggs - 6 Pack',
      barcode:
        '890123456793',
      category:
        'Dairy',
      stock: 5,
      minimumStock: 12,
      purchasePrice: 48,
      price: 60,
      gst: 0,
      unit: 'Pack',
      status:
        'Low Stock',
    },

    {
      id: 6,
      name:
        'Sunflower Oil 1L',
      barcode:
        '890123456794',
      category:
        'Grocery',
      stock: 34,
      minimumStock: 10,
      purchasePrice: 125,
      price: 150,
      gst: 5,
      unit: 'Bottle',
      status:
        'In Stock',
    },

    {
      id: 7,
      name:
        'Rice 1kg',
      barcode:
        '890123456795',
      category:
        'Grocery',
      stock: 75,
      minimumStock: 15,
      purchasePrice: 65,
      price: 80,
      gst: 5,
      unit: 'Kg',
      status:
        'In Stock',
    },

    {
      id: 8,
      name:
        'Sugar 1kg',
      barcode:
        '890123456796',
      category:
        'Grocery',
      stock: 50,
      minimumStock: 10,
      purchasePrice: 37,
      price: 45,
      gst: 5,
      unit: 'Kg',
      status:
        'In Stock',
    },
  ]

/* =========================================
   CONTEXT
========================================= */

const ProductContext =
  createContext<
    ProductContextType | undefined
  >(undefined)

/* =========================================
   CALCULATE STOCK STATUS
========================================= */

function calculateStatus(
  stock: number,
  minimumStock: number
): Product['status'] {
  if (stock <= 0) {
    return 'Out of Stock'
  }

  if (
    stock <= minimumStock
  ) {
    return 'Low Stock'
  }

  return 'In Stock'
}

/* =========================================
   PROVIDER
========================================= */

export function ProductProvider({
  children,
}: {
  children: ReactNode
}) {
  /* =======================================
     BACKUP / OFFLINE SYNC
  ======================================== */

  const {
    connectionStatus,
    addPendingChange,
  } = useBackup()

  /* =======================================
     PRODUCT STATE
  ======================================== */

  const [
    products,
    setProducts,
  ] =
    useState<Product[]>(
      () => {
        const savedProducts =
          localStorage.getItem(
            'rk-billpro-products'
          )

        if (!savedProducts) {
          return defaultProducts
        }

        try {
          const parsed:
            unknown =
              JSON.parse(
                savedProducts
              )

          if (
            Array.isArray(
              parsed
            )
          ) {
            return parsed
          }

          return defaultProducts
        } catch {
          return defaultProducts
        }
      }
    )

  /* =======================================
     SAVE PRODUCTS
  ======================================== */

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-products',
      JSON.stringify(
        products
      )
    )
  }, [products])

  /* =======================================
     ADD PRODUCT
  ======================================== */

  function addProduct(
    product: NewProduct
  ) {
    const newProduct:
      Product = {
        ...product,

        id:
          Date.now(),

        status:
          calculateStatus(
            product.stock,
            product.minimumStock
          ),
      }

    /*
      Product is always stored locally.

      Offline mode must not prevent
      the business from creating
      products.
    */

    setProducts(
      (
        currentProducts
      ) => [
        ...currentProducts,
        newProduct,
      ]
    )

    /*
      Adding a NEW product is its own
      business operation, so we add it
      to the pending queue while offline.
    */

    if (
      connectionStatus ===
      'Offline'
    ) {
      const barcode =
        newProduct.barcode
          .trim() ||
        'No barcode'

      addPendingChange(
        'Product',
        `Added ${newProduct.name || 'Unnamed Product'} • ${barcode} • Stock ${newProduct.stock}`
      )
    }
  }

  /* =======================================
     REDUCE STOCK AFTER SALE
  ======================================== */

  function reduceStock(
    items: StockItem[]
  ) {
    /*
      IMPORTANT:

      Do NOT add a pending queue item
      here.

      SaleContext already queues the
      complete Sale transaction.

      If we also queued stock reduction,
      one offline sale would incorrectly
      become two pending business events.
    */

    setProducts(
      (
        currentProducts
      ) =>
        currentProducts.map(
          (product) => {
            const soldItem =
              items.find(
                (item) =>
                  item.productId ===
                  product.id
              )

            if (!soldItem) {
              return product
            }

            const quantity =
              Math.max(
                0,
                soldItem.quantity
              )

            const newStock =
              Math.max(
                0,
                product.stock -
                  quantity
              )

            return {
              ...product,

              stock:
                newStock,

              status:
                calculateStatus(
                  newStock,
                  product.minimumStock
                ),
            }
          }
        )
    )
  }

  /* =======================================
     INCREASE STOCK AFTER PURCHASE
  ======================================== */

  function increaseStock(
    items: StockItem[]
  ) {
    /*
      IMPORTANT:

      Do NOT add a pending queue item
      here either.

      PurchaseContext already queues the
      complete Purchase transaction.
    */

    setProducts(
      (
        currentProducts
      ) =>
        currentProducts.map(
          (product) => {
            const purchasedItem =
              items.find(
                (item) =>
                  item.productId ===
                  product.id
              )

            if (
              !purchasedItem
            ) {
              return product
            }

            const quantity =
              Math.max(
                0,
                purchasedItem.quantity
              )

            const newStock =
              product.stock +
              quantity

            return {
              ...product,

              stock:
                newStock,

              status:
                calculateStatus(
                  newStock,
                  product.minimumStock
                ),
            }
          }
        )
    )
  }

  /* =======================================
     PROVIDER VALUE
  ======================================== */

  return (
    <ProductContext.Provider
      value={{
        products,

        addProduct,

        reduceStock,

        increaseStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

/* =========================================
   CUSTOM HOOK
========================================= */

export function useProducts() {
  const context =
    useContext(
      ProductContext
    )

  if (!context) {
    throw new Error(
      'useProducts must be used inside ProductProvider'
    )
  }

  return context
}