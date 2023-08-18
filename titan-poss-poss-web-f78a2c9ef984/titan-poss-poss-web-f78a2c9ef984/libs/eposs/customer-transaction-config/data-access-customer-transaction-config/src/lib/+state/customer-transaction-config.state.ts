import {
  CustomErrors,
  CustomerTransactionConfig,
  CheckBoxHeader,
  CustomerConfigDetails
} from '@poss-web/shared/models';
export interface CustomerTransactionConfigState {
  error: CustomErrors;
  configList: CustomerTransactionConfig[];
  totalElements: number;
  isLoading: boolean;
  hasSearched: boolean;
  hasStatusUpdated: boolean;
  transactionTypes: CheckBoxHeader[];
  customers: CheckBoxHeader[];
  hasSaved: boolean;
  hasUpdated: boolean;
  configId: string;
  customerTranConfigDetails: CustomerConfigDetails;
}
