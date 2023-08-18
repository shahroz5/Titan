import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { CnMasterService } from '../cn-master.service';
import * as CreditNoteMasterAction from './cn-master.actions';
import { CreditNoteMasterActionTypes } from './cn-master.actions';

import { map } from 'rxjs/operators';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  CnMasterDetail,
  CnMasterListResponse,
  CustomErrors
} from '@poss-web/shared/models';

@Injectable()
export class CreditNoteMasterEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public cnMasterService: CnMasterService,
    public loggerService: LoggerService
  ) {}

  @Effect()
  loadCreditNoteMasterList$ = this.dataPersistence.fetch(
    CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_LIST,
    {
      run: (action: CreditNoteMasterAction.LoadCreditNoteMasterList) => {
        return this.cnMasterService
          .getCnMasterList(action.payload.pageIndex, action.payload.pageSize)
          .pipe(
            map(
              (creditNoteMasterList: CnMasterListResponse) =>
                new CreditNoteMasterAction.LoadCreditNoteMasterListSuccess(
                  creditNoteMasterList
                )
            )
          );
      },
      onError: (
        action: CreditNoteMasterAction.LoadCreditNoteMasterList,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteMasterAction.LoadCreditNoteMasterListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchCreditNoteMasterList$ = this.dataPersistence.fetch(
    CreditNoteMasterActionTypes.SEARCH_CREDIT_NOTE_MASTER_LIST,
    {
      run: (action: CreditNoteMasterAction.SearchCreditNoteMasterList) => {
        return this.cnMasterService
          .searchCnMasterByCnType(action.payload)
          .pipe(
            map(
              (creditNoteMasterList: CnMasterListResponse) =>
                new CreditNoteMasterAction.SearchCreditNoteMasterListSuccess(
                  creditNoteMasterList
                )
            )
          );
      },
      onError: (
        action: CreditNoteMasterAction.SearchCreditNoteMasterList,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteMasterAction.SearchCreditNoteMasterListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadCreditNoteMasterDetailByCnType$ = this.dataPersistence.fetch(
    CreditNoteMasterActionTypes.LOAD_CREDIT_NOTE_MASTER_DETAIL_BY_CNTYPE,
    {
      run: (
        action: CreditNoteMasterAction.LoadCreditNoteMasterDetailByCNType
      ) => {
        return this.cnMasterService
          .getCnMasterDetailByCnType(action.payload)
          .pipe(
            map(
              (creditNoteMasterDetial: CnMasterDetail) =>
                new CreditNoteMasterAction.LoadCreditNoteMasterDetailByCNTypeSuccess(
                  creditNoteMasterDetial
                )
            )
          );
      },
      onError: (
        action: CreditNoteMasterAction.LoadCreditNoteMasterDetailByCNType,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteMasterAction.LoadCreditNoteMasterDetailByCNTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateCreditNoteMasterDetail$ = this.dataPersistence.fetch(
    CreditNoteMasterActionTypes.UPDATE_CREDIT_NOTE_MASTER_DETAIL,
    {
      run: (action: CreditNoteMasterAction.UpdateCreditNoteMasterDetail) => {
        return this.cnMasterService
          .updateCnMasterDetail(action.payload.cnType, action.payload.cnDetail)
          .pipe(
            map(
              (creditNoteMasterDetial: CnMasterDetail) =>
                new CreditNoteMasterAction.UpdateCreditNoteMasterDetailSuccess(
                  creditNoteMasterDetial
                )
            )
          );
      },
      onError: (
        action: CreditNoteMasterAction.UpdateCreditNoteMasterDetail,
        error: HttpErrorResponse
      ) => {
        return new CreditNoteMasterAction.UpdateCreditNoteMasterDetailFailure(
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
