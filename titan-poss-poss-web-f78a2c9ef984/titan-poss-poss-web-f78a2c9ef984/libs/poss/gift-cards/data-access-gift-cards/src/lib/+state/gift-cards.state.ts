import {
  CancellableCashMemoData,
  CashMemoMinimalDetail,
  CustomErrors,
  GcCashMemoCancelResponse,
  GetAddedGiftCardItemResponse,
  GetCreatedGiftCardCmDetails,
  GetDeletedGiftCardItemResponse,
  GetGiftCardItemResponse,
  GetPartiallyUpdatedGcCmResponse,
  GetUpdatedGcCashMemoResponse,
  GiftCardItem,
  GiftCardsHistoryListItems,
  GiftCardsHistoryRequestPayload,
  QCGCCardDetails,
  RsoNameObject
} from '@poss-web/shared/models';

export class GiftCardsState {
  errors?: CustomErrors | null;
  isLoading?: boolean;
  selectedRSOName: { value: string; description: string };
  cardsTotalAmount: number;
  gcTotalAmountPaid: number;
  cardsTotalQty: number;
  cardsList: GiftCardItem[];
  maxAmount: number;
  minAmount: number;
  gcCashMemoDetails: GetCreatedGiftCardCmDetails | null;
  partiallyUpdatedGcCmResponse: GetPartiallyUpdatedGcCmResponse | null;
  addGiftCardItemResponse: GetAddedGiftCardItemResponse | null;
  getAddedGiftCardItemResponse: GetGiftCardItemResponse | null;
  deleteAddedGiftCardItemResponse: GetDeletedGiftCardItemResponse | null;
  partiallyUpdateGiftCardItemResponse: GetAddedGiftCardItemResponse | null;
  updateGcCashMemoResponse: GetUpdatedGcCashMemoResponse | null;
  rsoDetails: RsoNameObject[];
  printDataResponse: any;
  gcCashMemoBillsReadyForCancellation: CancellableCashMemoData[];
  selectedGcCashMemoData: CashMemoMinimalDetail;
  cancelGcCashMemoResponse: GcCashMemoCancelResponse;
  selectedGcCancellationReason: string;
  gcCancellationReasons: string[];
  remarks: string;
  orderNumber: { order: number; status: string };
  gcBalance: QCGCCardDetails;

  gcHistoryListItems: GiftCardsHistoryListItems[];
  gcHistoryTotalElements: number;
  historySearchParameter: GiftCardsHistoryRequestPayload;
}
