import {
  CreateOpenTepTransactionResponse,
  GetTepItemConfiguratonResponse,
  GetTepCashMemoResponse,
  GetTepPriceDetailsResponse,
  AddOrUpdateTepItemResponse,
  ConfirmTepItemResponse,
  DeleteTepItemResponse,
  CustomErrors,
  TepTransactionResponse,
  TepItemResponse,
  GoldPlusLocation,
  CancelResponse,
  CancelTEPResponse,
  createOpenOrPatchCutPieceTepStockManagementResponse,
  addOrPatchCutPieceTepItemInStockManagementResponse,
  DiscountsList,
  SelectDropDownOption,
  RsoNameObject,
  RefundCashLimit
} from '@poss-web/shared/models';

export class TepState {
  errors?: CustomErrors;
  isLoading?: boolean;
  isOpenTaskLoading?: boolean;
  selectedRsoName: SelectDropDownOption;
  selectedCmItem: string;
  createOpenTepTransactionResponse: CreateOpenTepTransactionResponse;
  updateOpenTepTransactionResponse: CreateOpenTepTransactionResponse;
  tepItemConfiguratonResponse: GetTepItemConfiguratonResponse;
  tepCashMemoResponseItemList: GetTepCashMemoResponse;
  tepPriceDetailsResponse: GetTepPriceDetailsResponse;
  UpdatePriceDetailsResponse: GetTepPriceDetailsResponse;
  addTepItemResponse: AddOrUpdateTepItemResponse;
  selectedData: any;
  updateTepItemResponse: AddOrUpdateTepItemResponse;
  confirmTepItemResponse: ConfirmTepItemResponse;
  deleteTepItemResponse: DeleteTepItemResponse;
  rsoList: RsoNameObject[];
  isLoadingPriceUpdate: boolean;
  cancelResponse: CancelTEPResponse;
  cancelTEPResponse: CancelResponse;
  remarks: string;
  totalQty: number;
  totalGrossWt: number;
  totalExchangeAmt: number;
  selectedPaymentMethod: string;
  selectedTepType: string;
  scannedTepItemCode: string;
  viewTepTransactionResponse: TepTransactionResponse;
  viewTepItemResponse: TepItemResponse;
  deleteTepTransactionResponse: any;
  tepItemCutPieceDetailsResponse: any;
  cutPieceTotalQty: number;
  cutPieceTotalValue: number;
  cmListItemTepConfigurationResponse: GetTepItemConfiguratonResponse;
  isRefundFormValid: boolean;
  isRequestRaisingScenario: boolean;
  goldPlusLocations: GoldPlusLocation[];
  uploadFileResponse: boolean;
  downloadIdProofFileUrl: string;
  downloadCancelledChequeFileUrl: string;
  downloadApprovalMailFileUrl: string;
  fvtReasons: string[];
  refundCashLimit: RefundCashLimit;
  updateTepTransactionPriceDetailsResponse: TepTransactionResponse;

  createOpenCutPieceTepTransactionResponse: createOpenOrPatchCutPieceTepStockManagementResponse;
  patchCutPieceTepTransactionResponse: createOpenOrPatchCutPieceTepStockManagementResponse;
  addCutPieceTepItemResponse: addOrPatchCutPieceTepItemInStockManagementResponse;
  patchCutPieceTepItemResponse: addOrPatchCutPieceTepItemInStockManagementResponse;
  confirmCutPieceTepItemResponse: addOrPatchCutPieceTepItemInStockManagementResponse;
  availableDiscountsList: DiscountsList[];
  studdedProductGroupCodes?: string[];
  isExceptionScenario?: boolean;
  holdTransactionMetalRates?: any;
}
