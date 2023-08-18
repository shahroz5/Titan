import { CustomErrors, CnList } from '@poss-web/shared/models';

export interface CnDirectState {
  cnList: CnList[];
  error: CustomErrors;
  isLoading: boolean;
  hasUpdated: boolean;
  totalElements: number;
}
