import { Action } from '@ngrx/store';
import {
  LoadPendingCMPayload,
  PendingCMResponsePayload,
  LoadPendingFocSchemesPayload,
  LoadFocItemDetailsPayload,
  FocItemDetailsResponsePayload,
  CustomErrors,
  IssuePendingFocConfirmationPayload,
  IssuepPendingFocPayload,
  AvailableSchemesPayload,
  FocSchemeRequestDto,
  FocSchemeDetailsDto,
  AddFocToCmResponsePayload,
  AddFocToCMPayload,
  CmFocPayload,
  PendingFocSchemesResponsePayload,
  KeepFocPendingPayload,
  OrderDetailsForFOC,
  ABFocSchemeDetailsDto,
  ManualFocDetailsDto,
  ValidateManualFocPayload,
  AddManualFocToCMPayload,
  VerifyManualFocPayload
} from '@poss-web/shared/models';

export enum FocActionTypes {
  LOAD_PENDING_FOC_CM = '[FOC] Load Pending FOC CM',
  LOAD_PENDING_FOC_CM_SUCCESS = '[FOC] Load Pending FOC CM SUCCESS',
  LOAD_PENDING_FOC_CM_FAILURE = '[FOC] Load Pending FOC CM FAILURE',

  SET_SELECTED_FOC_PENDIND_CM = '[FOC] Set Selected Foc Pending CM',
  GET_SELECTED_FOC_PENDIND_CM = '[FOC] Get Selected Foc Pending CM',

  LOAD_PENDING_FOC_SCHEME = '[FOC] Load Pending FOC Scheme',
  LOAD_PENDING_FOC_SCHEME_SUCCESS = '[FOC] Load Pending FOC Scheme Success',
  LOAD_PENDING_FOC_SCHEME_FAILURE = '[FOC] Load Pending FOC Scheme Failure',

  LOAD_FOC_ITEM_DETAILS = '[FOC] Load FOC Item Details',
  LOAD_FOC_ITEM_DETAILS_SUCCESS = '[FOC] Load FOC Item Details Success',
  LOAD_FOC_ITEM_DETAILS_FAILURE = '[FOC] Load FOC Item Details Failure',

  ISSUE_PENDING_FOC = '[FOC] Issue Pending FOC',
  ISSUE_PENDING_FOC_SUCCESS = '[FOC] Issue Pending FOC Success',
  ISSUE_PENDING_FOC_FAILURE = '[FOC] Issue Pending FOC Failure',

  // SET_FOC_ITEMS = '[FOC] Set FOC Items',

  RESET_FOC_DATA = '[FOC] Reset Issue Pending FOC Data',

  LOAD_CONFIGURED_FOC_SCHEMES = '[FOC] Load Configured FOC Schemes',
  LOAD_CONFIGURED_FOC_SCHEMES_SUCCESS = '[FOC] Load Configured FOC Schemes Success',
  LOAD_CONFIGURED_FOC_SCHEMES_FAILURE = '[FOC] Load Configured FOC Schemes Failure',

  LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS = '[FOC] Load Available FOC Schemes and Items',
  LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS_SUCCESS = '[FOC] Load Available FOC Schemes and Items Success',
  LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS_FAILURE = '[FOC] Load Available FOC Schemes and Items Failure',

  ADD_FOC_TO_CM = '[FOC] Add FOC To CashMemo',
  ADD_FOC_TO_CM_SUCCESS = '[FOC] Add FOC To CashMemo Success',
  ADD_FOC_TO_CM_FAILURE = '[FOC] Add FOC To CashMemo Failure',

  ADD_MANUAL_FOC_TO_CM = '[FOC] Add Manual FOC To CashMemo',
  ADD_MANUAL_FOC_TO_CM_SUCCESS = '[FOC] Add Manual FOC To CashMemo Success',
  ADD_MANUAL_FOC_TO_CM_FAILURE = '[FOC] Add Manual FOC To CashMemo Failure',

  DELETE_FOC_FROM_CM = '[FOC] Delete FOC From CashMemo',
  DELETE_FOC_FROM_CM_SUCCESS = '[FOC] Delete FOC From CashMemo Success',
  DELETE_FOC_FROM_CM_FAILURE = '[FOC] Delete FOC From CashMemo Failure',

  DELETE_MANUAL_FOC_FROM_CM = '[FOC] Delete Manual FOC From CashMemo',
  DELETE_MANUAL_FOC_FROM_CM_SUCCESS = '[FOC] Delete Manual FOC From CashMemo Success',
  DELETE_MANUAL_FOC_FROM_CM_FAILURE = '[FOC] Delete Manual FOC From CashMemo Failure',

  GET_FOC_ASSIGNED_TO_CM = '[FOC] Get FOC Assigned To CM',
  GET_FOC_ASSIGNED_TO_CM_SUCCESS = '[FOC] Get FOC Assigned To CM Success',
  GET_FOC_ASSIGNED_TO_CM_FAILURE = '[FOC] Get FOC Assigned To CM Failure',
  GET_MANUAL_FOC_ASSIGNED_TO_CM = '[FOC] Get Manual FOC Assigned To CM',
  GET_MANUAL_FOC_ASSIGNED_TO_CM_SUCCESS = '[FOC] Get Manual FOC Assigned To CM Success',
  GET_MANUAL_FOC_ASSIGNED_TO_CM_FAILURE = '[FOC] Get Manual FOC Assigned To CM Failure',

  KEEP_FOC_PENDING = '[FOC] Keep FOC as Pending',
  KEEP_FOC_PENDING_SUCCESS = '[FOC] Keep FOC as Pending Success',
  KEEP_FOC_PENDING_FAILURE = '[FOC] Keep FOC as Pending Failure',

  SET_PENDING_FOC_TRIGGER = '[FOC] Set Keep FOC Pending Trigger',

  LOAD_FOC_SCHEME_ITEMS = '[FOC] Load FOC Scheme for Items',
  LOAD_FOC_SCHEME_ITEMS_SUCCESS = '[FOC] Load FOC Scheme for Items Success',
  LOAD_FOC_SCHEME_ITEMS_FAILURE = '[FOC] Load FOC Scheme for Items Failure',
  CLEAR_FOC_SCHEME_ITEMS = '[FOC] Clear FOC Scheme for Items',

  LOAD_AB_FOC_SCHEMES = '[FOC] Load AB FOC Schemes',
  LOAD_AB_FOC_SCHEMES_SUCCESS = '[FOC] Load AB FOC Schemes Success',
  LOAD_AB_FOC_SCHEMES_FAILURE = '[FOC] Load AB FOC Schemes Failure',

  LOAD_AB_FOC_SCHEMES_FOR_ITEMS = '[FOC] Load AB FOC Schemes for Items',
  LOAD_AB_FOC_SCHEMES_FOR_ITEMS_SUCCESS = '[FOC] Load AB FOC Schemes for Items Success',
  LOAD_AB_FOC_SCHEMES_FOR_ITEMS_FAILURE = '[FOC] Load AB FOC Schemes for Items Failure',

  SAVE_AB_FOC_SCHEMES = '[FOC] Save AB FOC Schemes',
  SAVE_AB_FOC_SCHEMES_SUCCESS = '[FOC] Save AB FOC Schemes Success',
  SAVE_AB_FOC_SCHEMES_FAILURE = '[FOC] Save AB FOC Schemes Failure',

  DELETE_AB_FOC_SCHEMES = '[FOC] Delete AB FOC Schemes',
  DELETE_AB_FOC_SCHEMES_SUCCESS = '[FOC] Delete AB FOC Schemes Success',
  DELETE_AB_FOC_SCHEMES_FAILURE = '[FOC] Delete AB FOC Schemes Failure',

  LOAD_SELECTED_AB_FOC_SCHEMES = '[FOC] Load Selected AB FOC Schemes',
  LOAD_SELECTED_AB_FOC_SCHEMES_SUCCESS = '[FOC] Load Selected AB FOC Schemes Success',
  LOAD_SELECTED_AB_FOC_SCHEMES_FAILURE = '[FOC] Load  Selected AB FOC Schemes Failure',

  LOAD_SELECTED_AB_FOC_SCHEMES_COUNT = '[FOC] Load Selected AB FOC Schemes Count',
  LOAD_SELECTED_AB_FOC_SCHEMES_COUNT_SUCCESS = '[FOC] Load Selected AB FOC Schemes Count Success',
  LOAD_SELECTED_AB_FOC_SCHEMES_COUNT_FAILURE = '[FOC] Load  Selected AB FOC Schemes Count cFailure',

  CLEAR_AB_FOC_SCHEME = '[FOC] Clear AB FOC Schemes',
  CLEAR_AB_FOC_SCHEME_COUNT = '[FOC] Clear AB FOC Schemes Count',

  LOAD_MANUAL_FOC_ITEMS = '[FOC] Load Manual FOC Items',
  LOAD_MANUAL_FOC_ITEMS_SUCCESS = '[FOC] Load Manual FOC Items Success',
  LOAD_MANUAL_FOC_ITEMS_FAILURE = '[FOC] Load Manual FOC Items Failure',

  LOAD_MANUAL_FOC_ITEM_DETAILS = '[FOC] Load Manual FOC Item Details',
  LOAD_MANUAL_FOC_ITEM_DETAILS_SUCCESS = '[FOC] Load Manual FOC Item Details Success',
  LOAD_MANUAL_FOC_ITEM_DETAILS_FAILURE = '[FOC] Load Manual FOC Item Details Failure',

  VALIDATE_MANUAL_FOC = '[FOC] Validate Manual Foc',
  VALIDATE_MANUAL_FOC_SUCCESS = '[FOC] Validate Manual Foc Success',
  VALIDATE_MANUAL_FOC_FAILURE = '[FOC] Validate Manual Foc Failure',
  CLEAR_VALIDATED_MANUAL_FOC = '[FOC] Clear Validated Manual FOC',
  VERIFY_MANUAL_FOC = '[FOC] Verify Manual Foc',
  VERIFY_MANUAL_FOC_SUCCESS = '[FOC] Verify Manual Foc Success',
  VERIFY_MANUAL_FOC_FAILURE = '[FOC] Verify Manual Foc Failure',
  CLEAR_VERIFY_MANUAL_FOC = '[FOC] Clear Verify Manual FOC'
}
export class LoadPendingFocCM implements Action {
  readonly type = FocActionTypes.LOAD_PENDING_FOC_CM;
  constructor(readonly payload: LoadPendingCMPayload) {}
}
export class LoadPendingFocCMSuccess implements Action {
  readonly type = FocActionTypes.LOAD_PENDING_FOC_CM_SUCCESS;
  constructor(readonly payload: PendingCMResponsePayload[]) {}
}
export class LoadPendingFocCMFailure implements Action {
  readonly type = FocActionTypes.LOAD_PENDING_FOC_CM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class SetSelectedFocCM implements Action {
  readonly type = FocActionTypes.SET_SELECTED_FOC_PENDIND_CM;
  constructor(readonly payload: PendingCMResponsePayload) {}
}

export class LoadPendingFocScheme implements Action {
  readonly type = FocActionTypes.LOAD_PENDING_FOC_SCHEME;
  constructor(readonly payload: LoadPendingFocSchemesPayload) {}
}
export class LoadPendingFocSchemeSuccess implements Action {
  readonly type = FocActionTypes.LOAD_PENDING_FOC_SCHEME_SUCCESS;
  constructor(readonly payload: PendingFocSchemesResponsePayload) {}
}
export class LoadPendingFocSchemeFailure implements Action {
  readonly type = FocActionTypes.LOAD_PENDING_FOC_SCHEME_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadFocItemDetails implements Action {
  readonly type = FocActionTypes.LOAD_FOC_ITEM_DETAILS;
  constructor(readonly payload: LoadFocItemDetailsPayload) {}
}
export class LoadFocItemDetailsSuccess implements Action {
  readonly type = FocActionTypes.LOAD_FOC_ITEM_DETAILS_SUCCESS;
  constructor(readonly payload: FocItemDetailsResponsePayload[]) {}
}
export class LoadFocItemDetailsFailure implements Action {
  readonly type = FocActionTypes.LOAD_FOC_ITEM_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ValidateManualFoc implements Action {
  readonly type = FocActionTypes.VALIDATE_MANUAL_FOC;
  constructor(readonly payload: ValidateManualFocPayload) {}
}
export class ValidateManualFocSuccess implements Action {
  readonly type = FocActionTypes.VALIDATE_MANUAL_FOC_SUCCESS;
  constructor(readonly payload: any) {}
}
export class ValidateManualFocFailure implements Action {
  readonly type = FocActionTypes.VALIDATE_MANUAL_FOC_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class VerifyManualFoc implements Action {
  readonly type = FocActionTypes.VERIFY_MANUAL_FOC;
  constructor(readonly payload: VerifyManualFocPayload) {}
}
export class VerifyManualFocSuccess implements Action {
  readonly type = FocActionTypes.VERIFY_MANUAL_FOC_SUCCESS;
}
export class VerifyManualFocFailure implements Action {
  readonly type = FocActionTypes.VERIFY_MANUAL_FOC_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadManualFocItemDetails implements Action {
  readonly type = FocActionTypes.LOAD_MANUAL_FOC_ITEM_DETAILS;
  constructor(readonly payload: LoadFocItemDetailsPayload) {}
}
export class LoadManualFocItemDetailsSuccess implements Action {
  readonly type = FocActionTypes.LOAD_MANUAL_FOC_ITEM_DETAILS_SUCCESS;
  constructor(readonly payload: FocItemDetailsResponsePayload[]) {}
}
export class LoadManualFocItemDetailsFailure implements Action {
  readonly type = FocActionTypes.LOAD_MANUAL_FOC_ITEM_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class IssuePendingFOC implements Action {
  readonly type = FocActionTypes.ISSUE_PENDING_FOC;
  constructor(readonly payload: IssuepPendingFocPayload) {}
}
export class IssuePendingFOCSuccess implements Action {
  readonly type = FocActionTypes.ISSUE_PENDING_FOC_SUCCESS;
  constructor(readonly payload: IssuePendingFocConfirmationPayload) {}
}
export class IssuePendingFOCFailure implements Action {
  readonly type = FocActionTypes.ISSUE_PENDING_FOC_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

// export class SetFocItems implements Action {
//   readonly type = FocActionTypes.SET_FOC_ITEMS;
//   constructor(readonly payload: any[]) {}
// }

export class ResetFocData implements Action {
  readonly type = FocActionTypes.RESET_FOC_DATA;
}

export class LoadConfiguredFocSchemes implements Action {
  readonly type = FocActionTypes.LOAD_CONFIGURED_FOC_SCHEMES;
}
export class LoadConfiguredFocSchemesSuccess implements Action {
  readonly type = FocActionTypes.LOAD_CONFIGURED_FOC_SCHEMES_SUCCESS;
  constructor(readonly payload: AvailableSchemesPayload[]) {}
}
export class LoadConfiguredFocSchemesFailure implements Action {
  readonly type = FocActionTypes.LOAD_CONFIGURED_FOC_SCHEMES_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadFocSchemesAndItems implements Action {
  readonly type = FocActionTypes.LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS;
  constructor(readonly payload: FocSchemeRequestDto) {}
}
export class LoadFocSchemesAndItemsSuccess implements Action {
  readonly type = FocActionTypes.LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS_SUCCESS;
  constructor(readonly payload: FocSchemeDetailsDto[]) {}
}
export class LoadFocSchemesAndItemsFailure implements Action {
  readonly type = FocActionTypes.LOAD_AVAILABLE_FOC_SCHEMES_AND_ITEMS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class AddFocToCm implements Action {
  readonly type = FocActionTypes.ADD_FOC_TO_CM;
  constructor(readonly payload: AddFocToCMPayload) {}
}
export class AddFocToCmSuccess implements Action {
  readonly type = FocActionTypes.ADD_FOC_TO_CM_SUCCESS;
  constructor(readonly payload: AddFocToCmResponsePayload[]) {}
}
export class AddFocToCmFailure implements Action {
  readonly type = FocActionTypes.ADD_FOC_TO_CM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class AddManualFocToCm implements Action {
  readonly type = FocActionTypes.ADD_MANUAL_FOC_TO_CM;
  constructor(readonly payload: AddManualFocToCMPayload) {}
}
export class AddManualFocToCmSuccess implements Action {
  readonly type = FocActionTypes.ADD_MANUAL_FOC_TO_CM_SUCCESS;
  constructor(readonly payload: AddFocToCmResponsePayload[]) {}
}
export class AddManualFocToCmFailure implements Action {
  readonly type = FocActionTypes.ADD_MANUAL_FOC_TO_CM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class DeleteFocFromCm implements Action {
  readonly type = FocActionTypes.DELETE_FOC_FROM_CM;
  constructor(readonly payload: CmFocPayload) {}
}
export class DeleteFocFromCmSuccess implements Action {
  readonly type = FocActionTypes.DELETE_FOC_FROM_CM_SUCCESS;
  constructor(readonly payload: boolean) {}
}
export class DeleteFocFromCmFailure implements Action {
  readonly type = FocActionTypes.DELETE_FOC_FROM_CM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class DeleteManualFocFromCm implements Action {
  readonly type = FocActionTypes.DELETE_MANUAL_FOC_FROM_CM;
  constructor(readonly payload: CmFocPayload) {}
}
export class DeleteManualFocFromCmSuccess implements Action {
  readonly type = FocActionTypes.DELETE_MANUAL_FOC_FROM_CM_SUCCESS;
  constructor(readonly payload: boolean) {}
}
export class DeleteManualFocFromCmFailure implements Action {
  readonly type = FocActionTypes.DELETE_MANUAL_FOC_FROM_CM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class GetFocAssignedToCm implements Action {
  readonly type = FocActionTypes.GET_FOC_ASSIGNED_TO_CM;
  constructor(readonly payload: CmFocPayload) {}
}

export class GetManualFocAssignedToCm implements Action {
  readonly type = FocActionTypes.GET_MANUAL_FOC_ASSIGNED_TO_CM;
  constructor(readonly payload: CmFocPayload) {}
}
export class GetFocAssignedToCmSuccess implements Action {
  readonly type = FocActionTypes.GET_FOC_ASSIGNED_TO_CM_SUCCESS;
  constructor(readonly payload: AddFocToCmResponsePayload[]) {}
}

export class GetManualFocAssignedToCmSuccess implements Action {
  readonly type = FocActionTypes.GET_MANUAL_FOC_ASSIGNED_TO_CM_SUCCESS;
  constructor(readonly payload: AddFocToCmResponsePayload[]) {}
}
export class GetFocAssignedToCmFailure implements Action {
  readonly type = FocActionTypes.GET_FOC_ASSIGNED_TO_CM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetManualFocAssignedToCmFailure implements Action {
  readonly type = FocActionTypes.GET_MANUAL_FOC_ASSIGNED_TO_CM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class KeepFocPending implements Action {
  readonly type = FocActionTypes.KEEP_FOC_PENDING;
  constructor(readonly payload: KeepFocPendingPayload) {}
}
export class KeepFocPendingSuccess implements Action {
  readonly type = FocActionTypes.KEEP_FOC_PENDING_SUCCESS;
  constructor(readonly payload: string[]) {}
}
export class KeepFocPendingFailure implements Action {
  readonly type = FocActionTypes.KEEP_FOC_PENDING_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetKeepFocPendingTrigger implements Action {
  readonly type = FocActionTypes.SET_PENDING_FOC_TRIGGER;
  constructor(readonly payload: boolean) {}
}

export class LoadFocSchemesForItems implements Action {
  readonly type = FocActionTypes.LOAD_FOC_SCHEME_ITEMS;
  constructor(readonly payload: FocSchemeRequestDto) {}
}
export class LoadFocSchemesForItemsSuccess implements Action {
  readonly type = FocActionTypes.LOAD_FOC_SCHEME_ITEMS_SUCCESS;
  constructor(readonly payload: FocSchemeDetailsDto[]) {}
}
export class LoadFocSchemesForItemsFailure implements Action {
  readonly type = FocActionTypes.LOAD_FOC_SCHEME_ITEMS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadManuaFocItems implements Action {
  readonly type = FocActionTypes.LOAD_MANUAL_FOC_ITEMS;
  constructor(readonly payload: string) {}
}
export class LoadManuaFocItemsSuccess implements Action {
  readonly type = FocActionTypes.LOAD_MANUAL_FOC_ITEMS_SUCCESS;
  constructor(readonly payload: ManualFocDetailsDto[]) {}
}
export class LoadManuaFocItemsFailure implements Action {
  readonly type = FocActionTypes.LOAD_MANUAL_FOC_ITEMS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class ClearLoadFocSchemesForItems implements Action {
  readonly type = FocActionTypes.CLEAR_FOC_SCHEME_ITEMS;
}

// AB FOC

export class LoadABFocSchemes implements Action {
  readonly type = FocActionTypes.LOAD_AB_FOC_SCHEMES;
  constructor(readonly payload: FocSchemeRequestDto) {}
}
export class LoadABFocSchemesSuccess implements Action {
  readonly type = FocActionTypes.LOAD_AB_FOC_SCHEMES_SUCCESS;
  constructor(readonly payload: FocSchemeDetailsDto[]) {}
}
export class LoadABFocSchemesFailure implements Action {
  readonly type = FocActionTypes.LOAD_AB_FOC_SCHEMES_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadABFocSchemesForItems implements Action {
  readonly type = FocActionTypes.LOAD_AB_FOC_SCHEMES_FOR_ITEMS;
  constructor(readonly payload: FocSchemeRequestDto) {}
}
export class LoadABFocSchemesForItemsSuccess implements Action {
  readonly type = FocActionTypes.LOAD_AB_FOC_SCHEMES_FOR_ITEMS_SUCCESS;
  constructor(readonly payload: FocSchemeDetailsDto[]) {}
}
export class LoadABFocSchemesForItemsFailure implements Action {
  readonly type = FocActionTypes.LOAD_AB_FOC_SCHEMES_FOR_ITEMS_FAILURE;
  // constructor(readonly payload: CustomErrors) {}
}

export class SaveABFocSchemes implements Action {
  readonly type = FocActionTypes.SAVE_AB_FOC_SCHEMES;
  constructor(readonly payload: OrderDetailsForFOC) {}
}
export class SaveABFocSchemesSuccess implements Action {
  readonly type = FocActionTypes.SAVE_AB_FOC_SCHEMES_SUCCESS;
  constructor(readonly payload: ABFocSchemeDetailsDto[]) {}
}
export class SaveABFocSchemesFailure implements Action {
  readonly type = FocActionTypes.SAVE_AB_FOC_SCHEMES_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class DeleteABFocSchemes implements Action {
  readonly type = FocActionTypes.DELETE_AB_FOC_SCHEMES;
  constructor(readonly payload: OrderDetailsForFOC) {}
}
export class DeleteABFocSchemesSuccess implements Action {
  readonly type = FocActionTypes.DELETE_AB_FOC_SCHEMES_SUCCESS;
  constructor(readonly payload: boolean) {}
}
export class DeleteABFocSchemesFailure implements Action {
  readonly type = FocActionTypes.DELETE_AB_FOC_SCHEMES_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadSelectedABFocSchemes implements Action {
  readonly type = FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES;
  constructor(readonly payload: OrderDetailsForFOC) {}
}
export class LoadSelectedABFocSchemesSuccess implements Action {
  readonly type = FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_SUCCESS;
  constructor(readonly payload: ABFocSchemeDetailsDto[]) {}
}
export class LoadSelectedABFocSchemesFailure implements Action {
  readonly type = FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadSelectedABFocSchemesCount implements Action {
  readonly type = FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_COUNT;
  constructor(readonly payload: OrderDetailsForFOC) {}
}
export class LoadSelectedABFocSchemesCountSuccess implements Action {
  readonly type = FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_COUNT_SUCCESS;
  constructor(readonly payload: number) {}
}
export class LoadSelectedABFocSchemesCountFailure implements Action {
  readonly type = FocActionTypes.LOAD_SELECTED_AB_FOC_SCHEMES_COUNT_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ClearABFocSchemes implements Action {
  readonly type = FocActionTypes.CLEAR_AB_FOC_SCHEME;
}

export class ClearABFocSchemesCount implements Action {
  readonly type = FocActionTypes.CLEAR_AB_FOC_SCHEME_COUNT;
}

export class ClearValidatedManualFoc implements Action {
  readonly type = FocActionTypes.CLEAR_VALIDATED_MANUAL_FOC;
}

export class ClearVerifyManualFoc implements Action {
  readonly type = FocActionTypes.CLEAR_VERIFY_MANUAL_FOC;
}

export type FocActions =
  | LoadPendingFocCM
  | LoadPendingFocCMSuccess
  | LoadPendingFocCMFailure
  | SetSelectedFocCM
  // | GetSelectedFocCM
  | LoadPendingFocScheme
  | LoadPendingFocSchemeSuccess
  | LoadPendingFocSchemeFailure
  | LoadFocItemDetails
  | LoadFocItemDetailsSuccess
  | LoadFocItemDetailsFailure
  | IssuePendingFOC
  | IssuePendingFOCSuccess
  | IssuePendingFOCFailure
  // | SetFocItems
  | ResetFocData
  | LoadConfiguredFocSchemes
  | LoadConfiguredFocSchemesSuccess
  | LoadConfiguredFocSchemesFailure
  | LoadFocSchemesAndItems
  | LoadFocSchemesAndItemsSuccess
  | LoadFocSchemesAndItemsFailure
  | AddFocToCm
  | AddFocToCmSuccess
  | AddFocToCmFailure
  | DeleteFocFromCm
  | DeleteFocFromCmSuccess
  | DeleteFocFromCmFailure
  | GetFocAssignedToCm
  | GetFocAssignedToCmSuccess
  | GetFocAssignedToCmFailure
  | KeepFocPending
  | KeepFocPendingSuccess
  | KeepFocPendingFailure
  | SetKeepFocPendingTrigger
  | LoadFocSchemesForItems
  | LoadFocSchemesForItemsSuccess
  | LoadFocSchemesForItemsFailure
  | ClearLoadFocSchemesForItems
  // AB FOC
  | LoadABFocSchemes
  | LoadABFocSchemesSuccess
  | LoadABFocSchemesFailure
  | LoadABFocSchemesForItems
  | LoadABFocSchemesForItemsSuccess
  | LoadABFocSchemesForItemsFailure
  | SaveABFocSchemes
  | SaveABFocSchemesSuccess
  | SaveABFocSchemesFailure
  | DeleteABFocSchemes
  | DeleteABFocSchemesSuccess
  | DeleteABFocSchemesFailure
  | LoadSelectedABFocSchemes
  | LoadSelectedABFocSchemesSuccess
  | LoadSelectedABFocSchemesFailure
  | LoadSelectedABFocSchemesCount
  | LoadSelectedABFocSchemesCountSuccess
  | LoadSelectedABFocSchemesCountFailure
  | ClearABFocSchemes
  | LoadManuaFocItems
  | LoadManuaFocItemsSuccess
  | LoadManuaFocItemsFailure
  | LoadManualFocItemDetails
  | LoadManualFocItemDetailsSuccess
  | LoadManualFocItemDetailsFailure
  | ValidateManualFoc
  | ValidateManualFocSuccess
  | ValidateManualFocFailure
  | ClearValidatedManualFoc
  | AddManualFocToCm
  | AddManualFocToCmSuccess
  | AddManualFocToCmFailure
  | DeleteManualFocFromCm
  | DeleteManualFocFromCmSuccess
  | DeleteManualFocFromCmFailure
  | GetManualFocAssignedToCm
  | GetManualFocAssignedToCmSuccess
  | GetManualFocAssignedToCmFailure
  | VerifyManualFoc
  | VerifyManualFocSuccess
  | VerifyManualFocFailure
  | ClearVerifyManualFoc
  | ClearABFocSchemesCount;
