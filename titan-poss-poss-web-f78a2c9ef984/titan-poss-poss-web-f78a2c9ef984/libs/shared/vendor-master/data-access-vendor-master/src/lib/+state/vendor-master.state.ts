import { CustomErrors, VendorMaster } from '@poss-web/shared/models';

export interface VendorMasterState {
  vendorMasterList: VendorMaster[];
  vendorMaster: VendorMaster;
  isLoading: boolean;
  error: CustomErrors;

  totalElements: number;
}
