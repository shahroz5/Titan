import { Injectable } from '@angular/core';

import { CnValidationActionTypes } from './cn-validation.actions';
import * as CnValidationActions from './cn-validation.actions';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CnValidationService } from '../cn-validation.service';
import {
  CustomErrors,
  CnValidationList,
  CnValidationResponse,
  CnValidation,
  CnTypeList
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { HttpErrorResponse } from '@angular/common/http';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map } from 'rxjs/Operators';

@Injectable()
export class CnValidationEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private cnValidationService: CnValidationService
  ) {}

  @Effect()
  cnValidationList$: Observable<Action> = this.dataPersistence.fetch(
    CnValidationActionTypes.LOAD_CN_VALIDATION_LIST,
    {
      run: (action: CnValidationActions.LoadCnValidationList) => {
        return this.cnValidationService
          .getCnValidationList(
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload.searchDescription
          )
          .pipe(
            map(
              (cnvalidationlist: CnValidationList) =>
                new CnValidationActions.LoadCnValidationListSuccess(
                  cnvalidationlist
                )
            )
          );
      },
      onError: (
        action: CnValidationActions.LoadCnValidationList,
        error: HttpErrorResponse
      ) => {
        return new CnValidationActions.LoadCnValidationListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveCnValidation$: Observable<Action> = this.dataPersistence.fetch(
    CnValidationActionTypes.SAVE_CN_VALIDATION,
    {
      run: (action: CnValidationActions.SaveCnValidation) => {
        return this.cnValidationService
          .saveCnValidation(action.payload)
          .pipe(
            map(
              (cnValidationResponse: CnValidationResponse) =>
                new CnValidationActions.SaveCnValidationSuccess(
                  cnValidationResponse
                )
            )
          );
      },
      onError: (
        action: CnValidationActions.SaveCnValidation,
        error: HttpErrorResponse
      ) => {
        return new CnValidationActions.SaveCnValidationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateCnValidation$: Observable<Action> = this.dataPersistence.fetch(
    CnValidationActionTypes.UPDATE_CN_VALIDATION,
    {
      run: (action: CnValidationActions.UpdateCnValidation) => {
        return this.cnValidationService
          .updateCnValidation(action.payload)
          .pipe(
            map(
              (cnValidationResponse: CnValidationResponse) =>
                new CnValidationActions.UpdateCnValidationSuccess(
                  cnValidationResponse
                )
            )
          );
      },
      onError: (
        action: CnValidationActions.UpdateCnValidation,
        error: HttpErrorResponse
      ) => {
        return new CnValidationActions.UpdateCnValidationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchCnValidationByCnType$: Observable<Action> = this.dataPersistence.fetch(
    CnValidationActionTypes.SEARCH_CN_VALIDATION_BY_CN_TYPE,
    {
      run: (action: CnValidationActions.SearchCnValidationByCnType) => {
        return this.cnValidationService
          .searchCnValidationByCnType(action.payload)
          .pipe(
            map(
              (cnValidationList: CnValidationList) =>
                new CnValidationActions.SearchCnValidationByCnTypeSuccess(
                  cnValidationList
                )
            )
          );
      },
      onError: (
        action: CnValidationActions.SearchCnValidationByCnType,
        error: HttpErrorResponse
      ) => {
        return new CnValidationActions.SearchCnValidationByCnTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );
  @Effect()
  loadCnValidationByRuleId$: Observable<Action> = this.dataPersistence.fetch(
    CnValidationActionTypes.LOAD_CN_VALIDATION_BY_RULE_ID,
    {
      run: (action: CnValidationActions.LoadCnValidationByRuleId) => {
        return this.cnValidationService
          .getCnValidation(action.ruleId, action.ruleType)
          .pipe(
            map(
              (cnValidation: CnValidation) =>
                new CnValidationActions.LoadCnValidationByRuleIdSuccess(
                  cnValidation
                )
            )
          );
      },
      onError: (
        action: CnValidationActions.LoadCnValidationByRuleId,
        error: HttpErrorResponse
      ) => {
        return new CnValidationActions.LoadCnValidationByRuleIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCnTypeList$: Observable<Action> = this.dataPersistence.fetch(
    CnValidationActionTypes.LOAD_CN_TYPE_LIST,
    {
      run: (action: CnValidationActions.LoadCnTypeList) => {
        return this.cnValidationService
          .getCreditNoteType()
          .pipe(
            map(
              (cnTypes: CnTypeList[]) =>
                new CnValidationActions.LoadCnTypeListSuccess(cnTypes)
            )
          );
      },
      onError: (
        action: CnValidationActions.LoadCnTypeList,
        error: HttpErrorResponse
      ) => {
        return new CnValidationActions.LoadCnTypeListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadNewCnValidationByRuleId$: Observable<Action> = this.dataPersistence.fetch(
    CnValidationActionTypes.LOAD_NEW_CN_VALIDATION_BY_RULE_ID,
    {
      run: (action: CnValidationActions.LoadNewCnValidationByRuleId) => {
        return new CnValidationActions.LoadCnValidationByRuleIdSuccess(
          this.cnValidationService.getNewCnValidationByRuleId()
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
