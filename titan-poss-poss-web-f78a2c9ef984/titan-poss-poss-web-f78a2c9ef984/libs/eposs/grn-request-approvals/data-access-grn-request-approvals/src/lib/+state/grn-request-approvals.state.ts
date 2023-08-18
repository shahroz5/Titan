import { CustomErrors } from '@poss-web/shared/models';
import { GrnRequestListEntity } from './grn-request-approvals.entity';
export interface GrnRequestApprovalState {
  grnRequestList: GrnRequestListEntity;
  error: CustomErrors;
  hasSaved: boolean;
  totalElements: number;
  isLoading: boolean;
  hasUpdated: boolean;
}
