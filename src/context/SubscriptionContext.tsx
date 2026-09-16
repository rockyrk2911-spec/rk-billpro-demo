import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

/* =========================================
   TYPES
========================================= */

export type SubscriptionPlan =
  | 'Starter'
  | 'Professional'
  | 'Business'

export type SubscriptionStatus =
  | 'Active'
  | 'Trial'
  | 'Expired'

export type BillingCycle =
  | 'Monthly'
  | 'Annual'

export type SubscriptionSettings = {
  plan: SubscriptionPlan

  status: SubscriptionStatus

  billingCycle: BillingCycle

  licenceType: string

  maxBranches: number

  maxUsers: number

  maxDevices: number

  cloudSync: boolean

  offlineBilling: boolean

  startDate: string

  expiryDate: string
}

/* =========================================
   PLAN DEFINITION
========================================= */

export type PlanDefinition = {
  name: SubscriptionPlan

  description: string

  maxBranches: number

  maxUsers: number

  maxDevices: number

  cloudSync: boolean

  offlineBilling: boolean

  features: string[]

  recommended?: boolean
}

/* =========================================
   AVAILABLE DEMO PLANS
========================================= */

export const subscriptionPlans:
  PlanDefinition[] = [
    {
      name: 'Starter',

      description:
        'Essential billing tools for small shops and new businesses.',

      maxBranches: 1,

      maxUsers: 2,

      maxDevices: 1,

      cloudSync: false,

      offlineBilling: true,

      features: [
        'POS Billing',
        'Product Management',
        'Inventory Tracking',
        'Sales Management',
        'Customer Management',
        'Basic Reports',
        'Offline Billing',
      ],
    },

    {
      name: 'Professional',

      description:
        'Complete billing and business management for growing businesses.',

      maxBranches: 3,

      maxUsers: 10,

      maxDevices: 5,

      cloudSync: true,

      offlineBilling: true,

      recommended: true,

      features: [
        'Everything in Starter',
        'Purchase Management',
        'Supplier Management',
        'Expense Tracking',
        'Advanced Reports',
        'GST & Tax Reports',
        'Cloud Backup & Sync',
        'Multiple Users & Roles',
      ],
    },

    {
      name: 'Business',

      description:
        'Advanced multi-branch management for larger businesses.',

      maxBranches: 10,

      maxUsers: 25,

      maxDevices: 15,

      cloudSync: true,

      offlineBilling: true,

      features: [
        'Everything in Professional',
        'Multi-Branch Management',
        'Advanced User Access',
        'Expanded Device Capacity',
        'Expanded User Capacity',
        'Expanded Branch Capacity',
        'Advanced Business Reporting',
        'Priority Support Demo',
      ],
    },
  ]

/* =========================================
   CONTEXT TYPE
========================================= */

type SubscriptionContextType = {
  subscription: SubscriptionSettings

  plans: PlanDefinition[]

  updateSubscription: (
    updates:
      Partial<SubscriptionSettings>
  ) => void

  changePlan: (
    plan: SubscriptionPlan
  ) => void

  resetSubscription: () => void
}

/* =========================================
   STORAGE
========================================= */

const STORAGE_KEY =
  'rk-billpro-subscription'

/* =========================================
   DEFAULT SUBSCRIPTION
========================================= */

const defaultSubscription:
  SubscriptionSettings = {
    plan: 'Professional',

    status: 'Active',

    billingCycle: 'Annual',

    licenceType:
      'Demo / Preview',

    maxBranches: 3,

    maxUsers: 10,

    maxDevices: 5,

    cloudSync: true,

    offlineBilling: true,

    startDate: '2026-09-01',

    expiryDate: '2027-08-31',
  }

/* =========================================
   VALIDATION HELPERS
========================================= */

function isSubscriptionPlan(
  value: unknown
): value is SubscriptionPlan {
  return (
    value === 'Starter' ||
    value === 'Professional' ||
    value === 'Business'
  )
}

function isSubscriptionStatus(
  value: unknown
): value is SubscriptionStatus {
  return (
    value === 'Active' ||
    value === 'Trial' ||
    value === 'Expired'
  )
}

function isBillingCycle(
  value: unknown
): value is BillingCycle {
  return (
    value === 'Monthly' ||
    value === 'Annual'
  )
}

/* =========================================
   LOAD SUBSCRIPTION
========================================= */

function loadSubscription():
  SubscriptionSettings {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      )

    if (!saved) {
      return {
        ...defaultSubscription,
      }
    }

    const parsed:
      unknown =
      JSON.parse(saved)

    if (
      !parsed ||
      typeof parsed !==
        'object' ||
      Array.isArray(parsed)
    ) {
      return {
        ...defaultSubscription,
      }
    }

    const savedSubscription =
      parsed as
        Partial<SubscriptionSettings>

    return {
      plan:
        isSubscriptionPlan(
          savedSubscription.plan
        )
          ? savedSubscription.plan
          : defaultSubscription.plan,

      status:
        isSubscriptionStatus(
          savedSubscription.status
        )
          ? savedSubscription.status
          : defaultSubscription.status,

      billingCycle:
        isBillingCycle(
          savedSubscription
            .billingCycle
        )
          ? savedSubscription
              .billingCycle
          : defaultSubscription
              .billingCycle,

      licenceType:
        typeof savedSubscription
          .licenceType === 'string'
          ? savedSubscription
              .licenceType
          : defaultSubscription
              .licenceType,

      maxBranches:
        typeof savedSubscription
          .maxBranches === 'number'
          ? savedSubscription
              .maxBranches
          : defaultSubscription
              .maxBranches,

      maxUsers:
        typeof savedSubscription
          .maxUsers === 'number'
          ? savedSubscription
              .maxUsers
          : defaultSubscription
              .maxUsers,

      maxDevices:
        typeof savedSubscription
          .maxDevices === 'number'
          ? savedSubscription
              .maxDevices
          : defaultSubscription
              .maxDevices,

      cloudSync:
        typeof savedSubscription
          .cloudSync === 'boolean'
          ? savedSubscription
              .cloudSync
          : defaultSubscription
              .cloudSync,

      offlineBilling:
        typeof savedSubscription
          .offlineBilling ===
          'boolean'
          ? savedSubscription
              .offlineBilling
          : defaultSubscription
              .offlineBilling,

      startDate:
        typeof savedSubscription
          .startDate === 'string'
          ? savedSubscription
              .startDate
          : defaultSubscription
              .startDate,

      expiryDate:
        typeof savedSubscription
          .expiryDate === 'string'
          ? savedSubscription
              .expiryDate
          : defaultSubscription
              .expiryDate,
    }
  } catch {
    return {
      ...defaultSubscription,
    }
  }
}

/* =========================================
   CONTEXT
========================================= */

const SubscriptionContext =
  createContext<
    SubscriptionContextType
    | undefined
  >(undefined)

/* =========================================
   PROVIDER
========================================= */

export function SubscriptionProvider({
  children,
}: {
  children: ReactNode
}) {
  const [
    subscription,
    setSubscription,
  ] =
    useState<SubscriptionSettings>(
      loadSubscription
    )

  /* =======================================
     SAVE
  ======================================= */

  function saveSubscription(
    value:
      SubscriptionSettings
  ) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(value)
    )
  }

  /* =======================================
     UPDATE
  ======================================= */

  function updateSubscription(
    updates:
      Partial<SubscriptionSettings>
  ) {
    setSubscription(
      (current) => {
        const updated:
          SubscriptionSettings = {
            ...current,
            ...updates,
          }

        saveSubscription(
          updated
        )

        return updated
      }
    )
  }

  /* =======================================
     CHANGE DEMO PLAN
  ======================================= */

  function changePlan(
    plan:
      SubscriptionPlan
  ) {
    const selectedPlan =
      subscriptionPlans.find(
        (item) =>
          item.name === plan
      )

    if (!selectedPlan) {
      return
    }

    setSubscription(
      (current) => {
        const updated:
          SubscriptionSettings = {
            ...current,

            plan:
              selectedPlan.name,

            status:
              'Active',

            licenceType:
              'Demo / Preview',

            maxBranches:
              selectedPlan
                .maxBranches,

            maxUsers:
              selectedPlan
                .maxUsers,

            maxDevices:
              selectedPlan
                .maxDevices,

            cloudSync:
              selectedPlan
                .cloudSync,

            offlineBilling:
              selectedPlan
                .offlineBilling,
          }

        saveSubscription(
          updated
        )

        return updated
      }
    )
  }

  /* =======================================
     RESET
  ======================================= */

  function resetSubscription() {
    const resetValue = {
      ...defaultSubscription,
    }

    saveSubscription(
      resetValue
    )

    setSubscription(
      resetValue
    )
  }

  /* =======================================
     VALUE
  ======================================= */

  const value:
    SubscriptionContextType = {
      subscription,

      plans:
        subscriptionPlans,

      updateSubscription,

      changePlan,

      resetSubscription,
    }

  return (
    <SubscriptionContext.Provider
      value={value}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

/* =========================================
   HOOK
========================================= */

export function useSubscription() {
  const context =
    useContext(
      SubscriptionContext
    )

  if (!context) {
    throw new Error(
      'useSubscription must be used inside SubscriptionProvider'
    )
  }

  return context
}