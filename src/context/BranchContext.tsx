import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import type {
  Branch,
  NewBranch,
} from '../types/branch'

type BranchContextType = {
  branches: Branch[]
  currentBranch?: Branch
  addBranch: (
    branch: NewBranch
  ) => void
  updateBranch: (
    branch: Branch
  ) => void
  setCurrentBranch: (
    id: number
  ) => void
  getBranchById: (
    id: number
  ) => Branch | undefined
}

const BranchContext =
  createContext<
    BranchContextType | undefined
  >(undefined)

const defaultBranches:
  Branch[] = [
    {
      id: 1,
      name: 'Tambaram Branch',
      code: 'TAM-001',
      phone: '',
      email: '',
      address: '',
      city: 'Tambaram',
      state: 'Tamil Nadu',
      pincode: '',
      gstin: '',
      status: 'Active',
      isCurrent: true,
      createdAt:
        new Date().toISOString(),
    },
  ]

export function BranchProvider({
  children,
}: {
  children: ReactNode
}) {
  const [
    branches,
    setBranches,
  ] = useState<Branch[]>(
    () => {
      const saved =
        localStorage.getItem(
          'rk-billpro-branches'
        )

      if (saved) {
        try {
          const parsed:
            Branch[] =
              JSON.parse(saved)

          if (
            Array.isArray(parsed) &&
            parsed.length > 0
          ) {
            return parsed
          }
        } catch {
          return defaultBranches
        }
      }

      return defaultBranches
    }
  )

  useEffect(() => {
    localStorage.setItem(
      'rk-billpro-branches',
      JSON.stringify(branches)
    )
  }, [branches])

  const currentBranch =
    branches.find(
      (branch) =>
        branch.isCurrent
    ) ??
    branches.find(
      (branch) =>
        branch.status ===
        'Active'
    )

  function addBranch(
    branch: NewBranch
  ) {
    const newBranch:
      Branch = {
        ...branch,
        id: Date.now(),
        createdAt:
          new Date().toISOString(),
      }

    setBranches(
      (current) => {
        let updated =
          current

        if (
          newBranch.isCurrent
        ) {
          updated =
            current.map(
              (item) => ({
                ...item,
                isCurrent: false,
              })
            )
        }

        return [
          ...updated,
          newBranch,
        ]
      }
    )
  }

  function updateBranch(
    branch: Branch
  ) {
    setBranches(
      (current) => {
        let updated =
          current.map(
            (item) =>
              item.id ===
              branch.id
                ? branch
                : item
          )

        if (
          branch.isCurrent
        ) {
          updated =
            updated.map(
              (item) => ({
                ...item,
                isCurrent:
                  item.id ===
                  branch.id,
              })
            )
        }

        return updated
      }
    )
  }

  function setCurrentBranch(
    id: number
  ) {
    setBranches(
      (current) =>
        current.map(
          (branch) => ({
            ...branch,

            isCurrent:
              branch.id === id &&
              branch.status ===
                'Active',
          })
        )
    )
  }

  function getBranchById(
    id: number
  ) {
    return branches.find(
      (branch) =>
        branch.id === id
    )
  }

  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        addBranch,
        updateBranch,
        setCurrentBranch,
        getBranchById,
      }}
    >
      {children}
    </BranchContext.Provider>
  )
}

export function useBranches() {
  const context =
    useContext(
      BranchContext
    )

  if (!context) {
    throw new Error(
      'useBranches must be used inside BranchProvider'
    )
  }

  return context
}