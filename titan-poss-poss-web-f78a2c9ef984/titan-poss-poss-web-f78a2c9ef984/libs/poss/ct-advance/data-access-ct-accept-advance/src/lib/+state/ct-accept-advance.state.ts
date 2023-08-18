import {
  AdvanceHistoryResponse,
  CustomErrors,
  HistorySearchParamDetails,
  InitiateAdvanceResponse,
  RsoNameObject,
  UpdateAdvanceTransactionResponse
} from '@poss-web/shared/models';

export class CtAcceptAdvanceState {
  errors?: CustomErrors;
  isLoading?: boolean;
  selectedRsoName: { value: string; description: string };
  totalAmt: number;
  initiateAdvanceResponse: InitiateAdvanceResponse;
  updateAdvanceResponse: UpdateAdvanceTransactionResponse;
  partiallyAdvanceResponse: any;
  rsoDetails: RsoNameObject[];
  remarks: string;
  viewAdvanceResponse: any;
  advanceHistoryItems: AdvanceHistoryResponse;
  historySearchParamDetails: HistorySearchParamDetails;
  orderNumber: { order: number; status: string };
  deleteAdvanceTransactionResponse: any;
}
