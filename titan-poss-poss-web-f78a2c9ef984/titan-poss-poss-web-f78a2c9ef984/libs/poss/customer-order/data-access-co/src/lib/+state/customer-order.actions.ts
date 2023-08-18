import { Action } from '@ngrx/store';
import {
  CODetailsRequestPayload,
  CODetailsResponse,
  COMOrders,
  CreateCOResponse,
  CustomErrors,
  Lov
} from '@poss-web/shared/models';

export enum CustomerOrderActionTypes {
  FETCH_CO = '[Customer Order] Fetch CO',
  FETCH_CO_SUCCESS = '[Customer Order] Fetch CO Success',
  FETCH_CO_FAILURE = '[Customer Order] Fetch CO Failure',

  CREATE_CO = '[Customer Order] Create CO',
  CREATE_CO_SUCCESS = '[Customer Order] Create CO Success',
  CREATE_CO_FAILURE = '[Customer Order] Create CO Failure',

  VIEW_CO = '[Customer Order] View CO',
  VIEW_CO_SUCCESS = '[Customer Order] View CO Success',
  VIEW_CO_FAILURE = '[Customer Order] View CO Failure',

  UPDATE_CO = '[Customer Order] Update CO',
  UPDATE_CO_SUCCESS = '[Customer Order] Update CO Success',
  UPDATE_CO_FAILURE = '[Customer Order] Update CO Failure',

  PARTIAL_UPDATE_CO = '[Customer Order] Partial Update CO',
  PARTIAL_UPDATE_CO_SUCCESS = '[Customer Order] Partial Update CO Success',
  PARTIAL_UPDATE_CO_FAILURE = '[Customer Order] Partial Update CO Failure',

  DELETE_CO = '[Customer Order] Delete CO',
  DELETE_CO_SUCCESS = '[Customer Order] Delete CO Success',
  DELETE_CO_FAILURE = '[Customer Order] Delete CO Failure',

  LOAD_RELATIONSHIP_TYPES = '[Customer Order] Load Relationship Types',
  LOAD_RELATIONSHIP_TYPES_SUCCESS = '[Customer Order] Load Relationship Types Success',
  LOAD_RELATIONSHIP_TYPES_FAILURE = '[Customer Order] Load Relationship Types Failure',

  UPDATE_PRICE_DETAILS = '[Customer Order]  Update Price Details',
  UPDATE_PRICE_DETAILS_SUCCESS = '[Customer Order]  Update Price Details Success',
  UPDATE_PRICE_DETAILS_FAILURE = '[Customer Order]  Update Price Details Failure',

  RESET_FETCHED_CO = '[Customer Order] Reset Fetched CO',
  RESET_CO_RES = '[Customer Order] Reset CO Res'
}

export class FetchCO implements Action {
  readonly type = CustomerOrderActionTypes.FETCH_CO;
  constructor(readonly payload: CODetailsRequestPayload) {}
}

export class FetchCOSuccess implements Action {
  readonly type = CustomerOrderActionTypes.FETCH_CO_SUCCESS;
  constructor(readonly payload: COMOrders[]) {}
}

export class FetchCOFailure implements Action {
  readonly type = CustomerOrderActionTypes.FETCH_CO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class CreateCO implements Action {
  readonly type = CustomerOrderActionTypes.CREATE_CO;
  constructor(readonly payload: CODetailsRequestPayload) {}
}

export class CreateCOSuccess implements Action {
  readonly type = CustomerOrderActionTypes.CREATE_CO_SUCCESS;
  constructor(readonly payload: CreateCOResponse) {}
}

export class CreateCOFailure implements Action {
  readonly type = CustomerOrderActionTypes.CREATE_CO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ViewCO implements Action {
  readonly type = CustomerOrderActionTypes.VIEW_CO;
  constructor(readonly payload: CODetailsRequestPayload) {}
}

export class ViewCOSuccess implements Action {
  readonly type = CustomerOrderActionTypes.VIEW_CO_SUCCESS;
  constructor(readonly payload: CODetailsResponse) {}
}

export class ViewCOFailure implements Action {
  readonly type = CustomerOrderActionTypes.VIEW_CO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UpdateCO implements Action {
  readonly type = CustomerOrderActionTypes.UPDATE_CO;
  constructor(readonly payload: CODetailsRequestPayload) {}
}

export class UpdateCOSuccess implements Action {
  readonly type = CustomerOrderActionTypes.UPDATE_CO_SUCCESS;
  constructor(readonly payload: CODetailsResponse) {}
}

export class UpdateCOFailure implements Action {
  readonly type = CustomerOrderActionTypes.UPDATE_CO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PartialUpdateCO implements Action {
  readonly type = CustomerOrderActionTypes.PARTIAL_UPDATE_CO;
  constructor(readonly payload: CODetailsRequestPayload) {}
}

export class PartialUpdateCOSuccess implements Action {
  readonly type = CustomerOrderActionTypes.PARTIAL_UPDATE_CO_SUCCESS;
  constructor(readonly payload: CODetailsResponse) {}
}

export class PartialUpdateCOFailure implements Action {
  readonly type = CustomerOrderActionTypes.PARTIAL_UPDATE_CO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class DeleteCO implements Action {
  readonly type = CustomerOrderActionTypes.DELETE_CO;
  constructor(readonly payload: CODetailsRequestPayload) {}
}

export class DeleteCOSuccess implements Action {
  readonly type = CustomerOrderActionTypes.DELETE_CO_SUCCESS;
  constructor(readonly payload: boolean) {}
}

export class DeleteCOFailure implements Action {
  readonly type = CustomerOrderActionTypes.DELETE_CO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadRelationshipTypes implements Action {
  readonly type = CustomerOrderActionTypes.LOAD_RELATIONSHIP_TYPES;
  constructor(public payload: string) {}
}

export class LoadRelationshipTypesSuccess implements Action {
  readonly type = CustomerOrderActionTypes.LOAD_RELATIONSHIP_TYPES_SUCCESS;
  constructor(public payload: Lov[]) {}
}

export class LoadRelationshipTypesFailure implements Action {
  readonly type = CustomerOrderActionTypes.LOAD_RELATIONSHIP_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetFetchedCO implements Action {
  readonly type = CustomerOrderActionTypes.RESET_FETCHED_CO;
}

export class ResetCORes implements Action {
  readonly type = CustomerOrderActionTypes.RESET_CO_RES;
}

export class UpdatePriceDetails implements Action {
  readonly type = CustomerOrderActionTypes.UPDATE_PRICE_DETAILS;
  constructor(
    readonly payload: CODetailsRequestPayload,
    readonly action?: string
  ) {}
}

export class UpdatePriceDetailsSuccess implements Action {
  readonly type = CustomerOrderActionTypes.UPDATE_PRICE_DETAILS_SUCCESS;
  constructor(readonly payload: CODetailsResponse) {}
}

export class UpdatePriceDetailsFailure implements Action {
  readonly type = CustomerOrderActionTypes.UPDATE_PRICE_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export type CustomerOrderActions =
  | FetchCO
  | FetchCOSuccess
  | FetchCOFailure
  | CreateCO
  | CreateCOSuccess
  | CreateCOFailure
  | ViewCO
  | ViewCOSuccess
  | ViewCOFailure
  | UpdateCO
  | UpdateCOSuccess
  | UpdateCOFailure
  | PartialUpdateCO
  | PartialUpdateCOSuccess
  | PartialUpdateCOFailure
  | DeleteCO
  | DeleteCOSuccess
  | DeleteCOFailure
  | LoadRelationshipTypes
  | LoadRelationshipTypesSuccess
  | LoadRelationshipTypesFailure
  | ResetFetchedCO
  | ResetCORes
  | UpdatePriceDetails
  | UpdatePriceDetailsSuccess
  | UpdatePriceDetailsFailure;
