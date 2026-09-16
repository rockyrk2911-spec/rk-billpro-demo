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
  Wallet,
} from 'lucide-react'

import {
  useExpenses,
} from '../context/ExpenseContext'

import type {
  ExpenseCategory,
  ExpensePaymentMethod,
  ExpenseStatus,
} from '../types/expense'

export default function AddExpense() {
  const navigate =
    useNavigate()

  const {
    addExpense,
  } = useExpenses()

  const today =
    new Date()
      .toISOString()
      .split('T')[0]

  // ==========================================
  // FORM STATE
  // ==========================================

  const [
    title,
    setTitle,
  ] = useState('')

  const [
    category,
    setCategory,
  ] =
    useState<ExpenseCategory>(
      'Other'
    )

  const [
    amount,
    setAmount,
  ] = useState('')

  const [
    date,
    setDate,
  ] = useState(today)

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<ExpensePaymentMethod>(
      'Cash'
    )

  const [
    status,
    setStatus,
  ] =
    useState<ExpenseStatus>(
      'Paid'
    )

  const [
    vendor,
    setVendor,
  ] = useState('')

  const [
    reference,
    setReference,
  ] = useState('')

  const [
    notes,
    setNotes,
  ] = useState('')

  // ==========================================
  // SUBMIT
  // ==========================================

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const cleanTitle =
      title.trim()

    const expenseAmount =
      Number(amount)

    if (!cleanTitle) {
      alert(
        'Please enter an expense title.'
      )

      return
    }

    if (
      !Number.isFinite(
        expenseAmount
      ) ||
      expenseAmount <= 0
    ) {
      alert(
        'Please enter a valid expense amount.'
      )

      return
    }

    if (!date) {
      alert(
        'Please select the expense date.'
      )

      return
    }

    addExpense({
      title:
        cleanTitle,

      category,

      amount:
        expenseAmount,

      /*
        Store the selected date at
        local noon to avoid timezone
        date-shift problems.
      */
      date:
        new Date(
          `${date}T12:00:00`
        ).toISOString(),

      paymentMethod,

      status,

      vendor:
        vendor.trim(),

      reference:
        reference.trim(),

      notes:
        notes.trim(),
    })

    navigate(
      '/expenses'
    )
  }

  return (
    <div className="add-expense-page">

      {/* BACK */}

      <button
        type="button"
        className="back-button"
        onClick={() =>
          navigate('/expenses')
        }
      >
        <ArrowLeft
          size={17}
        />

        Back to Expenses
      </button>

      {/* HEADER */}

      <div className="page-header">

        <h1>
          Add Expense
        </h1>

        <p>
          Record a new business
          operating expense.
        </p>

      </div>

      <form
        className="add-expense-form"
        onSubmit={
          handleSubmit
        }
      >

        <div className="add-expense-card">

          <div className="form-section-title">

            <Wallet
              size={20}
            />

            <div>

              <h3>
                Expense Details
              </h3>

              <p>
                Enter the expense and
                payment information.
              </p>

            </div>

          </div>

          <div className="expense-form-grid">

            {/* TITLE */}

            <div className="form-group expense-full-field">

              <label>
                Expense Title *
              </label>

              <input
                type="text"
                placeholder="Example: Shop electricity bill"
                value={title}
                onChange={(
                  event
                ) =>
                  setTitle(
                    event.target.value
                  )
                }
              />

            </div>

            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category
              </label>

              <select
                value={category}
                onChange={(
                  event
                ) =>
                  setCategory(
                    event.target
                      .value as ExpenseCategory
                  )
                }
              >

                <option value="Rent">
                  Rent
                </option>

                <option value="Electricity">
                  Electricity
                </option>

                <option value="Salary">
                  Salary
                </option>

                <option value="Transport">
                  Transport
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>

                <option value="Marketing">
                  Marketing
                </option>

                <option value="Office">
                  Office
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            {/* AMOUNT */}

            <div className="form-group">

              <label>
                Amount *
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(
                  event
                ) =>
                  setAmount(
                    event.target.value
                  )
                }
              />

            </div>

            {/* DATE */}

            <div className="form-group">

              <label>
                Expense Date *
              </label>

              <input
                type="date"
                value={date}
                onChange={(
                  event
                ) =>
                  setDate(
                    event.target.value
                  )
                }
              />

            </div>

            {/* PAYMENT */}

            <div className="form-group">

              <label>
                Payment Method
              </label>

              <select
                value={
                  paymentMethod
                }
                onChange={(
                  event
                ) =>
                  setPaymentMethod(
                    event.target
                      .value as ExpensePaymentMethod
                  )
                }
              >

                <option value="Cash">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="Card">
                  Card
                </option>

                <option value="Bank Transfer">
                  Bank Transfer
                </option>

              </select>

            </div>

            {/* STATUS */}

            <div className="form-group">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(
                  event
                ) =>
                  setStatus(
                    event.target
                      .value as ExpenseStatus
                  )
                }
              >

                <option value="Paid">
                  Paid
                </option>

                <option value="Pending">
                  Pending
                </option>

              </select>

            </div>

            {/* VENDOR */}

            <div className="form-group">

              <label>
                Vendor / Payee
              </label>

              <input
                type="text"
                placeholder="Vendor or payee"
                value={vendor}
                onChange={(
                  event
                ) =>
                  setVendor(
                    event.target.value
                  )
                }
              />

            </div>

            {/* REFERENCE */}

            <div className="form-group">

              <label>
                Reference
              </label>

              <input
                type="text"
                placeholder="Bill / transaction reference"
                value={reference}
                onChange={(
                  event
                ) =>
                  setReference(
                    event.target.value
                  )
                }
              />

            </div>

            {/* NOTES */}

            <div className="form-group expense-full-field">

              <label>
                Notes
              </label>

              <textarea
                rows={4}
                placeholder="Optional expense notes..."
                value={notes}
                onChange={(
                  event
                ) =>
                  setNotes(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="add-expense-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate(
                '/expenses'
              )
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            <Save
              size={17}
            />

            Save Expense
          </button>

        </div>

      </form>

    </div>
  )
}