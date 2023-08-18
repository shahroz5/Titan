import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  take,
  takeUntil,
  filter,
  tap,
  withLatestFrom,
  map
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { RoleConfigFacade } from '@poss-web/shared/role-config/data-access-role-config';
import {
  CustomErrors,
  RoleCountRequestList,
  RoleCountRequestEnum,
  RequestedRole,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { getRoleLimtiRequestsApprovalsRouteUrl } from '@poss-web/shared/util-site-routes';

@Component({
  templateUrl: './request-detail-shell.component.html'
})
export class RequestDetailShellComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean>;
  requestItem$: Observable<RoleCountRequestList>;
  requestedRoles$: Observable<RequestedRole[]>;
  destroy$: Subject<null> = new Subject<null>();
  requestId = '';
  isBTQUser = false;
  hasNotification = false;
  permissions$: Observable<any[]>;
  APPROVE_ROLELIMIT_REQUESTS = 'Uam Approvals - Approve Role Limit Requests';
  approvalTransactionCodes: Observable<string[]>;

  constructor(
    private roleMgmntfacade: RoleConfigFacade,
    private activatedRoute: ActivatedRoute,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private profileData: ProfileDataFacade,
    private permissionfacade: PermissionFacade
  ) {
    this.approvalTransactionCodes = this.loadPermission(
      this.APPROVE_ROLELIMIT_REQUESTS
    );

    this.profileData
      .getBoutiqueType()
      .pipe(
        filter((val: string) => !!val),
        withLatestFrom(this.profileData.isBTQUser()),
        take(1)
      )
      .subscribe(([val, val1]) => {
        this.isBTQUser = val1;
        this.requestId =
          this.activatedRoute.snapshot.params['_requestId'] || '';
        this.roleMgmntfacade.loadRoleCountRequest(
          this.requestId,
          this.isBTQUser
        );
        this.requestItem$ = this.roleMgmntfacade.getRoleCountRequest().pipe(
          filter(item => !!item),
          tap(
            item =>
              (this.hasNotification =
                item.status === RoleCountRequestEnum.PENDING)
          )
        );
      });

    roleMgmntfacade
      .getError()
      .pipe(
        takeUntil(this.destroy$),
        filter(errorVal => !!errorVal)
      )
      .subscribe(errorVal => this.showNotification(errorVal));
  }

  ngOnInit() {
    this.isLoading$ = this.roleMgmntfacade.isLoading();
    this.requestedRoles$ = this.roleMgmntfacade.getRequestedRoles();
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }

  loadPermission = (element: string) =>
    this.permissionfacade.getPermissionforURL().pipe(
      filter(data => !!data && data.length > 0),
      map(data => {
        const acl = data.find(aclData => aclData.element === element);
        return acl['transactionCodes'];
      })
    );

  responsetoRoleCountRequest(event: any) {
    this.roleMgmntfacade.requestRoleCountChange(
      event.roles,
      event.approvalRemarks,
      event.status,
      undefined,
      this.requestId
    );
    this.roleMgmntfacade
      .isRoleCountChanged()
      .pipe(
        filter(status => status),
        take(1)
      )
      .subscribe(status =>
        this.translate
          .get(
            'pw.roleCountDetailNotificationMessages.roleCountRequestApprovalSuccessfullMessage'
          )
          .pipe(take(1))
          .subscribe(message => this.showNotification(undefined, message))
      );
  }

  showNotification(error?: CustomErrors, message?: string) {
    this.overlayNotification
      .show({
        type: !!error
          ? OverlayNotificationType.ERROR
          : OverlayNotificationType.SIMPLE,
        message: message,
        error: error,
        hasBackdrop: !!message,
        hasClose: true
      })
      .events.pipe(take(1))
      .subscribe(() => {
        if (message) {
          this.router.navigate([getRoleLimtiRequestsApprovalsRouteUrl()]);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
