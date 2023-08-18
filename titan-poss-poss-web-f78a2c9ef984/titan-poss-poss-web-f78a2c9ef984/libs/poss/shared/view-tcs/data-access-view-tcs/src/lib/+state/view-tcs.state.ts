import { CustomErrors, TcsList } from '@poss-web/shared/models';

export interface ViewTcsState {
  error: CustomErrors;
  isLoading: boolean;
  tcsDetails: TcsList[];
}

export const viewTcsFetureKey = 'viewTcs';
