import {
  ItemDataService,
  ProductCategoryDataService,
  ProductGroupDataService
} from '@poss-web/shared/masters/data-access-masters';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrors, ItemStoneDetails } from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';
import * as ItemDetailsPopupActions from './item-details-popup.actions';
import { ItemDetailsPopupActionTypes } from './item-details-popup.actions';

@Injectable()
export class ItemDetailsPopupEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private itemDataService: ItemDataService,
    private productCategoryDataService: ProductCategoryDataService,
    private productGroupDataService: ProductGroupDataService
  ) {}
  /**
   *  The effect which handles the loadPendingFactorySTN Action
   */
  @Effect()
  loadStoneDetails$ = this.dataPersistence.fetch(
    ItemDetailsPopupActionTypes.LOAD_STONE_DETAILS,
    {
      run: (action: ItemDetailsPopupActions.LoadStoneDetails) => {
        return this.itemDataService
          .getItemStoneDetails(
            action.payload.itemCode,
            action.payload.lotNumber,
            action.payload.locationCode
          )
          .pipe(
            map(
              (data: ItemStoneDetails[]) =>
                new ItemDetailsPopupActions.LoadStoneDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: ItemDetailsPopupActions.LoadStoneDetails,
        error: HttpErrorResponse
      ) => {
        return new ItemDetailsPopupActions.LoadStoneDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCOStoneDetails$ = this.dataPersistence.fetch(
    ItemDetailsPopupActionTypes.LOAD_CO_STONE_DETAILS,
    {
      run: (action: ItemDetailsPopupActions.LoadCOStoneDetails) => {
        return this.itemDataService
          .getItemWithoutLotStoneDetails(action.payload.itemCode)
          .pipe(
            map(
              (data: ItemStoneDetails[]) =>
                new ItemDetailsPopupActions.LoadCOStoneDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: ItemDetailsPopupActions.LoadCOStoneDetails,
        error: HttpErrorResponse
      ) => {
        return new ItemDetailsPopupActions.LoadCOStoneDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPcDesc$ = this.dataPersistence.fetch(
    ItemDetailsPopupActionTypes.LOAD_PC_DESC,
    {
      run: (action: ItemDetailsPopupActions.LoadPcDesc) => {
        return this.productCategoryDataService
          .getProductCategoryDescription()
          .pipe(
            map(
              (data: {}) => new ItemDetailsPopupActions.LoadPcDescSuccess(data)
            )
          );
      },
      onError: (
        action: ItemDetailsPopupActions.LoadPcDesc,
        error: HttpErrorResponse
      ) => {
        return new ItemDetailsPopupActions.LoadPcDescFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPgDesc$ = this.dataPersistence.fetch(
    ItemDetailsPopupActionTypes.LOAD_PG_DESC,
    {
      run: (action: ItemDetailsPopupActions.LoadPgDesc) => {
        return this.productGroupDataService
          .getProductGroupDescription()
          .pipe(
            map(
              (data: {}) => new ItemDetailsPopupActions.LoadPgDescSuccess(data)
            )
          );
      },
      onError: (
        action: ItemDetailsPopupActions.LoadPgDesc,
        error: HttpErrorResponse
      ) => {
        return new ItemDetailsPopupActions.LoadPgDescFailure(
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
