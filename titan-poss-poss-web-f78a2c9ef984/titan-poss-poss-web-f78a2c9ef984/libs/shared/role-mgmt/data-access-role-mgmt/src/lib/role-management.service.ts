import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  getUpdateRoleUrl,
  addRoleUrl,
  getRoleDetailsUrl,
  getAllRolesUrl,
  ApiService
} from '@poss-web/shared/util-api-service';
import {
  RoleManagementAdaptor,
  RoleManagementHelper
} from '@poss-web/shared/util-adaptors';
import {
  RoleDetail,
  RolesPage,
  RoleData,
  RoleTypesData
} from '@poss-web/shared/models';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {
  constructor(
    private apiService: ApiService,
    private lovService: LovDataService
  ) {}

  loadRoles(pageDetails: RolesPage): Observable<RoleData> {
    const url = getAllRolesUrl(
      pageDetails.pageNumber,
      pageDetails.pageSize,
      pageDetails.roleCode,
      pageDetails.roleType,
      pageDetails.locationFormat
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => RoleManagementHelper.getRolesData(data)));
  }

  fetchRole = (roleCode: string): Observable<RoleDetail> =>
    this.apiService
      .get(getRoleDetailsUrl(roleCode))
      .pipe(map((data: any) => RoleManagementAdaptor.getRoleData(data)));

  updateRole = (roleCode: string, data: any): Observable<any> =>
    this.apiService.patch(getUpdateRoleUrl(roleCode), data);

  addRole = (data: any): Observable<any> =>
    this.apiService.post(addRoleUrl(), data);

  fetchLocationFormat = (): Observable<Map<string, string>> =>
    this.lovService
      .getLocationLovs('LOCATIONFORMAT')
      .pipe(map((data: any) => RoleManagementHelper.getLocationFormats(data)));

  fetchRoletypesList = (): Observable<RoleTypesData[]> =>
    this.lovService
      .getUserLovs('ROLE_TYPE')
      .pipe(map((data: any) => RoleManagementHelper.getRoleTypesData(data)));
}
