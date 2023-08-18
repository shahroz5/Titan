import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Inject, Injectable, NgModule, OnDestroy } from '@angular/core';
import {
  AuthFacade,
  SharedAuthDataAccessAuthModule
} from '@poss-web/shared/auth/data-access-auth';
import { AclUrlPermissionRequestBody } from '@poss-web/shared/models';
import {
  PermissionFacade,
  SharedPermissionDataAccessPermissionModule
} from '@poss-web/shared/permission/data-access-permission';
import {
  PermissionService,
  SharedPermissionUiPermissionModule
} from '@poss-web/shared/permission/ui-permission';
import { POSS_WEB_LOAD_ACL_DATA_FROM_DB } from '@poss-web/shared/util-config';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { JwtInterceptor } from './jwt.interceptor';

@Injectable()
@NgModule({
  imports: [
    CommonModule,
    SharedAuthDataAccessAuthModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthService
  ]
})
export class SharedAuthFeatureAuthModule implements OnDestroy {
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private authFacade: AuthFacade,
    private permissionService: PermissionService,
    private permissionfacade: PermissionFacade,
    @Inject(POSS_WEB_LOAD_ACL_DATA_FROM_DB) loadACLDataFromDB
  ) {
    if (!loadACLDataFromDB) {
      let requestBody: AclUrlPermissionRequestBody;
      requestBody = { urls: [''] };
      this.permissionfacade.loadUrlLevelPermissions(requestBody);
    }
    this.permissionfacade.loadUrlSuggestion('');

    this.authFacade
      .getACL()
      .pipe(
        filter(aclmap => !!aclmap && aclmap.size > 0),
        takeUntil(this.destroy$)
      )
      .subscribe(aclmap => {
        this.permissionService.clearPermissions();
        console.log('Trace getACL: Logged-In User Permissions', aclmap);
        for (const key of aclmap.keys()) {
          this.permissionService.loadPermissions(key);
          this.permissionService.loadPermissions(aclmap.get(key));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
