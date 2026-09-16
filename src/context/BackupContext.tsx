import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type {
  BackupSettings,
  ConnectionStatus,
  PendingChange,
  PendingChangeType,
  SyncStatus,
} from '../types/backup'

type BackupContextType = {
  backupSettings: BackupSettings

  connectionStatus: ConnectionStatus

  syncStatus: SyncStatus

  pendingChanges: number

  pendingItems: PendingChange[]

  isOnline: boolean

  updateBackupSettings: (
    settings: BackupSettings
  ) => void

  setConnectionStatus: (
    status: ConnectionStatus
  ) => void

  goOnline: () => Promise<void>

  goOffline: () => void

  toggleConnection: () => Promise<void>

  addPendingChange: (
    type: PendingChangeType,
    description: string
  ) => void

  clearPendingChanges: () => void

  markBackupComplete: () => void

  simulateSync: () => Promise<void>
}

const BackupContext =
  createContext<
    BackupContextType | undefined
  >(undefined)

/* =========================================
   DEFAULT SETTINGS
========================================= */

const defaultSettings:
  BackupSettings = {
    autoBackup: true,
    backupFrequency: 'Daily',
    syncEnabled: true,
    lastBackupAt: null,
    lastSyncAt: null,
  }

/* =========================================
   LOCAL STORAGE KEYS
========================================= */

const SETTINGS_KEY =
  'rk-billpro-backup-settings'

const CONNECTION_KEY =
  'rk-billpro-connection-status'

const PENDING_KEY =
  'rk-billpro-pending-changes'

/* =========================================
   PROVIDER
========================================= */

export function BackupProvider({
  children,
}: {
  children: ReactNode
}) {
  /* =======================================
     BACKUP SETTINGS
  ======================================== */

  const [
    backupSettings,
    setBackupSettings,
  ] =
    useState<BackupSettings>(() => {
      const saved =
        localStorage.getItem(
          SETTINGS_KEY
        )

      if (!saved) {
        return defaultSettings
      }

      try {
        const parsed =
          JSON.parse(saved)

        if (
          typeof parsed !==
            'object' ||
          parsed === null ||
          Array.isArray(parsed)
        ) {
          return defaultSettings
        }

        return {
          ...defaultSettings,
          ...parsed,
        }
      } catch {
        return defaultSettings
      }
    })

  /* =======================================
     CONNECTION
  ======================================== */

  const [
    connectionStatus,
    setConnectionStatusState,
  ] =
    useState<ConnectionStatus>(() => {
      const saved =
        localStorage.getItem(
          CONNECTION_KEY
        )

      return saved === 'Offline'
        ? 'Offline'
        : 'Online'
    })

  /* =======================================
     PENDING CHANGES
  ======================================== */

  const [
    pendingItems,
    setPendingItems,
  ] =
    useState<PendingChange[]>(
      () => {
        const saved =
          localStorage.getItem(
            PENDING_KEY
          )

        if (!saved) {
          return []
        }

        try {
          const parsed =
            JSON.parse(saved)

          return Array.isArray(
            parsed
          )
            ? parsed
            : []
        } catch {
          return []
        }
      }
    )

  /* =======================================
     SYNC STATUS
  ======================================== */

  const [
    syncStatus,
    setSyncStatus,
  ] =
    useState<SyncStatus>(() => {
      if (
        connectionStatus ===
        'Offline'
      ) {
        return 'Offline'
      }

      if (
        pendingItems.length > 0
      ) {
        return 'Pending'
      }

      return 'Synced'
    })

  /* =======================================
     DERIVED VALUES
  ======================================== */

  const isOnline =
    connectionStatus === 'Online'

  const pendingChanges =
    pendingItems.length

  /* =======================================
     SAVE BACKUP SETTINGS
  ======================================== */

  useEffect(() => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(
        backupSettings
      )
    )
  }, [backupSettings])

  /* =======================================
     SAVE CONNECTION STATUS
  ======================================== */

  useEffect(() => {
    localStorage.setItem(
      CONNECTION_KEY,
      connectionStatus
    )
  }, [connectionStatus])

  /* =======================================
     SAVE PENDING QUEUE
  ======================================== */

  useEffect(() => {
    localStorage.setItem(
      PENDING_KEY,
      JSON.stringify(
        pendingItems
      )
    )
  }, [pendingItems])

  /* =======================================
     UPDATE BACKUP SETTINGS
  ======================================== */

  function updateBackupSettings(
    settings: BackupSettings
  ) {
    setBackupSettings(
      settings
    )
  }

  /* =======================================
     DIRECT CONNECTION UPDATE
  ======================================== */

  function setConnectionStatus(
    status: ConnectionStatus
  ) {
    setConnectionStatusState(
      status
    )

    if (status === 'Offline') {
      setSyncStatus(
        'Offline'
      )

      return
    }

    setSyncStatus(
      pendingItems.length > 0
        ? 'Pending'
        : 'Synced'
    )
  }

  /* =======================================
     GO OFFLINE
  ======================================== */

  function goOffline() {
    setConnectionStatusState(
      'Offline'
    )

    setSyncStatus(
      'Offline'
    )
  }

  /* =======================================
     ADD PENDING CHANGE
  ======================================== */

  function addPendingChange(
    type: PendingChangeType,
    description: string
  ) {
    /*
      Online operations are treated as
      immediately synchronized in this demo.

      Only operations created while offline
      are added to the local pending queue.
    */

    if (
      connectionStatus ===
      'Online'
    ) {
      return
    }

    const item:
      PendingChange = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

        type,

        description,

        createdAt:
          new Date()
            .toISOString(),
      }

    setPendingItems(
      (current) => [
        ...current,
        item,
      ]
    )
  }

  /* =======================================
     CLEAR PENDING CHANGES
  ======================================== */

  function clearPendingChanges() {
    setPendingItems([])

    if (
      connectionStatus ===
      'Online'
    ) {
      setSyncStatus(
        'Synced'
      )
    }
  }

  /* =======================================
     BACKUP COMPLETE
  ======================================== */

  function markBackupComplete() {
    setBackupSettings(
      (current) => ({
        ...current,

        lastBackupAt:
          new Date()
            .toISOString(),
      })
    )
  }

  /* =======================================
     SIMULATE SYNC
  ======================================== */

  async function simulateSync() {
    /*
      RK BillPro demo only.

      This simulates synchronization.
      No real cloud API is called.
    */

    if (
      connectionStatus !==
      'Online'
    ) {
      setSyncStatus(
        'Offline'
      )

      return
    }

    if (
      !backupSettings
        .syncEnabled
    ) {
      if (
        pendingItems.length > 0
      ) {
        setSyncStatus(
          'Pending'
        )
      }

      return
    }

    /*
      Nothing is waiting to sync.
    */

    if (
      pendingItems.length === 0
    ) {
      setSyncStatus(
        'Synced'
      )

      return
    }

    setSyncStatus(
      'Syncing'
    )

    await new Promise<void>(
      (resolve) => {
        window.setTimeout(
          resolve,
          1300
        )
      }
    )

    setPendingItems([])

    setBackupSettings(
      (current) => ({
        ...current,

        lastSyncAt:
          new Date()
            .toISOString(),
      })
    )

    setSyncStatus(
      'Synced'
    )
  }

  /* =======================================
     GO ONLINE
  ======================================== */

  async function goOnline() {
    setConnectionStatusState(
      'Online'
    )

    /*
      If offline work exists and sync
      is enabled, synchronize it
      automatically.
    */

    if (
      pendingItems.length > 0 &&
      backupSettings.syncEnabled
    ) {
      setSyncStatus(
        'Syncing'
      )

      await new Promise<void>(
        (resolve) => {
          window.setTimeout(
            resolve,
            1300
          )
        }
      )

      setPendingItems([])

      setBackupSettings(
        (current) => ({
          ...current,

          lastSyncAt:
            new Date()
              .toISOString(),
        })
      )

      setSyncStatus(
        'Synced'
      )

      return
    }

    /*
      Pending data remains pending when
      automatic synchronization is disabled.
    */

    if (
      pendingItems.length > 0
    ) {
      setSyncStatus(
        'Pending'
      )

      return
    }

    setSyncStatus(
      'Synced'
    )
  }

  /* =======================================
     TOGGLE CONNECTION
  ======================================== */

  async function toggleConnection() {
    if (
      connectionStatus ===
      'Online'
    ) {
      goOffline()

      return
    }

    await goOnline()
  }

  /* =======================================
     CONTEXT VALUE
  ======================================== */

  /*
    We intentionally don't use useMemo here.

    The previous useMemo required all of the
    locally declared functions as dependencies
    and caused exhaustive-deps warnings.

    For this demo context, a normal object is
    simpler and avoids unnecessary callback/
    memo complexity.
  */

  const value:
    BackupContextType = {
      backupSettings,

      connectionStatus,

      syncStatus,

      pendingChanges,

      pendingItems,

      isOnline,

      updateBackupSettings,

      setConnectionStatus,

      goOnline,

      goOffline,

      toggleConnection,

      addPendingChange,

      clearPendingChanges,

      markBackupComplete,

      simulateSync,
    }

  return (
    <BackupContext.Provider
      value={value}
    >
      {children}
    </BackupContext.Provider>
  )
}

/* =========================================
   HOOK
========================================= */

export function useBackup() {
  const context =
    useContext(
      BackupContext
    )

  if (!context) {
    throw new Error(
      'useBackup must be used inside BackupProvider'
    )
  }

  return context
}