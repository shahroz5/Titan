import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoreTypes, UserDetail } from '@poss-web/shared/models';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss']
})
export class UserListItemComponent {
  @Output() toggleUserLock = new EventEmitter<any>();

  @Input() user: UserDetail;
  @Input() permissions$: Observable<any[]>;

  USER_LIST_LOGIN_TOGGLE_BTN = 'Uam User List - Login Toggle Btn';

  storetype = Array(
    StoreTypes.LargeFormatStoreType.toString(),
    StoreTypes.MediumFormatStoreType.toString(),
    StoreTypes.SmallFormatStoreType.toString()
  );

  constructor(private elementPermission: ElementPermissionService) {}

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
