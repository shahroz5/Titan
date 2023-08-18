import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ComplexityCodeActionTypes } from './complexity-code.actions';
import * as ComplexityCodeActions from './complexity-code.actions';
import {
    CustomErrors,
    ComplexityListing,
    ComplexityCode
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { ComplexityCodeService } from '../complexity-code.service';

@Injectable()
export class ComplexityCodeEffect {
    constructor(
        public dataPersistence: DataPersistence<any>,
        public complexityCodeService: ComplexityCodeService,
        private loggerService: LoggerService
    ) { }
    @Effect()
    loadComplexityCodeList$ = this.dataPersistence.fetch(
        ComplexityCodeActionTypes.LOAD_COMPLEXIETY_CODE_LISTING,
        {
            run: (action: ComplexityCodeActions.LoadComplexityCodeList) => {
                return this.complexityCodeService
                    .getComplexityCodeList(
                        action.payload.pageIndex,
                        action.payload.pageSize
                    )
                    .pipe(
                        map(
                            (complexityCodeList: ComplexityListing) =>
                                new ComplexityCodeActions.LoadComplexityCodeListSuccess(
                                    complexityCodeList
                                )
                        )
                    );
            },

            onError: (
                action: ComplexityCodeActions.LoadComplexityCodeList,
                error: HttpErrorResponse
            ) => {
                return new ComplexityCodeActions.LoadComplexityCodeListFailure(
                    this.errorHandler(error)
                );
            }
        }
    );

    @Effect()
    loadComplexityByCode$ = this.dataPersistence.fetch(
        ComplexityCodeActionTypes.LOAD_COMPLEXITY_BY_CODE,
        {
            run: (action: ComplexityCodeActions.LoadComplexityByCode) => {
                return this.complexityCodeService
                    .getComplexityByCode(action.payload)
                    .pipe(
                        map(
                            (complexityCode: ComplexityCode) =>
                                new ComplexityCodeActions.LoadComplexityByCodeSuccess(
                                    complexityCode
                                )
                        )
                    );
            },

            onError: (
                action: ComplexityCodeActions.LoadComplexityByCode,
                error: HttpErrorResponse
            ) => {
                return new ComplexityCodeActions.LoadComplexityByCodeFailure(
                    this.errorHandler(error)
                );
            }
        }
    );

    @Effect()
    updateComplexityByCode$ = this.dataPersistence.pessimisticUpdate(
        ComplexityCodeActionTypes.UPDATE_COMPLEXITY_BY_CODE,
        {
            run: (
                action: ComplexityCodeActions.UpdateComplexityByCode
            ) => {
                return this.complexityCodeService
                    .updateComplexityCode(
                        action.payload

                    )
                    .pipe(
                        map(
                            () =>
                                new ComplexityCodeActions.UpdateComplexityByCodeSuccess()
                        )
                    );
            },

            onError: (
                action: ComplexityCodeActions.UpdateComplexityByCode,
                error: HttpErrorResponse
            ) => {
                return new ComplexityCodeActions.UpdateComplexityByCodeFailure(
                    this.errorHandler(error)
                );
            }
        }
    );

    @Effect()
    saveComplexityCode$ = this.dataPersistence.fetch(
        ComplexityCodeActionTypes.SAVE_COMPLEXIETY_CODE,
        {
            run: (action: ComplexityCodeActions.SaveComplexityCode) => {
                return this.complexityCodeService
                    .saveComplexityCode(action.payload)
                    .pipe(map(() => new ComplexityCodeActions.SaveComplexityCodeSuccess()));
            },

            onError: (
                action: ComplexityCodeActions.SaveComplexityCode,
                error: HttpErrorResponse
            ) => {
                return new ComplexityCodeActions.SaveComplexityCodeFailure(
                    this.errorHandler(error)
                );
            }
        }
    );

    @Effect()
    searchComplexityCode$ = this.dataPersistence.fetch(
        ComplexityCodeActionTypes.SEARCH_COMPLEXIETY_CODE,
        {
            run: (action: ComplexityCodeActions.SearchComplexityCode) => {
                return this.complexityCodeService
                    .searchComplexityCode(action.payload)
                    .pipe(
                        map(
                            (complexityCodeList: ComplexityListing) =>
                                new ComplexityCodeActions.SearchComplexityCodeSuccess(
                                    complexityCodeList
                                )
                        )
                    );
            },

            onError: (
                action: ComplexityCodeActions.SearchComplexityCode,
                error: HttpErrorResponse
            ) => {
                return new ComplexityCodeActions.SearchComplexityCodeFailure(
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
