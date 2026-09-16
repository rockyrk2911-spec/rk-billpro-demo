import {
  Building2,
  Store,
  ReceiptText,
  Printer,
  CreditCard,
  Users,
  Cloud,
  Palette,
  Crown,
  ChevronRight,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  useSettings,
} from '../context/SettingsContext'

type SettingItem = {
  title: string
  description: string
  route: string
  icon: typeof Building2
}

export default function Settings() {
  const navigate =
    useNavigate()

  const {
    businessProfile,
  } = useSettings()

  /* =========================================
     SETTINGS ITEMS
  ========================================= */

  const settings:
    SettingItem[] = [
      {
        title:
          'Business Profile',

        description:
          'Business name, owner, address, contact and company details.',

        route:
          '/settings/business',

        icon:
          Building2,
      },

      {
        title:
          'Branches',

        description:
          'Manage stores, branches and business locations.',

        route:
          '/settings/branches',

        icon:
          Store,
      },

      {
        title:
          'GST & Tax',

        description:
          'Configure GST registration, tax rates and tax preferences.',

        route:
          '/settings/tax',

        icon:
          ReceiptText,
      },

      {
        title:
          'Invoice Settings',

        description:
          'Invoice numbering, business details, footer and receipt preferences.',

        route:
          '/settings/invoice',

        icon:
          ReceiptText,
      },

      {
        title:
          'Printer Settings',

        description:
          'Configure thermal printers, paper size and printing behaviour.',

        route:
          '/settings/printer',

        icon:
          Printer,
      },

      {
        title:
          'Payment Methods',

        description:
          'Manage Cash, UPI, Card and other accepted payment methods.',

        route:
          '/settings/payments',

        icon:
          CreditCard,
      },

      {
        title:
          'Users & Roles',

        description:
          'Manage owners, managers, cashiers and access permissions.',

        route:
          '/settings/users',

        icon:
          Users,
      },

      {
        title:
          'Backup & Sync',

        description:
          'Manage offline data, cloud sync, backups and restore options.',

        route:
          '/settings/backup',

        icon:
          Cloud,
      },

      {
        title:
          'Theme',

        description:
          'Customize RK BillPro appearance and interface preferences.',

        route:
          '/settings/theme',

        icon:
          Palette,
      },

      {
        title:
          'Subscription',

        description:
          'View plan information, billing status and software licence.',

        route:
          '/settings/subscription',

        icon:
          Crown,
      },
    ]

  /* =========================================
     BUSINESS LOGO INITIALS
  ========================================= */

  const businessInitials =
    businessProfile
      .businessName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (word) =>
          word.charAt(0)
      )
      .join('')
      .toUpperCase() ||
    'RK'

  /* =========================================
     BUSINESS LOCATION
  ========================================= */

  const businessLocation =
    businessProfile
      .city
      .trim() ||
    'Business Location'

  return (
    <div className="settings-page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="page-header settings-page-header">

        <div>

          <h1>
            Settings
          </h1>

          <p>
            Configure RK BillPro for your business.
          </p>

        </div>

      </div>

      {/* =====================================
          BUSINESS SUMMARY
      ====================================== */}

      <div className="settings-business-banner">

        {/* BUSINESS LOGO */}

        <div className="settings-business-logo">

          {businessInitials}

        </div>

        {/* BUSINESS INFORMATION */}

        <div className="settings-business-info">

          <span>
            CURRENT BUSINESS
          </span>

          <h2>
            {
              businessProfile
                .businessName
            }
          </h2>

          <p>

            {businessLocation}

            {' • '}

            Owner:{' '}

            {
              businessProfile
                .ownerName ||
              'Not Set'
            }

          </p>

        </div>

      </div>

      {/* =====================================
          SETTINGS GRID
      ====================================== */}

      <div className="settings-grid">

        {settings.map(
          (setting) => {
            const Icon =
              setting.icon

            return (
              <button
                key={
                  setting.title
                }
                type="button"
                className="settings-card"
                onClick={() =>
                  navigate(
                    setting.route
                  )
                }
              >

                {/* ICON */}

                <div className="settings-card-icon">

                  <Icon
                    size={21}
                  />

                </div>

                {/* CONTENT */}

                <div className="settings-card-content">

                  <h3>
                    {
                      setting.title
                    }
                  </h3>

                  <p>
                    {
                      setting.description
                    }
                  </p>

                </div>

                {/* ARROW */}

                <ChevronRight
                  size={18}
                  className="settings-card-arrow"
                />

              </button>
            )
          }
        )}

      </div>

    </div>
  )
}