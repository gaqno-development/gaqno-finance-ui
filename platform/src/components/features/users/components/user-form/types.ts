import { IUserProfile } from '@gaqno-dev/core/types/user'

export interface IUserFormProps {
  user?: IUserProfile
  onSuccess?: () => void
  onCancel?: () => void
}

