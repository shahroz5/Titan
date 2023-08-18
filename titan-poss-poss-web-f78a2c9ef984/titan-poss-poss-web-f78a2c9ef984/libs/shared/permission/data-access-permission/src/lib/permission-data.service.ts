import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  AclUrlPermissionRequestBody,
  ElementLevelPermissionItemModel,
  ElementLevelPermissionModel,
  TransactionCodesModel,
  UrlLevelPermissionResponseModel
} from '@poss-web/shared/models';
import { AclPermissionAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getACLPermissionsApiUrl,
  getElementLevelPermissionsApiUrl
} from '@poss-web/shared/util-api-service';
import { POSS_WEB_LOAD_ACL_DATA_FROM_DB } from '@poss-web/shared/util-config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PermissionDataService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private authFacade: AuthFacade,
    @Inject(POSS_WEB_LOAD_ACL_DATA_FROM_DB) private loadACLDataFromDB
  ) {}

  getPermissionforURL = (
    urlPattern: string
  ): Observable<ElementLevelPermissionItemModel[] | any> => {
    if (!this.loadACLDataFromDB) {
      return this.http.get('./assets/element-level-permissions.json');
    } else {
      let paramUrl = urlPattern;
      if (urlPattern.startsWith('/')) {
        paramUrl = urlPattern.slice(1);
      }
      const elementLevelPermissionsApiUrl = getElementLevelPermissionsApiUrl();
      const requestBody = { url: paramUrl };
      return this.apiService
        .post(elementLevelPermissionsApiUrl, requestBody)
        .pipe(
          map((data: ElementLevelPermissionModel) =>
            AclPermissionAdaptor.getPermissionforURL(data)
          )
        );
    }
  };

  getURLPermissions = (
    requestBody: AclUrlPermissionRequestBody
  ): Observable<TransactionCodesModel[] | any> => {
    if (!this.loadACLDataFromDB) {
      return this.http.get('./assets/url-level-permissions.json');
    } else {
      const aclPermissionsApiUrl = getACLPermissionsApiUrl();

      return this.apiService
        .post(aclPermissionsApiUrl, requestBody)
        .pipe(
          map((data: UrlLevelPermissionResponseModel) =>
            AclPermissionAdaptor.getUrlPermissions(data)
          )
        );
    }
  };

  getURLSuggestions = (url: string): any =>
    this.http.get('./assets/allowed-route-mapping.json');
}
