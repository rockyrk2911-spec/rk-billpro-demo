import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Search,
  Plus,
  Truck,
  Phone,
  Mail,
  MapPin,
  Eye,
} from 'lucide-react'

import {
  useSuppliers,
} from '../context/SupplierContext'

import {
  usePurchases,
} from '../context/PurchaseContext'

export default function Suppliers() {
  const navigate = useNavigate()

  const {
    suppliers,
  } = useSuppliers()

  const {
    purchases,
  } = usePurchases()

  const [
    search,
    setSearch,
  ] = useState('')

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('All')

  // ==========================================
  // FILTER SUPPLIERS
  // ==========================================

  const filteredSuppliers =
    suppliers.filter((supplier) => {
      const searchText =
        search.trim().toLowerCase()

      const matchesSearch =
        supplier.name
          .toLowerCase()
          .includes(searchText) ||
        supplier.phone
          .toLowerCase()
          .includes(searchText) ||
        (supplier.gstin || '')
          .toLowerCase()
          .includes(searchText)

      const matchesStatus =
        statusFilter === 'All' ||
        supplier.status ===
          statusFilter

      return (
        matchesSearch &&
        matchesStatus
      )
    })

  // ==========================================
  // SUMMARY
  // ==========================================

  const activeSuppliers =
    suppliers.filter(
      (supplier) =>
        supplier.status === 'Active'
    ).length

  const totalPurchaseValue =
    purchases.reduce(
      (total, purchase) =>
        total +
        purchase.grandTotal,
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
        minimumFractionDigits: 2,
      }
    ).format(value)
  }

  // ==========================================
  // SUPPLIER PURCHASE DATA
  // ==========================================
  //
  // New purchases:
  //   match using supplierId
  //
  // Old purchases:
  //   fall back to supplier name
  //
  // This keeps old localStorage data working.
  // ==========================================

  function getSupplierPurchaseData(
    supplierId: number,
    supplierName: string
  ) {
    const supplierPurchases =
      purchases.filter(
        (purchase) =>
          purchase.supplierId ===
            supplierId ||
          (
            !purchase.supplierId &&
            purchase.supplier ===
              supplierName
          )
      )

    const purchaseValue =
      supplierPurchases.reduce(
        (total, purchase) =>
          total +
          purchase.grandTotal,
        0
      )

    return {
      count:
        supplierPurchases.length,

      value:
        purchaseValue,
    }
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="suppliers-page">

      {/* HEADER */}

      <div className="suppliers-header">

        <div className="page-header">

          <h1>
            Suppliers
          </h1>

          <p>
            Manage supplier information
            and purchase relationships.
          </p>

        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate(
              '/suppliers/add'
            )
          }
        >
          <Plus size={17} />

          Add Supplier
        </button>

      </div>

      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="supplier-summary-grid">

        {/* TOTAL SUPPLIERS */}

        <div className="supplier-summary-card">

          <div className="supplier-summary-icon supplier-blue">

            <Truck size={21} />

          </div>

          <div>

            <span>
              Total Suppliers
            </span>

            <strong>
              {suppliers.length}
            </strong>

            <small>
              Registered suppliers
            </small>

          </div>

        </div>

        {/* ACTIVE SUPPLIERS */}

        <div className="supplier-summary-card">

          <div className="supplier-summary-icon supplier-green">

            <Truck size={21} />

          </div>

          <div>

            <span>
              Active Suppliers
            </span>

            <strong>
              {activeSuppliers}
            </strong>

            <small>
              Available for purchases
            </small>

          </div>

        </div>

        {/* PURCHASE VALUE */}

        <div className="supplier-summary-card">

          <div className="supplier-summary-icon supplier-purple">
            ₹
          </div>

          <div>

            <span>
              Purchase Value
            </span>

            <strong>
              {formatMoney(
                totalPurchaseValue
              )}
            </strong>

            <small>
              Across all suppliers
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          SUPPLIER LIST
      ====================================== */}

      <div className="suppliers-card">

        {/* CARD HEADER */}

        <div className="suppliers-card-header">

          <div>

            <h3>
              Supplier List
            </h3>

            <p>
              Your business supplier
              directory.
            </p>

          </div>

          <span className="supplier-count">

            {suppliers.length}
            {' '}
            Suppliers

          </span>

        </div>

        {/* ===================================
            SEARCH + FILTER
        ==================================== */}

        <div className="suppliers-toolbar">

          <div className="supplier-search">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search supplier, phone or GSTIN..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>

        {/* ===================================
            SUPPLIER GRID
        ==================================== */}

        <div className="supplier-grid">

          {filteredSuppliers.map(
            (supplier) => {
              const purchaseData =
                getSupplierPurchaseData(
                  supplier.id,
                  supplier.name
                )

              return (
                <div
                  className="supplier-card"
                  key={supplier.id}
                >

                  {/* SUPPLIER HEADER */}

                  <div className="supplier-card-top">

                    <div className="supplier-avatar">

                      {supplier.name
                        .charAt(0)
                        .toUpperCase()}

                    </div>

                    <div className="supplier-main-info">

                      <strong>
                        {supplier.name}
                      </strong>

                      <span>
                        {supplier.contactPerson ||
                          'No contact person'}
                      </span>

                    </div>

                    <span
                      className={
                        supplier.status ===
                        'Active'
                          ? 'supplier-status active'
                          : 'supplier-status inactive'
                      }
                    >
                      {supplier.status}
                    </span>

                  </div>

                  {/* CONTACT DETAILS */}

                  <div className="supplier-contact-list">

                    <div>

                      <Phone size={14} />

                      <span>
                        {supplier.phone ||
                          'No phone'}
                      </span>

                    </div>

                    <div>

                      <Mail size={14} />

                      <span>
                        {supplier.email ||
                          'No email'}
                      </span>

                    </div>

                    <div>

                      <MapPin size={14} />

                      <span>
                        {supplier.city ||
                          'No city'}
                      </span>

                    </div>

                  </div>

                  {/* GST */}

                  <div className="supplier-gstin">

                    <span>
                      GSTIN
                    </span>

                    <strong>
                      {supplier.gstin ||
                        'Not provided'}
                    </strong>

                  </div>

                  {/* PURCHASE STATISTICS */}

                  <div className="supplier-purchase-stats">

                    <div>

                      <span>
                        Purchases
                      </span>

                      <strong>
                        {purchaseData.count}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Purchase Value
                      </span>

                      <strong>
                        {formatMoney(
                          purchaseData.value
                        )}
                      </strong>

                    </div>

                  </div>

                  {/* VIEW */}

                  <button
                    type="button"
                    className="supplier-view-button"
                    onClick={() =>
                      navigate(
                        `/suppliers/${supplier.id}`
                      )
                    }
                  >
                    <Eye size={15} />

                    View Supplier
                  </button>

                </div>
              )
            }
          )}

        </div>

        {/* ===================================
            EMPTY STATE
        ==================================== */}

        {filteredSuppliers.length ===
          0 && (

          <div className="suppliers-empty">

            <Truck size={42} />

            <h3>
              No suppliers found
            </h3>

            <p>
              Try another search or
              create a new supplier.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}