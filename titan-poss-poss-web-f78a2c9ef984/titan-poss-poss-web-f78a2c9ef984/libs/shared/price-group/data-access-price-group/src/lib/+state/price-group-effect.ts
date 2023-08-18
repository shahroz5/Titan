import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PriceGroupService } from '../price-group.service';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { PriceGroupMasterActionsTypes } from './price-group-actions';
import * as PriceGroupMasterActions from './price-group-actions';
import {
  CustomErrors,
  PriceGroupListing,
  PriceGroupMaster
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
@Injectable()
export class PriceGroupEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public priceGroupService: PriceGroupService,
    private loggerService: LoggerService
  ) { }
  @Effect()
  loadPriceGroupList$ = this.dataPersistence.fetch(
    PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_LISTING,
    {
      run: (action: PriceGroupMasterActions.LoadPriceGroup) => {
        return this.priceGroupService
          .getPriceGroupMasterList(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (priecGrouplist: PriceGroupListing) =>
                new PriceGroupMasterActions.LoadPriceGroupSuccess(
                  priecGrouplist
                )
            )
          );
      },

      onError: (
        action: PriceGroupMasterActions.LoadPriceGroup,
        error: HttpErrorResponse
      ) => {
        return new PriceGroupMasterActions.LoadPriceGroupFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadPriceGroupByPriceGroupCode$ = this.dataPersistence.fetch(
    PriceGroupMasterActionsTypes.LOAD_PRICE_GROUP_BY_PRICE_GROUP_CODE,
    {
      run: (action: PriceGroupMasterActions.LoadPriceGroupByPriceGroupCode) => {
        return this.priceGroupService
          .getPriceGroupByPriceGroupCode(action.payload)
          .pipe(
            map(
              (priecGroup: PriceGroupMaster) =>
                new PriceGroupMasterActions.LoadPriceGroupByPriceGroupCodeSuccess(
                  priecGroup
                )
            )
          );
      },

      onError: (
        action: PriceGroupMasterActions.LoadPriceGroupByPriceGroupCode,
        error: HttpErrorResponse
      ) => {
        return new PriceGroupMasterActions.LoadPriceGroupByPriceGroupCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updatePriceGroupByPriceGroupCode$ = this.dataPersistence.pessimisticUpdate(
    PriceGroupMasterActionsTypes.UPDATE_PRICE_GROUP_BY_PRICE_GROUP_CODE,
    {
      run: (
        action: PriceGroupMasterActions.UpdatePricGroupByPriceGroupCode
      ) => {
        return this.priceGroupService
          .updatePriceGroupByPriceGroupCode(
            action.payload.priceGroup,
            action.payload.data
          )
          .pipe(
            map(
              () =>
                new PriceGroupMasterActions.UpdatePricGroupByPriceGroupCodeSuccess()
            )
          );
      },

      onError: (
        action: PriceGroupMasterActions.UpdatePricGroupByPriceGroupCode,
        error: HttpErrorResponse
      ) => {
        return new PriceGroupMasterActions.UpdatePricGroupByPriceGroupCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  savePriceGroupMaster$ = this.dataPersistence.fetch(
    PriceGroupMasterActionsTypes.SAVE_PRICE_GROUP,
    {
      run: (action: PriceGroupMasterActions.SavePriceGroup) => {
        return this.priceGroupService
          .savePriceGroup(action.payload)
          .pipe(map(() => new PriceGroupMasterActions.SavePriceGroupSuccess()));
      },

      onError: (
        action: PriceGroupMasterActions.SavePriceGroup,
        error: HttpErrorResponse
      ) => {
        return new PriceGroupMasterActions.SavePriceGroupFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchPriceGroupList$ = this.dataPersistence.fetch(
    PriceGroupMasterActionsTypes.SEARCH_PRICE_GROUP_LIST,
    {
      run: (action: PriceGroupMasterActions.SearchPriceGroupList) => {
        return this.priceGroupService
          .searchPriceGroupList(action.payload)
          .pipe(
            map(
              (priceGroupListing: PriceGroupListing) =>
                new PriceGroupMasterActions.SearchPriceGroupListSuccess(
                  priceGroupListing
                )
            )
          );
      },

      onError: (
        action: PriceGroupMasterActions.SearchPriceGroupList,
        error: HttpErrorResponse
      ) => {
        return new PriceGroupMasterActions.SearchPriceGroupListFailure(
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
