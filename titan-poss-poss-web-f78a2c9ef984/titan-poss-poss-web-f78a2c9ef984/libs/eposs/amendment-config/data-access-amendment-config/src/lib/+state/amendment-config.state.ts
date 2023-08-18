import { CustomErrors } from '@poss-web/shared/models';

export interface AmendmentConfigState {
  amendmentConfigValue: number;
  error: CustomErrors;
  isLoading: boolean;
  hasUpdated: boolean
}
