import {
  CustomErrors,
  FullValueTepRequestsResponse,
  RefundList,
  RefundListItem,
  tepApprovalListResponse
} from '@poss-web/shared/models';
import { TepApprovalEntity } from './tep-approval.entity';
export interface TepApprovalState {
  approvalist: TepApprovalEntity;
  totalCount: number;
  editableWorkflowDetails: tepApprovalListResponse;
  hasError?: CustomErrors;
  isLoading?: boolean;
  refundList: RefundList;
  editedRefundListItemResponse: RefundListItem;
  fullValueTepRequestsList: FullValueTepRequestsResponse;
  fvtApprovedDetails: any;
}
