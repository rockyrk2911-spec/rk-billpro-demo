import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  ArrowLeft,
  Store,
  Plus,
  Search,
  MapPin,
  Phone,
  CheckCircle2,
  Building2,
} from 'lucide-react'

import {
  useBranches,
} from '../context/BranchContext'

export default function BranchesSettings() {
  const navigate =
    useNavigate()

  const {
    branches,
    currentBranch,
    setCurrentBranch,
  } = useBranches()

  const [
    search,
    setSearch,
  ] =
    useState('')

  const filteredBranches =
    useMemo(() => {
      const searchText =
        search
          .trim()
          .toLowerCase()

      if (!searchText) {
        return branches
      }

      return branches.filter(
        (branch) =>
          branch.name
            .toLowerCase()
            .includes(
              searchText
            ) ||
          branch.code
            .toLowerCase()
            .includes(
              searchText
            ) ||
          branch.city
            .toLowerCase()
            .includes(
              searchText
            ) ||
          branch.phone
            .toLowerCase()
            .includes(
              searchText
            )
      )
    }, [
      branches,
      search,
    ])

  const activeCount =
    branches.filter(
      (branch) =>
        branch.status ===
        'Active'
    ).length

  const inactiveCount =
    branches.filter(
      (branch) =>
        branch.status ===
        'Inactive'
    ).length

  return (
    <div className="branches-settings-page">

      {/* HEADER */}

      <div className="settings-detail-header">

        <div>

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

          <div className="page-header">

            <div>

              <h1>
                Branches
              </h1>

              <p>
                Manage business stores,
                branches and locations.
              </p>

            </div>

          </div>

        </div>

        <button
          type="button"
          className="branch-add-button"
          onClick={() =>
            navigate(
              '/settings/branches/add'
            )
          }
        >

          <Plus
            size={17}
          />

          Add Branch

        </button>

      </div>

      {/* CURRENT BRANCH */}

      <div className="current-branch-card">

        <div className="current-branch-icon">

          <Store
            size={23}
          />

        </div>

        <div>

          <span>
            CURRENT BRANCH
          </span>

          <h2>
            {currentBranch?.name ??
              'No Current Branch'}
          </h2>

          <p>
            {currentBranch
              ? `${currentBranch.city}, ${currentBranch.state}`
              : 'Select an active branch'}
          </p>

        </div>

        {currentBranch && (

          <div className="current-branch-badge">

            <CheckCircle2
              size={14}
            />

            Active Branch

          </div>

        )}

      </div>

      {/* SUMMARY */}

      <div className="branch-summary-grid">

        <div className="branch-summary-card">

          <Building2
            size={20}
          />

          <div>

            <span>
              Total Branches
            </span>

            <strong>
              {branches.length}
            </strong>

          </div>

        </div>

        <div className="branch-summary-card">

          <CheckCircle2
            size={20}
          />

          <div>

            <span>
              Active
            </span>

            <strong>
              {activeCount}
            </strong>

          </div>

        </div>

        <div className="branch-summary-card">

          <Store
            size={20}
          />

          <div>

            <span>
              Inactive
            </span>

            <strong>
              {inactiveCount}
            </strong>

          </div>

        </div>

      </div>

      {/* BRANCH LIST */}

      <div className="branch-list-card">

        <div className="branch-list-header">

          <div>

            <h3>
              Business Branches
            </h3>

            <p>
              Select which branch is
              currently being used.
            </p>

          </div>

          <div className="branch-search">

            <Search
              size={17}
            />

            <input
              type="text"
              placeholder="Search branches..."
              value={search}
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </div>

        </div>

        <div className="branch-list">

          {filteredBranches.map(
            (branch) => (

              <div
                key={
                  branch.id
                }
                className={
                  branch.isCurrent
                    ? 'branch-item current'
                    : 'branch-item'
                }
              >

                <div className="branch-item-icon">

                  <Store
                    size={20}
                  />

                </div>

                <div className="branch-item-main">

                  <div className="branch-item-title">

                    <div>

                      <h3>
                        {
                          branch.name
                        }
                      </h3>

                      <span>
                        {
                          branch.code
                        }
                      </span>

                    </div>

                    <span
                      className={
                        branch.status ===
                        'Active'
                          ? 'branch-status active'
                          : 'branch-status inactive'
                      }
                    >

                      {
                        branch.status
                      }

                    </span>

                  </div>

                  <div className="branch-item-details">

                    <span>

                      <MapPin
                        size={13}
                      />

                      {
                        branch.city ||
                        'No city'
                      }

                      {branch.state
                        ? `, ${branch.state}`
                        : ''}

                    </span>

                    <span>

                      <Phone
                        size={13}
                      />

                      {
                        branch.phone ||
                        'No phone'
                      }

                    </span>

                  </div>

                </div>

                <div className="branch-item-actions">

                  {branch.isCurrent ? (

                    <span className="branch-current-label">

                      <CheckCircle2
                        size={14}
                      />

                      Current

                    </span>

                  ) : (

                    <button
                      type="button"
                      className="branch-current-button"
                      disabled={
                        branch.status !==
                        'Active'
                      }
                      onClick={() =>
                        setCurrentBranch(
                          branch.id
                        )
                      }
                    >

                      Set Current

                    </button>

                  )}

                </div>

              </div>

            )
          )}

          {filteredBranches.length ===
            0 && (

            <div className="branch-empty-state">

              <Store
                size={38}
              />

              <h3>
                No branches found
              </h3>

              <p>
                Try another search or
                add a new branch.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}