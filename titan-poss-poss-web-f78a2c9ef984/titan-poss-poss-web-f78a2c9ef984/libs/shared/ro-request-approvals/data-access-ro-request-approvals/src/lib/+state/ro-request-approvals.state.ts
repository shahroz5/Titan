import {
  CustomErrors,
  RoRequestApprovalListResponse,
  BoutiqueRoRequestApprovalList
} from '@poss-web/shared/models';
import { RequestListEntity } from './ro-request-approvals.entity';

export interface RoRequestApprovalState {
  pendingRoRequestList: RequestListEntity;
  approvedRoRequestList: RoRequestApprovalListResponse[];
  rejectedRoRequestList: RoRequestApprovalListResponse[];
  closedRoRequestList: RoRequestApprovalListResponse[];
  totalElements: number;
  isLoading: boolean;
  hasUpdated: boolean;
  error: CustomErrors;
  boutiqueRequestList: BoutiqueRoRequestApprovalList[];
}
