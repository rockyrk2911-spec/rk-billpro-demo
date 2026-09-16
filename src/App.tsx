import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import Landing from './pages/Landing'
import Login from './pages/Login'

import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import Sales from './pages/Sales'
import Purchases from './pages/Purchases'
import Customers from './pages/Customers'
import Suppliers from './pages/Suppliers'
import Expenses from './pages/Expenses'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

import AddProduct from './pages/AddProduct'
import Payment from './pages/Payment'
import Invoice from './pages/Invoice'

import NewPurchase from './pages/NewPurchase'

import AddSupplier from './pages/AddSupplier'
import SupplierDetails from './pages/SupplierDetails'

import AddCustomer from './pages/AddCustomer'
import CustomerDetails from './pages/CustomerDetails'

import AddExpense from './pages/AddExpense'

import SalesReport from './pages/SalesReport'
import PurchaseReport from './pages/PurchaseReport'
import ProfitLossReport from './pages/ProfitLossReport'
import InventoryReport from './pages/InventoryReport'
import TaxReport from './pages/TaxReport'
import ExpenseReport from './pages/ExpenseReport'
import CustomerReport from './pages/CustomerReport'
import SupplierReport from './pages/SupplierReport'

import BusinessSettings from './pages/BusinessSettings'

import BranchesSettings from './pages/BranchesSettings'
import AddBranch from './pages/AddBranch'

import TaxSettings from './pages/TaxSettings'
import InvoiceSettings from './pages/InvoiceSettings'
import PrinterSettings from './pages/PrinterSettings'
import PaymentSettings from './pages/PaymentSettings'

import UserSettings from './pages/UserSettings'
import AddUser from './pages/AddUser'
import EditUser from './pages/EditUser'
import BackupSettings from './pages/BackupSettings'
import ThemeSettings from './pages/ThemeSettings'
import SubscriptionSettings from './pages/SubscriptionSettings'

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================
            PUBLIC ROUTES
        ====================================== */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =====================================
            DASHBOARD LAYOUT
        ====================================== */}

        <Route
          element={<DashboardLayout />}
        >

          {/* =================================
              DASHBOARD
          ================================== */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute permission="dashboard">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* =================================
              POS
          ================================== */}

          <Route
            path="/pos"
            element={
              <ProtectedRoute permission="pos">
                <POS />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute permission="pos">
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* =================================
              SALES
          ================================== */}

          <Route
            path="/sales"
            element={
              <ProtectedRoute permission="sales">
                <Sales />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoice/:id"
            element={
              <ProtectedRoute permission="sales">
                <Invoice />
              </ProtectedRoute>
            }
          />

          {/* =================================
              PRODUCTS
          ================================== */}

          <Route
            path="/products"
            element={
              <ProtectedRoute permission="products">
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/add"
            element={
              <ProtectedRoute permission="products">
                <AddProduct />
              </ProtectedRoute>
            }
          />

          {/* =================================
              INVENTORY
          ================================== */}

          <Route
            path="/inventory"
            element={
              <ProtectedRoute permission="inventory">
                <Inventory />
              </ProtectedRoute>
            }
          />

          {/* =================================
              PURCHASES
          ================================== */}

          <Route
            path="/purchases"
            element={
              <ProtectedRoute permission="purchases">
                <Purchases />
              </ProtectedRoute>
            }
          />

          <Route
            path="/purchases/new"
            element={
              <ProtectedRoute permission="purchases">
                <NewPurchase />
              </ProtectedRoute>
            }
          />

          {/* =================================
              CUSTOMERS
          ================================== */}

          <Route
            path="/customers"
            element={
              <ProtectedRoute permission="customers">
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers/add"
            element={
              <ProtectedRoute permission="customers">
                <AddCustomer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute permission="customers">
                <CustomerDetails />
              </ProtectedRoute>
            }
          />

          {/* =================================
              SUPPLIERS
          ================================== */}

          <Route
            path="/suppliers"
            element={
              <ProtectedRoute permission="suppliers">
                <Suppliers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/suppliers/add"
            element={
              <ProtectedRoute permission="suppliers">
                <AddSupplier />
              </ProtectedRoute>
            }
          />

          <Route
            path="/suppliers/:id"
            element={
              <ProtectedRoute permission="suppliers">
                <SupplierDetails />
              </ProtectedRoute>
            }
          />

          {/* =================================
              EXPENSES
          ================================== */}

          <Route
            path="/expenses"
            element={
              <ProtectedRoute permission="expenses">
                <Expenses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses/add"
            element={
              <ProtectedRoute permission="expenses">
                <AddExpense />
              </ProtectedRoute>
            }
          />

          {/* =================================
              REPORTS
          ================================== */}

          <Route
            path="/reports"
            element={
              <ProtectedRoute permission="reports">
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/sales"
            element={
              <ProtectedRoute permission="reports">
                <SalesReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/purchases"
            element={
              <ProtectedRoute permission="reports">
                <PurchaseReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/profit-loss"
            element={
              <ProtectedRoute permission="reports">
                <ProfitLossReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/inventory"
            element={
              <ProtectedRoute permission="reports">
                <InventoryReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/tax"
            element={
              <ProtectedRoute permission="reports">
                <TaxReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/expenses"
            element={
              <ProtectedRoute permission="reports">
                <ExpenseReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/customers"
            element={
              <ProtectedRoute permission="reports">
                <CustomerReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/suppliers"
            element={
              <ProtectedRoute permission="reports">
                <SupplierReport />
              </ProtectedRoute>
            }
          />

          {/* =================================
              SETTINGS
          ================================== */}

          <Route
            path="/settings"
            element={
              <ProtectedRoute permission="settings">
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* BUSINESS PROFILE */}

          <Route
            path="/settings/business"
            element={
              <ProtectedRoute permission="settings">
                <BusinessSettings />
              </ProtectedRoute>
            }
          />

          {/* BRANCHES */}

          <Route
            path="/settings/branches"
            element={
              <ProtectedRoute permission="settings">
                <BranchesSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/branches/add"
            element={
              <ProtectedRoute permission="settings">
                <AddBranch />
              </ProtectedRoute>
            }
          />

          {/* TAX */}

          <Route
            path="/settings/tax"
            element={
              <ProtectedRoute permission="settings">
                <TaxSettings />
              </ProtectedRoute>
            }
          />

          {/* INVOICE */}

          <Route
            path="/settings/invoice"
            element={
              <ProtectedRoute permission="settings">
                <InvoiceSettings />
              </ProtectedRoute>
            }
          />

          {/* PRINTER */}

          <Route
            path="/settings/printer"
            element={
              <ProtectedRoute permission="settings">
                <PrinterSettings />
              </ProtectedRoute>
            }
          />

          {/* PAYMENT METHODS */}

          <Route
            path="/settings/payments"
            element={
              <ProtectedRoute permission="settings">
                <PaymentSettings />
              </ProtectedRoute>
            }
          />

          {/* USERS & ROLES */}

          <Route
            path="/settings/users"
            element={
              <ProtectedRoute permission="settings">
                <UserSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/users/add"
            element={
              <ProtectedRoute permission="settings">
                <AddUser />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/users/:id/edit"
            element={
              <ProtectedRoute permission="settings">
                <EditUser />
              </ProtectedRoute>
            }
          />

          <Route
  path="/settings/backup"
  element={
    <ProtectedRoute permission="settings">
      <BackupSettings />
    </ProtectedRoute>
  }
/>

<Route
  path="/settings/theme"
  element={
    <ProtectedRoute permission="settings">
      <ThemeSettings />
    </ProtectedRoute>
  }
/>
<Route
  path="/settings/subscription"
  element={
    <ProtectedRoute permission="settings">
      <SubscriptionSettings />
    </ProtectedRoute>
  }
/>
        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App