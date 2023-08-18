import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map, withLatestFrom, catchError } from 'rxjs/operators';

import {
  getUserProfileDataUrl,
  ApiService,
  getEmployeeSignatureDetailsUrl,
  uploadEmployeeSignatureUrl
} from '@poss-web/shared/util-api-service';
import { ProfileData } from '@poss-web/shared/models';
import { ProfileDataAdaptor } from '@poss-web/shared/util-adaptors';
import { LocationDataService } from '@poss-web/shared/masters/data-access-masters';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {
  constructor(
    private apiService: ApiService,
    private locationService: LocationDataService,
    private appSettingFacade: AppsettingFacade
  ) {}

  getEmployeeSignatureDetails(employeeCode: string) {
    const urlObject = getEmployeeSignatureDetailsUrl(employeeCode);
    const employeeSignatureDetailsUrlPath = urlObject.path;
    const params = urlObject.params;
    return this.apiService
      .get(employeeSignatureDetailsUrlPath, params)
      .pipe(map(data => data));
  }

  loadUserProfile = (): Observable<ProfileData> =>
    this.apiService.get(getUserProfileDataUrl()).pipe(
      switchMap((data: any) =>
        data.locationCode
          ? this.locationService
              .getLocationSummaryByLocationCode(data.locationCode)
              .pipe(
                map(locationData => {
                  data.boutiqueDesc = locationData.description;
                  return data;
                }),
                catchError(err => of(data))
              )
          : of(data)
      ),
      withLatestFrom(this.appSettingFacade.getStoreType()),
      map(([data, storetype]) => {
        // data.boutiqueType = storetype;
        return ProfileDataAdaptor.profileDatafromJson(data);
      })
    );

  uploadEmployeeSignature(employeeCode: string, cashierSignature: string) {
    const urlObject = uploadEmployeeSignatureUrl(employeeCode);
    const uploadEmployeeSignatureUrlPath = urlObject.path;
    return this.apiService
      .post(uploadEmployeeSignatureUrlPath, cashierSignature.toString())
      .pipe(map(data => data));
  }
}
