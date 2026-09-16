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
  UserPlus,
} from 'lucide-react'

import {
  useCustomers,
} from '../context/CustomerContext'

import type {
  CustomerStatus,
} from '../types/customer'

export default function AddCustomer() {
  const navigate = useNavigate()

  const {
    addCustomer,
  } = useCustomers()

  const [name, setName] =
    useState('')

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

  const [
    status,
    setStatus,
  ] =
    useState<CustomerStatus>(
      'Active'
    )

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (!name.trim()) {
      alert(
        'Please enter customer name.'
      )

      return
    }

    if (!phone.trim()) {
      alert(
        'Please enter customer phone number.'
      )

      return
    }

    addCustomer({
      name:
        name.trim(),

      phone:
        phone.trim(),

      email:
        email.trim(),

      gstin:
        gstin
          .trim()
          .toUpperCase(),

      address:
        address.trim(),

      city:
        city.trim(),

      openingBalance:
        Math.max(
          0,
          Number(
            openingBalance
          ) || 0
        ),

      status,
    })

    navigate('/customers')
  }

  return (
    <div className="add-customer-page">

      <div className="add-customer-header">

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate('/customers')
          }
        >
          <ArrowLeft size={18} />

          Back
        </button>

        <div className="page-header">

          <h1>
            Add Customer
          </h1>

          <p>
            Create a new customer for
            billing and loyalty tracking.
          </p>

        </div>

      </div>

      <form
        className="add-customer-form"
        onSubmit={handleSubmit}
      >

        <div className="customer-form-card">

          <div className="customer-form-title">

            <div className="customer-form-icon">
              <UserPlus size={20} />
            </div>

            <div>
              <h3>
                Customer Information
              </h3>

              <p>
                Enter the customer's
                basic details.
              </p>
            </div>

          </div>

          <div className="customer-form-grid">

            <div className="form-group">
              <label>
                Customer Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Enter customer name"
              />
            </div>

            <div className="form-group">
              <label>
                Phone Number *
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="customer@example.com"
              />
            </div>

            <div className="form-group">
              <label>
                GSTIN
              </label>

              <input
                type="text"
                value={gstin}
                onChange={(event) =>
                  setGstin(
                    event.target.value
                  )
                }
                placeholder="Optional GSTIN"
              />
            </div>

            <div className="form-group">
              <label>
                City
              </label>

              <input
                type="text"
                value={city}
                onChange={(event) =>
                  setCity(
                    event.target.value
                  )
                }
                placeholder="Enter city"
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
                      .value as CustomerStatus
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

            <div className="form-group customer-address-field">
              <label>
                Address
              </label>

              <textarea
                value={address}
                onChange={(event) =>
                  setAddress(
                    event.target.value
                  )
                }
                placeholder="Enter customer address"
                rows={4}
              />
            </div>

          </div>

        </div>

        <div className="customer-form-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate('/customers')
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            <Save size={17} />

            Save Customer
          </button>

        </div>

      </form>

    </div>
  )
}