import {
  Component,
  Input,
  Output,
  EventEmitter,
  QueryList,
  ViewChildren,
  ChangeDetectionStrategy,
  Inject
} from '@angular/core';

import { Navigation, PermissionData } from '@poss-web/shared/models';
import { MenuItemComponent } from '../menu-item.component';
import { POSS_WEB_HOST_NAME } from '@poss-web/shared/util-config';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubMenuComponent {
  @Input() sidenavitems: Navigation[] = [];

  @Output() sideNavToggle = new EventEmitter();
  @Output() panelToggle = new EventEmitter();

  @ViewChildren('queryItem')
  menuItems: QueryList<MenuItemComponent | SubMenuComponent>;

  constructor(
    @Inject(POSS_WEB_HOST_NAME) public hostname,
    private translate: TranslateService
  ) {}

  getPermissions = (permissionData: PermissionData) => of(permissionData);
}
