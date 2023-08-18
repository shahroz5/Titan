import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as ClubDiscountsActions from './clubbing-discount.actions';
import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  ClubDiscountsList,
  CustomErrors,
  DiscountTypeBasedCodes
} from '@poss-web/shared/models';
import { ClubbingDiscountsService } from '../clubbing-discounts.service';
import { ClubDiscountsActionTypes } from './clubbing-discount.actions';

@Injectable()
export class ClubDiscountsEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public clubDiscountsService: ClubbingDiscountsService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  loadDiscountConfigList$ = this.dataPersistence.fetch(
    ClubDiscountsActionTypes.LOAD_CLUBBING_DISCOUNTS,
    {
      run: (action: ClubDiscountsActions.LoadClubbingDiscountConfigList) => {
        return this.clubDiscountsService
          .loadClubbingDiscountConfigList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.discountCode
          )
          .pipe(
            map(
              (data: any) =>
                new ClubDiscountsActions.LoadClubbingDiscountConfigListSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: ClubDiscountsActions.LoadClubbingDiscountConfigList,
        error: HttpErrorResponse
      ) => {
        return new ClubDiscountsActions.LoadClubbingDiscountConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveClubbedDiscountDetails$ = this.dataPersistence.fetch(
    ClubDiscountsActionTypes.SAVE_CLUBBING_DISCOUNTS,
    {
      run: (action: ClubDiscountsActions.SaveClubbingDiscountConfigList) => {
        return this.clubDiscountsService
          .saveClubbedDiscounts(action.payload)
          .pipe(
            map(
              (clunDiscountList: ClubDiscountsList) =>
                new ClubDiscountsActions.SaveClubbingDiscountConfigListSuccess(
                  clunDiscountList
                )
            )
          );
      },
      onError: (
        action: ClubDiscountsActions.SaveClubbingDiscountConfigList,
        error: HttpErrorResponse
      ) => {
        return new ClubDiscountsActions.SaveClubbingDiscountConfigListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadType1DiscountCodes$ = this.dataPersistence.fetch(
    ClubDiscountsActionTypes.LOAD_TYPE1_DISCOUNTS,
    {
      run: (action: ClubDiscountsActions.LoadType1Discounts) => {
        return this.clubDiscountsService
          .getDiscountCodesByType(action.payload)
          .pipe(
            map(
              (discountCodes: DiscountTypeBasedCodes[]) =>
                new ClubDiscountsActions.LoadType1DiscountsSuccess(
                  discountCodes
                )
            )
          );
      },
      onError: (
        action: ClubDiscountsActions.LoadType1Discounts,
        error: HttpErrorResponse
      ) => {
        return new ClubDiscountsActions.LoadType1DiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadType2DiscountCodes$ = this.dataPersistence.fetch(
    ClubDiscountsActionTypes.LOAD_TYPE2_DISCOUNTS,
    {
      run: (action: ClubDiscountsActions.LoadType2Discounts) => {
        return this.clubDiscountsService
          .getDiscountCodesByType(action.payload)
          .pipe(
            map(
              (discountCodes: DiscountTypeBasedCodes[]) =>
                new ClubDiscountsActions.LoadType2DiscountsSuccess(
                  discountCodes
                )
            )
          );
      },
      onError: (
        action: ClubDiscountsActions.LoadType2Discounts,
        error: HttpErrorResponse
      ) => {
        return new ClubDiscountsActions.LoadType2DiscountsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadType3DiscountCodes$ = this.dataPersistence.fetch(
    ClubDiscountsActionTypes.LOAD_TYPE3_DISCOUNTS,
    {
      run: (action: ClubDiscountsActions.LoadType3Discounts) => {
        return this.clubDiscountsService
          .getDiscountCodesByType(action.payload)
          .pipe(
            map(
              (discountCodes: DiscountTypeBasedCodes[]) =>
                new ClubDiscountsActions.LoadType3DiscountsSuccess(
                  discountCodes
                )
            )
          );
      },
      onError: (
        action: ClubDiscountsActions.LoadType3Discounts,
        error: HttpErrorResponse
      ) => {
        return new ClubDiscountsActions.LoadType3DiscountsFailure(
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
