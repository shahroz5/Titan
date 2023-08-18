import {
  CustomErrors,
  CreateCashMemoResponse,
  CashMemoDetailsResponse,
  CashMemoHistoryDetails,
  CashMemoHistoryRequestPayload,
  TcsDataResponse,
  MetalRates,
  FileUploadLists
} from '@poss-web/shared/models';

import { ItemDetailsEntity } from './cash-memo.entity';
export class CashMemoState {
  hasError?: CustomErrors;
  isLoading?: boolean;

  createCashMemoResponse: CreateCashMemoResponse;
  viewCashMemoResponse: CashMemoDetailsResponse;
  partialUpdateCashMemoResponse: CashMemoDetailsResponse;
  updateCashMemoResponse: CashMemoDetailsResponse;
  deleteCashMemoResponse: boolean;
  isIGST: boolean;

  // Regular CM
  updatePriceDetailsResponse: {
    data: CashMemoDetailsResponse;
    requestDetails: boolean;
  };
  invokeOrderDetailsResponse: CashMemoDetailsResponse;
  isABInvoked: boolean;

  // Manual CM
  materialPrices: MetalRates[];
  uploadFileResponse: boolean;
  uploadFileListResponse: FileUploadLists[];
  downloadFileUrl: string;

  //cmhistory
  isHistoryDetailsLoading: boolean;
  cashMemoHistory: CashMemoHistoryDetails[];
  cashMemoHistoryTotalElements: number;
  productDetails: ItemDetailsEntity;
  historySearchParameter: CashMemoHistoryRequestPayload;

  tcsDetails: TcsDataResponse;
  setFocus: number;

  isMetalRateValidated: boolean;
}
