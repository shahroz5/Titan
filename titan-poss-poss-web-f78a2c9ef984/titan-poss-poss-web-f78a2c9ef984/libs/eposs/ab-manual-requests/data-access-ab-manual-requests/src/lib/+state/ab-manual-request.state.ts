import {
  ApprovalRequest,
  CashMemoDetailsResponse,
  CustomErrors,
  FileUploadLists,
  HistoryFiltersData
} from '@poss-web/shared/models';
import {
  AbManualRequestListEntity,
  ItemDetailsEntity
} from './ab-manual-request.entity';

export class AbManualRequestState {
  hasError?: CustomErrors;
  isLoading?: boolean;
  abManualRequestList: AbManualRequestListEntity;
  abManualRequestDetails: any;
  customerDetails: any;
  headerDetails: any;
  productList: any;
  productDetails: ItemDetailsEntity;
  abManualApprovalRequest: ApprovalRequest;
  updateCashMemoResponse: CashMemoDetailsResponse;
  advancedFilter: HistoryFiltersData;
  uploadFileListResponse: FileUploadLists[];
  downloadFileUrl: string;
}
