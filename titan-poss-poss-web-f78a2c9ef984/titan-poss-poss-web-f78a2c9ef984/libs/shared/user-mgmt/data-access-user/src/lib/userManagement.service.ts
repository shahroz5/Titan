import { Inject, Injectable } from '@angular/core';
import { CryptoService } from '@poss-web/shared/auth/data-access-auth';
import {
  CountryDataService,
  LocationDataService,
  LovDataService,
  StateDataService
} from '@poss-web/shared/masters/data-access-masters';
import {
  CountryData,
  LocationData,
  RoleInfo,
  RoleTypesData,
  UserData,
  UserDetail,
  UserProfile
} from '@poss-web/shared/models';
import {
  UserManagementAdaptor,
  UserManagementHelper
} from '@poss-web/shared/util-adaptors';
import {
  addUserDataUrl,
  ApiService,
  changeUserPasswordUrl,
  getActiveAccessTokenEndpointUrl,
  getActiveRolesUrl,
  getEmailMobileCheckUrl,
  getMappedLocationsDataUrl,
  getRegionsDataUrl,
  getRequestedMobileNoDataUrl,
  getUserDataUrl,
  getUserProfileDataUrl,
  getUserRoleUrl,
  getUsersListUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_ENCRYPT_PASSWORD } from '@poss-web/shared/util-config';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';

@Injectable()
export class UserManagementService {
  constructor(
    private apiService: ApiService,
    private locationService: LocationDataService,
    private countryService: CountryDataService,
    private stateService: StateDataService,
    private lovService: LovDataService,
    private cryptoService: CryptoService,
    @Inject(POSS_WEB_ENCRYPT_PASSWORD) private encryptPassword,
    @Inject('env') private env
  ) {}

  getUsersList(
    isBTQUser: boolean,
    page: number,
    pageSize: number,
    employeeCode: string,
    roleCodes: string[],
    locationCodes: string[]
  ): Observable<UserData> {
    const url = getUsersListUrl(
      isBTQUser,
      page,
      pageSize,
      employeeCode,
      roleCodes,
      locationCodes
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => UserManagementHelper.getUserData(data)));
  }

  getUser = (
    isBTQUser: boolean,
    employeeCode: string
  ): Observable<UserDetail> =>
    this.apiService
      .get(getUserDataUrl(isBTQUser, employeeCode))
      .pipe(map((data: any) => UserManagementAdaptor.usersfromJson(data)));

  getUserProfile = (): Observable<UserProfile> =>
    this.apiService.get(getUserProfileDataUrl()).pipe(
      switchMap((data: any) =>
        data.locationCode
          ? this.locationService
              .getLocationSummaryByLocationCode(data.locationCode)
              .pipe(
                switchMap(locationData => {
                  data.locationCode =
                    data.locationCode + ' - ' + locationData.description;

                  return this.apiService
                    .get(getRequestedMobileNoDataUrl())
                    .pipe(
                      map(response => {
                        data.requestedMobileNo = !!response
                          ? !!response.requestedMobileNo
                            ? response.requestedMobileNo.toString()
                            : null
                          : null;

                        return data;
                      })
                    );
                }),
                catchError(err => of(data))
              )
          : of(data).pipe(
              switchMap(profileData =>
                this.apiService.get(getRequestedMobileNoDataUrl()).pipe(
                  map(response => {
                    profileData.requestedMobileNo = !!response
                      ? !!response.requestedMobileNo
                        ? response.requestedMobileNo.toString()
                        : null
                      : null;
                    return profileData;
                  })
                )
              ),
              catchError(err => of(data))
            )
      ),
      map(data => {
        return UserManagementAdaptor.userProfilefromJson(data);
      })
    );

  loadStates = (countryCode: string): Observable<string[]> =>
    this.stateService
      .getStatesSummary(countryCode, null, null, false, ['description', 'asc'])
      .pipe(map((data: any) => UserManagementHelper.getStateData(data)));

  loadCountries = (): Observable<CountryData[]> =>
    this.countryService
      .getCountrySummary()
      .pipe(map((data: any) => UserManagementHelper.getCountryData(data)));

  loadlocations = (locationCode: string): Observable<LocationData> => {
    return this.locationService
      .getLocationSummaryByLocationCode(locationCode)
      .pipe(map((data: any) => UserManagementHelper.getLocationCodeData(data)));
  };

  loadUserRoles(
    isBTQUser: boolean,
    roleType: string,
    locationCode?: string
  ): Observable<RoleInfo> {
    const url = getUserRoleUrl(isBTQUser, roleType, locationCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => UserManagementHelper.getRolesData(data)));
  }
  loadUserRoleTypes = (): Observable<RoleTypesData[]> =>
    this.lovService
      .getUserLovs('USER_TYPE')
      .pipe(map((data: any) => UserManagementHelper.getRoleTypesData(data)));

  loadActiveRoles(isBTQUser: boolean): Observable<RoleInfo> {
    const url = getActiveRolesUrl(isBTQUser);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => UserManagementHelper.getRolesData(data)));
  }

  updateUser = (
    isBTQUser: boolean,
    employeeCode: string,
    data: any
  ): Observable<string[]> =>
    this.apiService.patch(getUserDataUrl(isBTQUser, employeeCode), data);

  addUser = (isBTQUser: boolean, data: any): Observable<string[]> =>
    this.apiService.post(addUserDataUrl(isBTQUser), data);

  changePassword = (
    oldPassword: string,
    newPassword: string
  ): Observable<boolean> => {
    if (!this.encryptPassword) {
      return this.apiService.patch(changeUserPasswordUrl(), {
        oldPassword: window.btoa(oldPassword),
        newPassword: window.btoa(newPassword)
      });
    } else {
      return this.apiService
        .get(getActiveAccessTokenEndpointUrl(this.env))
        .pipe(
          concatMap(key => {
            const encryptedOldPassword = this.cryptoService.encryptPassword(
              key.publicKey,
              oldPassword
            );
            const encryptedNewPassword = this.cryptoService.encryptPassword(
              key.publicKey,
              newPassword
            );
            return this.apiService.patch(changeUserPasswordUrl(), {
              oldPassword: encryptedOldPassword,
              newPassword: encryptedNewPassword
            });
          })
        );
    }
  };

  checkMobileEmail(type: string, value: string): Observable<boolean> {
    const url = getEmailMobileCheckUrl(type, value);
    return this.apiService.get(url.path, url.params);
  }

  loadMappedLocations(isBTQUser: boolean, empCode: string) {
    const url = getMappedLocationsDataUrl(isBTQUser, empCode);
    return this.apiService.get(url)
    .pipe(
      map(data => UserManagementHelper.getMappedLocations(data))
    );
  }

  updateMappedLocations(isBTQUser: boolean, empCode: string, data: any) {
    return this.apiService.patch(getMappedLocationsDataUrl(isBTQUser, empCode), data);
  }

  getRegions() {
    const url = getRegionsDataUrl();
    return this.apiService.get(url)
    .pipe(
      map(data => UserManagementHelper.getMappedRegions(data))
    );  }
}
