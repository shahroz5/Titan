import {
  ApiService,
  getRolesForAclUrl,
  getACLModulesUrl,
  getACLSubModulesUrl,
  getACLLoadUrl,
  getUpdateRoleUrl
} from '@poss-web/shared/util-api-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ACLRole, ACLModuleDetails, ACLDetails } from '@poss-web/shared/models';
import {
  ACLRoleHelper,
  ACLModuleDetailsHelper,
  ACLDetailsHelper
} from '@poss-web/shared/util-adaptors';

@Injectable()
export class AccessControlManagementService {
  constructor(private apiService: ApiService) {}

  loadRoles = (): Observable<ACLRole[]> => {
    const url = getRolesForAclUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => ACLRoleHelper.getRoles(data)));
  };

  loadModules = (role: string): Observable<ACLModuleDetails[]> => {
    const url = getACLModulesUrl(role);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => ACLModuleDetailsHelper.getModules(data)));
  };

  loadSubModules = (
    groupCode: string,
    role: string
  ): Observable<ACLModuleDetails[]> => {
    const url = getACLSubModulesUrl(groupCode, role);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => ACLModuleDetailsHelper.getModules(data)));
  };

  loadACL = (
    aclGroupCode: string,
    roleCode: string
  ): Observable<ACLDetails[]> => {
    const url = getACLLoadUrl(aclGroupCode, roleCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => ACLDetailsHelper.getACL(data)));
  };

  updateACL = (
    roleCode: string,
    addedAclCodes: string[],
    removedAclCodes: string[]
  ): Observable<any> => {
    const url = getUpdateRoleUrl(roleCode);
    const requestBody = {
      addAclCodes: addedAclCodes,
      removeAclCodes: removedAclCodes
    };
    return this.apiService.patch(url, requestBody);
  };
}
