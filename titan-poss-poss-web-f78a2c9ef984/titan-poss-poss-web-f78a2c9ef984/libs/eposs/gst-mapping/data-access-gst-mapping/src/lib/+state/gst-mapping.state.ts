import {
  GSTMappingDetails,
  CustomErrors,
  Tax,
  Lov
} from '@poss-web/shared/models';
export interface GSTMappingState {
  isLoading: boolean;
  totalElements: number;
  gstMappingList: GSTMappingDetails[];
  error: CustomErrors;
  txnTypes: Lov[];
  taxes: Tax[];

  reloadStatus: {
    reload: boolean;
    type: string;
  };
}
