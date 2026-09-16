import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  ArrowLeft,
  Save,
  PackagePlus,
} from 'lucide-react'

import { useProducts } from '../context/ProductContext'

export default function AddProduct() {

  const navigate = useNavigate()

  const { addProduct } = useProducts()

  const [name, setName] = useState('')
  const [barcode, setBarcode] = useState('')
  const [category, setCategory] = useState('Grocery')
  const [unit, setUnit] = useState('Piece')

  const [purchasePrice, setPurchasePrice] =
    useState('')

  const [sellingPrice, setSellingPrice] =
    useState('')

  const [stock, setStock] = useState('')

  const [minimumStock, setMinimumStock] =
    useState('10')

  const [gst, setGst] = useState('5')

  const [error, setError] = useState('')

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {

    event.preventDefault()

    if (!name.trim()) {
      setError('Please enter product name.')
      return
    }

    if (!barcode.trim()) {
      setError('Please enter barcode.')
      return
    }

    if (!sellingPrice) {
      setError('Please enter selling price.')
      return
    }

    addProduct({
      name: name.trim(),
      barcode: barcode.trim(),
      category,
      unit,

      purchasePrice:
        Number(purchasePrice) || 0,

      price:
        Number(sellingPrice) || 0,

      stock:
        Number(stock) || 0,

      minimumStock:
        Number(minimumStock) || 0,

      gst:
        Number(gst) || 0,
    })

    navigate('/products')
  }

  return (
    <div className="add-product-page">

      <div className="add-product-header">

        <div>

          <button
            className="back-button"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft size={17} />
            Back to Products
          </button>

          <div className="page-header">
            <h1>Add Product</h1>

            <p>
              Create a new product for billing and
              inventory.
            </p>
          </div>

        </div>

      </div>

      <form
        className="product-form"
        onSubmit={handleSubmit}
      >

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="form-card">

          <div className="form-card-heading">

            <div className="form-heading-icon">
              <PackagePlus size={20} />
            </div>

            <div>
              <h3>Product Information</h3>
              <p>
                Enter the basic product details.
              </p>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group form-full">
              <label>Product Name *</label>

              <input
                type="text"
                placeholder="Example: Coca-Cola 750ml"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Barcode *</label>

              <input
                type="text"
                placeholder="Enter or scan barcode"
                value={barcode}
                onChange={(event) =>
                  setBarcode(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option>Grocery</option>
                <option>Beverages</option>
                <option>Dairy</option>
                <option>Bakery</option>
                <option>Snacks</option>
                <option>Personal Care</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Unit</label>

              <select
                value={unit}
                onChange={(event) =>
                  setUnit(event.target.value)
                }
              >
                <option>Piece</option>
                <option>Packet</option>
                <option>Bottle</option>
                <option>Kg</option>
                <option>Gram</option>
                <option>Litre</option>
                <option>Pack</option>
              </select>
            </div>

            <div className="form-group">
              <label>GST</label>

              <select
                value={gst}
                onChange={(event) =>
                  setGst(event.target.value)
                }
              >
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>

          </div>

        </div>

        <div className="form-card">

          <div className="form-card-heading">
            <div>
              <h3>Pricing & Stock</h3>

              <p>
                Configure product price and inventory.
              </p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Purchase Price</label>

              <div className="price-input">
                <span>₹</span>

                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={purchasePrice}
                  onChange={(event) =>
                    setPurchasePrice(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Selling Price *</label>

              <div className="price-input">
                <span>₹</span>

                <input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={sellingPrice}
                  onChange={(event) =>
                    setSellingPrice(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Opening Stock</label>

              <input
                type="number"
                min="0"
                placeholder="0"
                value={stock}
                onChange={(event) =>
                  setStock(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Low Stock Alert At</label>

              <input
                type="number"
                min="0"
                value={minimumStock}
                onChange={(event) =>
                  setMinimumStock(
                    event.target.value
                  )
                }
              />
            </div>

          </div>

        </div>

        <div className="form-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/products')}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            <Save size={17} />
            Save Product
          </button>

        </div>

      </form>

    </div>
  )
}