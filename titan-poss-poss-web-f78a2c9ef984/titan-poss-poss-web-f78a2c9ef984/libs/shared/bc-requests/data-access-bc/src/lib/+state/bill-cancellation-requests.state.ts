import {
  BillDetailsEntity,
  BillStatusEntity,
  ItemDetailsEntity
} from './bill-cancellation-requests.entity';
import { CashMemoDetailsResponse, CustomErrors } from '@poss-web/shared/models';

export interface BillCancellationRequestsState {
  billCancellationRequests: BillDetailsEntity;
  billancellationRequestsDetail: any;
  billCancellationRequestsCount: any;
  hasError?: CustomErrors;
  isLoading?: boolean;
  locations: any[];
  billCancelStatus: BillStatusEntity;
  billStatusCount: number;
  advancedFilter: string;
  productDetails: ItemDetailsEntity;
  viewCashMemoResponse: CashMemoDetailsResponse;
  selectedData: any;
  deleteResponse: any;
  confirmResponse: any;
  cancelResponse: any;
  cancelType: string[];
  errorWhileCancellingBill: boolean;
}
