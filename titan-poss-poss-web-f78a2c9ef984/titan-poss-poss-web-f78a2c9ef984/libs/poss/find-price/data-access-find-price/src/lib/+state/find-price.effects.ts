import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { FindPriceService } from '../find-price.service';
import { 
  CashMemoTaxDetails,
  CustomErrors,
  ProductPriceDetails,
} from '@poss-web/shared/models';
import { FindPriceState } from './find-price.state';
import { FindPriceActionTypes } from './find-price.actions';
import * as FindPriceActions from './find-price.actions';
import { CommonService } from '@poss-web/shared/common/data-access-common'; 

@Injectable()
export class FindPriceEffects {
  constructor(
    private dataPersistence: DataPersistence<FindPriceState>,
    private FindPriceService: FindPriceService,
    private commonService: CommonService,
    private loggerService: LoggerService
  ) {}

  @Effect()
  loadStandardMetalPriceDetails$ = this.dataPersistence.fetch(
    FindPriceActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS,
    {
      run: (action: FindPriceActions.LoadStandardMetalPriceDetails) => {
        return this.commonService
          .getStandardMetalPriceDetails()
          .pipe(
            map(
              (metalPriceDetails: any) =>
                new FindPriceActions.LoadStandardMetalPriceDetailsSuccess(
                  metalPriceDetails
                )
            )
          );
      },
      onError: (
        action: FindPriceActions.LoadStandardMetalPriceDetails,
        error: HttpErrorResponse
      ) => {
        return new FindPriceActions.LoadStandardMetalPriceDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() FindPrice$: Observable<Action> = this.dataPersistence.fetch(
    FindPriceActionTypes.FIND_PRICE,
    {
      run: (action: FindPriceActions.FindPrice) => {
        return this.FindPriceService
          .getFindPrice(action.payload.payload)
          .pipe(
            map(
              (data: ProductPriceDetails) =>
                new FindPriceActions.FindPriceSuccess({
                  data: data,
                  isViewPricing: action.payload.isViewPricing,
                })
            )
          );
      },

      onError: (
        action: FindPriceActions.FindPrice,
        error: HttpErrorResponse
      ) => {
        return new FindPriceActions.FindPriceFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadTaxDetails$: Observable<Action> = this.dataPersistence.fetch(
    FindPriceActionTypes.LOAD_TAX_DETAILS,
    {
      run: (action: FindPriceActions.LoadTaxDetails) => {
        return this.FindPriceService
          .getTaxDetails(
            action.payload.itemCode,
            action.payload.txnType
          )
          .pipe(
            map((data: CashMemoTaxDetails) => {
              return new FindPriceActions.LoadTaxDetailsSuccess(data);
            })
          );
      },

      onError: (
        action: FindPriceActions.LoadTaxDetails,
        error: HttpErrorResponse
      ) => {
        return new FindPriceActions.LoadTaxDetailsFailure(
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