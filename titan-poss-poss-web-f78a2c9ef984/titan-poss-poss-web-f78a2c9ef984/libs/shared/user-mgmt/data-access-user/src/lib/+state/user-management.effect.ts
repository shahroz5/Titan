import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import {
  CountryData,
  CustomErrors,
  LocationData,
  RoleInfo,
  RoleTypesData,
  SelectDropDownOption,
  UserData,
  UserDetail,
  UserProfile
} from '@poss-web/shared/models';
import { OneTimePasswordService } from '@poss-web/shared/one-time-password/data-access-one-time-password';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { LoggerService } from '@poss-web/shared/util-logger';
import { map, mergeMap } from 'rxjs/operators';
import { UserManagementService } from '../userManagement.service';
import * as UserManagementActions from './user-management.actions';
import { UserManagementActionTypes } from './user-management.actions';
import { UserManagementState } from './user-management.state';

@Injectable()
export class UserManagmentEffect {
  constructor(
    private service: UserManagementService,
    private otpservice: OneTimePasswordService,
    private dataPersistence: DataPersistence<UserManagementState>,
    private loggerService: LoggerService
  ) {}

  @Effect() loadUsers$ = this.dataPersistence.fetch(
    UserManagementActionTypes.LOAD_USERS,
    {
      run: (action: UserManagementActions.LoadUsers) => {
        return this.service
          .getUsersList(
            action.payload.isBTQUser,
            action.payload.pageNumber,
            action.payload.pageSize,
            action.payload.employeeCode,
            action.payload.roleCodes,
            action.payload.locationCodes
          )
          .pipe(
            map(
              (Users: UserData) =>
                new UserManagementActions.LoadUsersSuccess(Users)
            )
          );
      },

      onError: (
        action: UserManagementActions.LoadUsers,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.LoadUsersSuccess({
          users: [],
          totalUsers: 0
        });
      }
    }
  );

  @Effect() fetchUser$ = this.dataPersistence.fetch(
    UserManagementActionTypes.FETCH_USER,
    {
      run: (action: UserManagementActions.FetchUser) => {
        return this.service
          .getUser(action.payload.isBTQUser, action.payload.employeeCode)
          .pipe(
            map(
              (user: UserDetail) =>
                new UserManagementActions.FetchUserSuccess(user)
            )
          );
      },

      onError: (
        action: UserManagementActions.FetchUser,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.FetchUserFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() userProfile$ = this.dataPersistence.fetch(
    UserManagementActionTypes.LOAD_USER_PROFILE,
    {
      run: (action: UserManagementActions.LoadUserProfile) => {
        return this.service
          .getUserProfile()
          .pipe(
            map(
              (user: UserProfile) =>
                new UserManagementActions.LoadUserProfileSuccess(user)
            )
          );
      },

      onError: (
        action: UserManagementActions.LoadUserProfile,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.LoadUserProfileFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadStates$ = this.dataPersistence.fetch(
    UserManagementActionTypes.LOAD_STATE,
    {
      run: (action: UserManagementActions.LoadState) => {
        return this.service
          .loadStates(action.payload)
          .pipe(
            map(
              (states: string[]) =>
                new UserManagementActions.LoadStateSuccess(states)
            )
          );
      },

      onError: (
        action: UserManagementActions.LoadState,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.LoadStateFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadCountries$ = this.dataPersistence.fetch(
    UserManagementActionTypes.LOAD_COUNTRY,
    {
      run: (action: UserManagementActions.LoadCountry) => {
        return this.service
          .loadCountries()
          .pipe(
            map(
              (countries: CountryData[]) =>
                new UserManagementActions.LoadCountrySuccess(countries)
            )
          );
      },

      onError: (
        action: UserManagementActions.LoadCountry,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.LoadCountryFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() validateLocation$ = this.dataPersistence.fetch(
    UserManagementActionTypes.FETCH_LOCATION,
    {
      run: (action: UserManagementActions.FetchLocation) => {
        return this.service
          .loadlocations(action.payload)
          .pipe(
            map(
              (location: LocationData) =>
                new UserManagementActions.FetchLocationSuccess(location)
            )
          );
      },

      onError: (
        action: UserManagementActions.FetchLocation,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.FetchLocationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() validateEmailLocation$ = this.dataPersistence.fetch(
    UserManagementActionTypes.FETCH_EMAIL_LOCATION,
    {
      run: (action: UserManagementActions.FetchEmailLocation) => {
        return this.service
          .loadlocations(action.payload)
          .pipe(
            map(
              (location: LocationData) =>
                new UserManagementActions.FetchEmailLocationSuccess(location)
            )
          );
      },

      onError: (
        action: UserManagementActions.FetchEmailLocation,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.FetchEmailLocationFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() validateEmailMobile$ = this.dataPersistence.fetch(
    UserManagementActionTypes.VALIDATE_MOBILE_EMAIL,
    {
      run: (action: UserManagementActions.ValidateMobileEmail) => {
        return this.service
          .checkMobileEmail(action.payload.fieldtype, action.payload.value)
          .pipe(
            map(
              (validemailmobile: boolean) =>
                new UserManagementActions.ValidateMobileEmailSuccess(
                  validemailmobile
                )
            )
          );
      },

      onError: (
        action: UserManagementActions.ValidateMobileEmail,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.ValidateMobileEmailFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadRoles$ = this.dataPersistence.fetch(
    UserManagementActionTypes.LOAD_ROLES,
    {
      run: (action: UserManagementActions.LoadRoles) => {
        return this.service
          .loadUserRoles(
            action.payload.isBTQUser,
            action.payload.roleType,
            action.payload.locationCode
          )
          .pipe(
            map(
              (roles: RoleInfo) =>
                new UserManagementActions.LoadRolesSuccess(roles)
            )
          );
      },

      onError: (
        action: UserManagementActions.LoadRoles,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.LoadRolesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadRegions$ = this.dataPersistence.fetch(
    UserManagementActionTypes.LOAD_REGIONS,
    {
      run: (action: UserManagementActions.LoadRegions) => {
        return this.service
          .getRegions()
          .pipe(
            map(
              (regions: SelectDropDownOption[]) =>
                new UserManagementActions.LoadRegionsSuccess(regions)
            )
          );
      },

      onError: (
        action: UserManagementActions.LoadRegions,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.LoadRolesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadRoleTypes$ = this.dataPersistence.fetch(
    UserManagementActionTypes.LOAD_ROLE_TYPES,
    {
      run: (action: UserManagementActions.LoadRoleTypes) => {
        return this.service
          .loadUserRoleTypes()
          .pipe(
            map(
              (roles: RoleTypesData[]) =>
                new UserManagementActions.LoadRoleTypesSuccess(roles)
            )
          );
      },

      onError: (
        action: UserManagementActions.LoadRoleTypes,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.LoadRoleTypesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() loadFilterRoles$ = this.dataPersistence.fetch(
    UserManagementActionTypes.LOAD_FILTER_ROLES,
    {
      run: (action: UserManagementActions.LoadFilterRoles) => {
        return this.service
          .loadActiveRoles(action.payload)
          .pipe(
            map(
              (roles: RoleInfo) =>
                new UserManagementActions.LoadFilterRolesSuccess(roles)
            )
          );
      },

      onError: (
        action: UserManagementActions.LoadFilterRoles,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.LoadFilterRolesFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() UpdateUser$ = this.dataPersistence.fetch(
    UserManagementActionTypes.UPDATE_USER,
    {
      run: (action: UserManagementActions.UpdateUser) => {
        return this.service
          .updateUser(
            action.payload.isBTQUser,
            action.payload.employeeCode,
            action.payload.data
          )
          .pipe(map(_ => new UserManagementActions.UpdateUserSuccess()));
      },

      onError: (
        action: UserManagementActions.UpdateUser,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.UpdateUserFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() AddUser$ = this.dataPersistence.fetch(
    UserManagementActionTypes.ADD_USER,
    {
      run: (action: UserManagementActions.AddUser) => {
        return this.service
          .addUser(action.payload.isBTQUser, action.payload.data)
          .pipe(map(_ => new UserManagementActions.AddUserSuccess()));
      },

      onError: (
        action: UserManagementActions.AddUser,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.AddUserFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() ChangePassword$ = this.dataPersistence.fetch(
    UserManagementActionTypes.CHANGE_PASSWORD,
    {
      run: (action: UserManagementActions.ChangePassword) => {
        return this.service
          .changePassword(
            action.payload.oldPassword,
            action.payload.newPassword
          )
          .pipe(map(_ => new UserManagementActions.ChangePasswordSuccess()));
      },

      onError: (
        action: UserManagementActions.ChangePassword,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.ChangePasswordFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() VerifyMobileOTP$ = this.dataPersistence.fetch(
    UserManagementActionTypes.VERIFY_OTP_FOR_MOBILE,
    {
      run: (action: UserManagementActions.VerifyMobileOTP) => {
        return this.otpservice
          .verifyUserMobileNoOtp(action.payload)
          .pipe(map(_ => new UserManagementActions.VerifyMobileOTPSuccess()));
      },

      onError: (
        action: UserManagementActions.VerifyMobileOTP,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.VerifyMobileOTPFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() ActivateAccountOTP$ = this.dataPersistence.fetch(
    UserManagementActionTypes.ACTIVATE_ACCOUNT_OTP,
    {
      run: (action: UserManagementActions.ActivateAccountOTP) => {
        return this.otpservice
          .resendActivateAccountOtp(action.payload)
          .pipe(
            map(_ => new UserManagementActions.ActivateAccountOTPSuccess())
          );
      },

      onError: (
        action: UserManagementActions.ActivateAccountOTP,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.ActivateAccountOTPFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() LoadMappedLocations$ = this.dataPersistence.fetch(
    UserManagementActionTypes.LOAD_MAPPED_LOCATIONS,
    {
      run: (action: UserManagementActions.LoadMappedLocations) => {
        return this.service
          .loadMappedLocations(action.isBTQUser, action.empCode)
          .pipe(
            map(data => new UserManagementActions.LoadMappedLocationsSuccess(data))
          );
      },

      onError: (
        action: UserManagementActions.LoadMappedLocations,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.LoadMappedLocationsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() UpdateMappedLocations$ = this.dataPersistence.fetch(
    UserManagementActionTypes.UPDATE_MAPPED_LOCATIONS,
    {
      run: (action: UserManagementActions.UpdateMappedLocations) => {
        return this.service
          .updateMappedLocations(action.isBTQUser, action.empCode, action.payload)
          .pipe(
            mergeMap(data => {
              return  [
                new UserManagementActions.UpdateMappedLocationsSuccess(),
                new UserManagementActions.LoadMappedLocations(action.isBTQUser, action.empCode)
              ]
            })
          );
      },
      onError: (
        action: UserManagementActions.UpdateMappedLocations,
        error: HttpErrorResponse
      ) => {
        return new UserManagementActions.UpdateMappedLocationsFailure(
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
