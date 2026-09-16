import {
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Palette,
  PanelLeft,
  TableProperties,
  Sparkles,
  RotateCcw,
  Save,
  Check,
  IndianRupee,
  ReceiptText,
} from 'lucide-react'

import {
  useTheme,
} from '../context/ThemeContext'

import type {
  AccentColor,
  ThemeMode,
  ThemeSettings as ThemeSettingsType,
} from '../types/theme'

/* =========================================
   DEFAULT THEME SETTINGS
========================================= */

const defaultThemeSettings:
  ThemeSettingsType = {
    mode: 'Light',
    accentColor: 'Blue',
    compactSidebar: false,
    denseTables: false,
    reducedAnimations: false,
  }

/* =========================================
   APPEARANCE OPTIONS
========================================= */

const appearanceOptions: {
  value: ThemeMode
  title: string
  description: string
  icon: typeof Sun
}[] = [
  {
    value: 'Light',
    title: 'Light',
    description:
      'Bright interface for normal daytime use.',
    icon: Sun,
  },

  {
    value: 'Dark',
    title: 'Dark',
    description:
      'Dark interface for low-light environments.',
    icon: Moon,
  },

  {
    value: 'System',
    title: 'System',
    description:
      'Follow your device appearance preference.',
    icon: Monitor,
  },
]

/* =========================================
   ACCENT OPTIONS
========================================= */

const accentOptions: {
  value: AccentColor
  label: string
  className: string
}[] = [
  {
    value: 'Blue',
    label: 'Blue',
    className:
      'theme-accent-blue',
  },

  {
    value: 'Purple',
    label: 'Purple',
    className:
      'theme-accent-purple',
  },

  {
    value: 'Green',
    label: 'Green',
    className:
      'theme-accent-green',
  },

  {
    value: 'Orange',
    label: 'Orange',
    className:
      'theme-accent-orange',
  },
]

/* =========================================
   PAGE
========================================= */

export default function ThemeSettings() {
  const navigate =
    useNavigate()

  const {
    themeSettings,
    updateThemeSettings,
    resetThemeSettings,
  } = useTheme()

  const [
    form,
    setForm,
  ] = useState<
    ThemeSettingsType
  >(themeSettings)

  const [
    savedMessage,
    setSavedMessage,
  ] = useState(false)

  /* =======================================
     UPDATE FIELD
  ======================================== */

  function updateField<
    K extends keyof ThemeSettingsType
  >(
    key: K,
    value:
      ThemeSettingsType[K]
  ) {
    setForm(
      (current) => ({
        ...current,
        [key]: value,
      })
    )

    setSavedMessage(false)
  }

  /* =======================================
     SAVE
  ======================================== */

  function handleSave() {
    updateThemeSettings(
      form
    )

    setSavedMessage(
      true
    )

    window.setTimeout(
      () => {
        setSavedMessage(
          false
        )
      },
      2500
    )
  }

  /* =======================================
     RESET
  ======================================== */

  function handleReset() {
    const confirmed =
      window.confirm(
        'Reset RK BillPro theme settings to the default appearance?'
      )

    if (!confirmed) {
      return
    }

    resetThemeSettings()

    setForm({
      ...defaultThemeSettings,
    })

    setSavedMessage(
      false
    )
  }

  return (
    <div className="theme-settings-page">

      {/* ===================================
          BACK
      ==================================== */}

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

      {/* ===================================
          HEADER
      ==================================== */}

      <div className="page-header theme-page-header">

        <div>

          <h1>
            Theme & Appearance
          </h1>

          <p>
            Customize the RK BillPro
            interface for your preferred
            working style.
          </p>

        </div>

      </div>

      <div className="theme-settings-layout">

        {/* =================================
            LEFT SETTINGS
        ================================== */}

        <div className="theme-settings-main">

          {/* APPEARANCE */}

          <section className="settings-section-card">

            <div className="settings-section-heading">

              <div className="settings-section-icon">

                <Palette
                  size={20}
                />

              </div>

              <div>

                <h3>
                  Appearance
                </h3>

                <p>
                  Choose how RK BillPro
                  should look.
                </p>

              </div>

            </div>

            <div className="theme-mode-grid">

              {appearanceOptions.map(
                (option) => {
                  const Icon =
                    option.icon

                  const selected =
                    form.mode ===
                    option.value

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      className={
                        selected
                          ? 'theme-mode-card selected'
                          : 'theme-mode-card'
                      }
                      onClick={() =>
                        updateField(
                          'mode',
                          option.value
                        )
                      }
                    >

                      <div className="theme-mode-card-top">

                        <div className="theme-mode-icon">

                          <Icon
                            size={20}
                          />

                        </div>

                        {selected && (

                          <div className="theme-selected-check">

                            <Check
                              size={14}
                            />

                          </div>

                        )}

                      </div>

                      <strong>
                        {option.title}
                      </strong>

                      <span>
                        {option.description}
                      </span>

                    </button>
                  )
                }
              )}

            </div>

          </section>

          {/* ACCENT COLOR */}

          <section className="settings-section-card">

            <div className="settings-section-heading">

              <div className="settings-section-icon">

                <Palette
                  size={20}
                />

              </div>

              <div>

                <h3>
                  Accent Color
                </h3>

                <p>
                  Select the primary
                  interface color used
                  for buttons, highlights
                  and active states.
                </p>

              </div>

            </div>

            <div className="theme-accent-grid">

              {accentOptions.map(
                (option) => {
                  const selected =
                    form.accentColor ===
                    option.value

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      className={
                        selected
                          ? 'theme-accent-option selected'
                          : 'theme-accent-option'
                      }
                      onClick={() =>
                        updateField(
                          'accentColor',
                          option.value
                        )
                      }
                    >

                      <span
                        className={
                          `theme-accent-dot ${option.className}`
                        }
                      />

                      <strong>
                        {option.label}
                      </strong>

                      {selected && (

                        <Check
                          size={15}
                          className="theme-accent-check"
                        />

                      )}

                    </button>
                  )
                }
              )}

            </div>

          </section>

          {/* INTERFACE */}

          <section className="settings-section-card">

            <div className="settings-section-heading">

              <div className="settings-section-icon">

                <PanelLeft
                  size={20}
                />

              </div>

              <div>

                <h3>
                  Interface Preferences
                </h3>

                <p>
                  Adjust the density and
                  motion of the RK BillPro
                  interface.
                </p>

              </div>

            </div>

            {/* COMPACT SIDEBAR */}

            <div className="settings-toggle-row">

              <div className="theme-toggle-info">

                <div className="theme-toggle-icon">

                  <PanelLeft
                    size={18}
                  />

                </div>

                <div>

                  <strong>
                    Compact Sidebar
                  </strong>

                  <p>
                    Reduce sidebar width
                    to provide more space
                    for billing content.
                  </p>

                </div>

              </div>

              <label className="settings-switch">

                <input
                  type="checkbox"
                  checked={
                    form.compactSidebar
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'compactSidebar',
                      event.target
                        .checked
                    )
                  }
                />

                <span />

              </label>

            </div>

            {/* DENSE TABLES */}

            <div className="settings-toggle-row">

              <div className="theme-toggle-info">

                <div className="theme-toggle-icon">

                  <TableProperties
                    size={18}
                  />

                </div>

                <div>

                  <strong>
                    Dense Tables
                  </strong>

                  <p>
                    Reduce table row
                    spacing to display
                    more records at once.
                  </p>

                </div>

              </div>

              <label className="settings-switch">

                <input
                  type="checkbox"
                  checked={
                    form.denseTables
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'denseTables',
                      event.target
                        .checked
                    )
                  }
                />

                <span />

              </label>

            </div>

            {/* REDUCED ANIMATIONS */}

            <div className="settings-toggle-row">

              <div className="theme-toggle-info">

                <div className="theme-toggle-icon">

                  <Sparkles
                    size={18}
                  />

                </div>

                <div>

                  <strong>
                    Reduced Animations
                  </strong>

                  <p>
                    Minimize interface
                    transitions and
                    decorative motion.
                  </p>

                </div>

              </div>

              <label className="settings-switch">

                <input
                  type="checkbox"
                  checked={
                    form.reducedAnimations
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'reducedAnimations',
                      event.target
                        .checked
                    )
                  }
                />

                <span />

              </label>

            </div>

          </section>

          {/* ACTIONS */}

          <div className="theme-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={
                handleReset
              }
            >
              <RotateCcw
                size={17}
              />

              Reset to Default
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={
                handleSave
              }
            >
              <Save
                size={17}
              />

              Save Changes
            </button>

          </div>

        </div>

        {/* =================================
            PREVIEW
        ================================== */}

        <aside className="theme-preview-card">

          <div className="theme-preview-heading">

            <div>

              <span>
                LIVE PREVIEW
              </span>

              <h3>
                RK BillPro
              </h3>

            </div>

            <Palette
              size={19}
            />

          </div>

          <div
            className={
              `theme-preview-window theme-preview-${form.mode.toLowerCase()} theme-preview-accent-${form.accentColor.toLowerCase()}`
            }
          >

            <div className="theme-preview-topbar">

              <div className="theme-preview-brand">

                <div>
                  R
                </div>

                <span>
                  RK BillPro
                </span>

              </div>

              <div className="theme-preview-online">
                ● Online
              </div>

            </div>

            <div className="theme-preview-body">

              <span className="theme-preview-label">
                TODAY'S SALES
              </span>

              <h2>
                ₹62,450
              </h2>

              <div className="theme-preview-stats">

                <div>

                  <IndianRupee
                    size={16}
                  />

                  <span>
                    Sales
                  </span>

                  <strong>
                    ₹62,450
                  </strong>

                </div>

                <div>

                  <ReceiptText
                    size={16}
                  />

                  <span>
                    Bills
                  </span>

                  <strong>
                    184
                  </strong>

                </div>

              </div>

              <button
                type="button"
                className="theme-preview-button"
              >
                + New Sale
              </button>

            </div>

          </div>

          <div className="theme-preview-details">

            <div>

              <span>
                Appearance
              </span>

              <strong>
                {form.mode}
              </strong>

            </div>

            <div>

              <span>
                Accent
              </span>

              <strong>
                {form.accentColor}
              </strong>

            </div>

            <div>

              <span>
                Sidebar
              </span>

              <strong>
                {form.compactSidebar
                  ? 'Compact'
                  : 'Standard'}
              </strong>

            </div>

            <div>

              <span>
                Tables
              </span>

              <strong>
                {form.denseTables
                  ? 'Dense'
                  : 'Standard'}
              </strong>

            </div>

          </div>

        </aside>

      </div>

      {/* SUCCESS TOAST */}

      {savedMessage && (

        <div className="backup-toast success">

          <Check
            size={17}
          />

          Theme settings saved successfully.

        </div>

      )}

    </div>
  )
}