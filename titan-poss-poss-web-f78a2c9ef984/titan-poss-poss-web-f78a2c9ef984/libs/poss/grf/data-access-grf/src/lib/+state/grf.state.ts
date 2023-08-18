import {
  AdvanceHistoryResponse,
  CreditNote,
  CustomErrors,
  FileUploadLists,
  FrozenCNs,
  HistorySearchParamDetails,
  InitiateAdvanceResponse,
  MergeCNResponse,
  RsoNameObject,
  UpdateAdvanceTransactionResponse
} from '@poss-web/shared/models';
import { CreditNoteEntity } from './grf.entity';

export class CtGrfState {
  errors?: CustomErrors;
  isLoading?: boolean;
  selectedRsoName: { value: string; description: string };
  totalAmt: number;
  initiateGrfResponse: InitiateAdvanceResponse;
  updateGrfResponse: UpdateAdvanceTransactionResponse;
  partiallyGrfResponse: any;
  goldWeight: number;
  rsoDetails: RsoNameObject[];
  remarks: string;
  viewGrfResponse: any;
  frozenCNs: FrozenCNs[];
  creditNote: CreditNoteEntity;
  anotherCustomerCN: CreditNote;
  mergeCNsResponse: MergeCNResponse;
  hasOtpGenerated: boolean;
  hasOtpValidated: boolean;
  grfHistoryItems: AdvanceHistoryResponse;
  historySearchParamDetails: HistorySearchParamDetails;
  orderNumber: { order: number; status: string };
  cnValidationDetails: any;
  uploadFileListResponse: FileUploadLists[];
  uploadFileResponse: boolean;
  downloadFileUrl: string;
}
