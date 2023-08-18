import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { RoleConfigFacade } from '@poss-web/shared/role-config/data-access-role-config';
import { Observable } from 'rxjs';
import { filter, take, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'poss-web-role-mgmt-menu',
  templateUrl: './role-management-menu.component.html'
})
export class RoleManagementMenuComponent implements OnInit {
  roleCountRequestListLength$: Observable<number>;
  isBTQUser = false;
  permissions$: Observable<any[]>;

  UAM_ADDREMOVEROLE_TAB = 'Uam Role Mgmt - Add/Remove Role Tab';
  UAM_DEFINEROLELIMIT_TAB =
    'Uam Role Mgmt - Define Role Limit for Boutique Tab';
  UAM_ROLELIMITDEFAULT_TAB = 'Uam Role Mgmt - Default SubTab';
  UAM_ROLELIMITCUSTOMIZE_TAB = 'Uam Role Mgmt - Customize SubTab';
  UAM_SENDREQUEST_EMPLOYEELIMIT_TAB =
    'Uam Role Mgmt - Send Request For Employee Limit Tab';
  UAM_SEEPREVIOUS_REQUESTS_TAB =
    'Uam Role Mgmt - See Previous Sent Requests Tab';

  constructor(
    private roleConfigfacade: RoleConfigFacade,
    private profileData: ProfileDataFacade,
    public router: Router,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    profileData
      .getBoutiqueType()
      .pipe(
        filter((val: string) => !!val),
        withLatestFrom(this.profileData.isBTQUser()),
        take(1)
      )
      .subscribe(([val, val1]) => {
        this.isBTQUser = val1;
        if (!this.isBTQUser) {
          this.roleConfigfacade.loadRoleRequestCount();
          this.roleCountRequestListLength$ = this.roleConfigfacade.fetchRoleCountRequestListLength();
        }
      });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
