import { CustomErrors } from '@poss-web/shared/models';

export interface ActivateUserState {
  generatedOtp: boolean;
  verifiedOtp: boolean;
  username: string;
  error: CustomErrors;
  isLoading: boolean;
}
