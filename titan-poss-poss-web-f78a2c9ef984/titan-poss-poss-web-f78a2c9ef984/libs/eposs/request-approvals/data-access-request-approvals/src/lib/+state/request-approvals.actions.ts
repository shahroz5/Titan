import { Action } from '@ngrx/store';
import {
  BinRequestApprovalsItems,
  BinApprovals,
  LoadBinRequestResponse,
  CustomErrors,
  RequestApprovals,
  LoadRequestResponse,
  LoadRequestResponseItems,
  RequestApprovalsItems,
  ApprovalUpdatePayload,
  LoadRequestTotalCountSuccessPayload,
  ImageReqPayload,
  ImageResponse
} from '@poss-web/shared/models';


export interface LoadBinRequestApprovalsPayload {
  pageIndex: number;
  pageSize: number;
}

export interface Ibtpayload {
  id: number;
  requestType: string;
  requestUpdateDto: {
    itemIds: string[];
    remarks: string;
    status: string;
  };
}

export interface IbtCancelPayload {
  id: number;
  stUpdateDto: {
    remarks: string;
    status: string;
  };
  transferType: string;
}

export interface SelectedStockPayload {
  id: number;
  requestType: string;
}

export interface GetIbtRequestPayload {
  id: number;
  itemCode?: string;
  requestType: string;
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: string;
  filter?: { key: string; value: any[] }[];
  isSelectedArray: string[];
}

export interface GetBinRequestPayload {
  reqDocNo?: number;
  locationCode?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface BinApprovalspayload {
  binRequestUpdateDto: BinApprovals;
  id: number;
}

export interface IbtApprovalspayload {
  id: number;
  itemId: string;
  itemUpdateDto: ApprovalUpdatePayload;
}

export interface LoadIbtRequestPayload {
  requestType: string;
  pageIndex: number;
  pageSize: number;
  reqDocNo?: number;
  reqLocationCode?: string;
}

export interface LoadIbtCancellationRequestPayload {
  requestType: string;
  pageIndex: number;
  pageSize: number;
  reqDocNo?: number;
  reqLocationCode?: string;
  sort?: string;
  status: string;
}

export interface CountPayload {
  requestType: string;
  id: number;
}

export enum RequestApprovalsActionTypes {
  LOAD_BINREQUESTAPPROVALS_COUNT = '[RequestApprovals] Load  BinRequestApprovals Count',
  LOAD_BINREQUESTAPPROVALS_COUNT_SUCCESS = '[RequestApprovals ] Load BinRequestApprovals Count Success',
  LOAD_BINREQUESTAPPROVALS_COUNT_FAILURE = '[RequestApprovals ] Load  BinRequestApprovals Count Failure',

  LOAD_BINREQUESTAPPROVALS = '[ RequestApprovals ] Load BinRequestApprovals  ',
  LOAD_BINREQUESTAPPROVALS_SUCCESS = '[ RequestApprovals] Load BinRequestApprovals Success',
  LOAD_BINREQUESTAPPROVALS_FAILURE = '[ RequestApprovals ] Load BinRequestApprovals Failure',
  SEARCH_CLEAR = '[ RequestApprovals ] Clear BinRequestApprovals  ',

  RESET_BINREQUESTAPPROVALS = '[ RequestApprovals ] Reset BinRequestApprovals List',
  RESET_BINREQUESTAPPROVALS_COUNT = '[ RequestApprovals ] Reset BinRequestApprovals Count',
  RESET_IBTREQUESTAPPROVALS = '[ RequestApprovals ] Reset IBTRequestApprovals List',
  RESET_IBTREQUESTAPPROVALS_COUNT = '[ RequestApprovals ] Reset IBTRequestApprovals Count',
  RESET_ADJREQUESTAPPROVALS = '[ RequestApprovals ] Reset ADJRequestApprovals List',
  RESET_ADJREQUESTAPPROVALS_COUNT = '[ RequestApprovals ] Reset ADJRequestApprovals Count',
  RESET_EXHREQUESTAPPROVALS = '[ RequestApprovals ] Reset EXHRequestApprovals List',
  RESET_EXHREQUESTAPPROVALS_COUNT = '[ RequestApprovals ] Reset EXHRequestApprovals Count',
  RESET_FOCREQUESTAPPROVALS = '[ RequestApprovals ] Reset FOCRequestApprovals List',
  RESET_FOCREQUESTAPPROVALS_COUNT = '[ RequestApprovals ] Reset FOCRequestApprovals Count',
  RESET_LOSSREQUESTAPPROVALS = '[ RequestApprovals ] Reset LOSSRequestApprovals List',
  RESET_LOSSREQUESTAPPROVALS_COUNT = '[ RequestApprovals ] Reset LOSSRequestApprovals Count',
  RESET_LOANREQUESTAPPROVALS = '[ RequestApprovals ] Reset LOANRequestApprovals List',
  RESET_LOANREQUESTAPPROVALS_COUNT = '[ RequestApprovals ] Reset LOANRequestApprovals Count',
  RESET_PSVREQUESTAPPROVALS = '[ RequestApprovals ] Reset PSVRequestApprovals List',
  RESET_PSVREQUESTAPPROVALS_COUNT = '[ RequestApprovals ] Reset PSVRequestApprovals Count',
  RESET_REQUESTAPPROVALSITEMS = '[ RequestApprovals ] Reset RequestApprovalsItems List',
  RESET_REQUESTAPPROVALSITEMS_COUNT = '[ RequestApprovals ] Reset RequestApprovalsItems Count',
  RESET_UPDATE = '[ RequestApprovals ] Reset UPDATE List',
  RESET_ERROR = '[ RequestApprovals ] Reset ERROR ',

  LOAD_STUDDED_PRODUCT_GROUPS = '[RequestApprovals]  Load Studded Product Groups ',
  LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS = '[RequestApprovals]  Load Studded Product Groups Success ',
  LOAD_STUDDED_PRODUCT_GROUPS_FAILURE = '[RequestApprovals]  Load Studded Product Groups Failure ',

  UPDATE_BINREQUESTAPPROVALS = '[ RequestApprovals ] Update item',
  UPDATE_BINREQUESTAPPROVALS_SUCCESS = '[ RequestApprovals ] Update item success',
  UPDATE_BINREQUESTAPPROVALS_FAILURE = '[ RequestApprovals ] Update item Failure',

  LOAD_LOCATION_COUNT = '[RequestApprovals] Load  Location Count',
  LOAD_LOCATION_COUNT_SUCCESS = '[RequestApprovals ] Load Location Count Success',
  LOAD_LOCATION_COUNT_FAILURE = '[RequestApprovals ] Load  Location Count Failure',

  LOAD_LOCATION = '[ RequestApprovals ] Load Location',
  LOAD_LOCATION_SUCCESS = '[ RequestApprovals] Load Location Success',
  LOAD_LOCATION_FAILURE = '[ RequestApprovals ] Load location Failure',

  LOAD_IBT_REQUEST = '[  RequestApprovals] Load Ibt Request',
  LOAD_IBT_REQUEST_SUCCESS = '[  RequestApprovals] Load Ibt Request Success',
  LOAD_IBT_REQUEST_FAILURE = '[  RequestApprovals] Load Ibt Request Failure',

  LOAD_IBT_CANCELLATION_REQUEST = '[  RequestApprovals] Load Ibt Canccellation Request',
  LOAD_IBT_REQUEST_CANCELLATION_SUCCESS = '[  RequestApprovals] Load Ibt Request Cancellation Success',
  LOAD_IBT_REQUEST_CANCELLATION_FAILURE = '[  RequestApprovals] Load Ibt Request Cancellation Failure',

  LOAD_SELECTED_REQUEST = '[ RequestApprovals ] Load selected request ',
  LOAD_SELECTED_REQUEST_SUCCESS = '[ RequestApprovals ] Load selected request Success',
  LOAD_SELECTED_REQUEST_FAILURE = '[ RequestApprovals ] Load selected request Failure',

  LOAD_SELECTED_CANCELLATION_REQUEST = '[ RequestApprovals ] Load selected Cancellation request ',
  LOAD_SELECTED_CANCELLATION_REQUEST_SUCCESS = '[ RequestApprovals ] Load selected request Cancellation Success',
  LOAD_SELECTED_CANCELLATION_REQUEST_FAILURE = '[ RequestApprovals ] Load selected request CancelllationFailure',

  LOAD_ADJ_REQUEST = '[  RequestApprovals] Load ADJ Request',
  LOAD_ADJ_REQUEST_SUCCESS = '[  RequestApprovals] Load ADJ Request Success',
  LOAD_ADJ_REQUEST_FAILURE = '[  RequestApprovals] Load ADJ Request Failure',

  LOAD_ADJ_SELECTED_REQUEST = '[ RequestApprovals ] Load selected ADJ request ',
  LOAD_ADJ_SELECTED_REQUEST_SUCCESS = '[ RequestApprovals ] Load selected ADJ request Success',
  LOAD_ADJ_SELECTED_REQUEST_FAILURE = '[ RequestApprovals ] Load selected  ADJ request Failure',

  LOAD_LOAN_REQUEST = '[  RequestApprovals] Load LOAN Request',
  LOAD_LOAN_REQUEST_SUCCESS = '[  RequestApprovals] Load LOAN Request Success',
  LOAD_LOAN_REQUEST_FAILURE = '[  RequestApprovals] Load LOAN Request Failure',

  LOAD_LOAN_SELECTED_REQUEST = '[ RequestApprovals ] Load  LOAN selected request ',
  LOAD_LOAN_SELECTED_REQUEST_SUCCESS = '[ RequestApprovals ] Load LOAN selected request Success',
  LOAD_LOAN_SELECTED_REQUEST_FAILURE = '[ RequestApprovals ] Load LOAN selected request Failure',

  LOAD_LOSS_REQUEST = '[  RequestApprovals] Load LOSS Request',
  LOAD_LOSS_REQUEST_SUCCESS = '[  RequestApprovals] Load LOSS Request Success',
  LOAD_LOSS_REQUEST_FAILURE = '[  RequestApprovals] Load LOSS Request Failure',

  LOAD_LOSS_SELECTED_REQUEST = '[ RequestApprovals ] Load selected request ',
  LOAD_LOSS_SELECTED_REQUEST_SUCCESS = '[ RequestApprovals ] Load selected request Success',
  LOAD_LOSS_SELECTED_REQUEST_FAILURE = '[ RequestApprovals ] Load selected request Failure',

  LOAD_PSV_REQUEST = '[  RequestApprovals] Load PSV Request',
  LOAD_PSV_REQUEST_SUCCESS = '[  RequestApprovals] Load PSV Request Success',
  LOAD_PSV_REQUEST_FAILURE = '[  RequestApprovals] Load PSV Request Failure',

  LOAD_PSV_SELECTED_REQUEST = '[ RequestApprovals ] Load selected request ',
  LOAD_PSV_SELECTED_REQUEST_SUCCESS = '[ RequestApprovals ] Load selected request Success',
  LOAD_PSV_SELECTED_REQUEST_FAILURE = '[ RequestApprovals ] Load selected request Failure',

  LOAD_FOC_REQUEST = '[  RequestApprovals] Load FOC Request',
  LOAD_FOC_REQUEST_SUCCESS = '[  RequestApprovals] Load FOC Request Success',
  LOAD_FOC_REQUEST_FAILURE = '[  RequestApprovals] Load FOC Request Failure',

  LOAD_FOC_SELECTED_REQUEST = '[ RequestApprovals ] Load selected request ',
  LOAD_FOC_SELECTED_REQUEST_SUCCESS = '[ RequestApprovals ] Load selected request Success',
  LOAD_FOC_SELECTED_REQUEST_FAILURE = '[ RequestApprovals ] Load selected request Failure',

  LOAD_EXH_REQUEST = '[  RequestApprovals] Load EXH Request',
  LOAD_EXH_REQUEST_SUCCESS = '[  RequestApprovals] Load EXH Request Success',
  LOAD_EXH_REQUEST_FAILURE = '[  RequestApprovals] Load EXH Request Failure',

  LOAD_EXH_SELECTED_REQUEST = '[ RequestApprovals ] Load selected request ',
  LOAD_EXH_SELECTED_REQUEST_SUCCESS = '[ RequestApprovals ] Load selected request Success',
  LOAD_EXH_SELECTED_REQUEST_FAILURE = '[ RequestApprovals ] Load selected request Failure',

  LOAD_IBTREQUESTAPPROVALS_COUNT = '[RequestApprovals] Load  IBTRequestApprovals Count',
  LOAD_IBTREQUESTAPPROVALS_COUNT_SUCCESS = '[RequestApprovals ] Load IBTRequestApprovals Count Success',
  LOAD_IBTREQUESTAPPROVALS_COUNT_FAILURE = '[RequestApprovals ] Load  IBTRequestApprovals Count Failure',

  LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT = '[RequestApprovals] Load  IBTRequestApprovalsCancel Count',
  LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT_SUCCESS = '[RequestApprovals ] Load IBTRequestApprovals Cancel Count Success',
  LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT_FAILURE = '[RequestApprovals ] Load  IBTRequestApprovals Count Cancel Failure',

  LOAD_IBTREQUESTITEMSAPPROVALS_COUNT = '[RequestApprovals] Load  IBTRequestApprovals Items Count',
  LOAD_IBTREQUESTITEMSAPPROVALS_COUNT_SUCCESS = '[RequestApprovals ] Load IBTRequestApprovals Items Count Success',
  LOAD_IBTREQUESTITEMSAPPROVALS_COUNT_FAILURE = '[RequestApprovals ] Load  IBTRequestApprovals Items Count Failure',

  LOAD_IBTREQUESCANCELAPPROVALS_ITEMS = '[ RequestApprovals ] Load IBTRequestApprovals  Cancel Items ',
  LOAD_IBTREQUESTCANCELAPPROVALS_ITEMS_SUCCESS = '[ RequestApprovals] Load IBTRequestApprovals Cancel Items Success',
  LOAD_IBTREQUESTCANCELAPPROVALS_ITEMS_FAILURE = '[ RequestApprovals ] Load IBTRequestApprovals Cancel Items Failure',

  CLEAR_SEARCH_IBT_ITEMS = '[ RequestApprovals ] CLEAR IBT Cancel Items Failure',
  CLEAR_EXH_REQUEST = '[ RequestApprovals ] CLEAR EXH Cancel Items Failure',
  CLEAR_LOSS_REQUEST = '[ RequestApprovals ] CLEAR LOSS Cancel Items Failure',
  CLEAR_LOAN_REQUEST = '[ RequestApprovals ] CLEAR LOAN Cancel Items Failure',
  CLEAR_PSV_REQUEST = '[ RequestApprovals ] CLEAR PSV Cancel Items Failure',
  CLEAR_ADJ_REQUEST = '[ RequestApprovals ] CLEAR ADJ Cancel Items Failure',
  CLEAR_FOC_REQUEST = '[ RequestApprovals ] CLEAR FOC Cancel Items Failure',

  LOAD_IBTREQUESTAPPROVALS = '[ RequestApprovals ] Load IBTRequestApprovals  ',
  LOAD_IBTREQUESTAPPROVALS_SUCCESS = '[ RequestApprovals] Load IBTRequestApprovals Success',
  LOAD_IBTREQUESTAPPROVALS_FAILURE = '[ RequestApprovals ] Load IBTRequestApprovals Failure',

  LOAD_IBTREQUESTAPPROVALS_CANCELLATION = '[ RequestApprovals ] Load IBTRequestApprovals  Cancellation',
  LOAD_IBTREQUESTAPPROVALS_CANCELLATION_SUCCESS = '[ RequestApprovals] Load IBTRequestApprovals CancellationSuccess',
  LOAD_IBTREQUESTAPPROVALS_CANCELLATION_FAILURE = '[ RequestApprovals ] Load IBTRequestApprovals Cancellation Failure',

  UPDATE_IBTREQUESTAPPROVALSITEMS = '[ RequestApprovals ] Update IBTitem',
  UPDATE_IBTREQUESTAPPROVALSITEMS_SUCCESS = '[ RequestApprovals ] Update IBTitem success',
  UPDATE_IBTREQUESTAPPROVALSITEMS_FAILURE = '[ RequestApprovals ] Update IBTitem Failure',

  IBTREQUESTAPPROVALS = '[ RequestApprovals ] Update IBT',
  IBTREQUESTAPPROVALS_SUCCESS = '[ RequestApprovals ] Update IBT success',
  IBTREQUESTAPPROVALS_FAILURE = '[ RequestApprovals ] Update IBT Failure',

  IBTCANCELREQUESTAPPROVALS = '[ RequestApprovals ] Update IBT Cancel Approvals',
  IBTCANCELREQUESTAPPROVALS_SUCCESS = '[ RequestApprovals ] Update IBT Cancel Approvals success',
  IBTCANCELREQUESTAPPROVALS_FAILURE = '[ RequestApprovals ] Update IBT Cancel Approvals Failure',

  LOAD_ItEMS_COUNT = '[ RequestApprovals ] Load items Count ',
  LOAD_ItEMS_COUNT_SUCCESS = '[ RequestApprovals ] Load items Count Success ',
  LOAD_ItEMS_COUNT_FAILURE = '[ RequestApprovals ] Load items Count Failure ',

  CLEAR_ITEM_LIST = '[ RequestApprovals ] Clear Items',

  // Image
  LOAD_THUMBNAIL_IMAGE_URL = '[ RequestApprovals ] Load Thumbnail Image Url',
  LOAD_THUMBNAIL_IMAGE_URL_SUCCESS = '[ RequestApprovals ] Load Thumbnail Image Url Success',
  LOAD_THUMBNAIL_IMAGE_URL_FAILURE = '[ RequestApprovals ] Load Thumbnail Image Url Failure',

  LOAD_IMAGE_URL = '[ RequestApprovals ] Load Image Url',
  LOAD_IMAGE_URL_SUCCESS = '[ RequestApprovals ] Load Image Url Success',
  LOAD_IMAGE_URL_FAILURE = '[ RequestApprovals ] Load Image Url Failure',
}

export class LoadBinRequestApprovalsCount implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_COUNT;
  constructor() {
    console.log('actions');
  }
}

export class LoadBinRequestApprovalsCountSuccess implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_COUNT_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadBinRequestApprovalsCountFailure implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchClear implements Action {
  readonly type = RequestApprovalsActionTypes.SEARCH_CLEAR;
}

export class LoadBinRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS;
  constructor(public payload: GetBinRequestPayload) {}
}

export class LoadBinRequestApprovalsSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_SUCCESS;
  constructor(public payload: LoadBinRequestResponse) {}
}
export class LoadBinRequestApprovalsFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetBinRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_BINREQUESTAPPROVALS;
}

export class ResetBinRequestApprovalsCount implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_BINREQUESTAPPROVALS_COUNT;
}

export class ResetRequestApprovalsItems implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_REQUESTAPPROVALSITEMS;
}

export class ResetRequestApprovalsItemsCount implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_REQUESTAPPROVALSITEMS_COUNT;
}
export class ResetIBTRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_IBTREQUESTAPPROVALS;
}

export class ResetIBTRequestApprovalsCount implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_IBTREQUESTAPPROVALS_COUNT;
}

export class ResetEXHRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_EXHREQUESTAPPROVALS;
}

export class ResetEXHRequestApprovalsCount implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_EXHREQUESTAPPROVALS_COUNT;
}

export class ResetFOCRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_FOCREQUESTAPPROVALS;
}

export class ResetFOCRequestApprovalsCount implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_FOCREQUESTAPPROVALS_COUNT;
}
export class ResetLOSSRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_LOSSREQUESTAPPROVALS;
}

export class ResetLOSSRequestApprovalsCount implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_LOSSREQUESTAPPROVALS_COUNT;
}
export class ResetLOANRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_LOANREQUESTAPPROVALS;
}

export class ResetLOANRequestApprovalsCount implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_LOANREQUESTAPPROVALS_COUNT;
}
export class ResetADJRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_ADJREQUESTAPPROVALS;
}

export class ResetADJRequestApprovalsCount implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_ADJREQUESTAPPROVALS_COUNT;
}

export class ResetPSVRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_PSVREQUESTAPPROVALS;
}

export class ResetPSVRequestApprovalsCount implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_PSVREQUESTAPPROVALS_COUNT;
}

export class ResetError implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_ERROR;
}

export class ResetStatus implements Action {
  readonly type = RequestApprovalsActionTypes.RESET_UPDATE;
}

export class LoadStuddedProductGroups implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS;
}
export class LoadStuddedProductGroupsSuccess implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadStuddedProductGroupsFailure implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateBinRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.UPDATE_BINREQUESTAPPROVALS;
  constructor(public payload: BinApprovalspayload) {}
}
export class UpdateBinRequestApprovalsSuccess implements Action {
  readonly type =
    RequestApprovalsActionTypes.UPDATE_BINREQUESTAPPROVALS_SUCCESS;
  constructor(public payload: BinRequestApprovalsItems) {}
}
export class UpdateBinRequestApprovalsFailure implements Action {
  readonly type =
    RequestApprovalsActionTypes.UPDATE_BINREQUESTAPPROVALS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadLocationCount implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOCATION_COUNT;

}

export class LoadLocationCountSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOCATION_COUNT_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadLocationCountFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOCATION_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocation implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOCATION;

}

export class LoadLocationSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOCATION_SUCCESS;
  constructor(public payload: Location[]) {}
}
export class LoadLocationFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOCATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIBtRequest implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_IBT_REQUEST;
  constructor(public payload: LoadIbtRequestPayload) {}
}

export class LoadIBtRequestSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_IBT_REQUEST_SUCCESS;
  constructor(public payload: LoadRequestResponse) {}
}

export class LoadIBtRequestFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_IBT_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIBtCancellationRequest implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_IBT_CANCELLATION_REQUEST;
  constructor(public payload: LoadIbtCancellationRequestPayload) {}
}

export class LoadIBtCancellationRequestSuccess implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBT_REQUEST_CANCELLATION_SUCCESS;
  constructor(public payload: LoadRequestResponse) {}
}

export class LoadIBtCancellationRequestFailure implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBT_REQUEST_CANCELLATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPSVRequest implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_PSV_REQUEST;
  constructor(public payload: LoadIbtRequestPayload) {}
}

export class LoadPSVRequestSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_PSV_REQUEST_SUCCESS;
  constructor(public payload: LoadRequestResponse) {}
}

export class LoadPSVRequestFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_PSV_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadLOSSRequest implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOSS_REQUEST;
  constructor(public payload: LoadIbtRequestPayload) {}
}

export class LoadLOSSRequestSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOSS_REQUEST_SUCCESS;
  constructor(public payload: LoadRequestResponse) {}
}

export class LoadLOSSRequestFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOSS_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearIbtSearchItems implements Action {
  readonly type = RequestApprovalsActionTypes.CLEAR_SEARCH_IBT_ITEMS;

}

export class ClearExhRequest implements Action {
  readonly type = RequestApprovalsActionTypes.CLEAR_EXH_REQUEST;

}

export class ClearPSVRequest implements Action {
  readonly type = RequestApprovalsActionTypes.CLEAR_PSV_REQUEST;

}

export class ClearLOSSRequest implements Action {
  readonly type = RequestApprovalsActionTypes.CLEAR_LOSS_REQUEST;

}

export class ClearLOANRequest implements Action {
  readonly type = RequestApprovalsActionTypes.CLEAR_LOAN_REQUEST;

}

export class ClearADJRequest implements Action {
  readonly type = RequestApprovalsActionTypes.CLEAR_ADJ_REQUEST;

}

export class ClearFOCRequest implements Action {
  readonly type = RequestApprovalsActionTypes.CLEAR_FOC_REQUEST;

}
export class LoadLOANRequest implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOAN_REQUEST;
  constructor(public payload: LoadIbtRequestPayload) {}
}

export class LoadLOANRequestSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOAN_REQUEST_SUCCESS;
  constructor(public payload: LoadRequestResponse) {}
}

export class LoadLOANRequestFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_LOAN_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadEXHRequest implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_EXH_REQUEST;
  constructor(public payload: LoadIbtRequestPayload) {}
}

export class LoadEXHRequestSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_EXH_REQUEST_SUCCESS;
  constructor(public payload: LoadRequestResponse) {}
}

export class LoadEXHRequestFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_EXH_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadADJRequest implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_ADJ_REQUEST;
  constructor(public payload: LoadIbtRequestPayload) {}
}

export class LoadADJRequestSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_ADJ_REQUEST_SUCCESS;
  constructor(public payload: LoadRequestResponse) {}
}

export class LoadADJRequestFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_ADJ_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadFOCRequest implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_FOC_REQUEST;
  constructor(public payload: LoadIbtRequestPayload) {}
}

export class LoadFOCRequestSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_FOC_REQUEST_SUCCESS;
  constructor(public payload: LoadRequestResponse) {}
}

export class LoadFOCRequestFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_FOC_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIBTRequestApprovalsCount implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_COUNT;
  constructor() {
    console.log('actions');
  }
}

export class LoadIBTRequestApprovalsCountSuccess implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_COUNT_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadIBTRequestApprovalsCountFailure implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIBTCancelRequestApprovalsCount implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT;
  constructor() {
    console.log('actions');
  }
}

export class LoadIBTCancelRequestApprovalsCountSuccess implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadIBTCancelRequestApprovalsCountFailure implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedRequest implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_SELECTED_REQUEST;
  constructor(public payload: SelectedStockPayload) {}
}

export class LoadSelectedRequestSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_SELECTED_REQUEST_SUCCESS;
  constructor(public payload: RequestApprovals) {}
}
export class LoadSelectedRequestFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_SELECTED_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedCancelRequest implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_SELECTED_CANCELLATION_REQUEST;
  constructor(public payload: SelectedStockPayload) {}
}

export class LoadSelectedRequestCancelSuccess implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_SELECTED_CANCELLATION_REQUEST_SUCCESS;
  constructor(public payload: RequestApprovals) {}
}
export class LoadSelectedCancelRequestFailure implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_SELECTED_CANCELLATION_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIBTRequestApprovalsItemsCount implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBTREQUESTITEMSAPPROVALS_COUNT;
  constructor(public payload: CountPayload) {
    console.log('actions');
  }
}

export class LoadIBTRequestApprovalsItemsCountSuccess implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBTREQUESTITEMSAPPROVALS_COUNT_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadIBTRequestApprovalsItemsCountFailure implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBTREQUESTITEMSAPPROVALS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIbtRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS;
  constructor(public payload: GetIbtRequestPayload) {}
}

export class LoadIbtRequestApprovalsSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_SUCCESS;
  constructor(public payload: LoadRequestResponseItems) {}
}
export class LoadIbtRequestApprovalsFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIbtCancelRequestItemsApprovals implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBTREQUESCANCELAPPROVALS_ITEMS;
  constructor(public payload: GetIbtRequestPayload) {}
}

export class LoadIbtCancelRequestApprovalsItemsSuccess implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBTREQUESTCANCELAPPROVALS_ITEMS_SUCCESS;
  constructor(public payload: LoadRequestResponseItems) {}
}
export class LoadIbtCancelRequestApprovalsItemsFailure implements Action {
  readonly type =
    RequestApprovalsActionTypes.LOAD_IBTREQUESTCANCELAPPROVALS_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateIBTRequestApprovals implements Action {
  readonly type = RequestApprovalsActionTypes.UPDATE_IBTREQUESTAPPROVALSITEMS;
  constructor(public payload: IbtApprovalspayload) {}
}
export class UpdateIbtRequestApprovalsSuccess implements Action {
  readonly type =
    RequestApprovalsActionTypes.UPDATE_IBTREQUESTAPPROVALSITEMS_SUCCESS;
  constructor(public payload: RequestApprovalsItems) {}
}
export class UpdateIbtRequestApprovalsFailure implements Action {
  readonly type =
    RequestApprovalsActionTypes.UPDATE_IBTREQUESTAPPROVALSITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class IBTRequest implements Action {
  readonly type = RequestApprovalsActionTypes.IBTREQUESTAPPROVALS;
  constructor(public payload: Ibtpayload) {}
}

export class IbtRequestSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.IBTREQUESTAPPROVALS_SUCCESS;
  constructor(public payload: RequestApprovals) {}
}

export class IbtRequestFailure implements Action {
  readonly type = RequestApprovalsActionTypes.IBTREQUESTAPPROVALS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class IBTCancelRequest implements Action {
  readonly type = RequestApprovalsActionTypes.IBTCANCELREQUESTAPPROVALS;
  constructor(public payload: IbtCancelPayload) {}
}

export class IbtCancelRequestSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.IBTCANCELREQUESTAPPROVALS_SUCCESS;
  constructor(public payload: RequestApprovals) {}
}

export class IbtCancelRequestFailure implements Action {
  readonly type = RequestApprovalsActionTypes.IBTCANCELREQUESTAPPROVALS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearItemList implements Action {
  readonly type = RequestApprovalsActionTypes.CLEAR_ITEM_LIST;
}

export class LoadItemsTotalCount implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_ItEMS_COUNT;

}

export class LoadItemsTotalCountSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_ItEMS_COUNT_SUCCESS;
  constructor(public payload: LoadRequestTotalCountSuccessPayload) {}
}

export class LoadItemsTotalCountFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_ItEMS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

// Image
export class LoadThumbnailImageUrl implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadThumbnailImageUrlSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadThumbnailImageUrlFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export class LoadImageUrl implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadImageUrlSuccess implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadImageUrlFailure implements Action {
  readonly type = RequestApprovalsActionTypes.LOAD_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export type RequestApprovalsActions =
  | LoadBinRequestApprovalsCount
  | LoadBinRequestApprovalsCountSuccess
  | LoadBinRequestApprovalsCountFailure
  | LoadBinRequestApprovals
  | LoadBinRequestApprovalsSuccess
  | LoadBinRequestApprovalsFailure
  | ResetBinRequestApprovals
  | ResetBinRequestApprovalsCount
  | UpdateBinRequestApprovals
  | UpdateBinRequestApprovalsFailure
  | UpdateBinRequestApprovalsSuccess
  | SearchClear
  | ClearIbtSearchItems
  | ClearADJRequest
  | ClearExhRequest
  | ClearPSVRequest
  | ClearLOSSRequest
  | ClearLOANRequest
  | ClearFOCRequest
  | LoadLocationCount
  | LoadLocationCountSuccess
  | LoadLocationCountFailure
  | LoadLocation
  | LoadLocationSuccess
  | LoadLocationFailure
  | LoadIBtRequest
  | LoadIBtRequestSuccess
  | LoadIBtRequestFailure
  | LoadIBTRequestApprovalsCount
  | LoadIBTRequestApprovalsCountFailure
  | LoadIBTRequestApprovalsCountSuccess
  | ResetIBTRequestApprovals
  | ResetIBTRequestApprovalsCount
  | LoadSelectedRequest
  | LoadSelectedRequestSuccess
  | LoadSelectedRequestFailure
  | LoadIBTRequestApprovalsItemsCount
  | LoadIBTRequestApprovalsItemsCountSuccess
  | LoadIBTRequestApprovalsItemsCountFailure
  | LoadIbtRequestApprovals
  | LoadIbtRequestApprovalsSuccess
  | LoadIbtRequestApprovalsFailure
  | UpdateIBTRequestApprovals
  | UpdateIbtRequestApprovalsFailure
  | UpdateIbtRequestApprovalsSuccess
  | IBTRequest
  | IbtRequestSuccess
  | IbtRequestFailure
  | ClearItemList
  | ResetADJRequestApprovals
  | ResetADJRequestApprovalsCount
  | ResetEXHRequestApprovals
  | ResetEXHRequestApprovalsCount
  | ResetFOCRequestApprovals
  | ResetFOCRequestApprovalsCount
  | ResetLOANRequestApprovals
  | ResetLOANRequestApprovalsCount
  | ResetLOSSRequestApprovals
  | ResetLOSSRequestApprovalsCount
  | ResetPSVRequestApprovals
  | ResetPSVRequestApprovalsCount
  | LoadADJRequest
  | LoadStuddedProductGroups
  | LoadStuddedProductGroupsSuccess
  | LoadStuddedProductGroupsFailure
  | ResetError
  | LoadIBTCancelRequestApprovalsCount
  | LoadIBTCancelRequestApprovalsCountSuccess
  | LoadIBTCancelRequestApprovalsCountFailure
  | ResetStatus
  | LoadIbtCancelRequestItemsApprovals
  | LoadIbtCancelRequestApprovalsItemsSuccess
  | LoadIbtCancelRequestApprovalsItemsFailure
  | IbtCancelRequestFailure
  | IbtCancelRequestSuccess
  | IBTCancelRequest
  | ResetRequestApprovalsItems
  | LoadSelectedCancelRequest
  | LoadSelectedRequestCancelSuccess
  | LoadSelectedCancelRequestFailure
  | ResetRequestApprovalsItemsCount
  | LoadADJRequestFailure
  | LoadADJRequestSuccess
  | LoadEXHRequest
  | LoadEXHRequestFailure
  | LoadEXHRequestSuccess
  | LoadFOCRequest
  | LoadFOCRequestFailure
  | LoadFOCRequestSuccess
  | LoadLOANRequest
  | LoadLOANRequestFailure
  | LoadLOANRequestSuccess
  | LoadLOSSRequest
  | LoadLOSSRequestFailure
  | LoadLOSSRequestSuccess
  | LoadPSVRequest
  | LoadPSVRequestFailure
  | LoadPSVRequestSuccess
  | LoadItemsTotalCount
  | LoadItemsTotalCountSuccess
  | LoadItemsTotalCountFailure
  | LoadIBtCancellationRequest
  | LoadIBtCancellationRequestSuccess
  | LoadIBtCancellationRequestFailure
  | LoadImageUrl
  | LoadImageUrlSuccess
  | LoadImageUrlFailure
  | LoadThumbnailImageUrl
  | LoadThumbnailImageUrlSuccess
  | LoadThumbnailImageUrlFailure;
