import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoleDetail } from '@poss-web/shared/models';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {
  @Input() role: RoleDetail;
  @Input() permissions$: Observable<any[]>;

  @Output() toggleRole = new EventEmitter<any>();
  @Output() updateRole = new EventEmitter<string>();
  @Output() viewRole = new EventEmitter<string>();

  destroy$: Subject<null> = new Subject<null>();

  ROLE_LIST_EDITROLE_LINK = 'Uam Role Mgmt - Edit Role anchor Link';
  ROLE_LIST_VIEWROLE_LINK = 'Uam Role Mgmt - View Role anchor Link';

  ROLE_LIST_TOGGLE_ACTIVEINACTIVE_BTN =
    'Uam Role Mgmt - Toggle Role Active/InActive Button';
  ROLE_LIST_TOGGLE_ACTIVEINACTIVE_BTN_VIEW =
    'Uam Role Mgmt - View Toggle Role Active/InActive Button';
  hasPermission: boolean;

  constructor(
    private elementPermission: ElementPermissionService,
    private permissionService: PermissionService,
    ) {}

  loadPermission(element: string) {
    this.elementPermission.loadPermission(element, this.permissions$)
    .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          const hasRequestPermission = data.transactionCodes.find(key =>
            this.permissionService.hasPermission(key)
          );
          if (hasRequestPermission && this.ROLE_LIST_TOGGLE_ACTIVEINACTIVE_BTN === element) {
            this.hasPermission = true;
          }
        });
    return this.elementPermission.loadPermission(element, this.permissions$);
  }
}
