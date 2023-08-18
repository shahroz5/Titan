import {
  DiscountsResponse,
  ApplyDiscountRequest,
  CustomErrors,
  DiscountTransactionLevelRequest,
  DiscountTransactionLevelResponse,
  LoadAppliedTransactionDiscountsRequest,
  RemoveAllAppliedTransactionLevelDiscountsPayload,
  RemoveAppliedTransactionLevelDiscountByIDPayload,
  UpdateTransactionLevelDiscountByIDPayload,
  ItemLevelDiscountsRequestPayload,
  ItemLevelDiscountsDetailsRequestPayload,
  DiscountConfigDetailsResponse,
  DiscountHeaders,
  DiscountsRequestPayload,
  Lov,
  ConfirmTransactionLevelDiscountPayload,
  KaratOrCoinOfferEligibleItemsRequestPayload,
  DiscountVoucherDetailsRequestPayload,
  DiscountVoucherDetailsResponePayload,
  GepPurityConfigIdEligibleItemsRequestPayload,
  DiscountHeadersDetails,
  DiscountsRequest,
  CashMemoItemDetailsResponse,
  CashMemoDetailsResponse,
  AutoDiscRequest,
  RivaahGHSDiscounts
} from '@poss-web/shared/models';
import { Action } from '@ngrx/store';

export enum DiscountActionTypes {
  LOAD_ITEM_LEVEL_DISCOUNTS = '[ Discount ] Load Item Level Discounts',
  LOAD_ITEM_LEVEL_DISCOUNTS_SUCCESS = '[ Discount ]  Load Item Level Discounts Success',
  LOAD_ITEM_LEVEL_DISCOUNTS_FAILURE = '[ Discount ]  Load Item Level Discounts Failure',

  LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS = '[ Discount ] Load Item Level Discounts Details',
  LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS_SUCCESS = '[ Discount ] Load Item Level Discounts Details Success',
  LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS_FAILURE = '[ Discount ] Load Item Level Discounts Details Failure',

  GET_ITEM_LEVEL_DISCOUNTS = '[ Discount ] Get Item Level Discounts',
  GET_ITEM_LEVEL_DISCOUNTS_SUCCESS = '[ Discount ]  Get Item Level Discounts Success',
  GET_ITEM_LEVEL_DISCOUNTS_FAILURE = '[ Discount ]  Get Item Level Discounts Failure',

  SAVE_ITEM_LEVEL_DISCOUNTS = '[ Discount ] Save Item Level Discounts',
  SAVE_ITEM_LEVEL_DISCOUNTS_SUCCESS = '[ Discount ] Save Item Level Discounts Success',
  SAVE_ITEM_LEVEL_DISCOUNTS_FAILURE = '[ Discount ] Save Item Level Discounts Failure',

  UPDATE_ITEM_LEVEL_DISCOUNTS = '[ Discount ] Update Item Level Discounts',
  UPDATE_ITEM_LEVEL_DISCOUNTS_SUCCESS = '[ Discount ] Update Item Level Discounts Success',
  UPDATE_ITEM_LEVEL_DISCOUNTS_FAILURE = '[ Discount ] Update Item Level Discounts Failure',

  DELETE_ITEM_LEVEL_DISCOUNTS = '[ Discount ] Delete Item Level Discounts',
  DELETE_ITEM_LEVEL_DISCOUNTS_SUCCESS = '[ Discount ] Delete Item Level Discounts Success',
  DELETE_ITEM_LEVEL_DISCOUNTS_FAILURE = '[ Discount ] Delete Item Level Discounts Failure',

  REMOVE_DIGI_DISCOUNT = '[ Discount ] Remove DIGI Discounts',
  REMOVE_DIGI_DISCOUNT_SUCCESS = '[ Discount ] Remove DIGI Discounts Success',
  REMOVE_DIGI_DISCOUNT_FAILURE = '[ Discount ] Remove DIGI Discounts Failure',

  LOAD_TRANSACTION_LEVEL_DISCOUNTS = '[Discount-Bill Level] Load Transaction Level Discounts',
  LOAD_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS = '[Discount-Bill Level] Load Transaction Level Discounts Success',
  LOAD_TRANSACTION_LEVEL_DISCOUNTS_FAILURE = '[Discount- Bill Level] Load Transaction Level Discounts Failure',

  LOAD_DIGI_GOLD_DISCOUNTS = '[Discount-Bill Level] Load Digi Gold Discounts',
  LOAD_DIGI_GOLD_DISCOUNTS_SUCCESS = '[Discount-Bill Level] Load Digi Gold Success',
  LOAD_DIGI_GOLD_DISCOUNTS_FAILURE = '[Discount- Bill Level] Load Digi Gold Failure',

  LOAD_GRN_MULTIPLE_DISCOUNTS = '[Discount-Bill Level] Load Grn Mulptiple Discounts',
  LOAD_GRN_MULTIPLE_DISCOUNTS_SUCCESS = '[Discount-Bill Level] Load Grn Multiple Discounts Success',
  LOAD_GRN_MULTIPLE_DISCOUNTS_FAILURE = '[Discount- Bill Level] Load Grn Multiple Discounts Failure',

  LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS = '[Discount-Bill Level] Load Available Employee Discounts',
  LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS_SUCCESS = '[Discount-Bill Level] Load Available Employee Discounts Success',
  LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS_FAILURE = '[Discount- Bill Level] Load Available Employee Discounts Failure',

  LOAD_AVAILABLE_TSSS_DISCOUNTS = '[Discount-Bill Level] Load Available TSSS Discounts',
  LOAD_AVAILABLE_TSSS_DISCOUNTS_SUCCESS = '[Discount-Bill Level] Load Available TSSS Discounts Success',
  LOAD_AVAILABLE_TSSS_DISCOUNTS_FAILURE = '[Discount- Bill Level] Load Available TSSS Discounts Failure',

  LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS = '[Discount-Bill Level] Load Available Tata Employee Discounts',
  LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS_SUCCESS = '[Discount-Bill Level] Load Available Tata Employee Discounts Success',
  LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS_FAILURE = '[Discount- Bill Level] Load Available Tata Employee Discounts Failure',

  LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT = '[Discount-Bill Level] Load Available Empowerment Discounts',
  LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT_SUCCESS = '[Discount-Bill Level] Load Available Empowerment Discounts Success',
  LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT_FAILURE = '[Discount- Bill Level] Load Available Empowerment Discounts Failure',

  APPLY_DISCOUNT_AT_TRANSACTION_LEVEL = '[Discount- Bill Level] Apply Discount At Transaction Level',
  APPLY_DISCOUNT_AT_TRANSACTION_LEVEL_SUCCESS = '[Discount- Bill Level] Apply Discount At Transaction Level Success',
  APPLY_DISCOUNT_AT_TRANSACTION_LEVEL_FAILURE = '[Discount- Bill Level] Apply Discount At Transaction Level Failure',

  LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS = '[Discount- Bill Level] Load Applied Transaction Level Discounts',
  LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS = '[Discount- Bill Level] Load Applied Transaction Level Discounts Success',
  LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE = '[Discount- Bill Level] Load Applied Transaction Level Discounts Failure',

  REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS = '[Discount- Bill Level] Remove All Applied Transaction Level Discounts',
  REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS = '[Discount- Bill Level] Remove All Applied Transaction Level Discounts Success',
  REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE = '[Discount- Bill Level] Remove All Applied Transaction Level Discounts Failure',

  REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID = '[Discount- Bill Level] Remove Applied Transaction Level Discount By ID',
  REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID_SUCCESS = '[Discount- Bill Level] Remove Applied Transaction Level Discount By ID Success',
  REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID_FAILURE = '[Discount- Bill Level] Remove Applied Transaction Level Discount By ID Failure',

  UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS = '[Discount- Bill Level] Update Applied Transaction Level Discounts',
  UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS = '[Discount- Bill Level] Update Applied Transaction Level Discounts Success',
  UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE = '[Discount- Bill Level] Update Applied Transaction Level Discounts Failure',

  CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS = '[Discount- Bill Level] Confirm Applied Transaction Level Discounts',
  CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS = '[Discount- Bill Level] Confirm Applied Transaction Level Discounts Success',
  CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE = '[Discount- Bill Level] Confirm Applied Transaction Level Discounts Failure',

  LOAD_TATA_COMPANY_NAME_LIST = '[Discount] Load TATA Compan Name',
  LOAD_TATA_COMPANY_NAME_LIST_SUCCESS = '[Discount] Load TATA Compan Name Success',
  LOAD_TATA_COMPANY_NAME_LIST_FAILURE = '[Discount] Load TATA Compan Name Failure',

  LOAD_PC_DESC = '[ Discount ] Load PC Desc',
  LOAD_PC_DESC_SUCCESS = '[ Discount ]  Load PC Desc Success',
  LOAD_PC_DESC_FAILURE = '[ Discount ]  Load PC Desc Failure',

  LOAD_PG_DESC = '[ Discount ] Load PG Desc',
  LOAD_PG_DESC_SUCCESS = '[ Discount ]  Load PG Desc Success',
  LOAD_PG_DESC_FAILURE = '[ Discount ]  Load PG Desc Failure',

  LOAD_DISCOUNT_TYPES = '[ Discount ] Load Discount Types',
  LOAD_DISCOUNT_TYPES_SUCCESS = '[ Discount ]  Load Discount Types Success',
  LOAD_DISCOUNT_TYPES_FAILURE = '[ Discount ]  Load Discount Types Failure',

  SET_ISENCIRCLE_DETAILS = '[ Discount ] Set IsEncircle Details',
  CLEAR_ISENCIRCLE_ADDED = '[ Discount ] Clear IsEncircle Added',
  CLEAR_ENCIRCLE = '[ Discount ] Clear Encircle',

  CLEAR = '[ Discount ] Clear Data',

  SET_DISCOUNT_STATE = '[ Discount ] Set Discount State Details',
  CLEAR_ITEM_LEVEL_DISCOUNT_DETAILS = '[ Discount ] Clear Item Level Discount Details',
  CLEAR_TRANSACTION_LEVEL_DISCOUNT_DETAILS = '[ Discount- Bill Level] Clear Transaction Level Discount Details',
  CLEAR_UPDATE_ITEM_LEVEL_DISCOUNT_DETAILS = '[ Discount ] Clear Update Item Level Discount Details',
  REFRESH_DISCOUNT_AND_OFFERS_PANEL = '[Discount] Refresh Discount and Offers Panel',

  SET_IS_RSO_SELECETED = '[Discount] Set Is Rso Selected',

  LOAD_ELIGIBLE_ITEMS_FOR_DISCOUNT_IDS = '[ Discount ] Load Eligible Items For Discount Ids',
  LOAD_ELIGIBLE_ITEMS_FOR_DISCOUNT_IDS_SUCCESS = '[ Discount ] Load Eligible Items For Discount Ids Success',
  LOAD_ELIGIBLE_ITEMS_FOR_DISCOUNT_IDS_FAILURE = '[ Discount ] Load Eligible Items For Discount Ids Failure',

  APPLY_KARAT_OR_COIN_OFFER_DISCOUNT = '[Discount] Apply Karat or Coin Offer Discount',
  APPLY_KARAT_OR_COIN_OFFER_DISCOUNT_SUCCESS = '[Discount] Apply Karat or Coin Offer Discount Success',
  APPLY_KARAT_OR_COIN_OFFER_DISCOUNT_FAILURE = '[Discount] Apply Karat or Coin Offer Discount Failure',

  LOAD_DISCOUNT_VOUCHER_DETAILS = '[Discount] Load Discount Voucher Details',
  LOAD_DISCOUNT_VOUCHER_DETAILS_SUCCESS = '[Discount] Load Discount Voucher Details Success',
  LOAD_DISCOUNT_VOUCHER_DETAILS_FAILURE = '[Discount] Load Discount Voucher Details Failure',

  LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS = '[Discount-Bill Level] Load Available System DV Discounts',
  LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS_SUCCESS = '[Discount-Bill Level] Load Available System DV Discounts Success',
  LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS_FAILURE = '[Discount- Bill Level] Load Available System DV Discounts Failure',

  // SET_GHS_PAYMENT_DETAILS = '[Discount] Set GHS Payment Details',
  // GET_GHS_PAYMENT_DETAILS = '[Discount] Get GHS Payment Details'
  LOAD_ELIGIBLE_ITEMS_FOR_GEP_PURITY_CONFIG = '[ Discount ] Load Eligible Items For Gep Purity Config',
  LOAD_ELIGIBLE_ITEMS_FOR_GEP_PURITY_CONFIG_SUCCESS = '[ Discount ] Load Eligible Items For Gep Purity Config Success',
  LOAD_ELIGIBLE_ITEMS_FOR_GEP_PURITY_CONFIG_FAILURE = '[ Discount ] Load Eligible Items For Gep Purity Config Failure',

  CHECK_AB_CO_ELIGIBILITY = '[Discount-Item Level] Check AB CO Eligibility',
  CHECK_AB_CO_ELIGIBILITY_SUCCESS = '[Discount-Item Level] Check AB CO Eligibility Success',
  CHECK_AB_CO_ELIGIBILITY_FAILURE = '[Discount-Item Level] Check AB CO Eligibility Failure',

  LOAD_AB_CO_DISCOUNT_DETAILS = '[Discount-Item Level] Load AB CO Discount Details',
  LOAD_AB_CO_DISCOUNT_DETAILS_SUCCESS = '[Discount-Item Level] Load AB CO Discount Details Success',
  LOAD_AB_CO_DISCOUNT_DETAILS_FAILURE = '[Discount-Item Level] Load AB CO Discount Details Failure',

  LOAD_AB_CO_DISCOUNTS = '[Discount-Item Level] Load AB CO Discounts',
  LOAD_AB_CO_DISCOUNTS_SUCCESS = '[Discount-Item Level] Load AB CO Discounts Success',
  LOAD_AB_CO_DISCOUNTS_FAILURE = '[Discount-Item Level] Load AB CO Discounts Failure',

  LOAD_AB_CO_CONFIG_DETAILS = '[Discount-Item Level] Load AB CO Config Details',
  LOAD_AB_CO_CONFIG_DETAILS_SUCCESS = '[Discount-Item Level] Load AB CO Config Details Success',
  LOAD_AB_CO_CONFIG_DETAILS_FAILURE = '[Discount-Item Level] Load AB CO Config Details Failure',

  LOAD_NEW_AB_CO_DISCOUNTS = '[Discount-Item Level] Load New AB CO Discounts',
  LOAD_NEW_AB_CO_DISCOUNTS_SUCCESS = '[Discount-Item Level] Load New AB CO Discounts Success',
  LOAD_NEW_AB_CO_DISCOUNTS_FAILURE = '[Discount-Item Level] Load New AB CO Discounts Failure',

  LOAD_AUTO_DISCOUNTS = '[Discount-Item Level] Load Auto Discounts',
  LOAD_AUTO_DISCOUNTS_SUCCESS = '[Discount-Item Level] Load Auto Discounts Success',
  LOAD_AUTO_DISCOUNTS_FAILURE = '[Discount-Item Level] Load Auto Discounts Failure',

  RELOAD_GRID_ON_DISCOUNT_APPLY_DELETE = '[Discount-Item Level] Reload Grid on Discounts Apply and Delete',

  SET_ORDER_DISCOUNT_DETAILS = '[ Discount ] Set Order Discount Details',
  GET_ORDER_DISCOUNT_DETAILS = '[ Discount ] Get Order Discount Details',
  CLEAR_ORDER_DISCOUNT_DETAILS = '[ Discount ] Clear Order Discount Details',

  LOAD_RIVAAH_GHS_DISCOUNTS = '[Discount] Load Rivaah GHS Discounts',
  LOAD_RIVAAH_GHS_DISCOUNTS_SUCCESS = '[Discount] Load Rivaah GHS Discounts Success',
  LOAD_RIVAAH_GHS_DISCOUNTS_FAILURE = '[Discount] Load Rivaah GHS Discounts Failure',

  SAVE_RIVAAH_GHS_DISCOUNTS = '[Discount] Save Rivaah GHS Discounts',
  SAVE_RIVAAH_GHS_DISCOUNTS_SUCCESS = '[Discount] Save Rivaah GHS Discounts Success',
  SAVE_RIVAAH_GHS_DISCOUNTS_FAILURE = '[Discount] Save Rivaah GHS Discounts Failure',

  SET_ENABLE_CALCULATE_RIVAAH_GHS_DISCOUNTS = '[Discount] Set Enable Calculate Rivaah GHS Discounts',

  LOAD_REASON_FOR_CHANGING_DISCOUNTS = '[Discount] Load Reason For Changing Discounts',
  LOAD_REASON_FOR_CHANGING_DISCOUNTS_SUCCESS = '[Discount] Load Reason For Changing Discounts Success',
  LOAD_REASON_FOR_CHANGING_DISCOUNTS_FAILURE = '[Discount] Load Reason For Changing Discounts Failure',

  LOAD_REASON_FOR_NOTGIVING_DISCOUNTS = '[Discount] Load Reason For Not Giving Discounts',
  LOAD_REASON_FOR_NOTGIVING_DISCOUNTS_SUCCESS = '[Discount] Load Reason For Not Giving Discounts Success',
  LOAD_REASON_FOR_NOTGIVING_DISCOUNTS_FAILURE = '[Discount] Load Reason For Not Giving Discounts Failure',

  SAVE_EXCLUDE_SLAB_ITEM_DISCOUNT = '[Discount] Save Exclude Slab Item Discount',
  SAVE_EXCLUDE_SLAB_ITEM_DISCOUNT_SUCCESS = '[Discount] Save Exclude Slab Item Discount Success',
  SAVE_EXCLUDE_SLAB_ITEM_DISCOUNT_FAILURE = '[Discount] Save Exclude Slab Item Discount Failure'
}

export class LoadItemLevelDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS;
  constructor(public payload: ItemLevelDiscountsRequestPayload) {}
}

export class LoadItemLevelDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountHeaders) {}
}

export class LoadItemLevelDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadItemLevelDiscountsDetails implements Action {
  readonly type = DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS;
  constructor(public payload: ItemLevelDiscountsDetailsRequestPayload) {}
}

export class LoadItemLevelDiscountsDetailsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS_SUCCESS;
  constructor(
    public payload: {
      discountConfigDetails: DiscountConfigDetailsResponse[];
      clubbingId: string;
      data: CashMemoItemDetailsResponse;
    }
  ) {}
}

export class LoadItemLevelDiscountsDetailsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_ITEM_LEVEL_DISCOUNTS_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetItemLevelDiscounts implements Action {
  readonly type = DiscountActionTypes.GET_ITEM_LEVEL_DISCOUNTS;
  constructor(public payload: DiscountsRequestPayload) {}
}

export class GetItemLevelDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.GET_ITEM_LEVEL_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountsResponse[]) {}
}

export class GetItemLevelDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.GET_ITEM_LEVEL_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveItemLevelDiscounts implements Action {
  readonly type = DiscountActionTypes.SAVE_ITEM_LEVEL_DISCOUNTS;
  constructor(
    public payload: {
      request: DiscountsRequestPayload;
      data: CashMemoItemDetailsResponse;
    }
  ) {}
}

export class SaveItemLevelDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.SAVE_ITEM_LEVEL_DISCOUNTS_SUCCESS;
  constructor(
    public payload: {
      response: DiscountsResponse[];
      data: CashMemoItemDetailsResponse;
    }
  ) {}
}

export class SaveItemLevelDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.SAVE_ITEM_LEVEL_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateItemLevelDiscounts implements Action {
  readonly type = DiscountActionTypes.UPDATE_ITEM_LEVEL_DISCOUNTS;
  constructor(public payload: DiscountsRequestPayload) {}
}

export class UpdateItemLevelDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.UPDATE_ITEM_LEVEL_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountsResponse) {}
}

export class UpdateItemLevelDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.UPDATE_ITEM_LEVEL_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class DeleteItemLevelDiscounts implements Action {
  readonly type = DiscountActionTypes.DELETE_ITEM_LEVEL_DISCOUNTS;
  constructor(
    public payload: {
      request: DiscountsRequestPayload;
      data: CashMemoItemDetailsResponse | DiscountsResponse[];
    }
  ) {}
}

export class DeleteItemLevelDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.DELETE_ITEM_LEVEL_DISCOUNTS_SUCCESS;
  constructor(
    public payload: {
      response: boolean;
      data: {
        discountData: DiscountsRequest | DiscountsRequest[];
        itemData: CashMemoItemDetailsResponse | DiscountsResponse[];
      };
    }
  ) {}
}

export class DeleteItemLevelDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.DELETE_ITEM_LEVEL_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTransactionLevelDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_TRANSACTION_LEVEL_DISCOUNTS;
  constructor(public paylaod: DiscountTransactionLevelRequest) {}
}
export class LoadTransactionLevelDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountTransactionLevelResponse[]) {}
}

export class LoadTransactionLevelDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_TRANSACTION_LEVEL_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDigiGoldDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_DIGI_GOLD_DISCOUNTS;
  constructor(public paylaod: DiscountTransactionLevelRequest) {}
}
export class LoadDigiGoldDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_DIGI_GOLD_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountTransactionLevelResponse[]) {}
}

export class LoadDigiGoldDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_DIGI_GOLD_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGrnMultipleDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_GRN_MULTIPLE_DISCOUNTS;
  constructor(public paylaod: DiscountTransactionLevelRequest) {}
}
export class LoadGrnMultipleDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_GRN_MULTIPLE_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountTransactionLevelResponse[]) {}
}

export class LoadGrnMultipleDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_GRN_MULTIPLE_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAvailableEmployeeDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS;
  constructor(public paylaod: DiscountTransactionLevelRequest) {}
}
export class LoadAvailableEmployeeDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountTransactionLevelResponse[]) {}
}

export class LoadAvailableEmployeeDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_AVAILABLE_EMPLOYEE_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAvailableTSSSDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_AVAILABLE_TSSS_DISCOUNTS;
  constructor(public paylaod: DiscountTransactionLevelRequest) {}
}
export class LoadAvailableTSSSDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_AVAILABLE_TSSS_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountTransactionLevelResponse[]) {}
}

export class LoadAvailableTSSSDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_AVAILABLE_TSSS_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAvailableTataEmployeeDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS;
  constructor(public paylaod: DiscountTransactionLevelRequest) {}
}
export class LoadAvailableTataEmployeeDiscountsSuccess implements Action {
  readonly type =
    DiscountActionTypes.LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountTransactionLevelResponse[]) {}
}

export class LoadAvailableTataEmployeeDiscountsFailure implements Action {
  readonly type =
    DiscountActionTypes.LOAD_AVAILABLE_TATA_EMPLOYEE_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadAvailableSystemDvDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS;
  constructor(public paylaod: DiscountTransactionLevelRequest) {}
}
export class LoadAvailableSystemDvDiscountsSuccess implements Action {
  readonly type =
    DiscountActionTypes.LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountTransactionLevelResponse[]) {}
}

export class LoadAvailableSystemDvDiscountsFailure implements Action {
  readonly type =
    DiscountActionTypes.LOAD_AVAILABLE_SYSTEM_DV_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadAvailableEmpowementDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT;
  constructor(public paylaod: DiscountTransactionLevelRequest) {}
}
export class LoadAvailableEmpowementDiscountsSuccess implements Action {
  readonly type =
    DiscountActionTypes.LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT_SUCCESS;
  constructor(public payload: DiscountTransactionLevelResponse[]) {}
}

export class LoadAvailableEmpowementDiscountsFailure implements Action {
  readonly type =
    DiscountActionTypes.LOAD_AVAILABLE_EMPOWERMENT_DISCOUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ApplyDiscountAtTransactionLevel implements Action {
  readonly type = DiscountActionTypes.APPLY_DISCOUNT_AT_TRANSACTION_LEVEL;
  constructor(public paylaod: ApplyDiscountRequest) {}
}
export class ApplyDiscountAtTransactionLevelSucces implements Action {
  readonly type =
    DiscountActionTypes.APPLY_DISCOUNT_AT_TRANSACTION_LEVEL_SUCCESS;
  constructor(public payload: boolean) {}
}

export class ApplyDiscountAtTransactionLevelFailure implements Action {
  readonly type =
    DiscountActionTypes.APPLY_DISCOUNT_AT_TRANSACTION_LEVEL_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadAppliedTransactionLevelDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS;
  constructor(public paylaod: LoadAppliedTransactionDiscountsRequest) {}
}
export class LoadAppliedTransactionLevelDiscountsSuccess implements Action {
  readonly type =
    DiscountActionTypes.LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadAppliedTransactionLevelDiscountsFailure implements Action {
  readonly type =
    DiscountActionTypes.LOAD_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RemoveAllAppliedTransactionLevelDiscounts implements Action {
  readonly type =
    DiscountActionTypes.REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS;
  constructor(
    public payload: RemoveAllAppliedTransactionLevelDiscountsPayload
  ) {}
}
export class RemoveAllAppliedTransactionLevelDiscountsSuccess
  implements Action {
  readonly type =
    DiscountActionTypes.REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS;
  constructor(
    public payload: {
      isDeleted: boolean;
      discountType: string;
    }
  ) {}
}

export class RemoveAllAppliedTransactionLevelDiscountsFailure
  implements Action {
  readonly type =
    DiscountActionTypes.REMOVE_ALL_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RemoveAppliedTransactionLevelDiscountByID implements Action {
  readonly type =
    DiscountActionTypes.REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID;
  constructor(
    public paylaod: RemoveAppliedTransactionLevelDiscountByIDPayload
  ) {}
}
export class RemoveAppliedTransactionLevelDiscountByIDSuccess
  implements Action {
  readonly type =
    DiscountActionTypes.REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID_SUCCESS;
  constructor(public payload: boolean) {}
}

export class RemoveAppliedTransactionLevelDiscountByIDFailure
  implements Action {
  readonly type =
    DiscountActionTypes.REMOVE_APPLIED_TRANSACTION_LEVEL_DISCOUNT_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RemoveDigiDiscount implements Action {
  readonly type = DiscountActionTypes.REMOVE_DIGI_DISCOUNT;
  constructor(
    public paylaod: RemoveAppliedTransactionLevelDiscountByIDPayload
  ) {}
}
export class RemoveDigiDiscountSuccess implements Action {
  readonly type = DiscountActionTypes.REMOVE_DIGI_DISCOUNT_SUCCESS;
  constructor(
    public payload: boolean,
    public deletedDiscount: RemoveAppliedTransactionLevelDiscountByIDPayload
  ) {}
}

export class RemoveDigiDiscountFailure implements Action {
  readonly type = DiscountActionTypes.REMOVE_DIGI_DISCOUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateAppliedTransactionLevelDiscount implements Action {
  readonly type =
    DiscountActionTypes.UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS;
  constructor(public paylaod: UpdateTransactionLevelDiscountByIDPayload) {}
}
export class UpdateAppliedTransactionLevelDiscountSuccess implements Action {
  readonly type =
    DiscountActionTypes.UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS;
  constructor(public payload: boolean) {}
}

export class UpdateAppliedTransactionLevelDiscountFailure implements Action {
  readonly type =
    DiscountActionTypes.UPDATE_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmAppliedTransactionLevelDiscount implements Action {
  readonly type =
    DiscountActionTypes.CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS;
  constructor(public paylaod: ConfirmTransactionLevelDiscountPayload) {}
}
export class ConfirmAppliedTransactionLevelDiscountSuccess implements Action {
  readonly type =
    DiscountActionTypes.CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_SUCCESS;
  constructor(
    public payload: boolean,
    public confirmedDiscounts: ConfirmTransactionLevelDiscountPayload
  ) {}
}

export class ConfirmAppliedTransactionLevelDiscountFailure implements Action {
  readonly type =
    DiscountActionTypes.CONFIRM_APPLIED_TRANSACTION_LEVEL_DISCOUNTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadTataCompanyNameList implements Action {
  readonly type = DiscountActionTypes.LOAD_TATA_COMPANY_NAME_LIST;
  constructor(readonly payload: string) {}
}
export class LoadTataCompanyNameListSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_TATA_COMPANY_NAME_LIST_SUCCESS;
  constructor(readonly payload: Lov[]) {}
}
export class LoadTataCompanyNameListFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_TATA_COMPANY_NAME_LIST_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class Clear implements Action {
  readonly type = DiscountActionTypes.CLEAR;
}

export class SetDiscountState implements Action {
  readonly type = DiscountActionTypes.SET_DISCOUNT_STATE;
  constructor(readonly payload: string) {}
}

export class ClearItemLevelDiscountDetails implements Action {
  readonly type = DiscountActionTypes.CLEAR_ITEM_LEVEL_DISCOUNT_DETAILS;
}

export class ClearUpdateItemLevelDiscountDetails implements Action {
  readonly type = DiscountActionTypes.CLEAR_UPDATE_ITEM_LEVEL_DISCOUNT_DETAILS;
}

export class ClearTransactionLevelDiscountDetails implements Action {
  readonly type = DiscountActionTypes.CLEAR_TRANSACTION_LEVEL_DISCOUNT_DETAILS;
}
export class RefreshDiscountsAndOffersPanel implements Action {
  readonly type = DiscountActionTypes.REFRESH_DISCOUNT_AND_OFFERS_PANEL;
  constructor(readonly payload: boolean) {}
}

export class LoadPcDesc implements Action {
  readonly type = DiscountActionTypes.LOAD_PC_DESC;
}

export class LoadPcDescSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_PC_DESC_SUCCESS;
  constructor(public payload: {}) {}
}

export class LoadPcDescFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_PC_DESC_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPgDesc implements Action {
  readonly type = DiscountActionTypes.LOAD_PG_DESC;
}

export class LoadPgDescSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_PG_DESC_SUCCESS;
  constructor(public payload: {}) {}
}

export class LoadPgDescFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_PG_DESC_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SetIsRsoSelected implements Action {
  readonly type = DiscountActionTypes.SET_IS_RSO_SELECETED;
  constructor(public payload: boolean) {}
}
export class LoadDiscountTypes implements Action {
  readonly type = DiscountActionTypes.LOAD_DISCOUNT_TYPES;
  constructor(public payload: string) {}
}

export class LoadDiscountTypesSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_DISCOUNT_TYPES_SUCCESS;
  constructor(public payload: Lov[]) {}
}

export class LoadDiscountTypesFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_DISCOUNT_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SetIsEncircleDetails implements Action {
  readonly type = DiscountActionTypes.SET_ISENCIRCLE_DETAILS;
  constructor(public payload: any) {}
}

export class ClearIsEncircleAdded implements Action {
  readonly type = DiscountActionTypes.CLEAR_ISENCIRCLE_ADDED;
}

export class ClearEncircle implements Action {
  readonly type = DiscountActionTypes.CLEAR_ENCIRCLE;
}

export class LoadEligibleItemsForDiscountIds implements Action {
  readonly type = DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_DISCOUNT_IDS;
  constructor(
    readonly discountType: string,
    readonly requestPayload: KaratOrCoinOfferEligibleItemsRequestPayload
  ) {}
}

export class LoadEligibleItemsForDiscountIdsSuccess implements Action {
  readonly type =
    DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_DISCOUNT_IDS_SUCCESS;
  constructor(readonly payload: any) {}
}

export class LoadEligibleItemsForDiscountIdsFailure implements Action {
  readonly type =
    DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_DISCOUNT_IDS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ApplyKaratOrCoinOfferDiscount implements Action {
  readonly type = DiscountActionTypes.APPLY_KARAT_OR_COIN_OFFER_DISCOUNT;
  constructor(readonly requestPayload: ApplyDiscountRequest) {}
}

export class ApplyKaratOrCoinOfferDiscountSuccess implements Action {
  readonly type =
    DiscountActionTypes.APPLY_KARAT_OR_COIN_OFFER_DISCOUNT_SUCCESS;
  constructor(readonly payload: any) {}
}

export class ApplyKaratOrCoinOfferDiscountFailure implements Action {
  readonly type =
    DiscountActionTypes.APPLY_KARAT_OR_COIN_OFFER_DISCOUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDiscountVoucherDetails implements Action {
  readonly type = DiscountActionTypes.LOAD_DISCOUNT_VOUCHER_DETAILS;
  constructor(public payload: DiscountVoucherDetailsRequestPayload) {}
}
export class LoadDiscountVoucherDetailsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_DISCOUNT_VOUCHER_DETAILS_SUCCESS;
  constructor(public payload: DiscountVoucherDetailsResponePayload) {}
}
export class LoadDiscountVoucherDetailsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_DISCOUNT_VOUCHER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CheckABCOEligibility implements Action {
  readonly type = DiscountActionTypes.CHECK_AB_CO_ELIGIBILITY;
  constructor(
    public payload: {
      data: any;
      existingDiscounts: DiscountsResponse[];
      id: string[];
    }
  ) {}
}

export class CheckABCOEligibilitySuccess implements Action {
  readonly type = DiscountActionTypes.CHECK_AB_CO_ELIGIBILITY_SUCCESS;
  constructor(
    public payload:
      | {
          discountConfigDetails: DiscountConfigDetailsResponse[];
          clubbingId: string;
        }
      | string
  ) {}
}

export class CheckABCOEligibilityFailure implements Action {
  readonly type = DiscountActionTypes.CHECK_AB_CO_ELIGIBILITY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadABCODiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_AB_CO_DISCOUNTS;
  constructor(public payload: DiscountsRequestPayload) {}
}

export class LoadABCODiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_AB_CO_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountHeaders) {}
}

export class LoadABCODiscountsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_AB_CO_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadNewABCODiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_NEW_AB_CO_DISCOUNTS;
  constructor(public payload: DiscountsRequestPayload) {}
}

export class LoadNewABCODiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_NEW_AB_CO_DISCOUNTS_SUCCESS;
  constructor(public payload: DiscountHeaders) {}
}

export class LoadNewABCODiscountsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_NEW_AB_CO_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadABCODiscountDetails implements Action {
  readonly type = DiscountActionTypes.LOAD_AB_CO_DISCOUNT_DETAILS;
  constructor(
    public payload: {
      data: any;
      existingDiscounts: DiscountsResponse[];
      id: string[];
    }
  ) {}
}

export class LoadABCODiscountDetailsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_AB_CO_DISCOUNT_DETAILS_SUCCESS;
  constructor(
    public payload: {
      discountConfigDetails: DiscountConfigDetailsResponse[];
      clubbingId: string;
    }
  ) {}
}

export class LoadABCODiscountDetailsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_AB_CO_DISCOUNT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadABCOConfigDetails implements Action {
  readonly type = DiscountActionTypes.LOAD_AB_CO_CONFIG_DETAILS;
  constructor(public payload: DiscountsRequestPayload) {}
}

export class LoadABCOConfigDetailsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_AB_CO_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: DiscountHeadersDetails) {}
}

export class LoadABCOConfigDetailsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_AB_CO_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAutoDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_AUTO_DISCOUNTS;
  constructor(public payload: AutoDiscRequest) {}
}

export class LoadAutoDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_AUTO_DISCOUNTS_SUCCESS;
  constructor(
    public payload: {
      response: {
        discountConfigDetails: DiscountConfigDetailsResponse[];
        clubbingId: string;
        cummulativeDiscountWithExcludeDetails: any;
      };
      data: CashMemoItemDetailsResponse;
    }
  ) {}
}

export class LoadAutoDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_AUTO_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadEligibleItemsForGepPurityConfig implements Action {
  readonly type = DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_GEP_PURITY_CONFIG;
  constructor(
    readonly requestPayload: GepPurityConfigIdEligibleItemsRequestPayload
  ) {}
}

export class LoadEligibleItemsForGepPurityConfigSuccess implements Action {
  readonly type =
    DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_GEP_PURITY_CONFIG_SUCCESS;
  constructor(readonly payload: any) {}
}

export class LoadEligibleItemsForGepPurityConfigFailure implements Action {
  readonly type =
    DiscountActionTypes.LOAD_ELIGIBLE_ITEMS_FOR_GEP_PURITY_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RealodDiscountsGrid implements Action {
  readonly type = DiscountActionTypes.RELOAD_GRID_ON_DISCOUNT_APPLY_DELETE;
  constructor(public payload: boolean) {}
}

export class SetOrderDiscDetails implements Action {
  readonly type = DiscountActionTypes.SET_ORDER_DISCOUNT_DETAILS;
  constructor(public payload: CashMemoDetailsResponse) {}
}

export class GetOrderDiscDetails implements Action {
  readonly type = DiscountActionTypes.GET_ORDER_DISCOUNT_DETAILS;
  constructor(public payload: CashMemoDetailsResponse) {}
}

export class ClearOrderDiscDetails implements Action {
  readonly type = DiscountActionTypes.CLEAR_ORDER_DISCOUNT_DETAILS;
}

export class LoadRivaahGHSDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_RIVAAH_GHS_DISCOUNTS;
  constructor(public paylaod: DiscountTransactionLevelRequest) {}
}

export class LoadRivaahGHSDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.LOAD_RIVAAH_GHS_DISCOUNTS_SUCCESS;
  constructor(public payload: RivaahGHSDiscounts) {}
}

export class LoadRivaahGHSDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.LOAD_RIVAAH_GHS_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveRivaahGHSDiscounts implements Action {
  readonly type = DiscountActionTypes.SAVE_RIVAAH_GHS_DISCOUNTS;
  constructor(public paylaod: ApplyDiscountRequest) {}
}
export class SaveRivaahGHSDiscountsSuccess implements Action {
  readonly type = DiscountActionTypes.SAVE_RIVAAH_GHS_DISCOUNTS_SUCCESS;
  constructor(public payload: string[]) {}
}

export class SaveRivaahGHSDiscountsFailure implements Action {
  readonly type = DiscountActionTypes.SAVE_RIVAAH_GHS_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SetEnableCalculateRivaahGHSDiscounts implements Action {
  readonly type = DiscountActionTypes.SET_ENABLE_CALCULATE_RIVAAH_GHS_DISCOUNTS;
  constructor(public payload: boolean) {}
}

export class LoadReasonForChangingDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_REASON_FOR_CHANGING_DISCOUNTS;
  constructor(public payload: string) {}
}
export class LoadReasonForChangingDiscountsSuccess implements Action {
  readonly type =
    DiscountActionTypes.LOAD_REASON_FOR_CHANGING_DISCOUNTS_SUCCESS;
  constructor(public payload: Lov[]) {}
}

export class LoadReasonForChangingDiscountsFailure implements Action {
  readonly type =
    DiscountActionTypes.LOAD_REASON_FOR_CHANGING_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReasonForNotGivingDiscounts implements Action {
  readonly type = DiscountActionTypes.LOAD_REASON_FOR_NOTGIVING_DISCOUNTS;
  constructor(public payload: string) {}
}
export class LoadReasonForNotGivingDiscountsSuccess implements Action {
  readonly type =
    DiscountActionTypes.LOAD_REASON_FOR_NOTGIVING_DISCOUNTS_SUCCESS;
  constructor(public payload: Lov[]) {}
}

export class LoadReasonForNotGivingDiscountsFailure implements Action {
  readonly type =
    DiscountActionTypes.LOAD_REASON_FOR_NOTGIVING_DISCOUNTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveExcludeSlabItemDiscount implements Action {
  readonly type = DiscountActionTypes.SAVE_EXCLUDE_SLAB_ITEM_DISCOUNT;
  constructor(public payload: DiscountsRequestPayload) {}
}

export class SaveExcludeSlabItemDiscountSuccess implements Action {
  readonly type = DiscountActionTypes.SAVE_EXCLUDE_SLAB_ITEM_DISCOUNT_SUCCESS;
  constructor(public payload: boolean) {}
}

export class SaveExcludeSlabItemDiscountFailure implements Action {
  readonly type = DiscountActionTypes.SAVE_EXCLUDE_SLAB_ITEM_DISCOUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type DiscountActions =
  | LoadItemLevelDiscounts
  | LoadItemLevelDiscountsSuccess
  | LoadItemLevelDiscountsFailure
  | LoadItemLevelDiscountsDetails
  | LoadItemLevelDiscountsDetailsSuccess
  | LoadItemLevelDiscountsDetailsFailure
  | GetItemLevelDiscounts
  | GetItemLevelDiscountsSuccess
  | GetItemLevelDiscountsFailure
  | SaveItemLevelDiscounts
  | SaveItemLevelDiscountsSuccess
  | SaveItemLevelDiscountsFailure
  | UpdateItemLevelDiscounts
  | UpdateItemLevelDiscountsSuccess
  | UpdateItemLevelDiscountsFailure
  | DeleteItemLevelDiscounts
  | DeleteItemLevelDiscountsSuccess
  | DeleteItemLevelDiscountsFailure
  | LoadTransactionLevelDiscounts
  | LoadTransactionLevelDiscountsSuccess
  | LoadTransactionLevelDiscountsFailure
  | LoadAvailableEmployeeDiscounts
  | LoadAvailableEmployeeDiscountsSuccess
  | LoadAvailableEmployeeDiscountsFailure
  | LoadAvailableTSSSDiscounts
  | LoadAvailableTSSSDiscountsSuccess
  | LoadAvailableTSSSDiscountsFailure
  | LoadAvailableTataEmployeeDiscounts
  | LoadAvailableTataEmployeeDiscountsSuccess
  | LoadAvailableTataEmployeeDiscountsFailure
  | LoadAvailableSystemDvDiscounts
  | LoadAvailableSystemDvDiscountsSuccess
  | LoadAvailableSystemDvDiscountsFailure
  | LoadAvailableEmpowementDiscounts
  | LoadAvailableEmpowementDiscountsSuccess
  | LoadAvailableEmpowementDiscountsFailure
  | ApplyDiscountAtTransactionLevel
  | ApplyDiscountAtTransactionLevelSucces
  | ApplyDiscountAtTransactionLevelFailure
  | LoadAppliedTransactionLevelDiscounts
  | LoadAppliedTransactionLevelDiscountsSuccess
  | LoadAppliedTransactionLevelDiscountsFailure
  | RemoveAllAppliedTransactionLevelDiscounts
  | RemoveAllAppliedTransactionLevelDiscountsSuccess
  | RemoveAllAppliedTransactionLevelDiscountsFailure
  | RemoveAppliedTransactionLevelDiscountByID
  | RemoveAppliedTransactionLevelDiscountByIDSuccess
  | RemoveAppliedTransactionLevelDiscountByIDFailure
  | UpdateAppliedTransactionLevelDiscount
  | UpdateAppliedTransactionLevelDiscountSuccess
  | UpdateAppliedTransactionLevelDiscountFailure
  | ConfirmAppliedTransactionLevelDiscount
  | ConfirmAppliedTransactionLevelDiscountSuccess
  | ConfirmAppliedTransactionLevelDiscountFailure
  | LoadTataCompanyNameList
  | LoadTataCompanyNameListSuccess
  | LoadTataCompanyNameListFailure
  | LoadPcDesc
  | LoadPcDescSuccess
  | LoadPcDescFailure
  | LoadPgDesc
  | LoadPgDescSuccess
  | LoadPgDescFailure
  | LoadDiscountTypes
  | LoadDiscountTypesSuccess
  | LoadDiscountTypesFailure
  | Clear
  | ClearItemLevelDiscountDetails
  | ClearTransactionLevelDiscountDetails
  | ClearUpdateItemLevelDiscountDetails
  | RefreshDiscountsAndOffersPanel
  | SetIsRsoSelected
  | ClearIsEncircleAdded
  | SetIsEncircleDetails
  | LoadEligibleItemsForDiscountIds
  | LoadEligibleItemsForDiscountIdsSuccess
  | LoadEligibleItemsForDiscountIdsFailure
  | ApplyKaratOrCoinOfferDiscount
  | ApplyKaratOrCoinOfferDiscountSuccess
  | ApplyKaratOrCoinOfferDiscountFailure
  | LoadDiscountVoucherDetails
  | LoadDiscountVoucherDetailsSuccess
  | LoadDiscountVoucherDetailsFailure
  | LoadEligibleItemsForGepPurityConfig
  | LoadEligibleItemsForGepPurityConfigSuccess
  | LoadEligibleItemsForGepPurityConfigFailure
  | CheckABCOEligibility
  | CheckABCOEligibilitySuccess
  | CheckABCOEligibilityFailure
  | LoadABCODiscounts
  | LoadABCODiscountsSuccess
  | LoadABCODiscountsFailure
  | LoadNewABCODiscounts
  | LoadNewABCODiscountsSuccess
  | LoadNewABCODiscountsFailure
  | LoadABCODiscountDetails
  | LoadABCODiscountDetailsSuccess
  | LoadABCODiscountDetailsFailure
  | LoadDigiGoldDiscounts
  | LoadDigiGoldDiscountsSuccess
  | LoadDigiGoldDiscountsFailure
  | LoadABCOConfigDetails
  | LoadABCOConfigDetailsSuccess
  | LoadABCOConfigDetailsFailure
  | LoadAutoDiscounts
  | LoadAutoDiscountsSuccess
  | LoadAutoDiscountsFailure
  | RemoveDigiDiscount
  | RemoveDigiDiscountSuccess
  | RemoveDigiDiscountFailure
  | SetDiscountState
  | ClearEncircle
  | RealodDiscountsGrid
  | SetOrderDiscDetails
  | GetOrderDiscDetails
  | ClearOrderDiscDetails
  | LoadRivaahGHSDiscounts
  | LoadRivaahGHSDiscountsSuccess
  | LoadRivaahGHSDiscountsFailure
  | SaveRivaahGHSDiscounts
  | SaveRivaahGHSDiscountsSuccess
  | SaveRivaahGHSDiscountsFailure
  | SetEnableCalculateRivaahGHSDiscounts
  | LoadReasonForChangingDiscounts
  | LoadReasonForChangingDiscountsSuccess
  | LoadReasonForChangingDiscountsFailure
  | LoadReasonForNotGivingDiscounts
  | LoadReasonForNotGivingDiscountsSuccess
  | LoadReasonForNotGivingDiscountsFailure
  | LoadGrnMultipleDiscounts
  | LoadGrnMultipleDiscountsSuccess
  | LoadGrnMultipleDiscountsFailure
  | SaveExcludeSlabItemDiscount
  | SaveExcludeSlabItemDiscountSuccess
  | SaveExcludeSlabItemDiscountFailure;
