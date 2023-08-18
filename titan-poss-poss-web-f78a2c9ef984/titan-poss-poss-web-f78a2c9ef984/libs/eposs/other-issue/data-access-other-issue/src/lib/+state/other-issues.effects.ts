import { Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import {
  OtherIssuesActionTypes,
  LoadIssuesSTNCount,
  LoadIssuesSTNCountSuccess,
  LoadIssuesSTNCountFailure
} from './other-issues.actions';
import * as otherRecieptissuesActions from './other-issues.actions';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import { OtherIssuesState } from './other-issues.state';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  OtherIssuedataModel,
  OtherIssueModel,
  RequestOtherIssueStockTransferNote,
  CustomErrors,
  OtherIssuesItem,
  OtherIssuesCreateStockResponse,
  OtherReceiptsIssuesEnum,
  ProductCategory,
  ProductGroup,
  LoadOtherIssuesSTNCountPayload,
  AdjustmentSearchItemPayloadSuccess,
  LoadOtherIssueCreateItemsTotalCountSuccessPayload,
  PSVSearchItemPayloadSuccess,
  ConfirmOtherStockIssueResponse,
  OtherIssuesHistoryItem
} from '@poss-web/shared/models';
import { OtherIssueService } from '../other-issues.service';
import {
  ProductCategoryDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import { LoggerService } from '@poss-web/shared/util-logger';

import { otherIssueFeatureKey } from './other-issues.reducer';
@Injectable()
export class OtherIssuesEffect {
  //v2
  @Effect() loadOtherIssuesCount$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_ISSUES_STN_COUNT,
    {
      // provides an action and the current state of the store
      run: (action: LoadIssuesSTNCount, state: OtherIssuesState) => {
        return this.otherIssueService
          .getOtherIssuesSTNCount()
          .pipe(
            map(
              (data: LoadOtherIssuesSTNCountPayload) =>
                new LoadIssuesSTNCountSuccess(data)
            )
          );
      },

      onError: (action: LoadIssuesSTNCount, error: HttpErrorResponse) => {
        return new LoadIssuesSTNCountFailure(this.errorHandler(error));
      }
    }
  );

  @Effect() loadIssueList$: Observable<Action> = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_ISSUE_LIST,
    {
      run: (action: otherRecieptissuesActions.LoadIssueList) => {
        return this.otherIssueService
          .getIssueList(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: OtherIssuedataModel) =>
                new otherRecieptissuesActions.LoadIssueListSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadIssueList,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadIssueListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadIssueLoanList$: Observable<Action> = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_ISSUE_LOAN_LIST,
    {
      run: (action: otherRecieptissuesActions.LoadIssueLoanList) => {
        return this.otherIssueService
          .getIssueList(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: OtherIssuedataModel) =>
                new otherRecieptissuesActions.LoadIssueLoanListSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadIssueLoanList,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadIssueLoanListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadStuddedProductGroups$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_STUDDED_PRODUCT_GROUPS,
    {
      run: () => {
        return this.productGroupDataService
          .getProductGroups(false, null, null, null, 'S')
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new otherRecieptissuesActions.LoadStuddedProductGroupsSuccess(
                  data.map(p => p.productGroupCode)
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadStuddedProductGroups,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadStuddedProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() searchPendingIssuesStocks$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.SEARCH_PENDING_ISSUE,
    {
      run: (action: otherRecieptissuesActions.SearchPendingIssue) => {
        return this.otherIssueService
          .searchIssueStocks(action.payload.srcDocnumber, action.payload.type)
          .pipe(
            map(
              (searchresult: OtherIssueModel[]) =>
                new otherRecieptissuesActions.SearchPendingIssueSuccess(
                  searchresult
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.SearchPendingIssue,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.SearchPendingIssueSuccess([]);
      }
    }
  );

  @Effect()
  loadSelectedIssue$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_SELECTED_ISSUE,
    {
      run: (action: otherRecieptissuesActions.LoadSelectedIssue) => {
        return this.otherIssueService
          .getOtherStockIssue(action.payload.reqDocNo, action.payload.type)
          .pipe(
            map(
              (
                requestStockTransferNoteData: RequestOtherIssueStockTransferNote
              ) =>
                new otherRecieptissuesActions.LoadSelectedIssueSuccess(
                  requestStockTransferNoteData
                )
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadSelectedIssue,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadSelectedIssueFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadNonVerifiedOtherIssueItems$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS,
    {
      run: (
        action: otherRecieptissuesActions.LoadNonVerifiedOtherIssueItems,
        state
      ) => {
        return this.otherIssueService
          .getOtherIssuesItems(
            action.payload.id,
            action.payload.status,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.type,
            action.payload.itemCode,
            action.payload.lotNumber,
            action.payload.sort,
            action.payload.filter,
            state[otherIssueFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (items: OtherIssuesItem[]) =>
                new otherRecieptissuesActions.LoadNonVerifiedOtherIssueItemsSuccess(
                  items
                )
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadNonVerifiedOtherIssueItems,
        error: HttpErrorResponse
      ) => {
        const items: OtherIssuesItem[] = [];
        return new otherRecieptissuesActions.LoadNonVerifiedOtherIssueItemsSuccess(
          items
        );
      }
    }
  );
  @Effect() createOtherStockIssueItems$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.CREATE_OTHER_STOCK_ISSUE_ITEMS,
    {
      run: (
        action: otherRecieptissuesActions.CreateOtherStockIssueItems,
        state: OtherIssuesState
      ) => {
        return this.otherIssueService
          .createOtherStockIssueItems(
            action.payload.id,
            action.payload.data,
            action.payload.transferType
          )
          .pipe(
            map(
              (data: any) =>
                new otherRecieptissuesActions.CreateOtherStockIssueItemsItemsSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.CreateOtherStockIssueItems,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.CreateOtherStockIssueItemsItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() confirmOtherStockIssue$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.CONFIRM_OTHER_STOCK_ISSUE,
    {
      run: (action: otherRecieptissuesActions.ConfirmOtherStockIssue) => {
        return this.otherIssueService
          .confirmOtherStockIssue(
            action.payload.id,
            action.payload.transferType,
            action.payload.carrierDetails,
            action.payload.remarks,
            action.payload.destinationLocationCode
          )
          .pipe(
            map(
              (data: ConfirmOtherStockIssueResponse) =>
                new otherRecieptissuesActions.ConfirmOtherStockIssueSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.ConfirmOtherStockIssue,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.ConfirmOtherStockIssueFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  //create page
  @Effect()
  createOtherIssuesStockRequest$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST,
    {
      run: (action: otherRecieptissuesActions.CreateOtherIssueStockRequest) => {
        return this.otherIssueService
          .createOtherIssuesStockRequest(action.payload.reqtype)
          .pipe(
            map(
              (data: OtherIssuesCreateStockResponse) =>
                new otherRecieptissuesActions.CreateOtherIssueStockRequestSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.CreateOtherIssueStockRequest,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.CreateOtherIssueStockRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadAllOtherIssueCreateItems$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS,
    {
      run: (
        action: otherRecieptissuesActions.LoadAllOtherIssueCreateItems,
        state
      ) => {
        return this.otherIssueService
          .getOtherIssueCreateItems(
            action.payload.id,
            OtherReceiptsIssuesEnum.OPEN,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.reqtype,
            action.payload.itemCode,
            action.payload.lotNumber,
            action.payload.sort,
            action.payload.filter,
            state[otherIssueFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (items: OtherIssuesItem[]) =>
                new otherRecieptissuesActions.LoadAllOtherIssueCreateItemsSuccess(
                  items
                )
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadAllOtherIssueCreateItems,
        error: HttpErrorResponse
      ) => {
        const items: OtherIssuesItem[] = [];
        return new otherRecieptissuesActions.LoadAllOtherIssueCreateItemsSuccess(
          items
        );
      }
    }
  );
  @Effect()
  loadSelectedCreateItems$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_ITEMS,
    {
      run: (
        action: otherRecieptissuesActions.LoadSelectedOtherIssueCreateItems,
        state
      ) => {
        return this.otherIssueService
          .getOtherIssueCreateItems(
            action.payload.id,
            OtherReceiptsIssuesEnum.SELECTED,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.reqtype,
            action.payload.itemCode,
            action.payload.lotNumber,
            action.payload.sort,
            action.payload.filter,
            state[otherIssueFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (items: OtherIssuesItem[]) =>
                new otherRecieptissuesActions.LoadSelectedOtherIssueCreateItemsSuccess(
                  items
                )
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadSelectedOtherIssueCreateItems,
        error: HttpErrorResponse
      ) => {
        const items: OtherIssuesItem[] = [];
        return new otherRecieptissuesActions.LoadSelectedOtherIssueCreateItemsSuccess(
          items
        );
      }
    }
  );
  @Effect()
  loadOtherIssueItemsCreateTotalCount$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_ISSUE_ITEMS_CREATE_COUNT,
    {
      run: (
        action: otherRecieptissuesActions.LoadIssueItemsCreateTotalCount
      ) => {
        return this.otherIssueService
          .getOtherIssuesCreateItemsCount(
            action.payload.reqtype,
            action.payload.id
          )
          .pipe(
            map(
              (
                loadItemsTotalCountSuccessPayload: LoadOtherIssueCreateItemsTotalCountSuccessPayload
              ) =>
                new otherRecieptissuesActions.LoadIssueItemsCreateTotalCountSuccess(
                  loadItemsTotalCountSuccessPayload
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadIssueItemsCreateTotalCount,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadIssueItemsCreateTotalCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() createStockIssueItems$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS,
    {
      run: (
        action: otherRecieptissuesActions.CreateOtherIssueStockRequestItems,
        state: OtherIssuesState
      ) => {
        return this.otherIssueService
          .createOtherIssueStockRequestItems(
            action.payload.id,
            action.payload.data,
            action.payload.requestType
          )
          .pipe(
            map(
              (data: any) =>
                new otherRecieptissuesActions.CreateOtherIssueStockRequestItemsSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.CreateOtherIssueStockRequestItems,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.CreateOtherIssueStockRequestItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() removeOtherStockIssueItems$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS,
    {
      run: (
        action: otherRecieptissuesActions.RemoveOtherIssueStockRequestItems,
        state: OtherIssuesState
      ) => {
        return this.otherIssueService
          .removeOtherIssueStockRequestItems(
            action.payload.id,
            action.payload.data,
            action.payload.requestType
          )
          .pipe(
            map(
              (data: any) =>
                new otherRecieptissuesActions.RemoveOtherIssueStockRequestItemsSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.RemoveOtherIssueStockRequestItems,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.RemoveOtherIssueStockRequestItemsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() updateStockIssueItem$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_CREATE_ITEM,
    {
      run: (action: otherRecieptissuesActions.UpdateStockRequestCreateItem) => {
        return this.otherIssueService
          .updateStockRequestCreateItem(
            action.payload.id,
            action.payload.itemid,
            action.payload.reqType,
            action.payload.value
          )
          .pipe(
            map(
              (data: any) =>
                new otherRecieptissuesActions.UpdateStockRequestCreateItemSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.UpdateStockRequestCreateItem,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.UpdateStockRequestCreateItemFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() updateStockIssue$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.UPDATE_STOCK_REQUEST,
    {
      run: (action: otherRecieptissuesActions.UpdateStockRequest) => {
        return this.otherIssueService
          .updateStockRequest(
            action.payload.id,
            action.payload.reqType,
            action.payload.carrierDetails,
            action.payload.approvalDetails,
            action.payload.remarks,
            action.payload.status
          )
          .pipe(
            map(
              (data: OtherIssueModel) =>
                new otherRecieptissuesActions.UpdateStockRequestSuccess(data)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.UpdateStockRequest,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.UpdateStockRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  /**
   * The effect which handles the  searchItem Action
   */
  @Effect() searchItemAdjustment$: Observable<
    Action
  > = this.dataPersistence.fetch(OtherIssuesActionTypes.ADJUSTMENT_SEARCH, {
    run: (action: otherRecieptissuesActions.SearchAdjustment, state) => {
      return this.otherIssueService
        .searchAdjustmentItem(
          action.payload.variantCode,
          action.payload.lotNumber,
          action.payload.binType,
          //action.payload.productGroups,
          state[otherIssueFeatureKey].studdedProductGroups
        )
        .pipe(
          map(
            (searchItemPayloadSuccess: AdjustmentSearchItemPayloadSuccess) =>
              new otherRecieptissuesActions.SearchAdjustmentSuccess(
                searchItemPayloadSuccess
              )
          )
        );
    },
    onError: (
      action: otherRecieptissuesActions.SearchAdjustment,
      error: HttpErrorResponse
    ) => {
      return new otherRecieptissuesActions.SearchAdjustmentSuccess({
        items: [],
        count: 0
      });
    }
  });
  @Effect() createStockRequestAdjustment$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.CREATE_STOCK_REQUEST_ADJUSTMENT,
    {
      run: (action: otherRecieptissuesActions.CreateStockRequestAdjustment) => {
        return this.otherIssueService
          .createStockRequestAdjustment(
            action.payload.reqType,
            action.payload.approvalDetails,
            action.payload.items,
            action.payload.remarks
          )
          .pipe(
            map(
              (data: OtherIssueModel) =>
                new otherRecieptissuesActions.CreateStockRequestAdjustmentSuccess(
                  data
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.CreateStockRequestAdjustment,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.CreateStockRequestAdjustmentFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadIssueADJList$: Observable<Action> = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST,
    {
      run: (action: otherRecieptissuesActions.LoadIssueADJList) => {
        return this.otherIssueService
          .getIssueList(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: OtherIssuedataModel) =>
                new otherRecieptissuesActions.LoadIssueADJListSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadIssueADJList,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadIssueADJListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadIssueLossList$: Observable<Action> = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_ISSUE_LOSS_LIST,
    {
      run: (action: otherRecieptissuesActions.LoadIssueLossList) => {
        return this.otherIssueService
          .getIssueList(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: OtherIssuedataModel) =>
                new otherRecieptissuesActions.LoadIssueLossListSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadIssueLossList,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadIssueLossListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadIssuePSVList$: Observable<Action> = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_ISSUE_PSV_LIST,
    {
      run: (action: otherRecieptissuesActions.LoadIssuePSVList) => {
        return this.otherIssueService
          .getIssueList(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: OtherIssuedataModel) =>
                new otherRecieptissuesActions.LoadIssuePSVListSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadIssuePSVList,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadIssuePSVListFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() searchItemPSV$: Observable<Action> = this.dataPersistence.fetch(
    OtherIssuesActionTypes.PSV_SEARCH,
    {
      run: (action: otherRecieptissuesActions.SearchPSV, state) => {
        return this.otherIssueService
          .searchAdjustmentItem(
            action.payload.variantCode,
            action.payload.lotNumber,
            action.payload.binType,
            //action.payload.productGroups,
            state[otherIssueFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (searchItemPayloadSuccess: PSVSearchItemPayloadSuccess) =>
                new otherRecieptissuesActions.SearchPSVSuccess(
                  searchItemPayloadSuccess
                )
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.SearchPSV,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.SearchPSVSuccess({
          items: [],
          count: 0
        });
      }
    }
  );
  @Effect() createStockRequestPSV$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.CREATE_STOCK_REQUEST_PSV,
    {
      run: (action: otherRecieptissuesActions.CreateStockRequestPSV) => {
        return this.otherIssueService
          .createStockRequestAdjustment(
            action.payload.reqType,
            action.payload.approvalDetails,
            action.payload.items,
            action.payload.remarks
          )
          .pipe(
            map(
              (data: OtherIssueModel) =>
                new otherRecieptissuesActions.CreateStockRequestPSVSuccess(data)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.CreateStockRequestPSV,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.CreateStockRequestPSVFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() searchItemFOC$: Observable<Action> = this.dataPersistence.fetch(
    OtherIssuesActionTypes.FOC_SEARCH,
    {
      run: (action: otherRecieptissuesActions.SearchFOC, state) => {
        return this.otherIssueService
          .searchAdjustmentItem(
            action.payload.variantCode,
            action.payload.lotNumber,
            action.payload.binType,
            //null,
            state[otherIssueFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (searchItemPayloadSuccess: PSVSearchItemPayloadSuccess) =>
                new otherRecieptissuesActions.SearchFOCSuccess({
                  items: searchItemPayloadSuccess.items,
                  count: searchItemPayloadSuccess.count
                })
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.SearchFOC,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.SearchFOCSuccess({
          items: [],
          count: 0
        });
      }
    }
  );
  @Effect() createStockRequestFOC$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.CREATE_STOCK_REQUEST_FOC,
    {
      run: (action: otherRecieptissuesActions.CreateStockRequestFOC) => {
        return this.otherIssueService
          .createStockRequestAdjustment(
            action.payload.reqType,
            action.payload.approvalDetails,
            action.payload.items,
            action.payload.remarks
          )
          .pipe(
            map(
              (data: OtherIssueModel) =>
                new otherRecieptissuesActions.CreateStockRequestFOCSuccess(data)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.CreateStockRequestFOC,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.CreateStockRequestFOCFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadIssueFOCList$: Observable<Action> = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_ISSUE_FOC_LIST,
    {
      run: (action: otherRecieptissuesActions.LoadIssueFOCList) => {
        return this.otherIssueService
          .getIssueList(
            action.payload.type,
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (stockTransferNotes: OtherIssuedataModel) =>
                new otherRecieptissuesActions.LoadIssueFOCListSuccess(
                  stockTransferNotes
                )
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadIssueFOCList,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadIssueFOCListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() cancelStockRequest$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.CANCEL_STOCK_REQUEST,
    {
      run: (action: otherRecieptissuesActions.CancelStockRequest) => {
        return this.otherIssueService
          .cancelStockRequest(action.payload.id, action.payload.requestType)
          .pipe(
            map(
              (data: any) =>
                new otherRecieptissuesActions.CancelStockRequestSuccess(data)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.CancelStockRequest,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.CancelStockRequestFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() printOtherIssues$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.PRINT_OTHER_ISSUES,
    {
      run: (action: otherRecieptissuesActions.PrintOtherIssues) => {
        return this.otherIssueService
          .printOtherIssue(action.payload.id, action.payload.requestType)
          .pipe(
            map(
              (data: any) =>
                new otherRecieptissuesActions.PrintOtherIssuesSuccess(data)
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.PrintOtherIssues,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.PrintOtherIssuesFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect() loadProductCategories$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_PRODUCT_CATEGORIES,
    {
      run: (action: otherRecieptissuesActions.LoadProductCategories) => {
        return this.productCategoryDataService
          .getProductCategories(false, null, null, ['description,asc'])
          .pipe(
            map(
              (data: ProductCategory[]) =>
                new otherRecieptissuesActions.LoadProductCategoriesSuccess(data)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadProductCategories,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadProductCategoriesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadProductGroups$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_PROUDCT_GROUPS,
    {
      run: (action: otherRecieptissuesActions.LoadProductGroups) => {
        return this.productGroupDataService
          .getProductGroups(
            false,
            null,
            null,
            ['description,asc'],
            action.payload
          )
          .pipe(
            map(
              (data: ProductGroup[]) =>
                new otherRecieptissuesActions.LoadProductGroupsSuccess(data)
            )
          );
      },

      onError: (
        action: otherRecieptissuesActions.LoadProductGroups,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadProductGroupsFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  // HISTORY
  @Effect()
  loadIssueHistory$: Observable<Action> = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY,
    {
      run: (action: otherRecieptissuesActions.LoadOtherIssueHistory) => {
        return this.otherIssueService
          .getHistory(
            action.payload.type,
            action.payload.page,
            action.payload.size,
            action.payload.sort,
            action.payload.payload,
            action.payload.issueType
          )
          .pipe(
            map(
              (history: OtherIssuedataModel) =>
                new otherRecieptissuesActions.LoadOtherIssueHistorySuccess(
                  history
                )
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadOtherIssueHistory,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadOtherIssueHistorySuccess({
          issueData: [],
          totalElements: 0
        });
      }
    }
  );
  @Effect()
  loadSelectedHistory$: Observable<Action> = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_HISTORY,
    {
      run: (action: otherRecieptissuesActions.LoadSelectedHistory) => {
        return this.otherIssueService
          .getSelectedHistory(
            action.payload.type,
            action.payload.actionType,
            action.payload.id,
            action.payload.transactionType
          )
          .pipe(
            map(
              (data: OtherIssueModel) =>
                new otherRecieptissuesActions.LoadSelectedHistorySuccess(data)
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadSelectedHistory,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadSelectedHistoryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadHistoryItems$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS,
    {
      run: (
        action: otherRecieptissuesActions.LoadSelectedHistoryItems,
        state
      ) => {
        return this.otherIssueService
          .getHistoryItems(
            action.payload.type,
            action.payload.actionType,
            action.payload.id,
            action.payload.page,
            action.payload.size,
            action.payload.sort,
            action.payload.payload,
            action.payload.transactionType,
            state[otherIssueFeatureKey].studdedProductGroups
          )
          .pipe(
            map(
              (data: { items: OtherIssuesHistoryItem[]; count: number }) =>
                new otherRecieptissuesActions.LoadSelectedHistoryItemsSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadSelectedHistoryItems,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadSelectedHistoryItemsSuccess({
          items: [],
          count: 0
        });
      }
    }
  );

  @Effect()
  loadItemsCount$ = this.dataPersistence.fetch(
    OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS,
    {
      run: (
        action: otherRecieptissuesActions.LoadSelectedHistoryItemsTotalCount
      ) => {
        return this.otherIssueService
          .getHistoryItemsTotalCount(
            action.payload.actionType,
            action.payload.type,
            action.payload.id,
            action.payload.page,
            action.payload.size,
            action.payload.sort,
            action.payload.payload,
            action.payload.transactionType
          )
          .pipe(
            map(
              (data: number) =>
                new otherRecieptissuesActions.LoadSelectedHistoryItemsTotalCountSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: otherRecieptissuesActions.LoadSelectedHistoryItemsTotalCount,
        error: HttpErrorResponse
      ) => {
        return new otherRecieptissuesActions.LoadSelectedHistoryItemsTotalCountFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }

  constructor(
    private dataPersistence: DataPersistence<OtherIssuesState>,
    private loggerService: LoggerService,
    private otherIssueService: OtherIssueService,
    private productGroupDataService: ProductGroupDataService,
    private productCategoryDataService: ProductCategoryDataService
  ) {}
}
