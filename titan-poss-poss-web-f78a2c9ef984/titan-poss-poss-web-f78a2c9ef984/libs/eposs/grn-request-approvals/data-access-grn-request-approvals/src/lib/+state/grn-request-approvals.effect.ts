import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CustomErrors,
  GrnRequestApprovalListResponse
} from '@poss-web/shared/models';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as GrnRequestApprovalActions from './grn-request-approvals.action';
import { GrnRequestApprovalActionTypes } from './grn-request-approvals.action';

import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { GrnRequestApprovalsService } from '../grn-request-approvals.service';
@Injectable()
export class GrnRequestApprovalEffect {
  constructor(
    private dataPersistence: DataPersistence<any>,
    private loggerService: LoggerService,
    private grnRequestApprovalsService: GrnRequestApprovalsService
  ) {}

  @Effect()
  loadGrnRequestList$ = this.dataPersistence.fetch(
    GrnRequestApprovalActionTypes.LOAD_GRN_REQUEST_LIST,
    {
      run: (action: GrnRequestApprovalActions.LoadGrnRequestList) => {
        return this.grnRequestApprovalsService
          .loadGrnRequestList(action.payload)
          .pipe(
            map(
              (
                rnRequestApprovalListResponse: GrnRequestApprovalListResponse[]
              ) =>
                new GrnRequestApprovalActions.LoadGrnRequestListSuccess(
                  rnRequestApprovalListResponse
                )
            )
          );
      },
      onError: (
        action: GrnRequestApprovalActions.LoadGrnRequestList,
        error: HttpErrorResponse
      ) => {
        return new GrnRequestApprovalActions.LoadGrnRequestListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  saveGrnRequestApprovalStatus$ = this.dataPersistence.fetch(
    GrnRequestApprovalActionTypes.SAVE_GRN_REQUEST_APPROVAL_STATUS,
    {
      run: (action: GrnRequestApprovalActions.SaveGrnRequestApprovalStatus) => {
        return this.grnRequestApprovalsService
          .saveGrnRequestApprovalStatus(action.payload)
          .pipe(
            map(
              (approvedIds: string[]) =>
                new GrnRequestApprovalActions.SaveGrnRequestApprovalStatusSuccess(
                  approvedIds
                )
            )
          );
      },
      onError: (
        action: GrnRequestApprovalActions.SaveGrnRequestApprovalStatus,
        error: HttpErrorResponse
      ) => {
        return new GrnRequestApprovalActions.SaveGrnRequestApprovalStatusFailure(
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
