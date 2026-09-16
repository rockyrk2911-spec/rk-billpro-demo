import {
  useState,
  type FormEvent,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Save,
  Truck,
} from 'lucide-react'

import {
  useSuppliers,
} from '../context/SupplierContext'

export default function AddSupplier() {
  const navigate = useNavigate()

  const {
    addSupplier,
  } = useSuppliers()

  const [name, setName] =
    useState('')

  const [
    contactPerson,
    setContactPerson,
  ] = useState('')

  const [phone, setPhone] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [gstin, setGstin] =
    useState('')

  const [address, setAddress] =
    useState('')

  const [city, setCity] =
    useState('')

  const [
    openingBalance,
    setOpeningBalance,
  ] = useState('0')

  const [status, setStatus] =
    useState<'Active' | 'Inactive'>(
      'Active'
    )

  const [error, setError] =
    useState('')

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!name.trim()) {
      setError(
        'Supplier name is required.'
      )

      return
    }

    if (!phone.trim()) {
      setError(
        'Phone number is required.'
      )

      return
    }

    addSupplier({
      name: name.trim(),

      contactPerson:
        contactPerson.trim(),

      phone: phone.trim(),

      email: email.trim(),

      gstin:
        gstin
          .trim()
          .toUpperCase(),

      address: address.trim(),

      city: city.trim(),

      openingBalance:
        Math.max(
          0,
          Number(openingBalance) || 0
        ),

      status,
    })

    navigate('/suppliers')
  }

  return (
    <div className="add-supplier-page">

      <button
        type="button"
        className="back-button"
        onClick={() =>
          navigate('/suppliers')
        }
      >
        <ArrowLeft size={17} />
        Back to Suppliers
      </button>

      <div className="add-supplier-header">

        <div className="page-header">

          <h1>
            Add Supplier
          </h1>

          <p>
            Create a supplier for
            purchase and inventory
            management.
          </p>

        </div>

        <div className="add-supplier-header-icon">
          <Truck size={23} />
        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="supplier-form"
      >

        {error && (
          <div className="supplier-form-error">
            {error}
          </div>
        )}

        <div className="supplier-form-card">

          <div className="supplier-form-title">

            <h3>
              Basic Information
            </h3>

            <p>
              Supplier and contact
              details.
            </p>

          </div>

          <div className="supplier-form-grid">

            <div className="form-group">

              <label>
                Supplier Name *
              </label>

              <input
                type="text"
                placeholder="Example: ABC Distributors"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="form-group">

              <label>
                Contact Person
              </label>

              <input
                type="text"
                placeholder="Contact person name"
                value={contactPerson}
                onChange={(event) =>
                  setContactPerson(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="form-group">

              <label>
                Phone Number *
              </label>

              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="supplier@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

        <div className="supplier-form-card">

          <div className="supplier-form-title">

            <h3>
              Business Information
            </h3>

            <p>
              Tax, address and account
              information.
            </p>

          </div>

          <div className="supplier-form-grid">

            <div className="form-group">

              <label>
                GSTIN
              </label>

              <input
                type="text"
                placeholder="33ABCDE1234F1Z5"
                value={gstin}
                onChange={(event) =>
                  setGstin(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="form-group">

              <label>
                City
              </label>

              <input
                type="text"
                placeholder="Chennai"
                value={city}
                onChange={(event) =>
                  setCity(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="form-group supplier-full-field">

              <label>
                Address
              </label>

              <textarea
                placeholder="Supplier business address"
                value={address}
                onChange={(event) =>
                  setAddress(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="form-group">

              <label>
                Opening Balance
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={openingBalance}
                onChange={(event) =>
                  setOpeningBalance(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="form-group">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as
                      | 'Active'
                      | 'Inactive'
                  )
                }
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

            </div>

          </div>

        </div>

        <div className="supplier-form-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate('/suppliers')
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            <Save size={17} />
            Save Supplier
          </button>

        </div>

      </form>

    </div>
  )
}