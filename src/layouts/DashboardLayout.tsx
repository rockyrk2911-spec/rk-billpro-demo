import {
  Outlet,
} from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import OfflineBanner from '../components/OfflineBanner'
import SyncNotification from '../components/SyncNotification'

export default function DashboardLayout() {
  return (
    <div className="app-layout">

      <Sidebar />

      <div className="app-main">

        <Topbar />

        <OfflineBanner />

        <main className="page-content">
          <Outlet />
        </main>

      </div>

      <SyncNotification />

    </div>
  )
}