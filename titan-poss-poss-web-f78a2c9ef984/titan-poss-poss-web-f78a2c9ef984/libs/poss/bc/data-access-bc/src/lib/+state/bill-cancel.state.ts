import {
  CustomErrors,
  CashMemoDetailsResponse,
  CmBillList,
  Lov,
  ConfirmResponse,
  CancelResponse,
  bcHistoryResponse,
  bcHistoryRequestPayload
} from '@poss-web/shared/models';
import { ItemDetailsEntity } from './bill-cancel.entity';

export interface BillCancelState {
  hasError?: CustomErrors;
  isLoading?: boolean;
  productDetails: ItemDetailsEntity;
  viewCashMemoResponse: CashMemoDetailsResponse;
  confirmResponse: ConfirmResponse;
  cancelResponse: CancelResponse;
  cmBillList: CmBillList[];
  reasonsForCancel: Lov[];
  rsoDetails: string[];
  cancelType: string[];
  historyList: bcHistoryResponse;
  bcHistoryRequestParams: bcHistoryRequestPayload;
  errorWhileCancellingBill: boolean;
}
