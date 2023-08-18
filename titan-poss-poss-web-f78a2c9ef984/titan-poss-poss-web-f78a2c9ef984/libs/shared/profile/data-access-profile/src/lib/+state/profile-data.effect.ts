import { map } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { DataPersistence } from '@nrwl/angular';
import { HttpErrorResponse } from '@angular/common/http';

import { LoggerService } from '@poss-web/shared/util-logger';
import {
  CustomErrors,
  EmployeeSignatureDetailsResponse,
  ProfileData
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as ProfileDataActions from './profile-data.actions';
import { ProfileDataActionTypes } from './profile-data.actions';
import { ProfileDataService } from '../profile-data.service';
import { ProfileDataState } from './profile-data.state';
import { AuthActionTypes } from '@poss-web/shared/auth/data-access-auth';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class ProfileDataEffect {
  constructor(
    private service: ProfileDataService,
    private dataPersistence: DataPersistence<ProfileDataState>,
    private loggerService: LoggerService,
    private actions$: Actions
  ) {}

  @Effect() userProfile$ = this.dataPersistence.fetch(
    ProfileDataActionTypes.LOAD_PROFILE_DATA,
    {
      run: (action: ProfileDataActions.LoadProfileData) => {
        return this.service
          .loadUserProfile()
          .pipe(
            map(
              (user: ProfileData) =>
                new ProfileDataActions.LoadProfileDataSuccess(user)
            )
          );
      },
      onError: (
        action: ProfileDataActions.LoadProfileData,
        error: HttpErrorResponse
      ) => {
        return new ProfileDataActions.LoadProfileDataFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadProfileData$ = this.actions$.pipe(
    ofType(
      AuthActionTypes.LOGIN_SUCCESS,
      AuthActionTypes.RELOAD_SUCCESS,
      AuthActionTypes.REFRESH_SUCCESS
    ),
    map(action => new ProfileDataActions.LoadProfileData())
  );

  @Effect()
  clarProfileData$ = this.actions$.pipe(
    ofType(AuthActionTypes.LOGOUT_SUCCESS),
    map(action => new ProfileDataActions.ClearProfileData())
  );

  @Effect() loadEmployeeSignatureDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    ProfileDataActionTypes.LOAD_EMPLOYEE_SIGNATURE_DETAILS,
    {
      run: (action: ProfileDataActions.LoadEmployeeSignatureDetails) => {
        return this.service
          .getEmployeeSignatureDetails(action.employeeCode)
          .pipe(
            map(
              (data: EmployeeSignatureDetailsResponse) =>
                new ProfileDataActions.LoadEmployeeSignatureDetailsSuccess(data)
            )
          );
      },
      onError: (
        action: ProfileDataActions.LoadEmployeeSignatureDetails,
        error: HttpErrorResponse
      ) => {
        return new ProfileDataActions.LoadEmployeeSignatureDetailsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() uploadEmployeeSignatureDetails$: Observable<
    Action
  > = this.dataPersistence.fetch(
    ProfileDataActionTypes.UPLOAD_EMPLOYEE_SIGNATURE,
    {
      run: (action: ProfileDataActions.UploadEmployeeSignature) => {
        return this.service
          .uploadEmployeeSignature(action.employeeCode, action.cashierSignature)
          .pipe(
            map(
              (data: any) =>
                new ProfileDataActions.UploadEmployeeSignatureSuccess(data)
            )
          );
      },
      onError: (
        action: ProfileDataActions.UploadEmployeeSignature,
        error: HttpErrorResponse
      ) => {
        return new ProfileDataActions.UploadEmployeeSignatureFailure(
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
