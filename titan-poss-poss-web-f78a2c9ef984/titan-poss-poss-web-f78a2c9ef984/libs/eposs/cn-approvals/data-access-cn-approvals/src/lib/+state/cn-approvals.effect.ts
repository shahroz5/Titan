import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomErrors, CnApprovalListResponse } from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as CnApprovalActions from './cn-approvals.action';
import { CnApprovalActionTypes } from './cn-approvals.action';

import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { CnApprovalsService } from '../cn-approvals.service';
@Injectable()
export class CnApprovalEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private cnApprovalsService: CnApprovalsService
  ) {}

  @Effect()
  loadCnApprovalsList$ = this.dataPersistence.fetch(
    CnApprovalActionTypes.LOAD_CN_APPROVALS_LIST,
    {
      run: (action: CnApprovalActions.LoadCnApprovalsList) => {
        return this.cnApprovalsService
          .loadCnApprovalList(action.payload)
          .pipe(
            map(
              (cnApprovalListResponse: CnApprovalListResponse[]) =>
                new CnApprovalActions.LoadCnApprovalsListSuccess(
                  cnApprovalListResponse
                )
            )
          );
      },
      onError: (
        action: CnApprovalActions.LoadCnApprovalsList,
        error: HttpErrorResponse
      ) => {
        return new CnApprovalActions.LoadCnApprovalsListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveCnApprovals$ = this.dataPersistence.fetch(
    CnApprovalActionTypes.SAVE_CN_APPROVAL_STATUS,
    {
      run: (action: CnApprovalActions.SaveCnApprovalStatus) => {
        return this.cnApprovalsService
          .saveCnApprovalStatus(action.payload)
          .pipe(
            map(
              (approvedIds: string[]) =>
                new CnApprovalActions.SaveCnApprovalStatusSuccess(approvedIds)
            )
          );
      },
      onError: (
        action: CnApprovalActions.SaveCnApprovalStatus,
        error: HttpErrorResponse
      ) => {
        return new CnApprovalActions.SaveCnApprovalStatusFailure(
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
