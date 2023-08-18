import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { DataPersistence } from '@nrwl/angular';
import { StoreUserDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  CancellableCashMemoData,
  CashMemoMinimalDetail,
  CustomErrors,
  GcCashMemoCancelResponse,
  GetAddedGiftCardItemResponse,
  GetCreatedGiftCardCmDetails,
  GetDeletedGiftCardItemResponse,
  GetGiftCardItemResponse,
  GetPartiallyUpdatedGcCmResponse,
  GetUpdatedGcCashMemoResponse,
  GiftCardsHistoryListItemsResponse,
  QCGCCardDetails,
  RsoNameObject,
  StoreUser
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GiftCardsService } from '../gift-cards.service';
import * as GiftCardsActions from './gift-cards.actions';
import { GiftCardsActionTypes } from './gift-cards.actions';
import { GiftCardsState } from './gift-cards.state';

@Injectable()
export class GiftCardsEffects {
  constructor(
    private dataPersistence: DataPersistence<GiftCardsState>,
    private giftCardsService: GiftCardsService,
    private loggerService: LoggerService,
    private storeUserDataService: StoreUserDataService
  ) {}

  @Effect() createGcCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    GiftCardsActionTypes.CREATE_GC_CASH_MEMO,
    {
      run: (action: GiftCardsActions.CreateGcCashMemo) => {
        return this.giftCardsService
          .createGiftCardCashMemo()
          .pipe(
            map(
              (data: GetCreatedGiftCardCmDetails | null) =>
                new GiftCardsActions.CreateGcCashMemoSuccess(data)
            )
          );
      },
      onError: (
        action: GiftCardsActions.CreateGcCashMemo,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.CreateGcCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() partiallyUpdateGcCashMemo$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GiftCardsActionTypes.PARTIALLY_UPDATE_GC_CASH_MEMO,
    {
      run: (action: GiftCardsActions.PartiallyUpdateGcCashMemo) => {
        return this.giftCardsService
          .partiallyUpdateGcCashMemo(action.cashMemoId, action.requestBody)
          .pipe(
            map(
              (data: GetPartiallyUpdatedGcCmResponse) =>
                new GiftCardsActions.PartiallyUpdateGcCashMemoSuccess(data)
            )
          );
      },
      onError: (
        action: GiftCardsActions.PartiallyUpdateGcCashMemo,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.PartiallyUpdateGcCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() updateGcCashMemo$: Observable<Action> = this.dataPersistence.fetch(
    GiftCardsActionTypes.UPDATE_GC_CASH_MEMO,
    {
      run: (action: GiftCardsActions.UpdateGcCashMemo) => {
        return this.giftCardsService
          .updateGcCashMemo(action.cashMemoId, action.requestDetails)
          .pipe(
            map(
              (data: GetUpdatedGcCashMemoResponse) =>
                new GiftCardsActions.UpdateGcCashMemoSuccess(data)
            )
          );
      },
      onError: (
        action: GiftCardsActions.UpdateGcCashMemo,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.UpdateGcCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() addGiftCardItem$: Observable<Action> = this.dataPersistence.fetch(
    GiftCardsActionTypes.ADD_GIFT_CARD_ITEM,
    {
      run: (action: GiftCardsActions.AddGiftCardItem) => {
        return this.giftCardsService
          .addGiftCardItem(action.cashMemoId, action.requestBody)
          .pipe(
            map((data: GetAddedGiftCardItemResponse) => {
              return new GiftCardsActions.AddGiftCardItemSuccess(data);
            })
          );
      },
      onError: (
        action: GiftCardsActions.AddGiftCardItem,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.AddGiftCardItemFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() getAddedGiftCardItem$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GiftCardsActionTypes.GET_ADDED_GIFT_CARD_ITEM,
    {
      run: (action: GiftCardsActions.GetAddedGiftCardItem) => {
        return this.giftCardsService
          .getAddedGiftCardItem(action.cashMemoId, action.giftCardItemId)
          .pipe(
            map(
              (data: GetGiftCardItemResponse) =>
                new GiftCardsActions.GetAddedGiftCardItemSuccess(data)
            )
          );
      },
      onError: (
        action: GiftCardsActions.GetAddedGiftCardItem,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.GetAddedGiftCardItemFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() deleteAddedGiftCardItem$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GiftCardsActionTypes.DELETE_ADDED_GIFT_CARD_ITEM,
    {
      run: (action: GiftCardsActions.DeleteAddedGiftCardItem) => {
        return this.giftCardsService
          .deleteAddedGiftCardItem(action.cashMemoId, action.giftCardItemId)
          .pipe(
            map(
              (data: GetDeletedGiftCardItemResponse) =>
                new GiftCardsActions.DeleteAddedGiftCardItemSuccess(data)
            )
          );
      },
      onError: (
        action: GiftCardsActions.DeleteAddedGiftCardItem,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.DeleteAddedGiftCardItemFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() partiallyUpdateGiftCardItem$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GiftCardsActionTypes.PARTIALLY_UPDATE_GIFT_CARD_ITEM,
    {
      run: (action: GiftCardsActions.PartiallyUpdateGiftCardItem) => {
        return this.giftCardsService
          .partiallyUpdateGiftCardItem(
            action.cashMemoId,
            action.giftCardItemId,
            action.requestBody
          )
          .pipe(
            map(
              (data: GetAddedGiftCardItemResponse) =>
                new GiftCardsActions.PartiallyUpdateGiftCardItemSuccess(data)
            )
          );
      },
      onError: (
        action: GiftCardsActions.PartiallyUpdateGiftCardItem,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.PartiallyUpdateGiftCardItemFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadRSODetails$: Observable<Action> = this.dataPersistence.fetch(
    GiftCardsActionTypes.LOAD_RSO_DETAILS,
    {
      run: (action: GiftCardsActions.LoadRSODetails) => {
        return this.storeUserDataService
          .getStoreUsers(null, null, null, null, [action.payload])
          .pipe(
            map((data: StoreUser[]) => {
              const employeeCodes: RsoNameObject[] = [];
              for (const employee of data) {
                const empObj: RsoNameObject = {
                  value: employee.employeeCode,
                  description: employee.empName
                };
                employeeCodes.push(empObj);
              }
              return new GiftCardsActions.LoadRSODetailsSuccess(employeeCodes);
            })
          );
      },

      onError: (
        action: GiftCardsActions.LoadRSODetails,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.LoadRSODetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() printGcCashMemo$ = this.dataPersistence.fetch(
    GiftCardsActionTypes.PRINT_GC_CASH_MEMO,
    {
      run: (action: GiftCardsActions.PrintGcCashMemo) => {
        return this.giftCardsService
          .printGcCashMemo()
          .pipe(
            map(
              (data: any) => new GiftCardsActions.PrintGcCashMemoSuccess(data)
            )
          );
      },
      onError: (
        action: GiftCardsActions.PrintGcCashMemo,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.PrintGcCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadGcCashMemoAvailableForCancellation$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GiftCardsActionTypes.LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION,
    {
      run: (
        action: GiftCardsActions.LoadCashMemoBillsAvailableForCancellation
      ) => {
        return this.giftCardsService
          .getCashMemoBillsAvailableForCancellation(
            action.mobileNumber,
            action.cmNumber
          )
          .pipe(
            map((data: CancellableCashMemoData[]) => {
              return new GiftCardsActions.LoadCashMemoBillsAvailableForCancellationSuccess(
                data
              );
            })
          );
      },
      onError: (
        action: GiftCardsActions.LoadCashMemoBillsAvailableForCancellation,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.LoadCashMemoBillsAvailableForCancellationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadSelectedGcCashMemoDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GiftCardsActionTypes.LOAD_SELECTED_GC_CASH_MEMO_DETAILS,
    {
      run: (action: GiftCardsActions.LoadSelectedGcCashMemoDetails) => {
        return this.giftCardsService.getGcCashMemoById(action.payload).pipe(
          map((data: CashMemoMinimalDetail) => {
            return new GiftCardsActions.LoadSelectedGcCashMemoDetailsSuccess(
              data
            );
          })
        );
      },
      onError: (
        action: GiftCardsActions.LoadSelectedGcCashMemoDetails,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.LoadSelectedGcCashMemoDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadCancelGcCashMemo$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GiftCardsActionTypes.LOAD_CANCEL_GC_CASH_MEMO,
    {
      run: (action: GiftCardsActions.LoadCancelGcCashMemo) => {
        return this.giftCardsService.cancelGcCashMemo(action.payload).pipe(
          map((data: GcCashMemoCancelResponse) => {
            return new GiftCardsActions.LoadCancelGcCashMemoSuccess(data);
          })
        );
      },
      onError: (
        action: GiftCardsActions.LoadCancelGcCashMemo,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.LoadCancelGcCashMemoFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadGcCancellationReasons$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GiftCardsActionTypes.LOAD_GC_CANCELLATION_REASONS,
    {
      run: (action: GiftCardsActions.LoadGcCancellationReasons) => {
        return this.giftCardsService.getGcCancellationReasons().pipe(
          map((data: string[]) => {
            return new GiftCardsActions.LoadGcCancellationReasonsSuccess(data);
          })
        );
      },
      onError: (
        action: GiftCardsActions.LoadGcCancellationReasons,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.LoadGcCancellationReasonsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadGcBalance$: Observable<Action> = this.dataPersistence.fetch(
    GiftCardsActionTypes.LOAD_GC_BALANCE,
    {
      run: (action: GiftCardsActions.LoadGcBalance) => {
        return this.giftCardsService.getQCGCBalance(action.payload).pipe(
          map((data: QCGCCardDetails) => {
            return new GiftCardsActions.LoadGcBalanceSuccess(data);
          })
        );
      },
      onError: (
        action: GiftCardsActions.LoadGcBalance,
        error: HttpErrorResponse
      ) => {
        console.log('Error in GC BALANCE:', error);
        return new GiftCardsActions.LoadGcBalanceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadGiftCardsHistoryListItems$: Observable<
    Action
  > = this.dataPersistence.fetch(
    GiftCardsActionTypes.LOAD_GIFT_CARDS_HISTORY_LIST_ITEMS,
    {
      run: (action: GiftCardsActions.LoadGiftCardsHistoryListItems) => {
        return this.giftCardsService
          .loadGiftCardsHistoryListItems(action.payload)
          .pipe(
            map((data: GiftCardsHistoryListItemsResponse) => {
              return new GiftCardsActions.LoadGiftCardsHistoryListItemsSuccess(
                data
              );
            })
          );
      },
      onError: (
        action: GiftCardsActions.LoadGiftCardsHistoryListItems,
        error: HttpErrorResponse
      ) => {
        return new GiftCardsActions.LoadGiftCardsHistoryListItemsFailure(
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
}
