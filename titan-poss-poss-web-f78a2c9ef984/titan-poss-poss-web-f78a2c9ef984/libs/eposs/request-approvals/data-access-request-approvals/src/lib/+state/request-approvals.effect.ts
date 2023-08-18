import * as RequestActions from './request-approvals.actions';
import { Injectable } from '@angular/core';
import { RequestApprovalsService } from '../request-approvals.service';
import { DataPersistence } from '@nrwl/angular';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { CustomErrors, ProductGroup,
  LoadBinRequestResponse ,
  LoadRequestResponse,
  RequestApprovals,
  LoadRequestResponseItems,
  ImageResponse} from '@poss-web/shared/models';
import { Effect } from '@ngrx/effects';
import {
  LocationDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import { RequestApprovalsState } from './request-approvals.state';
import { map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { REQUEST_APPROVALS_FEATURE_KEY } from './request-approval.reducer';
import { CommonService, InventoryValidationService } from '@poss-web/shared/common/data-access-common';

@Injectable()
export class RequestApprovalsEffects {
  constructor(
    private service: RequestApprovalsService,
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private locationService: LocationDataService,
    private productGroupDataService: ProductGroupDataService,
    private commonService: CommonService
  ) {}

  @Effect()
  binCount$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS_COUNT,
    {
      // provides an action and the current state of the store
      run: (
        action: RequestActions.LoadBinRequestApprovalsCount,
        state: RequestApprovalsState
      ) => {
        return this.service
          .getBinRequestApprovalsCount()
          .pipe(
            map(
              (data: any) =>
                new RequestActions.LoadBinRequestApprovalsCountSuccess(data)
            )
          );
      },

      onError: (
        action: RequestActions.LoadBinRequestApprovalsCount,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadBinRequestApprovalsCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  requestCount$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_ItEMS_COUNT,
    {
      // provides an action and the current state of the store
      run: (
        action: RequestActions.LoadItemsTotalCount,
        state: RequestApprovalsState
      ) => {
        return this.service
          .getRequestsCount()
          .pipe(
            map(
              (data: any) => new RequestActions.LoadItemsTotalCountSuccess(data)
            )
          );
      },

      onError: (
        action: RequestActions.LoadItemsTotalCount,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadItemsTotalCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  locationCount$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_LOCATION_COUNT,
    {
      // provides an action and the current state of the store
      run: (
        action: RequestActions.LoadLocationCount,
        state: RequestApprovalsState
      ) => {
        return this.service
          .getLocationCount()
          .pipe(
            map(
              (data: any) => new RequestActions.LoadLocationCountSuccess(data)
            )
          );
      },

      onError: (
        action: RequestActions.LoadLocationCount,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadLocationCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  ibtRequestCount$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS_COUNT,
    {
      // provides an action and the current state of the store
      run: (
        action: RequestActions.LoadIBTRequestApprovalsCount,
        state: RequestApprovalsState
      ) => {
        return this.service
          .getIbtRequestApprovalsCount()
          .pipe(
            map(
              (data: any) =>
                new RequestActions.LoadIBTRequestApprovalsCountSuccess(data)
            )
          );
      },

      onError: (
        action: RequestActions.LoadIBTRequestApprovalsCount,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadIBTRequestApprovalsCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  location$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_LOCATION,
    {
      run: (action: RequestActions.LoadLocation) => {
        return this.locationService
          .getLocationSummaryList(null, false, null, null, null)
          .pipe(
            map((items: any) => new RequestActions.LoadLocationSuccess(items))
          );
      },
      onError: (
        action: RequestActions.LoadLocation,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadLocationFailure(this.errorHandler(error));
      }
    }
  );
  @Effect()
  loadBinItems$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_BINREQUESTAPPROVALS,
    {
      run: (action: RequestActions.LoadBinRequestApprovals) => {
        return this.service
          .getBinRequestApprovalsItems(
            action.payload.locationCode,
            action.payload.reqDocNo,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (items: LoadBinRequestResponse) =>
                new RequestActions.LoadBinRequestApprovalsSuccess(items)
            )
          );
      },
      onError: (
        action: RequestActions.LoadBinRequestApprovals,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.SearchClear();
      }
    }
  );

  @Effect()
  updateBinApprovalStatus = this.dataPersistence.pessimisticUpdate(
    RequestActions.RequestApprovalsActionTypes.UPDATE_BINREQUESTAPPROVALS,
    {
      run: (action: RequestActions.UpdateBinRequestApprovals) => {
        return this.service
          .updateBinApprovalStatus(action.payload)
          .pipe(
            map(
              (data: any) =>
                new RequestActions.UpdateBinRequestApprovalsSuccess(data)
            )
          );
      },

      onError: (
        action: RequestActions.UpdateBinRequestApprovals,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.UpdateBinRequestApprovalsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateIbtApprovalStatus = this.dataPersistence.pessimisticUpdate(
    RequestActions.RequestApprovalsActionTypes.UPDATE_IBTREQUESTAPPROVALSITEMS,
    {
      run: (action: RequestActions.UpdateIBTRequestApprovals) => {
        return this.service
          .updateIbtApprovalStatus(action.payload)
          .pipe(
            map(
              (data: any) =>
                new RequestActions.UpdateIbtRequestApprovalsSuccess(data)
            )
          );
      },

      onError: (
        action: RequestActions.UpdateIBTRequestApprovals,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.UpdateIbtRequestApprovalsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  IbtApprovalStatus = this.dataPersistence.pessimisticUpdate(
    RequestActions.RequestApprovalsActionTypes.IBTREQUESTAPPROVALS,
    {
      run: (action: RequestActions.IBTRequest) => {
        return this.service
          .updateIbtApprovals(action.payload)
          .pipe(map((data: any) => new RequestActions.IbtRequestSuccess(data)));
      },

      onError: (
        action: RequestActions.IBTRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.IbtRequestFailure(this.errorHandler(error));
      }
    }
  );

  @Effect()
  IbtCancelUpdate = this.dataPersistence.pessimisticUpdate(
    RequestActions.RequestApprovalsActionTypes.IBTCANCELREQUESTAPPROVALS,
    {
      run: (action: RequestActions.IBTCancelRequest) => {
        return this.service
          .updateIbtCancelApprovals(action.payload)
          .pipe(
            map((data: any) => new RequestActions.IbtCancelRequestSuccess(data))
          );
      },

      onError: (
        action: RequestActions.IBTCancelRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.IbtCancelRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadIbtRequest$: Observable<Action> = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_IBT_REQUEST,
    {
      run: (action: RequestActions.LoadIBtRequest) => {
        return this.service
          .getIbtsApprovals(
            action.payload.reqLocationCode,
            action.payload.reqDocNo,
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (ibt: LoadRequestResponse) =>
                new RequestActions.LoadIBtRequestSuccess(ibt)
            )
          );
      },

      onError: (
        action: RequestActions.LoadIBtRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.ClearIbtSearchItems();
      }
    }
  );

  @Effect() loadIbtCancellationRequest$: Observable<
    Action
  > = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_IBT_CANCELLATION_REQUEST,
    {
      run: (action: RequestActions.LoadIBtCancellationRequest) => {
        return this.service
          .getIbtsCancellationApprovals(
            action.payload.reqLocationCode,
            action.payload.reqDocNo,
            action.payload.requestType,
            action.payload.sort,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.status
          )
          .pipe(
            map(
              (ibt: LoadRequestResponse) =>
                new RequestActions.LoadIBtCancellationRequestSuccess(ibt)
            )
          );
      },

      onError: (
        action: RequestActions.LoadIBtCancellationRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.ClearIbtSearchItems();
      }
    }
  );

  @Effect() loadFOCRequest$: Observable<Action> = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_FOC_REQUEST,
    {
      run: (action: RequestActions.LoadFOCRequest) => {
        return this.service
          .getIbtsApprovals(
            action.payload.reqLocationCode,
            action.payload.reqDocNo,
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (ibt: LoadRequestResponse) =>
                new RequestActions.LoadFOCRequestSuccess(ibt)
            )
          );
      },

      onError: (
        action: RequestActions.LoadFOCRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.ClearFOCRequest();
      }
    }
  );

  @Effect() loadPSVRequest$: Observable<Action> = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_PSV_REQUEST,
    {
      run: (action: RequestActions.LoadPSVRequest) => {
        return this.service
          .getIbtsApprovals(
            action.payload.reqLocationCode,
            action.payload.reqDocNo,
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (ibt: LoadRequestResponse) =>
                new RequestActions.LoadPSVRequestSuccess(ibt)
            )
          );
      },

      onError: (
        action: RequestActions.LoadPSVRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.ClearPSVRequest();
      }
    }
  );

  @Effect() loadLOSSRequest$: Observable<Action> = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_LOSS_REQUEST,
    {
      run: (action: RequestActions.LoadLOSSRequest) => {
        return this.service
          .getIbtsApprovals(
            action.payload.reqLocationCode,
            action.payload.reqDocNo,
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (ibt: LoadRequestResponse) =>
                new RequestActions.LoadLOSSRequestSuccess(ibt)
            )
          );
      },

      onError: (
        action: RequestActions.LoadLOSSRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.ClearLOSSRequest();
      }
    }
  );

  @Effect() loadLOANRequest$: Observable<Action> = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_LOAN_REQUEST,
    {
      run: (action: RequestActions.LoadLOANRequest) => {
        return this.service
          .getIbtsApprovals(
            action.payload.reqLocationCode,
            action.payload.reqDocNo,
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (ibt: LoadRequestResponse) =>
                new RequestActions.LoadLOANRequestSuccess(ibt)
            )
          );
      },

      onError: (
        action: RequestActions.LoadLOANRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.ClearLOANRequest();
      }
    }
  );

  @Effect() loadEXHRequest$: Observable<Action> = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_EXH_REQUEST,
    {
      run: (action: RequestActions.LoadEXHRequest) => {
        return this.service
          .getIbtsApprovals(
            action.payload.reqLocationCode,
            action.payload.reqDocNo,
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (ibt: LoadRequestResponse) =>
                new RequestActions.LoadEXHRequestSuccess(ibt)
            )
          );
      },

      onError: (
        action: RequestActions.LoadEXHRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.ClearExhRequest();
      }
    }
  );

  @Effect() loadADJRequest$: Observable<Action> = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_ADJ_REQUEST,
    {
      run: (action: RequestActions.LoadADJRequest) => {
        return this.service
          .getIbtsApprovals(
            action.payload.reqLocationCode,
            action.payload.reqDocNo,
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (ibt: LoadRequestResponse) =>
                new RequestActions.LoadADJRequestSuccess(ibt)
            )
          );
      },

      onError: (
        action: RequestActions.LoadADJRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.ClearADJRequest();
      }
    }
  );

  @Effect()
  ibtCancelCount$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes
      .LOAD_IBTREQUESTAPPROVALS_CANCEL_COUNT,
    {
      // provides an action and the current state of the store
      run: (
        action: RequestActions.LoadIBTCancelRequestApprovalsCount,
        state: RequestApprovalsState
      ) => {
        return this.service
          .getIbtCancelRequestApprovalsCount()
          .pipe(
            map(
              (data: any) =>
                new RequestActions.LoadIBTCancelRequestApprovalsCountSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: RequestActions.LoadIBTCancelRequestApprovalsCount,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadIBTCancelRequestApprovalsCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadSeletedRequest$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_SELECTED_REQUEST,
    {
      run: (action: RequestActions.LoadSelectedRequest) => {
        return this.service
          .getRequest(action.payload)
          .pipe(
            map(
              (data: RequestApprovals) =>
                new RequestActions.LoadSelectedRequestSuccess(data)
            )
          );
      },

      onError: (
        action: RequestActions.LoadSelectedRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadSelectedRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadSeletedCancelRequest$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes
      .LOAD_SELECTED_CANCELLATION_REQUEST,
    {
      run: (action: RequestActions.LoadSelectedCancelRequest) => {
        return this.service
          .getCancelRequest(action.payload)
          .pipe(
            map(
              (data: RequestApprovals) =>
                new RequestActions.LoadSelectedRequestCancelSuccess(data)
            )
          );
      },

      onError: (
        action: RequestActions.LoadSelectedCancelRequest,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadSelectedCancelRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadIbtItems$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_IBTREQUESTAPPROVALS,
    {
      run: (action: RequestActions.LoadIbtRequestApprovals, state) => {
        return this.service
          .getIbtRequestApprovalsItems(
            action.payload.id,
            action.payload.itemCode,
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.sortBy,
            action.payload.sortOrder,
            action.payload.filter,
            action.payload.pageSize,
            action.payload.isSelectedArray,
            state[REQUEST_APPROVALS_FEATURE_KEY].studdedProductGroups
          )
          .pipe(
            map(
              (items: LoadRequestResponseItems) =>
                new RequestActions.LoadIbtRequestApprovalsSuccess(items)
            )
          );
      },
      onError: (
        action: RequestActions.LoadIbtRequestApprovals,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadIbtRequestApprovalsSuccess({
          items: [],
          count: 0
        });
      }
    }
  );

  @Effect()
  loadIbtCancelItems$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes
      .LOAD_IBTREQUESCANCELAPPROVALS_ITEMS,
    {
      run: (
        action: RequestActions.LoadIbtCancelRequestItemsApprovals,
        state
      ) => {
        return this.service
          .getIbtCancelRequestApprovalsItems(
            action.payload.id,
            action.payload.requestType,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.isSelectedArray,
            state[REQUEST_APPROVALS_FEATURE_KEY].studdedProductGroups
          )
          .pipe(
            map(
              (items: LoadRequestResponseItems) =>
                new RequestActions.LoadIbtCancelRequestApprovalsItemsSuccess(
                  items
                )
            )
          );
      },
      onError: (
        action: RequestActions.LoadIbtCancelRequestItemsApprovals,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadIbtCancelRequestApprovalsItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadStuddedProductGroups$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, null, 'S')
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new RequestActions.LoadStuddedProductGroupsSuccess(
                  data.map(p => p.productGroupCode)
                )
            )
          );
      },

      onError: (
        action: RequestActions.LoadStuddedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadStuddedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  ibtItemsCount$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes
      .LOAD_IBTREQUESTITEMSAPPROVALS_COUNT,
    {
      // provides an action and the current state of the store
      run: (
        action: RequestActions.LoadIBTRequestApprovalsItemsCount,
        state: RequestApprovalsState
      ) => {
        return this.service
          .getIbtItemsRequestApprovalsCount(action.payload)
          .pipe(
            map(
              (data: any) =>
                new RequestActions.LoadIBTRequestApprovalsItemsCountSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: RequestActions.LoadIBTRequestApprovalsItemsCount,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadIBTRequestApprovalsItemsCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // Image

  @Effect() loadThumbnailImageUrl$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL,
    {
      run: (action: RequestActions.LoadThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new RequestActions.LoadThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: RequestActions.LoadThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadThumbnailImageUrlFailure({
          id: action.payload.id,
          isCancelItems: action.payload?.isCancelItems,
        });
      }
    }
  );

  @Effect() loadImageUrl$ = this.dataPersistence.fetch(
    RequestActions.RequestApprovalsActionTypes.LOAD_IMAGE_URL,
    {
      run: (action: RequestActions.LoadImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new RequestActions.LoadImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: RequestActions.LoadImageUrl,
        error: HttpErrorResponse
      ) => {
        return new RequestActions.LoadImageUrlFailure({
          id: action.payload.id,
          imageUrl: action.payload.imageUrl,
          isCancelItems: action.payload?.isCancelItems,
        });
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
