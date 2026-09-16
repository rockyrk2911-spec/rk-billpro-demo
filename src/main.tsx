import {
  StrictMode,
} from 'react'

import {
  createRoot,
} from 'react-dom/client'

import App from './App'
import './index.css'

import {
  ProductProvider,
} from './context/ProductContext'

import {
  SaleProvider,
} from './context/SaleContext'

import {
  PurchaseProvider,
} from './context/PurchaseContext'

import {
  SupplierProvider,
} from './context/SupplierContext'

import {
  CustomerProvider,
} from './context/CustomerContext'

import {
  ExpenseProvider,
} from './context/ExpenseContext'

import {
  SettingsProvider,
} from './context/SettingsContext'

import {
  BranchProvider,
} from './context/BranchContext'

import {
  UserProvider,
} from './context/UserContext'

import {
  BackupProvider,
} from './context/BackupContext'

import {
  ThemeProvider,
} from './context/ThemeContext'

import {
  SubscriptionProvider,
} from './context/SubscriptionContext'

createRoot(
  document.getElementById(
    'root'
  )!
).render(
  <StrictMode>

    <BackupProvider>

      <ProductProvider>

        <SettingsProvider>

          <SaleProvider>

            <SupplierProvider>

              <CustomerProvider>

                <PurchaseProvider>

                  <ExpenseProvider>

                    <BranchProvider>

                      <UserProvider>

                        <SubscriptionProvider>

                          <ThemeProvider>

                            <App />

                          </ThemeProvider>

                        </SubscriptionProvider>

                      </UserProvider>

                    </BranchProvider>

                  </ExpenseProvider>

                </PurchaseProvider>

              </CustomerProvider>

            </SupplierProvider>

          </SaleProvider>

        </SettingsProvider>

      </ProductProvider>

    </BackupProvider>

  </StrictMode>
)