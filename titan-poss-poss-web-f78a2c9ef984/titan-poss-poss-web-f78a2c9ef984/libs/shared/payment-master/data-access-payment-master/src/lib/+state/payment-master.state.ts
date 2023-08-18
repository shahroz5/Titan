import { CustomErrors, PaymentMaster } from '@poss-web/shared/models';


export interface PaymentMasterState {
  paymentMasterList: PaymentMaster[];
  error: CustomErrors;
  isLoading: boolean;
  totalElements: number;
  paymentMaster: PaymentMaster;
  hasUpdated: boolean;
  hasSaved: boolean;

}
