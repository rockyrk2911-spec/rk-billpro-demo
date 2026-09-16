import {
  ArrowLeft,
  Crown,
  CheckCircle2,
  CalendarDays,
  CreditCard,
  Users,
  Store,
  Monitor,
  Cloud,
  ShieldCheck,
  ReceiptText,
  Sparkles,
  CircleCheck,
  Headphones,
  Zap,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  useSubscription,
} from '../context/SubscriptionContext'

export default function SubscriptionSettings() {
  const navigate =
    useNavigate()

  const {
    subscription,
    plans,
    changePlan,
  } = useSubscription()

  /* =========================================
     CURRENT PLAN
  ========================================= */

  const currentPlanDefinition =
    plans.find(
      (plan) =>
        plan.name ===
        subscription.plan
    )

  const planFeatures =
    currentPlanDefinition
      ?.features ?? []

  const currentPlanDescription =
    currentPlanDefinition
      ?.description ??
    'RK BillPro billing and business management plan.'

  /* =========================================
     STATUS
  ========================================= */

  const isActive =
    subscription.status ===
    'Active'

  const isTrial =
    subscription.status ===
    'Trial'

  const statusClassName =
    isActive
      ? 'subscription-active-badge'
      : isTrial
        ? 'subscription-active-badge trial'
        : 'subscription-active-badge expired'

  /* =========================================
     DATE FORMAT
  ========================================= */

  function formatDate(
    dateString: string
  ) {
    if (!dateString) {
      return 'Not set'
    }

    const date =
      new Date(dateString)

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString
    }

    return new Intl.DateTimeFormat(
      'en-IN',
      {
        dateStyle: 'medium',
      }
    ).format(date)
  }

  /* =========================================
     CHANGE DEMO PLAN
  ========================================= */

  function handlePlanChange(
    planName:
      typeof subscription.plan
  ) {
    if (
      planName ===
      subscription.plan
    ) {
      return
    }

    const confirmed =
      window.confirm(
        `Switch the RK BillPro demo plan from ${subscription.plan} to ${planName}?\n\nThis only changes local demo subscription information. No payment or real subscription transaction will be performed.`
      )

    if (!confirmed) {
      return
    }

    changePlan(
      planName
    )
  }

  /* =========================================
     SCROLL TO PLANS
  ========================================= */

  function scrollToPlans() {
    document
      .querySelector(
        '.subscription-plan-comparison-grid'
      )
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
  }

  return (
    <div className="subscription-settings-page">

      {/* =====================================
          BACK
      ====================================== */}

      <button
        type="button"
        className="back-button"
        onClick={() =>
          navigate(
            '/settings'
          )
        }
      >
        <ArrowLeft
          size={17}
        />

        Back to Settings
      </button>

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="page-header subscription-page-header">

        <div>

          <h1>
            Subscription & Plan
          </h1>

          <p>
            View your RK BillPro plan,
            licence information and
            available features.
          </p>

        </div>

        <div
          className={
            statusClassName
          }
        >
          <CheckCircle2
            size={16}
          />

          {subscription.status}
        </div>

      </div>

      {/* =====================================
          CURRENT PLAN
      ====================================== */}

      <section className="subscription-plan-card">

        <div className="subscription-plan-top">

          <div className="subscription-plan-identity">

            <div className="subscription-crown">

              <Crown
                size={27}
              />

            </div>

            <div>

              <span className="subscription-eyebrow">
                CURRENT PLAN
              </span>

              <h2>
                RK BillPro{' '}
                {subscription.plan}
              </h2>

              <p>
                {
                  currentPlanDescription
                }
              </p>

            </div>

          </div>

          <div className="subscription-price">

            <strong>
              {
                subscription
                  .licenceType
              }
            </strong>

            <span>
              RK BillPro
            </span>

          </div>

        </div>

        <div className="subscription-plan-divider" />

        <div className="subscription-plan-meta">

          {/* BILLING CYCLE */}

          <div>

            <CalendarDays
              size={18}
            />

            <div>

              <span>
                Billing Cycle
              </span>

              <strong>
                {
                  subscription
                    .billingCycle
                }
              </strong>

            </div>

          </div>

          {/* ACCOUNT TYPE */}

          <div>

            <CreditCard
              size={18}
            />

            <div>

              <span>
                Account Type
              </span>

              <strong>
                {
                  subscription
                    .licenceType
                }
              </strong>

            </div>

          </div>

          {/* LICENCE STATUS */}

          <div>

            <ShieldCheck
              size={18}
            />

            <div>

              <span>
                Licence Status
              </span>

              <strong>
                {
                  subscription
                    .status
                }
              </strong>

            </div>

          </div>

          {/* EXPIRY */}

          <div>

            <CalendarDays
              size={18}
            />

            <div>

              <span>
                Valid Until
              </span>

              <strong>
                {formatDate(
                  subscription
                    .expiryDate
                )}
              </strong>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          PLAN DATES
      ====================================== */}

      <div className="subscription-section-heading">

        <div>

          <h2>
            Subscription Period
          </h2>

          <p>
            Current plan activation and
            validity information.
          </p>

        </div>

      </div>

      <div className="subscription-usage-grid">

        <div className="subscription-usage-card">

          <div className="subscription-usage-icon">

            <CalendarDays
              size={20}
            />

          </div>

          <div>

            <span>
              Start Date
            </span>

            <strong>
              {formatDate(
                subscription
                  .startDate
              )}
            </strong>

            <small>
              Plan activation
            </small>

          </div>

        </div>

        <div className="subscription-usage-card">

          <div className="subscription-usage-icon">

            <CalendarDays
              size={20}
            />

          </div>

          <div>

            <span>
              Expiry Date
            </span>

            <strong>
              {formatDate(
                subscription
                  .expiryDate
              )}
            </strong>

            <small>
              Current validity
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          PLAN CAPACITY
      ====================================== */}

      <div className="subscription-section-heading">

        <div>

          <h2>
            Plan Capacity
          </h2>

          <p>
            Maximum resources available
            under the current plan.
          </p>

        </div>

      </div>

      <div className="subscription-usage-grid">

        {/* BRANCHES */}

        <div className="subscription-usage-card">

          <div className="subscription-usage-icon">

            <Store
              size={20}
            />

          </div>

          <div>

            <span>
              Branches
            </span>

            <strong>
              {
                subscription
                  .maxBranches
              }
            </strong>

            <small>
              Maximum branches
            </small>

          </div>

        </div>

        {/* USERS */}

        <div className="subscription-usage-card">

          <div className="subscription-usage-icon">

            <Users
              size={20}
            />

          </div>

          <div>

            <span>
              Users
            </span>

            <strong>
              {
                subscription
                  .maxUsers
              }
            </strong>

            <small>
              Maximum users
            </small>

          </div>

        </div>

        {/* DEVICES */}

        <div className="subscription-usage-card">

          <div className="subscription-usage-icon">

            <Monitor
              size={20}
            />

          </div>

          <div>

            <span>
              Devices
            </span>

            <strong>
              {
                subscription
                  .maxDevices
              }
            </strong>

            <small>
              Maximum devices
            </small>

          </div>

        </div>

        {/* CLOUD SYNC */}

        <div className="subscription-usage-card">

          <div className="subscription-usage-icon">

            <Cloud
              size={20}
            />

          </div>

          <div>

            <span>
              Cloud Sync
            </span>

            <strong>
              {
                subscription
                  .cloudSync
                  ? 'Enabled'
                  : 'Disabled'
              }
            </strong>

            <small>
              Demo sync capability
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          SERVICE CAPABILITIES
      ====================================== */}

      <section className="subscription-content-card">

        <div className="subscription-content-header">

          <div>

            <h2>
              Service Capabilities
            </h2>

            <p>
              Important operating
              capabilities for the
              current plan.
            </p>

          </div>

          <Cloud
            size={20}
          />

        </div>

        <div className="subscription-feature-grid">

          <div className="subscription-feature">

            <CircleCheck
              size={17}
            />

            <span>
              Offline Billing:{' '}
              {
                subscription
                  .offlineBilling
                  ? 'Enabled'
                  : 'Disabled'
              }
            </span>

          </div>

          <div className="subscription-feature">

            <CircleCheck
              size={17}
            />

            <span>
              Cloud Sync:{' '}
              {
                subscription
                  .cloudSync
                  ? 'Enabled'
                  : 'Disabled'
              }
            </span>

          </div>

        </div>

      </section>

      {/* =====================================
          CURRENT PLAN FEATURES
      ====================================== */}

      <section className="subscription-content-card">

        <div className="subscription-content-header">

          <div>

            <h2>
              Included Features
            </h2>

            <p>
              Features available in the
              RK BillPro{' '}
              {subscription.plan}{' '}
              demo.
            </p>

          </div>

          <Sparkles
            size={20}
          />

        </div>

        <div className="subscription-feature-grid">

          {planFeatures.map(
            (feature) => (

              <div
                className="subscription-feature"
                key={feature}
              >

                <CircleCheck
                  size={17}
                />

                <span>
                  {feature}
                </span>

              </div>

            )
          )}

        </div>

      </section>

      {/* =====================================
          LICENCE INFORMATION
      ====================================== */}

      <section className="subscription-content-card">

        <div className="subscription-content-header">

          <div>

            <h2>
              Software Licence
            </h2>

            <p>
              Licence information for
              this RK BillPro
              demonstration.
            </p>

          </div>

          <ShieldCheck
            size={20}
          />

        </div>

        <div className="subscription-license-grid">

          {/* PRODUCT */}

          <div>

            <span>
              Product
            </span>

            <strong>
              RK BillPro
            </strong>

          </div>

          {/* EDITION */}

          <div>

            <span>
              Edition
            </span>

            <strong>
              {
                subscription
                  .plan
              }
            </strong>

          </div>

          {/* LICENCE TYPE */}

          <div>

            <span>
              Licence Type
            </span>

            <strong>
              {
                subscription
                  .licenceType
              }
            </strong>

          </div>

          {/* LICENCE STATUS */}

          <div>

            <span>
              Licence Status
            </span>

            <strong
              className={
                isActive
                  ? 'subscription-license-active'
                  : undefined
              }
            >

              <CheckCircle2
                size={15}
              />

              {
                subscription
                  .status
              }

            </strong>

          </div>

        </div>

      </section>

      {/* =====================================
          PLAN COMPARISON HEADING
      ====================================== */}

      <div className="subscription-section-heading">

        <div>

          <h2>
            Compare Plans
          </h2>

          <p>
            Compare RK BillPro demo
            plans and preview different
            business capacities.
          </p>

        </div>

      </div>

      {/* =====================================
          PLAN COMPARISON
      ====================================== */}

      <div className="subscription-plan-comparison-grid">

        {plans.map(
          (plan) => {
            const currentPlan =
              subscription.plan ===
              plan.name

            return (
              <article
                key={
                  plan.name
                }
                className={`subscription-comparison-card${
                  currentPlan
                    ? ' current'
                    : ''
                }${
                  plan.recommended
                    ? ' recommended'
                    : ''
                }`}
              >

                {/* BADGES */}

                <div className="subscription-comparison-badges">

                  {currentPlan && (

                    <span className="subscription-current-plan-badge">

                      <CheckCircle2
                        size={14}
                      />

                      Current Plan

                    </span>

                  )}

                  {plan.recommended &&
                    !currentPlan && (

                      <span className="subscription-recommended-badge">

                        <Sparkles
                          size={14}
                        />

                        Recommended

                      </span>

                    )}

                </div>

                {/* PLAN HEADER */}

                <div className="subscription-comparison-header">

                  <div className="subscription-comparison-icon">

                    {plan.name ===
                    'Starter' ? (

                      <Zap
                        size={23}
                      />

                    ) : plan.name ===
                      'Professional' ? (

                      <Crown
                        size={23}
                      />

                    ) : (

                      <Store
                        size={23}
                      />

                    )}

                  </div>

                  <div>

                    <span>
                      RK BillPro
                    </span>

                    <h3>
                      {
                        plan.name
                      }
                    </h3>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <p className="subscription-comparison-description">
                  {
                    plan.description
                  }
                </p>

                {/* CAPACITY */}

                <div className="subscription-comparison-limits">

                  <div>

                    <Store
                      size={17}
                    />

                    <span>
                      Branches
                    </span>

                    <strong>
                      {
                        plan
                          .maxBranches
                      }
                    </strong>

                  </div>

                  <div>

                    <Users
                      size={17}
                    />

                    <span>
                      Users
                    </span>

                    <strong>
                      {
                        plan
                          .maxUsers
                      }
                    </strong>

                  </div>

                  <div>

                    <Monitor
                      size={17}
                    />

                    <span>
                      Devices
                    </span>

                    <strong>
                      {
                        plan
                          .maxDevices
                      }
                    </strong>

                  </div>

                </div>

                {/* SERVICES */}

                <div className="subscription-comparison-services">

                  <div>

                    <CircleCheck
                      size={16}
                    />

                    <span>
                      Offline Billing
                    </span>

                    <strong>
                      {
                        plan
                          .offlineBilling
                          ? 'Yes'
                          : 'No'
                      }
                    </strong>

                  </div>

                  <div>

                    {plan.cloudSync ? (

                      <CircleCheck
                        size={16}
                      />

                    ) : (

                      <Cloud
                        size={16}
                      />

                    )}

                    <span>
                      Cloud Sync
                    </span>

                    <strong>
                      {
                        plan
                          .cloudSync
                          ? 'Yes'
                          : 'No'
                      }
                    </strong>

                  </div>

                </div>

                {/* FEATURES */}

                <div className="subscription-comparison-features">

                  <strong>
                    Included Features
                  </strong>

                  <div>

                    {plan.features.map(
                      (
                        feature
                      ) => (

                        <span
                          key={
                            feature
                          }
                        >

                          <CheckCircle2
                            size={
                              15
                            }
                          />

                          {
                            feature
                          }

                        </span>

                      )
                    )}

                  </div>

                </div>

                {/* ACTION */}

                <button
                  type="button"
                  className={
                    currentPlan
                      ? 'subscription-plan-button current'
                      : 'subscription-plan-button'
                  }
                  disabled={
                    currentPlan
                  }
                  onClick={() =>
                    handlePlanChange(
                      plan.name
                    )
                  }
                >

                  {currentPlan ? (

                    <>
                      <CheckCircle2
                        size={17}
                      />

                      Current Plan
                    </>

                  ) : (

                    <>
                      <Zap
                        size={17}
                      />

                      Switch Demo Plan
                    </>

                  )}

                </button>

              </article>
            )
          }
        )}

      </div>

      {/* =====================================
          DEMO PLAN WARNING
      ====================================== */}

      <div className="subscription-plan-demo-warning">

        <ShieldCheck
          size={18}
        />

        <div>

          <strong>
            Demo plan switching
          </strong>

          <p>
            Changing a plan here only
            updates RK BillPro frontend
            demo data stored in this
            browser. No payment,
            billing, renewal or real
            subscription change is
            performed.
          </p>

        </div>

      </div>

      {/* =====================================
          PLAN MANAGEMENT
      ====================================== */}

      <section className="subscription-management-card">

        <div className="subscription-management-icon">

          <Zap
            size={24}
          />

        </div>

        <div className="subscription-management-copy">

          <h2>
            Need a different plan?
          </h2>

          <p>
            Compare the available
            RK BillPro demo plans and
            preview different business
            capacities.
          </p>

        </div>

        <div className="subscription-management-actions">

          <button
            type="button"
            className="subscription-secondary-button"
            onClick={() =>
              navigate(
                '/settings'
              )
            }
          >

            <ReceiptText
              size={17}
            />

            View Settings

          </button>

          <button
            type="button"
            className="subscription-primary-button"
            onClick={
              scrollToPlans
            }
          >

            <Headphones
              size={17}
            />

            Compare Plans

          </button>

        </div>

      </section>

      {/* =====================================
          DEMO NOTICE
      ====================================== */}

      <div className="subscription-demo-note">

        <ShieldCheck
          size={18}
        />

        <div>

          <strong>
            Demo subscription
          </strong>

          <p>
            No real subscription,
            payment, renewal or
            software licence
            transaction is performed
            in this demo.
          </p>

        </div>

      </div>

    </div>
  )
}