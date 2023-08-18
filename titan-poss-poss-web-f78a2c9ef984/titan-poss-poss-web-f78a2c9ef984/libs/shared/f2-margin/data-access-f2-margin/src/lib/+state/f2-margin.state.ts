import { CustomErrors, F2MarginList } from '@poss-web/shared/models';

export interface F2MarginState {
  f2MarginList: F2MarginList[];
  error: CustomErrors;
  isLoading: boolean;
  totalElements: number;
}
