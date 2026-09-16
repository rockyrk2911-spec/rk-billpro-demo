import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Search,
  Bell,
  ChevronDown,
  Wifi,
  WifiOff,
  RefreshCw,
  MapPin,
  Cloud,
  CloudOff,
  Clock3,
  Database,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  useBranches,
} from '../context/BranchContext'

import {
  useSettings,
} from '../context/SettingsContext'

import {
  useBackup,
} from '../context/BackupContext'

export default function Topbar() {
  const navigate =
    useNavigate()

  const [
    connectionPanelOpen,
    setConnectionPanelOpen,
  ] = useState(false)

  const connectionPanelRef =
    useRef<HTMLDivElement | null>(
      null
    )

  /* =========================================
     BRANCH
  ========================================= */

  const {
    currentBranch,
  } = useBranches()

  /* =========================================
     BUSINESS SETTINGS
  ========================================= */

  const {
    businessProfile,
  } = useSettings()

  /* =========================================
     CONNECTION / SYNC
  ========================================= */

  const {
    backupSettings,
    connectionStatus,
    syncStatus,
    pendingChanges,
    pendingItems,
    goOnline,
    goOffline,
    simulateSync,
  } = useBackup()

  /* =========================================
     OWNER INITIALS
  ========================================= */

  const ownerInitials =
    businessProfile
      .ownerName
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
     OWNER NAME
  ========================================= */

  const ownerName =
    businessProfile
      .ownerName
      .trim() ||
    'Owner'

  /* =========================================
     BRANCH
  ========================================= */

  const branchName =
    currentBranch?.name ??
    'Select Branch'

  const branchLocation =
    currentBranch
      ?.city
      ?.trim() ||
    ''

  /* =========================================
     CONNECTION CLASS
  ========================================= */

  const connectionClass =
    connectionStatus ===
    'Offline'
      ? 'offline'
      : syncStatus ===
          'Syncing'
        ? 'syncing'
        : syncStatus ===
            'Pending'
          ? 'pending'
          : 'online'

  /* =========================================
     CONNECTION LABEL
  ========================================= */

  function getConnectionLabel() {
    if (
      connectionStatus ===
      'Offline'
    ) {
      if (
        pendingChanges > 0
      ) {
        return `Offline • ${pendingChanges} pending`
      }

      return 'Offline • Billing continues'
    }

    if (
      syncStatus ===
      'Syncing'
    ) {
      return 'Syncing...'
    }

    if (
      pendingChanges > 0
    ) {
      return `Online • ${pendingChanges} pending`
    }

    return 'Online • Synced'
  }

  /* =========================================
     FORMAT LAST SYNC
  ========================================= */

  function formatLastSync() {
    if (
      !backupSettings
        .lastSyncAt
    ) {
      return 'Not synced yet'
    }

    const date =
      new Date(
        backupSettings
          .lastSyncAt
      )

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return 'Not available'
    }

    return date.toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  /* =========================================
     PENDING TYPE COUNTS
  ========================================= */

  const pendingTypeCounts =
    pendingItems.reduce<
      Record<string, number>
    >(
      (
        counts,
        item
      ) => {
        counts[item.type] =
          (
            counts[
              item.type
            ] ?? 0
          ) + 1

        return counts
      },
      {}
    )

  /* =========================================
     CLOSE PANEL ON OUTSIDE CLICK
  ========================================= */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        !connectionPanelRef
          .current
      ) {
        return
      }

      if (
        !connectionPanelRef
          .current
          .contains(
            event.target as Node
          )
      ) {
        setConnectionPanelOpen(
          false
        )
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      )
    }
  }, [])

  /* =========================================
     WORK OFFLINE
  ========================================= */

  function handleGoOffline() {
    if (
      syncStatus ===
      'Syncing'
    ) {
      return
    }

    goOffline()

    setConnectionPanelOpen(
      false
    )
  }

  /* =========================================
     GO ONLINE
  ========================================= */

  async function handleGoOnline() {
    if (
      syncStatus ===
      'Syncing'
    ) {
      return
    }

    await goOnline()
  }

  /* =========================================
     MANUAL SYNC
  ========================================= */

  async function handleSyncNow() {
    if (
      connectionStatus !==
        'Online' ||
      syncStatus ===
        'Syncing' ||
      !backupSettings
        .syncEnabled
    ) {
      return
    }

    await simulateSync()
  }

  return (
    <header className="topbar">

      {/* =====================================
          GLOBAL SEARCH
      ====================================== */}

      <div className="topbar-search">

        <Search
          size={19}
        />

        <input
          type="text"
          placeholder="Search products, invoices, customers..."
          aria-label="Global search"
        />

      </div>

      {/* =====================================
          RIGHT ACTIONS
      ====================================== */}

      <div className="topbar-actions">

        {/* ===================================
            CURRENT BRANCH
        ==================================== */}

        <button
          type="button"
          className="branch-selector"
          onClick={() =>
            navigate(
              '/settings/branches'
            )
          }
          title="Manage branches"
        >

          <MapPin
            size={15}
            className="topbar-branch-icon"
          />

          <div className="topbar-branch-content">

            <span className="branch-label">
              Branch
            </span>

            <strong>
              {branchName}
            </strong>

            {branchLocation && (
              <small>
                {branchLocation}
              </small>
            )}

          </div>

          <ChevronDown
            size={16}
          />

        </button>

        {/* ===================================
            CONNECTION
        ==================================== */}

        <div
          className="topbar-connection-wrapper"
          ref={
            connectionPanelRef
          }
        >

          <button
            type="button"
            className={`topbar-connection ${connectionClass}`}
            onClick={() =>
              setConnectionPanelOpen(
                (current) =>
                  !current
              )
            }
            aria-expanded={
              connectionPanelOpen
            }
            aria-label="Open connection status"
            title="Connection and synchronization"
          >

            {connectionStatus ===
            'Offline' ? (

              <WifiOff
                size={16}
              />

            ) : syncStatus ===
              'Syncing' ? (

              <RefreshCw
                size={16}
                className="sync-spin"
              />

            ) : (

              <Wifi
                size={16}
              />

            )}

            <span>
              {getConnectionLabel()}
            </span>

            <ChevronDown
              size={14}
              className={
                connectionPanelOpen
                  ? 'connection-chevron open'
                  : 'connection-chevron'
              }
            />

          </button>

          {/* =================================
              CONNECTION POPUP
          ================================== */}

          {connectionPanelOpen && (

            <div className="connection-panel">

              {/* HEADER */}

              <div className="connection-panel-header">

                <div>

                  <span className="connection-panel-eyebrow">
                    RK BillPro
                  </span>

                  <h3>
                    Connection Status
                  </h3>

                </div>

                <button
                  type="button"
                  className="connection-panel-close"
                  onClick={() =>
                    setConnectionPanelOpen(
                      false
                    )
                  }
                  aria-label="Close connection panel"
                >
                  <X
                    size={18}
                  />
                </button>

              </div>

              {/* STATUS */}

              <div
                className={`connection-status-card ${connectionClass}`}
              >

                <div className="connection-status-icon">

                  {connectionStatus ===
                  'Offline' ? (

                    <CloudOff
                      size={22}
                    />

                  ) : syncStatus ===
                    'Syncing' ? (

                    <RefreshCw
                      size={22}
                      className="sync-spin"
                    />

                  ) : syncStatus ===
                    'Pending' ? (

                    <AlertCircle
                      size={22}
                    />

                  ) : (

                    <CheckCircle2
                      size={22}
                    />

                  )}

                </div>

                <div className="connection-status-copy">

                  <strong>

                    {connectionStatus ===
                    'Offline'
                      ? 'Working Offline'
                      : syncStatus ===
                          'Syncing'
                        ? 'Synchronizing'
                        : syncStatus ===
                            'Pending'
                          ? 'Sync Pending'
                          : 'Online & Synced'}

                  </strong>

                  <span>

                    {connectionStatus ===
                    'Offline'
                      ? 'Billing and local operations continue normally.'
                      : syncStatus ===
                          'Syncing'
                        ? `${pendingChanges} ${
                            pendingChanges ===
                            1
                              ? 'change is'
                              : 'changes are'
                          } being synchronized.`
                        : syncStatus ===
                            'Pending'
                          ? 'Local changes are waiting to synchronize.'
                          : 'All local data is up to date.'}

                  </span>

                </div>

              </div>

              {/* INFORMATION */}

              <div className="connection-info-grid">

                <div className="connection-info-item">

                  <div className="connection-info-icon">
                    <Database
                      size={17}
                    />
                  </div>

                  <div>
                    <span>
                      Pending Changes
                    </span>

                    <strong>
                      {pendingChanges}
                    </strong>
                  </div>

                </div>

                <div className="connection-info-item">

                  <div className="connection-info-icon">
                    <Clock3
                      size={17}
                    />
                  </div>

                  <div>
                    <span>
                      Last Sync
                    </span>

                    <strong>
                      {formatLastSync()}
                    </strong>
                  </div>

                </div>

              </div>

              {/* PENDING SUMMARY */}

              {pendingChanges >
                0 && (

                <div className="connection-pending-summary">

                  <div className="connection-section-title">

                    <span>
                      Pending Operations
                    </span>

                    <strong>
                      {pendingChanges}
                    </strong>

                  </div>

                  <div className="connection-pending-types">

                    {Object.entries(
                      pendingTypeCounts
                    ).map(
                      ([
                        type,
                        count,
                      ]) => (

                        <div
                          className="connection-pending-type"
                          key={
                            type
                          }
                        >

                          <span>
                            {type}
                          </span>

                          <strong>
                            {count}
                          </strong>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

              {/* SYNC DISABLED */}

              {!backupSettings
                .syncEnabled && (

                <div className="connection-sync-warning">

                  <AlertCircle
                    size={17}
                  />

                  <span>
                    Cloud sync is disabled in Backup & Sync settings.
                  </span>

                </div>

              )}

              {/* ACTIONS */}

              <div className="connection-panel-actions">

                {connectionStatus ===
                'Offline' ? (

                  <button
                    type="button"
                    className="connection-primary-button"
                    onClick={
                      handleGoOnline
                    }
                    disabled={
                      syncStatus ===
                      'Syncing'
                    }
                  >

                    {syncStatus ===
                    'Syncing' ? (

                      <RefreshCw
                        size={17}
                        className="sync-spin"
                      />

                    ) : (

                      <Cloud
                        size={17}
                      />

                    )}

                    {pendingChanges >
                    0
                      ? 'Go Online & Sync'
                      : 'Go Online'}

                  </button>

                ) : (

                  <>
                    {pendingChanges >
                      0 && (

                      <button
                        type="button"
                        className="connection-primary-button"
                        onClick={
                          handleSyncNow
                        }
                        disabled={
                          syncStatus ===
                            'Syncing' ||
                          !backupSettings
                            .syncEnabled
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

                        {syncStatus ===
                        'Syncing'
                          ? 'Syncing...'
                          : 'Sync Now'}

                      </button>

                    )}

                    <button
                      type="button"
                      className="connection-secondary-button"
                      onClick={
                        handleGoOffline
                      }
                      disabled={
                        syncStatus ===
                        'Syncing'
                      }
                    >

                      <WifiOff
                        size={17}
                      />

                      Work Offline

                    </button>

                  </>

                )}

              </div>

              {/* SETTINGS */}

              <button
                type="button"
                className="connection-settings-link"
                onClick={() => {
                  setConnectionPanelOpen(
                    false
                  )

                  navigate(
                    '/settings/backup'
                  )
                }}
              >
                Manage Backup & Sync
              </button>

            </div>

          )}

        </div>

        {/* ===================================
            NOTIFICATIONS
        ==================================== */}

        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
          title="Notifications"
        >

          <Bell
            size={20}
          />

          <span className="notification-dot" />

        </button>

        {/* ===================================
            USER PROFILE
        ==================================== */}

        <button
          type="button"
          className="user-profile"
          onClick={() =>
            navigate(
              '/settings/business'
            )
          }
          title="Business profile"
        >

          <div className="user-avatar">
            {ownerInitials}
          </div>

          <div className="user-info">

            <strong>
              {ownerName}
            </strong>

            <span>
              Owner
            </span>

          </div>

          <ChevronDown
            size={16}
          />

        </button>

      </div>

    </header>
  )
}