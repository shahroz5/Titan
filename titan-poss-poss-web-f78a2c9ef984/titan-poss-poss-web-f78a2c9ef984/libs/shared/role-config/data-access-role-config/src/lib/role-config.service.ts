import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  getActiveRolesUrl,
  getChangeRoleCountUrl,
  getRoleCountRequestListUrl,
  getRoleCountRequestUrl,
  ApiService
} from '@poss-web/shared/util-api-service';
import { RoleConfigHelper } from '@poss-web/shared/util-adaptors';
import {
  LoadLocationFormatPayload,
  RoleCountRequest,
  RoleCountRequestListDetail,
  RoleDetail,
  RequestedRole,
  RoleCountRequestList
} from '@poss-web/shared/models';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';

@Injectable({
  providedIn: 'root'
})
export class RoleConfigService {
  constructor(
    private apiService: ApiService,
    private lovService: LovDataService
  ) {}

  loadRolesforCount = (
    isBTQUser: boolean,
    roleType?: string,
    locationCode?: string,
    locationFormat?: string
  ): Observable<RoleDetail[]> => {
    const url = getActiveRolesUrl(
      isBTQUser,
      roleType,
      locationCode,
      locationFormat
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => RoleConfigHelper.getRolesData(data).roles));
  };

  requestRoleCountChange = (
    rolesCount: RoleCountRequest[],
    remarks?: string,
    status?: string,
    locationCode?: string,
    requestId?: string
  ): Observable<any> =>
    locationCode || requestId
      ? this.apiService.patch(getChangeRoleCountUrl(locationCode, requestId), {
          roles: rolesCount,
          ...(requestId && { approvalRemarks: remarks }),
          ...(requestId && { status })
        })
      : this.apiService.post(getChangeRoleCountUrl(), {
          requestRemarks: remarks,
          roleLimitReqDto: rolesCount
        });

  fetchRoleCountRequestList(
    pageNumber: number,
    pageSize: number,
    isBTQUser: boolean,
    locationCodes: string[],
    requestSearch: string
  ): Observable<RoleCountRequestListDetail> {
    const url = getRoleCountRequestListUrl(
      pageNumber,
      pageSize,
      isBTQUser,
      locationCodes,
      requestSearch
    );
    return this.apiService.get(url.path, url.params).pipe(
      map((data: any) => {
        return {
          ...RoleConfigHelper.getRoleCountRequestListData(data),
          isSearch: requestSearch,
          isFilter: locationCodes.toString()
        };
      })
    );
  }

  fetchRoleCountRequest = (
    requestId: string,
    isBTQUser: boolean
  ): Observable<{
    requestedRoles: RequestedRole[];
    requestdata: RoleCountRequestList;
  }> => {
    return this.apiService
      .get(getRoleCountRequestUrl(requestId, isBTQUser))
      .pipe(map((data: any) => RoleConfigHelper.getRequestedRoles(data)));
  };

  fetchRoleRequestCount(
    pageNumber: number,
    pageSize: number
  ): Observable<number> {
    const url = getRoleCountRequestListUrl(pageNumber, pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data.totalElements));
  }

  fetchLocationFormat = (): Observable<LoadLocationFormatPayload[]> => {
    return this.lovService
      .getLocationLovs('LOCATIONFORMAT')
      .pipe(map((data: any) => RoleConfigHelper.getLocationFormats(data)));
  };
}
