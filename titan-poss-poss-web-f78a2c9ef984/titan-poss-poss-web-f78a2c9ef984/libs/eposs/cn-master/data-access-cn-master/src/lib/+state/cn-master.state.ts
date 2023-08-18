import { CnMasterDetail, CustomErrors } from '@poss-web/shared/models';

export interface CreditNoteMasterState {
  creditNoteMasterlist: CnMasterDetail[];
  totalElements: number;
  isLoading: boolean;
  hasUpdated: boolean;
  error: CustomErrors;
  creditNoteMasterDetails: CnMasterDetail;
}
