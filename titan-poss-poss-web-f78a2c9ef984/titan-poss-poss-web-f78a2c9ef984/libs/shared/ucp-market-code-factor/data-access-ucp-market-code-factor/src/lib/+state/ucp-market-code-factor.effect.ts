import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { UcpMarketCodeFactorActionTypes } from './ucp-market-code-factor.action';
import * as UcpMarketCodeFactorAction from './ucp-market-code-factor.action';
import {
  CustomErrors,
  UcpMarketCodeListing,
  UcpProductGroup,
  MarketCode
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { UcpMarketCodeFactorService } from '../ucp-market-code-factor.service';

@Injectable()
export class UcpMarketCodeFactorEffect { 
  constructor(
    public dataPersistence: DataPersistence<any>,
    public ucpMarketCodeFactorService: UcpMarketCodeFactorService,
    private loggerService: LoggerService
  ) {}
  @Effect()
  loadUcpMarketCodeFactorList$ = this.dataPersistence.fetch(
    UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_LISTING,
    {
      run: (
        action: UcpMarketCodeFactorAction.LoadUCPMarketCodeFactorCodeList
      ) => {
        return this.ucpMarketCodeFactorService
          .getUcpMarketCodeFactorList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.searchValue
          )
          .pipe(
            map(
              (ucpMarketCodeListing: UcpMarketCodeListing) =>
                new UcpMarketCodeFactorAction.LoadUCPMarketCodeFactorCodeListSuccess(
                  ucpMarketCodeListing
                )
            )
          );
      },

      onError: (
        action: UcpMarketCodeFactorAction.LoadUCPMarketCodeFactorCodeList,
        error: HttpErrorResponse
      ) => {
        return new UcpMarketCodeFactorAction.LoadUCPMarketCodeFactorCodeListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadUcpMarketCodeFactorByCode$ = this.dataPersistence.fetch(
    UcpMarketCodeFactorActionTypes.LOAD_UCP_MARKET_CODE_FACTOR_BY_CODE,
    {
      run: (
        action: UcpMarketCodeFactorAction.LoadUCPMarketCodeFactorByCode
      ) => {
        return this.ucpMarketCodeFactorService
          .getUcpMarketCodeFactorByCode(action.payload)
          .pipe(
            map(
              (ucpMarketCodeFactor: any) =>
                new UcpMarketCodeFactorAction.LoadUCPMarketCodeFactorByCodeSuccess(
                  ucpMarketCodeFactor
                )
            )
          );
      },

      onError: (
        action: UcpMarketCodeFactorAction.LoadUCPMarketCodeFactorByCode,
        error: HttpErrorResponse
      ) => {
        return new UcpMarketCodeFactorAction.LoadUCPMarketCodeFactorByCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateUcpMarketCodeFactorByCode$ = this.dataPersistence.pessimisticUpdate(
    UcpMarketCodeFactorActionTypes.UPDATE_UCP_MARKET_CODE_FACTOR_BY_CODE,
    {
      run: (
        action: UcpMarketCodeFactorAction.UpdateUCPMarketCodeFactorByCode
      ) => {
        return this.ucpMarketCodeFactorService
          .updateUcpMarketCodeFactorByCode(action.payload)
          .pipe(
            map(
              () =>
                new UcpMarketCodeFactorAction.UpdateUCPMarketCodeFactorByCodeSuccess()
            )
          );
      },

      onError: (
        action: UcpMarketCodeFactorAction.UpdateUCPMarketCodeFactorByCode,
        error: HttpErrorResponse
      ) => {
        return new UcpMarketCodeFactorAction.UpdateUCPMarketCodeFactorByCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveUcpMarketCodeFactor$ = this.dataPersistence.fetch(
    UcpMarketCodeFactorActionTypes.SAVE_UCP_MARKET_CODE_FACTOR,
    {
      run: (action: UcpMarketCodeFactorAction.SaveUCPMarketCodeFactorCode) => {
        return this.ucpMarketCodeFactorService
          .saveUcpMarketCodeFactor(action.payload)
          .pipe(
            map(
              () =>
                new UcpMarketCodeFactorAction.SaveUCPMarketCodeFactorCodeSuccess()
            )
          );
      },

      onError: (
        action: UcpMarketCodeFactorAction.SaveUCPMarketCodeFactorCode,
        error: HttpErrorResponse
      ) => {
        return new UcpMarketCodeFactorAction.SaveUCPMarketCodeFactorCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMarketCode$ = this.dataPersistence.fetch(
    UcpMarketCodeFactorActionTypes.LOAD_MARKET_CODE,
    {
      run: (action: UcpMarketCodeFactorAction.LoadMarketCode) => {
        return this.ucpMarketCodeFactorService
          .getMarketCode()
          .pipe(
            map(
              (marketCodes: MarketCode[]) =>
                new UcpMarketCodeFactorAction.LoadMarketCodeSuccess(marketCodes)
            )
          );
      },

      onError: (
        action: UcpMarketCodeFactorAction.LoadMarketCode,
        error: HttpErrorResponse
      ) => {
        return new UcpMarketCodeFactorAction.LoadMarketCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadUcpProductGroup$ = this.dataPersistence.fetch(
    UcpMarketCodeFactorActionTypes.LOAD_UCP_PRODUCT_CODE,
    {
      run: (action: UcpMarketCodeFactorAction.LoadUcpProductCode) => {
        return this.ucpMarketCodeFactorService
          .getUcpProductGroup()
          .pipe(
            map(
              (ucpProductGroup: UcpProductGroup[]) =>
                new UcpMarketCodeFactorAction.LoadUcpProductCodeSuccess(
                  ucpProductGroup
                )
            )
          );
      },

      onError: (
        action: UcpMarketCodeFactorAction.LoadUcpProductCode,
        error: HttpErrorResponse
      ) => {
        return new UcpMarketCodeFactorAction.LoadUcpProductCodeFailure(
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
