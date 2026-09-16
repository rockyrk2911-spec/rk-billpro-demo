import {
  useRef,
  useState,
  type ChangeEvent,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Cloud,
  CloudCheck,
  Download,
  Upload,
  RefreshCw,
  Database,
  HardDrive,
  Clock3,
  ShieldCheck,
  AlertTriangle,
  Wifi,
  WifiOff,
  ListChecks,
  CheckCircle2,
  FileJson,
  Server,
} from 'lucide-react'

import {
  useBackup,
} from '../context/BackupContext'

import type {
  BackupFile,
  BackupFrequency,
} from '../types/backup'

/* =========================================
   BACKUP LOCAL STORAGE KEYS

   IMPORTANT:
   Connection status and pending sync queue
   are intentionally NOT included.

   They are temporary runtime/demo state,
   not normal business backup data.
========================================= */

const backupKeys = [
  /* BUSINESS DATA */

  'rk-billpro-products',
  'rk-billpro-sales',
  'rk-billpro-purchases',
  'rk-billpro-suppliers',
  'rk-billpro-customers',
  'rk-billpro-expenses',

  /* BUSINESS SETTINGS */

  'rk-billpro-business-profile',
  'rk-billpro-tax-settings',
  'rk-billpro-invoice-settings',
  'rk-billpro-printer-settings',
  'rk-billpro-payment-settings',

  /* ORGANIZATION */

  'rk-billpro-branches',
  'rk-billpro-users',

  /* SUBSCRIPTION */

  'rk-billpro-subscription',

  /* BACKUP PREFERENCES */

  'rk-billpro-backup-settings',
] as const

/* =========================================
   PAGE
========================================= */

export default function BackupSettings() {
  const navigate =
    useNavigate()

  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    )

  const {
    backupSettings,

    connectionStatus,

    syncStatus,

    pendingChanges,

    pendingItems,

    updateBackupSettings,

    markBackupComplete,

    simulateSync,
  } = useBackup()

  const [
    message,
    setMessage,
  ] = useState('')

  const [
    error,
    setError,
  ] = useState('')

  const [
    restoring,
    setRestoring,
  ] = useState(false)

  /* =========================================
     FORMAT DATE
  ========================================= */

  function formatDate(
    value: string | null
  ) {
    if (!value) {
      return 'Not yet'
    }

    const date =
      new Date(value)

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return 'Not yet'
    }

    return date.toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  /* =========================================
     AUTO BACKUP
  ========================================= */

  function updateAutoBackup(
    enabled: boolean
  ) {
    setError('')
    setMessage('')

    updateBackupSettings({
      ...backupSettings,

      autoBackup:
        enabled,
    })
  }

  /* =========================================
     BACKUP FREQUENCY
  ========================================= */

  function updateFrequency(
    frequency:
      BackupFrequency
  ) {
    setError('')
    setMessage('')

    updateBackupSettings({
      ...backupSettings,

      backupFrequency:
        frequency,
    })
  }

  /* =========================================
     SYNC ENABLED
  ========================================= */

  function updateSyncEnabled(
    enabled: boolean
  ) {
    setError('')
    setMessage('')

    updateBackupSettings({
      ...backupSettings,

      syncEnabled:
        enabled,
    })
  }

  /* =========================================
     EXPORT BACKUP
  ========================================= */

  function exportBackup() {
    setError('')
    setMessage('')

    try {
      const data:
        Record<
          string,
          unknown
        > = {}

      backupKeys.forEach(
        (key) => {
          const value =
            localStorage.getItem(
              key
            )

          if (
            value === null
          ) {
            return
          }

          try {
            data[key] =
              JSON.parse(
                value
              )
          } catch {
            /*
              Keep support for any
              future string-based
              storage value.
            */

            data[key] =
              value
          }
        }
      )

      const backup:
        BackupFile = {
          app:
            'RK BillPro',

          version:
            1,

          exportedAt:
            new Date()
              .toISOString(),

          data,
        }

      const json =
        JSON.stringify(
          backup,
          null,
          2
        )

      const blob =
        new Blob(
          [json],
          {
            type:
              'application/json',
          }
        )

      const url =
        URL.createObjectURL(
          blob
        )

      const link =
        document.createElement(
          'a'
        )

      const date =
        new Date()
          .toISOString()
          .slice(
            0,
            10
          )

      link.href =
        url

      link.download =
        `rk-billpro-backup-${date}.json`

      document.body.appendChild(
        link
      )

      link.click()

      link.remove()

      URL.revokeObjectURL(
        url
      )

      markBackupComplete()

      setMessage(
        'RK BillPro local backup exported successfully.'
      )
    } catch {
      setError(
        'Unable to export the backup.'
      )
    }
  }

  /* =========================================
     OPEN IMPORT
  ========================================= */

  function openImport() {
    setError('')
    setMessage('')

    fileInputRef.current
      ?.click()
  }

  /* =========================================
     IMPORT BACKUP
  ========================================= */

  async function handleImport(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target
        .files?.[0]

    /*
      Reset the input immediately.

      This allows the same backup
      file to be selected again
      later if required.
    */

    event.target.value =
      ''

    if (!file) {
      return
    }

    setError('')
    setMessage('')

    try {
      /* =====================================
         BASIC FILE TYPE CHECK
      ====================================== */

      if (
        !file.name
          .toLowerCase()
          .endsWith('.json')
      ) {
        throw new Error(
          'Please select an RK BillPro JSON backup file.'
        )
      }

      const text =
        await file.text()

      const parsed:
        unknown =
          JSON.parse(text)

      /* =====================================
         ROOT VALIDATION
      ====================================== */

      if (
        typeof parsed !==
          'object' ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        throw new Error(
          'Invalid RK BillPro backup file.'
        )
      }

      const backup =
        parsed as Partial<
          BackupFile
        >

      /* =====================================
         APPLICATION VALIDATION
      ====================================== */

      if (
        backup.app !==
          'RK BillPro'
      ) {
        throw new Error(
          'This file is not an RK BillPro backup.'
        )
      }

      /* =====================================
         VERSION VALIDATION
      ====================================== */

      if (
        backup.version !==
          1
      ) {
        throw new Error(
          'This RK BillPro backup version is not supported.'
        )
      }

      /* =====================================
         DATA VALIDATION
      ====================================== */

      if (
        typeof backup.data !==
          'object' ||
        backup.data === null ||
        Array.isArray(
          backup.data
        )
      ) {
        throw new Error(
          'The backup file does not contain valid RK BillPro data.'
        )
      }

      const backupData =
        backup.data as
          Record<
            string,
            unknown
          >

      /* =====================================
         ALLOW ONLY KNOWN KEYS

         This also prevents older backup
         files from restoring temporary
         connection or pending queue state.
      ====================================== */

      const allowedData:
        Record<
          string,
          unknown
        > = {}

      backupKeys.forEach(
        (key) => {
          if (
            Object.prototype
              .hasOwnProperty
              .call(
                backupData,
                key
              )
          ) {
            allowedData[key] =
              backupData[key]
          }
        }
      )

      if (
        Object.keys(
          allowedData
        ).length ===
        0
      ) {
        throw new Error(
          'No supported RK BillPro data was found in this backup.'
        )
      }

      /* =====================================
         RESTORE CONFIRMATION
      ====================================== */

      const confirmed =
        window.confirm(
          'Restore this RK BillPro backup?\n\nCurrent local data for the included business sections will be replaced.\n\nYour current online/offline connection mode and pending sync queue will not be changed.\n\nIt is recommended to export your current data before restoring.'
        )

      if (!confirmed) {
        return
      }

      setRestoring(true)

      /* =====================================
         RESTORE
      ====================================== */

      Object.entries(
        allowedData
      ).forEach(
        ([
          key,
          value,
        ]) => {
          localStorage.setItem(
            key,
            JSON.stringify(
              value
            )
          )
        }
      )

      /*
        Context providers currently
        contain the old in-memory data.

        Reloading causes every provider
        to read the restored localStorage
        data again.
      */

      window.setTimeout(
        () => {
          window.location.href =
            '/settings/backup'
        },
        500
      )
    } catch (
      importError
    ) {
      setRestoring(false)

      setError(
        importError instanceof
          Error
          ? importError.message
          : 'Unable to restore the backup.'
      )
    }
  }

  /* =========================================
     MANUAL SYNC
  ========================================= */

  async function handleSync() {
    setError('')
    setMessage('')

    if (
      connectionStatus ===
        'Offline'
    ) {
      setError(
        'RK BillPro is offline. Go online before synchronizing.'
      )

      return
    }

    if (
      !backupSettings
        .syncEnabled
    ) {
      setError(
        'Synchronization simulation is disabled.'
      )

      return
    }

    if (
      syncStatus ===
        'Syncing'
    ) {
      return
    }

    const countBeforeSync =
      pendingChanges

    await simulateSync()

    if (
      countBeforeSync >
      0
    ) {
      setMessage(
        `${countBeforeSync} pending ${
          countBeforeSync === 1
            ? 'change'
            : 'changes'
        } synchronized successfully.`
      )

      return
    }

    setMessage(
      'RK BillPro is already synchronized.'
    )
  }

  /* =========================================
     CONNECTION LABEL
  ========================================= */

  function getConnectionLabel() {
    if (
      connectionStatus ===
        'Offline'
    ) {
      return 'Offline'
    }

    return 'Online'
  }

  /* =========================================
     SYNC DESCRIPTION
  ========================================= */

  function getSyncDescription() {
    if (
      connectionStatus ===
        'Offline'
    ) {
      if (
        pendingChanges >
        0
      ) {
        return `${pendingChanges} ${
          pendingChanges === 1
            ? 'change'
            : 'changes'
        } waiting for sync`
      }

      return 'Billing can continue locally'
    }

    if (
      !backupSettings
        .syncEnabled
    ) {
      return 'Synchronization is disabled'
    }

    if (
      syncStatus ===
        'Syncing'
    ) {
      return 'Synchronizing local demo data'
    }

    if (
      pendingChanges >
      0
    ) {
      return `${pendingChanges} pending ${
        pendingChanges === 1
          ? 'change'
          : 'changes'
      }`
    }

    return 'Demo data is synchronized'
  }

  /* =========================================
     SYNC BUTTON LABEL
  ========================================= */

  function getSyncButtonLabel() {
    if (
      syncStatus ===
        'Syncing'
    ) {
      return 'Syncing...'
    }

    if (
      connectionStatus ===
        'Offline'
    ) {
      return 'Offline'
    }

    if (
      pendingChanges >
      0
    ) {
      return `Sync ${pendingChanges} ${
        pendingChanges === 1
          ? 'Change'
          : 'Changes'
      }`
    }

    return 'Sync Now'
  }

  /* =========================================
     SYNC STATUS ICON
  ========================================= */

  function renderSyncIcon() {
    if (
      syncStatus ===
        'Syncing'
    ) {
      return (
        <RefreshCw
          size={22}
          className="sync-spin"
        />
      )
    }

    if (
      connectionStatus ===
        'Offline'
    ) {
      return (
        <WifiOff
          size={22}
        />
      )
    }

    if (
      pendingChanges >
      0
    ) {
      return (
        <RefreshCw
          size={22}
        />
      )
    }

    return (
      <CloudCheck
        size={22}
      />
    )
  }

  /* =========================================
     PAGE
  ========================================= */

  return (
    <div className="backup-settings-page">

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

      <div className="page-header">

        <div>

          <h1>
            Backup & Sync
          </h1>

          <p>
            Protect RK BillPro local
            demo data and manage the
            offline-to-online
            synchronization experience.
          </p>

        </div>

      </div>

      {/* =====================================
          STATUS CARDS
      ====================================== */}

      <div className="backup-status-grid">

        {/* LOCAL DATA */}

        <div className="backup-status-card">

          <div className="backup-status-icon">

            <HardDrive
              size={22}
            />

          </div>

          <div>

            <span>
              Local Data
            </span>

            <strong>
              Available
            </strong>

            <small>
              Stored in this browser
            </small>

          </div>

        </div>

        {/* CONNECTION */}

        <div className="backup-status-card">

          <div className="backup-status-icon">

            {connectionStatus ===
            'Online' ? (

              <Wifi
                size={22}
              />

            ) : (

              <WifiOff
                size={22}
              />

            )}

          </div>

          <div>

            <span>
              Connection
            </span>

            <strong>
              {getConnectionLabel()}
            </strong>

            <small>
              {connectionStatus ===
              'Offline'
                ? 'Local demo mode'
                : 'Online demo mode'}
            </small>

          </div>

        </div>

        {/* SYNC STATUS */}

        <div className="backup-status-card">

          <div className="backup-status-icon">

            {renderSyncIcon()}

          </div>

          <div>

            <span>
              Sync Status
            </span>

            <strong>
              {connectionStatus ===
              'Offline'
                ? 'Offline'
                : syncStatus}
            </strong>

            <small>
              {getSyncDescription()}
            </small>

          </div>

        </div>

        {/* PENDING */}

        <div className="backup-status-card">

          <div className="backup-status-icon">

            <Database
              size={22}
            />

          </div>

          <div>

            <span>
              Pending Changes
            </span>

            <strong>
              {pendingChanges}
            </strong>

            <small>
              {pendingChanges === 0
                ? 'Nothing waiting'
                : 'Waiting for sync'}
            </small>

          </div>

        </div>

      </div>

      {/* =====================================
          MAIN GRID
      ====================================== */}

      <div className="backup-settings-grid">

        <div className="backup-settings-main">

          {/* =================================
              LOCAL BACKUP
          ================================== */}

          <section className="settings-section-card">

            <div className="settings-section-heading">

              <div className="settings-section-icon">

                <HardDrive
                  size={20}
                />

              </div>

              <div>

                <h3>
                  Local Backup
                </h3>

                <p>
                  Export or restore
                  supported RK BillPro
                  business data using a
                  local JSON backup file.
                </p>

              </div>

            </div>

            {/* EXPORT */}

            <div className="backup-action-row">

              <div>

                <strong>
                  Export Backup
                </strong>

                <p>
                  Export products,
                  sales, purchases,
                  customers, suppliers,
                  expenses, users,
                  branches and supported
                  application settings.
                </p>

              </div>

              <button
                type="button"
                className="primary-button"
                onClick={
                  exportBackup
                }
              >
                <Download
                  size={17}
                />

                Export Backup
              </button>

            </div>

            {/* IMPORT */}

            <div className="backup-action-row">

              <div>

                <strong>
                  Restore Backup
                </strong>

                <p>
                  Restore supported
                  business data from a
                  previously exported
                  RK BillPro JSON file.
                </p>

              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={
                  openImport
                }
                disabled={
                  restoring
                }
              >
                <Upload
                  size={17}
                />

                {restoring
                  ? 'Restoring...'
                  : 'Import Backup'}
              </button>

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept=".json,application/json"
                hidden
                onChange={
                  handleImport
                }
              />

            </div>

            {/* IMPORTANT NOTE */}

            <div className="backup-warning">

              <AlertTriangle
                size={18}
              />

              <p>
                Restoring a backup can
                replace current local
                business data contained
                in that backup. Export
                the current data first
                if you want to preserve
                it.
              </p>

            </div>

            {/* RUNTIME NOTE */}

            <div className="backup-runtime-note">

              <ShieldCheck
                size={17}
              />

              <div>

                <strong>
                  Runtime state is protected
                </strong>

                <p>
                  Your current online/offline
                  connection mode and pending
                  synchronization queue are
                  not included in business
                  backup files.
                </p>

              </div>

            </div>

          </section>

          {/* =================================
              AUTOMATIC BACKUP
          ================================== */}

          <section className="settings-section-card">

            <div className="settings-section-heading">

              <div className="settings-section-icon">

                <ShieldCheck
                  size={20}
                />

              </div>

              <div>

                <h3>
                  Automatic Backup
                </h3>

                <p>
                  Configure the preferred
                  automatic backup schedule
                  for RK BillPro.
                </p>

              </div>

            </div>

            <div className="settings-toggle-row">

              <div>

                <strong>
                  Auto Backup
                </strong>

                <p>
                  Save your preferred
                  automatic backup
                  schedule.
                </p>

              </div>

              <label className="settings-switch">

                <input
                  type="checkbox"
                  checked={
                    backupSettings
                      .autoBackup
                  }
                  onChange={(
                    event
                  ) =>
                    updateAutoBackup(
                      event.target
                        .checked
                    )
                  }
                />

                <span />

              </label>

            </div>

            <div className="backup-field">

              <label>
                Backup Frequency
              </label>

              <select
                value={
                  backupSettings
                    .backupFrequency
                }
                disabled={
                  !backupSettings
                    .autoBackup
                }
                onChange={(
                  event
                ) =>
                  updateFrequency(
                    event.target
                      .value as
                      BackupFrequency
                  )
                }
              >

                <option value="Every 6 Hours">
                  Every 6 Hours
                </option>

                <option value="Daily">
                  Daily
                </option>

                <option value="Weekly">
                  Weekly
                </option>

              </select>

            </div>

            <div className="backup-action-row">

              <div>

                <strong>
                  Last Local Backup
                </strong>

                <p>
                  Most recent manual
                  backup exported from
                  this browser.
                </p>

              </div>

              <div className="backup-date-value">

                <Clock3
                  size={16}
                />

                <span>
                  {formatDate(
                    backupSettings
                      .lastBackupAt
                  )}
                </span>

              </div>

            </div>

            <p className="settings-helper-text">
              Automatic backup is a saved
              preference in this frontend
              demo. A future desktop or
              backend version could execute
              scheduled backups automatically.
            </p>

          </section>

          {/* =================================
              CLOUD SYNC
          ================================== */}

          <section className="settings-section-card">

            <div className="settings-section-heading">

              <div className="settings-section-icon">

                <Cloud
                  size={20}
                />

              </div>

              <div>

                <h3>
                  Cloud Sync
                </h3>

                <p>
                  Manage the RK BillPro
                  offline-to-online
                  synchronization demo.
                </p>

              </div>

            </div>

            {/* ENABLE SYNC */}

            <div className="settings-toggle-row">

              <div>

                <strong>
                  Enable Sync
                </strong>

                <p>
                  Allow pending local
                  operations to use the
                  synchronization demo.
                </p>

              </div>

              <label className="settings-switch">

                <input
                  type="checkbox"
                  checked={
                    backupSettings
                      .syncEnabled
                  }
                  onChange={(
                    event
                  ) =>
                    updateSyncEnabled(
                      event.target
                        .checked
                    )
                  }
                />

                <span />

              </label>

            </div>

            {/* FLOW */}

            <div className="backup-sync-flow">

              <div className="backup-sync-flow-item">

                <div className="backup-sync-flow-icon">
                  <HardDrive
                    size={18}
                  />
                </div>

                <strong>
                  Local Data
                </strong>

                <span>
                  Work normally
                </span>

              </div>

              <div className="backup-sync-flow-arrow">
                →
              </div>

              <div className="backup-sync-flow-item">

                <div className="backup-sync-flow-icon">
                  <Database
                    size={18}
                  />
                </div>

                <strong>
                  Pending Queue
                </strong>

                <span>
                  {pendingChanges}{' '}
                  waiting
                </span>

              </div>

              <div className="backup-sync-flow-arrow">
                →
              </div>

              <div className="backup-sync-flow-item">

                <div className="backup-sync-flow-icon">
                  <RefreshCw
                    size={18}
                    className={
                      syncStatus ===
                      'Syncing'
                        ? 'sync-spin'
                        : ''
                    }
                  />
                </div>

                <strong>
                  Sync
                </strong>

                <span>
                  {syncStatus}
                </span>

              </div>

              <div className="backup-sync-flow-arrow">
                →
              </div>

              <div className="backup-sync-flow-item">

                <div className="backup-sync-flow-icon">
                  <CloudCheck
                    size={18}
                  />
                </div>

                <strong>
                  Up to Date
                </strong>

                <span>
                  Demo state
                </span>

              </div>

            </div>

            {/* SYNC PANEL */}

            <div className="backup-sync-panel">

              <div>

                <span>
                  Current Status
                </span>

                <strong>
                  {connectionStatus ===
                  'Offline'
                    ? 'Offline'
                    : syncStatus}
                </strong>

                <small>
                  Last sync:{' '}
                  {formatDate(
                    backupSettings
                      .lastSyncAt
                  )}
                </small>

              </div>

              <button
                type="button"
                className="primary-button"
                disabled={
                  !backupSettings
                    .syncEnabled ||
                  connectionStatus ===
                    'Offline' ||
                  syncStatus ===
                    'Syncing'
                }
                onClick={
                  handleSync
                }
              >

                <RefreshCw
                  size={17}
                  className={
                    syncStatus ===
                    'Syncing'
                      ? 'sync-spin'
                      : ''
                  }
                />

                {getSyncButtonLabel()}

              </button>

            </div>

            {/* OFFLINE INFO */}

            {connectionStatus ===
              'Offline' && (

              <div className="backup-offline-info">

                <WifiOff
                  size={18}
                />

                <div>

                  <strong>
                    RK BillPro is offline
                  </strong>

                  <p>
                    Billing and supported
                    local operations can
                    continue. Pending changes
                    can synchronize after
                    returning to online demo
                    mode.
                  </p>

                </div>

              </div>

            )}

            {/* SYNC DISABLED INFO */}

            {!backupSettings
              .syncEnabled && (

              <div className="backup-sync-disabled">

                <AlertTriangle
                  size={18}
                />

                <div>

                  <strong>
                    Synchronization disabled
                  </strong>

                  <p>
                    Pending offline operations
                    remain stored locally until
                    synchronization is enabled
                    again.
                  </p>

                </div>

              </div>

            )}

          </section>

          {/* =================================
              PENDING CHANGES
          ================================== */}

          <section className="settings-section-card">

            <div className="settings-section-heading">

              <div className="settings-section-icon">

                <ListChecks
                  size={20}
                />

              </div>

              <div>

                <h3>
                  Pending Changes

                  {pendingChanges >
                    0 && (

                    <span className="backup-heading-count">
                      {pendingChanges}
                    </span>

                  )}

                </h3>

                <p>
                  Local demo operations
                  waiting to be
                  synchronized.
                </p>

              </div>

            </div>

            {pendingItems.length ===
            0 ? (

              <div className="backup-empty-state">

                <CloudCheck
                  size={28}
                />

                <strong>
                  Everything is synced
                </strong>

                <p>
                  There are currently
                  no local changes
                  waiting for
                  synchronization.
                </p>

              </div>

            ) : (

              <div className="backup-pending-list">

                {pendingItems.map(
                  (item) => (

                    <div
                      key={
                        item.id
                      }
                      className="backup-pending-item"
                    >

                      <div className="backup-pending-icon">

                        <Database
                          size={16}
                        />

                      </div>

                      <div className="backup-pending-content">

                        <div className="backup-pending-title">

                          <strong>
                            {item.type}
                          </strong>

                          <span>
                            Pending
                          </span>

                        </div>

                        <p>
                          {item.description}
                        </p>

                        <small>
                          <Clock3
                            size={12}
                          />

                          {formatDate(
                            item.createdAt
                          )}
                        </small>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </div>

        {/* ===================================
            RIGHT INFORMATION CARD
        ==================================== */}

        <aside className="backup-info-card">

          <div className="backup-cloud-graphic">

            {connectionStatus ===
            'Online' ? (

              <Cloud
                size={35}
              />

            ) : (

              <WifiOff
                size={35}
              />

            )}

          </div>

          <h3>

            {connectionStatus ===
            'Online'
              ? pendingChanges >
                  0
                ? 'Changes Waiting'
                : 'Online & Ready'
              : 'Offline Billing'}

          </h3>

          <p>

            {connectionStatus ===
            'Online'
              ? pendingChanges >
                  0
                ? `${pendingChanges} local ${
                    pendingChanges === 1
                      ? 'change is'
                      : 'changes are'
                  } waiting to synchronize.`
                : 'RK BillPro is currently in online demo mode and the local synchronization queue is clear.'
              : 'RK BillPro is currently in offline demo mode. Billing and supported local operations can continue while changes wait for synchronization.'}

          </p>

          {/* FLOW */}

          <div className="backup-flow">

            <div>

              <span>
                1
              </span>

              <p>
                Work locally
              </p>

            </div>

            <div>

              <span>
                2
              </span>

              <p>
                Save pending changes
              </p>

            </div>

            <div>

              <span>
                3
              </span>

              <p>
                Return online
              </p>

            </div>

            <div>

              <span>
                4
              </span>

              <p>
                Synchronize
              </p>

            </div>

          </div>

          {/* STATUS SUMMARY */}

          <div className="backup-side-summary">

            <div>

              <span>
                Connection
              </span>

              <strong>
                {getConnectionLabel()}
              </strong>

            </div>

            <div>

              <span>
                Pending
              </span>

              <strong>
                {pendingChanges}
              </strong>

            </div>

            <div>

              <span>
                Last Sync
              </span>

              <strong>
                {formatDate(
                  backupSettings
                    .lastSyncAt
                )}
              </strong>

            </div>

          </div>

          {/* LOCAL BACKUP INFO */}

          <div className="backup-side-feature">

            <FileJson
              size={18}
            />

            <div>

              <strong>
                Local JSON Backup
              </strong>

              <span>
                Export and restore
                supported business data.
              </span>

            </div>

          </div>

          <div className="backup-side-feature">

            <CheckCircle2
              size={18}
            />

            <div>

              <strong>
                Offline Friendly
              </strong>

              <span>
                Supported operations continue
                while the demo is offline.
              </span>

            </div>

          </div>

          <div className="backup-side-feature">

            <Server
              size={18}
            />

            <div>

              <strong>
                Future Cloud Ready
              </strong>

              <span>
                A backend synchronization
                service can be connected
                in the production version.
              </span>

            </div>

          </div>

          {/* DEMO DISCLAIMER */}

          <div className="backup-demo-note">

            <strong>
              Demo Mode
            </strong>

            <br />

            Cloud synchronization is
            simulated in this frontend
            version. No RK BillPro data
            is currently uploaded to a
            real cloud server.

          </div>

        </aside>

      </div>

      {/* =====================================
          SUCCESS MESSAGE
      ====================================== */}

      {message && (

        <div className="backup-toast success">

          <CheckCircle2
            size={17}
          />

          <span>
            {message}
          </span>

        </div>

      )}

      {/* =====================================
          ERROR MESSAGE
      ====================================== */}

      {error && (

        <div className="backup-toast error">

          <AlertTriangle
            size={17}
          />

          <span>
            {error}
          </span>

        </div>

      )}

    </div>
  )
}