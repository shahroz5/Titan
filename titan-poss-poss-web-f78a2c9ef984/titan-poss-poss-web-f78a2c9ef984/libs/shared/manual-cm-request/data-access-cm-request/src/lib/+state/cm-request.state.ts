import {
  ApprovalRequest,
  CashMemoDetailsResponse,
  CmRequestDetails,
  CustomerInfo,
  CustomErrors,
  FileUploadLists,
  ManualBillDetails,
  StatusTypesEnum
} from '@poss-web/shared/models';
import { CmRequestListEntity, ItemDetailsEntity } from './cm-request.entity';

export class CmRequestState {
  hasError?: CustomErrors;
  isLoading?: boolean;
  cmRequestList: CmRequestListEntity;
  cmRequestDetails: CmRequestDetails;
  customerDetails: CustomerInfo;
  headerDetails: ManualBillDetails;
  productList: CashMemoDetailsResponse;
  productDetails: ItemDetailsEntity;
  cmApprovalRequest: ApprovalRequest;
  updateCashMemoResponse: CashMemoDetailsResponse;
  uploadFileListResponse: FileUploadLists[];
  downloadFileUrl: string;
  requestStausDropDownValues: StatusTypesEnum;
}
