import { Action } from '@ngrx/store';
import {
  CustomErrors,
  SaveBankDetailsPayload,
  BankDetailsPayload,
  UpdateBankDetailsPayload,
  LoadCashbackOfferListPayload,
  CashbackOfferList,
  PayerBankList,
  OfferDetails,
  OfferDetailResponse,
  ProductGroupMappingOption,
  SaveProductGroupPayload,
  UpdateCardDetails,
  UploadFile,
  LoadCardDetailsPayload,
  CardDetailsResponse,
  CardDetailsUploadResponse
} from '@poss-web/shared/models';

export enum CashbackOfferConfigurationActionTypes {
  LOAD_CASHBACK_OFFER_LIST = '[payment-configuration]  Load Cashback offer list',
  LOAD_CASHBACK_OFFER_LIST_SUCCESS = '[payment-configuration]  Load Cashback offer list Success',
  LOAD_CASHBACK_OFFER_LIST_FAILURE = '[payment-configuration] Load Cashback offer list Failure',

  LOAD_PAYER_BANK_LIST = '[payment-configuration]  Load Payer Bank list',
  LOAD_PAYER_BANK_LIST_SUCCESS = '[payment-configuration]   Load Payer Bank list Success',
  LOAD_PAYER_BANK_LIST_FAILURE = '[payment-configuration]  Load Payer Bank list Failure',

  SAVE_BANK_DETAILS = '[cashback-offer-configuration]  Save Bank Details ',
  SAVE_BANK_DETAILS_SUCCESS = '[cashback-offer-configuration] Save Bank Details  Success',
  SAVE_BANK_DETAILS_FAILURE = '[cashback-offer-configuration] Save Bank Details  Failure',

  UPADTE_BANK_DETAILS = '[cashback-offer-configuration] Update Bank Details ',
  UPADTE_BANK_DETAILSN_SUCCESS = '[cashback-offer-configuration]  Update Bank Details Success',
  UPADTE_BANK_DETAILS_FAILURE = '[cashback-offer-configuration]Update Bank Details  Failure',

  LOAD_BANK_DETAILS_BY_ID = '[cashback-offer-configuration]  Load Bank Details  By id',
  LOAD_BANK_DETAILS_BY_ID_SUCCESS = '[cashback-offer-configuration]  Load Bank Details  By  id Success',
  LOAD_BANK_DETAILS_BY_ID_FAILURE = '[cashback-offer-configuration] Load Bank Details By  id Failure',

  LOAD_OFFER_DETAILS_BY_ID = '[cashback-offer-configuration]  Load Offer Details  By id',
  LOAD_OFFER_DETAILS_BY_ID_SUCCESS = '[cashback-offer-configuration]  Load Offer Details  By  id Success',
  LOAD_OFFER_DETAILS_BY_ID_FAILURE = '[cashback-offer-configuration] Load Offer Details By  id Failure',

  UPDATE_OFFER_DETAILS_BY_ID = '[cashback-offer-configuration]  Update Offer Details  By id',
  UPDATE_OFFER_DETAILS_BY_ID_SUCCESS = '[cashback-offer-configuration]  Update Offer Details  By  id Success',
  UPDATE_OFFER_DETAILS_BY_ID_FAILURE = '[cashback-offer-configuration] Update Offer Details By  id Failure',

  CLEAR_OFFER_DETAILS_BY_ID = '[cashback-offer-configuration]  Clear Offer Details  By id',
  CLEAR_OFFER_DETAILS_BY_ID_SUCCESS = '[cashback-offer-configuration]  Clear Offer Details  By  id Success',
  CLEAR_OFFER_DETAILS_BY_ID_FAILURE = '[cashback-offer-configuration] Clear Offer Details By  id Failure',

  LOAD_NEW_BANK_DETAILS = '[cashback-offer-configuration] Load New Bank Details',

  LOAD_MAPPED_PRODUCT_GROUP_BY_ID = '[cashback-offer-configuration] Load Mapped Product Group By Id',
  LOAD_MAPPED_PRODUCT_GROUP_BY_ID_SUCCESS = '[cashback-offer-configuration] Load Mapped Product Group By Id Success',
  LOAD_MAPPED_PRODUCT_GROUP_BY_ID_FAILURE = '[cashback-offer-configuration] Load Mapped Product Group By Id Failure',

  UPDATE_PRODUCT_GROUP_BY_ID = '[cashback-offer-configuration] Update  Product Group By Id',
  UPDATE_PRODUCT_GROUP_BY_ID_SUCCESS = '[cashback-offer-configuration] Update  Product Group By Id Success',
  UPDATE_PRODUCT_GROUP_BY_ID_FAILURE = '[cashback-offer-configuration] Update  Product Group By Id Failure',

  UPLOAD_CARD_DETAILS_BY_ID = '[cashback-offer-configuration] Upload Card Details',
  UPLOAD_CARD_DETAILS_BY_ID_SUCCESS = '[cashback-offer-configuration] Upload Card Details Success',
  UPLOAD_CARD_DETAILS_BY_ID_FAILURE = '[cashback-offer-configuration] Upload Card Details Failure',

  ERROR_LOG_DOWNLOAD = '[cashback-offer-configuration] Download Error Log',
  ERROR_LOG_DOWNLOAD_SUCCESS = '[cashback-offer-configuration] Download Error Log Success',
  ERROR_LOG_DOWNLOAD_FAILURE = '[cashback-offer-configuration] Download Error Log Failure',

  LOAD_CARD_DETAILS_BY_ID = '[cashback-offer-configuration] Load Card details By Id',
  LOAD_CARD_DETAILS_BY_ID_SUCCESS = '[cashback-offer-configuration] Load Card details By Id Success',
  LOAD_CARD_DETAILS_BY_ID_FAILURE = '[cashback-offer-configuration] Load Card details By Id Failure',

  UPDATE_CARD_DETAILS_BY_ID = '[cashback-offer-configuration] Update  Card details By Id',
  UPDATE_CARD_DETAILS_BY_ID_SUCCESS = '[cashback-offer-configuration] Update   Card details By Id Success',
  UPDATE_CARD_DETAILS_BY_ID_FAILURE = '[cashback-offer-configuration] Update   Card details By Id Failure',

  LOAD_RESET_FILE_DATA = '[cashback-offer-configuration] Load Reset File Data',

  LOAD_RESET = '[cashback-offer-configuration] Load Reset',

  RESET_IS_CLEARED = '[cashback-offer-configuration] Reset Is Cleared'
}

export class LoadCashbackOfferList implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_CASHBACK_OFFER_LIST;
  constructor(
    public payload: LoadCashbackOfferListPayload,
    public searchValue?: string
  ) {}
}
export class LoadCashbackOfferListSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_CASHBACK_OFFER_LIST_SUCCESS;
  constructor(public payload: CashbackOfferList) {}
}
export class LoadCashbackOfferListFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_CASHBACK_OFFER_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveBankDetails implements Action {
  readonly type = CashbackOfferConfigurationActionTypes.SAVE_BANK_DETAILS;
  constructor(public payload: SaveBankDetailsPayload) {}
}
export class SaveBankDetailsSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.SAVE_BANK_DETAILS_SUCCESS;
  constructor(public payload: BankDetailsPayload) {}
}
export class SaveBankDetailsFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.SAVE_BANK_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateBankDetails implements Action {
  readonly type = CashbackOfferConfigurationActionTypes.UPADTE_BANK_DETAILS;
  constructor(public payload: UpdateBankDetailsPayload) {}
}
export class UpdateBankDetailsSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPADTE_BANK_DETAILSN_SUCCESS;
  constructor(public payload: BankDetailsPayload) {}
}
export class UpdateBankDetailsFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPADTE_BANK_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBankDetailsById implements Action {
  readonly type = CashbackOfferConfigurationActionTypes.LOAD_BANK_DETAILS_BY_ID;
  constructor(public payload: string) {}
}
export class LoadBankDetailsByIdSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_BANK_DETAILS_BY_ID_SUCCESS;
  constructor(public payload: BankDetailsPayload) {}
}
export class LoadBankDetailsByIdFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_BANK_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadNewBankDetails implements Action {
  readonly type = CashbackOfferConfigurationActionTypes.LOAD_NEW_BANK_DETAILS;
}

export class LoadReset implements Action {
  readonly type = CashbackOfferConfigurationActionTypes.LOAD_RESET;
}

export class ResetIsCleared implements Action {
  readonly type = CashbackOfferConfigurationActionTypes.RESET_IS_CLEARED;
}
export class LoadPayerBankList implements Action {
  readonly type = CashbackOfferConfigurationActionTypes.LOAD_PAYER_BANK_LIST;
}
export class LoadPayerBankListSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_PAYER_BANK_LIST_SUCCESS;
  constructor(public payload: PayerBankList[]) {}
}
export class LoadPayerBankListFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_PAYER_BANK_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadOfferDetailsById implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_OFFER_DETAILS_BY_ID;
  constructor(public payload: string) {}
}
export class LoadOfferDetailsByIdSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_OFFER_DETAILS_BY_ID_SUCCESS;
  constructor(public payload: OfferDetails[]) {}
}
export class LoadOfferDetailsByIdFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_OFFER_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateOfferDetailsById implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPDATE_OFFER_DETAILS_BY_ID;
  constructor(public payload: OfferDetailResponse) {}
}
export class UpdateOfferDetailsByIdSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPDATE_OFFER_DETAILS_BY_ID_SUCCESS;
}
export class UpdateOfferDetailsByIdFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPDATE_OFFER_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMappedProductGroupById implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUP_BY_ID;
  constructor(public payload: string) {}
}
export class LoadMappedProductGroupByIdSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUP_BY_ID_SUCCESS;
  constructor(public payload: ProductGroupMappingOption[]) {}
}
export class LoadMappedProductGroupByIdFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_MAPPED_PRODUCT_GROUP_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateProductGroupById implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPDATE_PRODUCT_GROUP_BY_ID;
  constructor(public payload: SaveProductGroupPayload) {}
}
export class UpdateProductGroupByIdSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPDATE_PRODUCT_GROUP_BY_ID_SUCCESS;
}
export class UpdateProductGroupByIdFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPDATE_PRODUCT_GROUP_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UploadCardDetailsById implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPLOAD_CARD_DETAILS_BY_ID;
  constructor(public payload: UploadFile) {}
}
export class UploadCardDetailsByIdSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPLOAD_CARD_DETAILS_BY_ID_SUCCESS;
  constructor(public payload: CardDetailsUploadResponse) {}
}
export class UploadCardDetailsByIdFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPLOAD_CARD_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ErrorLogDownload implements Action {
  readonly type = CashbackOfferConfigurationActionTypes.ERROR_LOG_DOWNLOAD;
  constructor(public payload: string) {}
}
export class ErrorLogDownloadSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS;
  constructor(public payload: any) {}
}
export class ErrorLogDownloadFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.ERROR_LOG_DOWNLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadCardDetailsById implements Action {
  readonly type = CashbackOfferConfigurationActionTypes.LOAD_CARD_DETAILS_BY_ID;
  constructor(public payload: LoadCardDetailsPayload) {}
}
export class LoadCardDetailsByIdSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_CARD_DETAILS_BY_ID_SUCCESS;
  constructor(public payload: CardDetailsResponse) {}
}
export class LoadCardDetailsByIdFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.LOAD_CARD_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateCardDeatislById implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPDATE_CARD_DETAILS_BY_ID;
  constructor(public payload: UpdateCardDetails) {}
}
export class UpdateCardDeatislByIdSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPDATE_CARD_DETAILS_BY_ID_SUCCESS;
}
export class UpdateCardDeatislByIdFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.UPDATE_CARD_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearOfferDetailsById implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.CLEAR_OFFER_DETAILS_BY_ID;
  constructor(public payload: OfferDetailResponse) {}
}
export class ClearOfferDetailsByIdSuccess implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.CLEAR_OFFER_DETAILS_BY_ID_SUCCESS;
}
export class ClearOfferDetailsByIdFailure implements Action {
  readonly type =
    CashbackOfferConfigurationActionTypes.CLEAR_OFFER_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadResetFileData {
  readonly type = CashbackOfferConfigurationActionTypes.LOAD_RESET_FILE_DATA;
}
export type CashbckOfferConfigurationAction =
  | SaveBankDetails
  | SaveBankDetailsSuccess
  | SaveBankDetailsFailure
  | UpdateBankDetails
  | UpdateBankDetailsSuccess
  | UpdateBankDetailsFailure
  | LoadBankDetailsById
  | LoadBankDetailsByIdFailure
  | LoadBankDetailsByIdSuccess
  | LoadCashbackOfferList
  | LoadCashbackOfferListSuccess
  | LoadCashbackOfferListFailure
  | LoadNewBankDetails
  | LoadOfferDetailsById
  | LoadOfferDetailsByIdSuccess
  | LoadOfferDetailsByIdFailure
  | LoadPayerBankList
  | LoadPayerBankListSuccess
  | LoadPayerBankListFailure
  | UpdateOfferDetailsById
  | UpdateOfferDetailsByIdSuccess
  | UpdateOfferDetailsByIdFailure
  | LoadMappedProductGroupById
  | LoadMappedProductGroupByIdSuccess
  | LoadMappedProductGroupByIdFailure
  | UpdateProductGroupById
  | UpdateProductGroupByIdSuccess
  | UpdateProductGroupByIdFailure
  | UploadCardDetailsById
  | UploadCardDetailsByIdSuccess
  | UploadCardDetailsByIdFailure
  | UpdateCardDeatislById
  | UpdateCardDeatislByIdSuccess
  | UpdateCardDeatislByIdFailure
  | LoadCardDetailsById
  | LoadCardDetailsByIdSuccess
  | LoadCardDetailsByIdFailure
  | LoadResetFileData
  | ClearOfferDetailsById
  | ClearOfferDetailsByIdSuccess
  | ClearOfferDetailsByIdFailure
  | ErrorLogDownload
  | ErrorLogDownloadSuccess
  | ErrorLogDownloadFailure
  | ResetIsCleared
  | LoadReset;
