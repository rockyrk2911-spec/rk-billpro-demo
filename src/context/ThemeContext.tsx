import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type {
  ThemeSettings,
} from '../types/theme'

/* =========================================
   STORAGE
========================================= */

const STORAGE_KEY =
  'rk-billpro-theme-settings'

/* =========================================
   DEFAULT SETTINGS
========================================= */

const defaultThemeSettings:
  ThemeSettings = {
    mode: 'Light',

    accentColor:
      'Blue',

    compactSidebar:
      false,

    denseTables:
      false,

    reducedAnimations:
      false,
  }

/* =========================================
   CONTEXT TYPE
========================================= */

type ThemeContextType = {
  themeSettings:
    ThemeSettings

  updateThemeSettings:
    (
      settings:
        ThemeSettings
    ) => void

  resetThemeSettings:
    () => void
}

/* =========================================
   CONTEXT
========================================= */

const ThemeContext =
  createContext<
    ThemeContextType |
    undefined
  >(undefined)

/* =========================================
   LOAD SETTINGS
========================================= */

function loadThemeSettings():
  ThemeSettings {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      )

    if (!saved) {
      return defaultThemeSettings
    }

    const parsed:
      unknown =
        JSON.parse(saved)

    if (
      typeof parsed !==
        'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return defaultThemeSettings
    }

    const value =
      parsed as Partial<
        ThemeSettings
      >

    const validModes =
      [
        'Light',
        'Dark',
        'System',
      ] as const

    const validAccents =
      [
        'Blue',
        'Purple',
        'Green',
        'Orange',
      ] as const

    const mode =
      validModes.includes(
        value.mode as
          typeof validModes[number]
      )
        ? value.mode as
            ThemeSettings['mode']
        : defaultThemeSettings.mode

    const accentColor =
      validAccents.includes(
        value.accentColor as
          typeof validAccents[number]
      )
        ? value.accentColor as
            ThemeSettings[
              'accentColor'
            ]
        : defaultThemeSettings
            .accentColor

    return {
      mode,

      accentColor,

      compactSidebar:
        typeof value
          .compactSidebar ===
          'boolean'
          ? value
              .compactSidebar
          : false,

      denseTables:
        typeof value
          .denseTables ===
          'boolean'
          ? value
              .denseTables
          : false,

      reducedAnimations:
        typeof value
          .reducedAnimations ===
          'boolean'
          ? value
              .reducedAnimations
          : false,
    }
  } catch {
    return defaultThemeSettings
  }
}

/* =========================================
   PROVIDER
========================================= */

export function ThemeProvider({
  children,
}: {
  children: ReactNode
}) {
  const [
    themeSettings,
    setThemeSettings,
  ] = useState<
    ThemeSettings
  >(
    loadThemeSettings
  )

  /* =======================================
     SAVE SETTINGS
  ======================================== */

  useEffect(
    () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          themeSettings
        )
      )
    },
    [themeSettings]
  )

  /* =======================================
     APPLY GLOBAL THEME
  ======================================== */

  useEffect(
    () => {
      const root =
        document.documentElement

      const systemQuery =
        window.matchMedia(
          '(prefers-color-scheme: dark)'
        )

      function applyTheme() {
        let resolvedTheme:
          'light' | 'dark'

        if (
          themeSettings.mode ===
            'Dark'
        ) {
          resolvedTheme =
            'dark'
        } else if (
          themeSettings.mode ===
            'System'
        ) {
          resolvedTheme =
            systemQuery.matches
              ? 'dark'
              : 'light'
        } else {
          resolvedTheme =
            'light'
        }

        root.dataset.theme =
          resolvedTheme

        root.dataset.themePreference =
          themeSettings.mode
            .toLowerCase()

        root.dataset.accent =
          themeSettings
            .accentColor
            .toLowerCase()

        root.classList.toggle(
          'compact-sidebar',
          themeSettings
            .compactSidebar
        )

        root.classList.toggle(
          'dense-tables',
          themeSettings
            .denseTables
        )

        root.classList.toggle(
          'reduced-animations',
          themeSettings
            .reducedAnimations
        )

        root.style.colorScheme =
          resolvedTheme
      }

      applyTheme()

      /*
        System mode automatically
        responds when Windows/macOS
        appearance changes.
      */

      function handleSystemChange() {
        if (
          themeSettings.mode ===
            'System'
        ) {
          applyTheme()
        }
      }

      systemQuery.addEventListener(
        'change',
        handleSystemChange
      )

      return () => {
        systemQuery.removeEventListener(
          'change',
          handleSystemChange
        )
      }
    },
    [themeSettings]
  )

  /* =======================================
     UPDATE
  ======================================== */

  function updateThemeSettings(
    settings:
      ThemeSettings
  ) {
    setThemeSettings(
      settings
    )
  }

  /* =======================================
     RESET
  ======================================== */

  function resetThemeSettings() {
    setThemeSettings(
      defaultThemeSettings
    )
  }

  return (
    <ThemeContext.Provider
      value={{
        themeSettings,
        updateThemeSettings,
        resetThemeSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

/* =========================================
   HOOK
========================================= */

export function useTheme() {
  const context =
    useContext(
      ThemeContext
    )

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    )
  }

  return context
}