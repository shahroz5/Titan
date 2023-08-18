import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { InterBoutiqueTransferActionTypes } from './inter-boutique-transfer.actions';
import * as InterBoutiqueTransferActions from './inter-boutique-transfer.actions';
import { InterBoutiqueTransferState } from './inter-boutique-transfer.state';
import { InterBoutiqueTransferService } from '../inter-boutique-transfer.service';
import {
  RequestList,
  ItemList,
  BoutiqueList,
  CustomErrors,
  ItemSummary,
  LoadIBTHistoryItemsResponse,
  IBThistoryHeaderPayload,
  ProductGroup,
  ImageResponse
} from '@poss-web/shared/models';
import { ProductGroupDataService } from '@poss-web/shared/masters/data-access-masters';
import { LoggerService } from '@poss-web/shared/util-logger';
import { ItemDataService } from '@poss-web/shared/masters/data-access-masters';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ibtFeatureKey } from './inter-boutique-transfer.reducer';
import { CommonService } from '@poss-web/shared/common/data-access-common'; 

@Injectable()
export class InterBoutiqueTransferEffects {
  constructor(
    private dataPersistence: DataPersistence<InterBoutiqueTransferState>,
    private interBoutiqueTransferService: InterBoutiqueTransferService,
    private loggerService: LoggerService,
    private itemDataService: ItemDataService,
    private productGroupDataService: ProductGroupDataService,
    private commonService: CommonService
  ) {}
  @Effect() loadRequestSentList$: Observable<
    Action
  > = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST,
    {
      run: (
        action: InterBoutiqueTransferActions.LoadRequestSentList,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService
          .getRequestList(
            action.payload.requestGroup,
            action.payload.searchValue,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (data: RequestList[]) =>
                new InterBoutiqueTransferActions.LoadRequestSentListSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadRequestSentList,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.ClearRequestSentList();
      }
    }
  );

  @Effect() loadRequestReceivedList$: Observable<
    Action
  > = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST,
    {
      run: (
        action: InterBoutiqueTransferActions.LoadRequestReceivedList,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService
          .getRequestList(
            action.payload.requestGroup,
            action.payload.searchValue,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (data: RequestList[]) =>
                new InterBoutiqueTransferActions.LoadRequestReceivedListSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadRequestReceivedList,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.ClearRequestReceivedList();
      }
    }
  );

  @Effect() loadRequestSentListCount$: Observable<
    Action
  > = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_SENT_LIST_COUNT,
    {
      // provides an action and the current state of the store
      run: (
        action: InterBoutiqueTransferActions.LoadRequestSentListCount,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService
          .getRequestCount(
            action.payload.requestGroup,
            action.payload.searchValue
          )
          .pipe(
            map(
              (data: number) =>
                new InterBoutiqueTransferActions.LoadRequestSentListCountSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadRequestSentListCount,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.LoadRequestSentListCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadRequestReceivedListCount$: Observable<
    Action
  > = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_REQUEST_RECEIVED_LIST_COUNT,
    {
      // provides an action and the current state of the store
      run: (
        action: InterBoutiqueTransferActions.LoadRequestReceivedListCount,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService
          .getRequestCount(
            action.payload.requestGroup,
            action.payload.searchValue
          )
          .pipe(
            map(
              (data: number) =>
                new InterBoutiqueTransferActions.LoadRequestReceivedListCountSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadRequestReceivedListCount,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.LoadRequestReceivedListCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadBoutiqueList$: Observable<Action> = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST,
    {
      run: (
        action: InterBoutiqueTransferActions.LoadBoutiqueList,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService
          .getBoutiqueList(
            action.payload.item,
            action.payload.regionType,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (data: BoutiqueList[]) =>
                new InterBoutiqueTransferActions.LoadBoutiqueListSuccess(data)
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadBoutiqueList,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.LoadBoutiqueListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadBoutiqueListCount$: Observable<
    Action
  > = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_BOUTIQUE_LIST_COUNT,
    {
      // provides an action and the current state of the store
      run: (
        action: InterBoutiqueTransferActions.LoadBoutiqueListCount,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService
          .getBoutiqueCount(action.payload.item, action.payload.regionType)
          .pipe(
            map(
              (data: number) =>
                new InterBoutiqueTransferActions.LoadBoutiqueListCountSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadBoutiqueListCount,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.LoadBoutiqueListCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() createRequest$: Observable<Action> = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.CREATE_REQUEST,
    {
      run: (
        action: InterBoutiqueTransferActions.CreateRequest,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService
          .createRequest(
            action.payload.items,
            action.payload.remarks,
            action.payload.srcLocationCode
          )
          .pipe(
            map(
              (data: RequestList) =>
                new InterBoutiqueTransferActions.CreateRequestSuccess(data)
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.CreateRequest,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.CreateRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadRequest$: Observable<Action> = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_REQUEST,
    {
      // provides an action and the current state of the store
      run: (
        action: InterBoutiqueTransferActions.LoadRequest,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService
          .getRequest(action.payload.id, action.payload.requestGroup)
          .pipe(
            map(
              (data: RequestList) =>
                new InterBoutiqueTransferActions.LoadRequestSuccess(data)
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadRequest,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.LoadRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadItemList$: Observable<Action> = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_ITEM_LIST,
    {
      run: (
        action: InterBoutiqueTransferActions.LoadItemList,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService
          .getItemList(
            action.payload.id,
            action.payload.requestGroup,
            state[ibtFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (data: ItemList[]) =>
                new InterBoutiqueTransferActions.LoadItemListSuccess(data)
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadItemList,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.LoadItemListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updateItemList$: Observable<Action> = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST,
    {
      run: (
        action: InterBoutiqueTransferActions.UpdateItemList,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService
          .updateItemList(
            action.payload.id,
            action.payload.itemId,
            action.payload.requestGroup,
            action.payload.data,
            state[ibtFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (data: ItemList) =>
                new InterBoutiqueTransferActions.UpdateItemListSuccess(data)
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.UpdateItemList,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.UpdateItemListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updateItemListStatus$: Observable<
    Action
  > = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.UPDATE_ITEM_LIST_STATUS,
    {
      run: (
        action: InterBoutiqueTransferActions.UpdateItemListStatus,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService
          .updateItemListStatus(
            action.payload.type,
            action.payload.id,
            action.payload.itemIds,
            action.payload.requestGroup,
            action.payload.remarks
          )
          .pipe(
            map(
              (data: RequestList) =>
                new InterBoutiqueTransferActions.UpdateItemListStatusSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.UpdateItemListStatus,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.UpdateItemListStatusFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() searchItem$: Observable<Action> = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.SEARCH_ITEM,
    {
      run: (
        action: InterBoutiqueTransferActions.SearchItem,
        state: InterBoutiqueTransferState
      ) => {
        return this.itemDataService
          .getItemSummaryByCode(
            action.payload,
            state[ibtFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (data: ItemSummary) =>
                new InterBoutiqueTransferActions.SearchItemSuccess(data)
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.SearchItem,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.SearchItemFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadStuddedProductGroups$ = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_STUDDED_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, null, 'S')
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new InterBoutiqueTransferActions.LoadStuddedProductGroupsSuccess(
                  data.map(p => p.productGroupCode)
                )
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadStuddedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.LoadStuddedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadIBTHistory$: Observable<Action> = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_IBT_HISTORY,
    {
      run: (action: InterBoutiqueTransferActions.LoadIBTHistory) => {
        return this.interBoutiqueTransferService
          .getHistory(
            action.payload.historyData,
            action.payload.page,
            action.payload.size,
            action.payload.requestType
          )
          .pipe(
            map(
              (ibtHistory: LoadIBTHistoryItemsResponse) =>
                new InterBoutiqueTransferActions.LoadIBTHistorySuccess(
                  ibtHistory
                )
            )
          );
      },
      onError: (
        action: InterBoutiqueTransferActions.LoadIBTHistory,

        error: HttpErrorResponse
      ) => {

        return new InterBoutiqueTransferActions.LoadIBTHistorySuccess({
          items: [],
          count: 0
        });
      }
    }
  );

  @Effect()
  loadSelectedHistory$: Observable<Action> = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_SELECTED_HISTORY,
    {
      run: (action: InterBoutiqueTransferActions.LoadSelectedHistory) => {
        return this.interBoutiqueTransferService
          .getSelectedHistory(action.payload.id, action.payload.actionType)
          .pipe(
            map(
              (selectedHistory: IBThistoryHeaderPayload) =>
                new InterBoutiqueTransferActions.LoadSelectedHistorySuccess(
                  selectedHistory
                )
            )
          );
      },
      onError: (
        action: InterBoutiqueTransferActions.LoadSelectedHistory,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.LoadSelectedHistoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadHistoryItems$ = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_HISTORY_ITEMS,
    {
      run: (
        action: InterBoutiqueTransferActions.LoadHistoryItems,
        state: InterBoutiqueTransferState
      ) => {
        return this.interBoutiqueTransferService

          .getHistoryItems(
            action.payload.historyItemsData,
            action.payload.requestType,
            action.payload.page,
            action.payload.size,
            action.payload.value,
            action.payload.actionType,

            state[ibtFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (loadItemsResponse: ItemList[]) =>
                new InterBoutiqueTransferActions.LoadHistoryItemsSuccess(
                  loadItemsResponse
                )
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadHistoryItems,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.LoadHistoryItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  // Image

  @Effect() loadThumbnailImageUrl$ = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_THUMBNAIL_IMAGE_URL,
    {
      run: (action: InterBoutiqueTransferActions.LoadThumbnailImageUrl, state) => {
        return this.commonService
          .getThumbnailImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new InterBoutiqueTransferActions.LoadThumbnailImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadThumbnailImageUrl,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.LoadThumbnailImageUrlFailure({
          id: action.payload.id
        });
      }
    }
  );

  @Effect() loadImageUrl$ = this.dataPersistence.fetch(
    InterBoutiqueTransferActionTypes.LOAD_IMAGE_URL,
    {
      run: (action: InterBoutiqueTransferActions.LoadImageUrl, state) => {
        return this.commonService
          .getImageUrl(action.payload)
          .pipe(
            map(
              (loadImageResponse: ImageResponse) =>
                new InterBoutiqueTransferActions.LoadImageUrlSuccess(
                  loadImageResponse
                )
            )
          );
      },

      onError: (
        action: InterBoutiqueTransferActions.LoadImageUrl,
        error: HttpErrorResponse
      ) => {
        return new InterBoutiqueTransferActions.LoadImageUrlFailure({
          id: action.payload.id,
          imageUrl: action.payload.imageUrl
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
