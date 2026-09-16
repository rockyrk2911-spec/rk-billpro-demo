export type BranchStatus =
  | 'Active'
  | 'Inactive'

export type Branch = {
  id: number
  name: string
  code: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
  gstin: string
  status: BranchStatus
  isCurrent: boolean
  createdAt: string
}

export type NewBranch = Omit<
  Branch,
  'id' | 'createdAt'
>