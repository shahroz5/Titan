import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardSubMenu } from '@poss-web/shared/models';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { Observable } from 'rxjs';

@Component({
  selector: 'poss-web-card-submenu',
  templateUrl: './card-submenu.component.html',
  styleUrls: ['./card-submenu.component.scss']
})
export class CardSubMenuComponent {
  @Input() subMenu: CardSubMenu;
  @Input() permissions$: Observable<any[]>;
  @Output() back = new EventEmitter<string>();
  @Output() selected = new EventEmitter<Object>();

  constructor(private elementPermission: ElementPermissionService) {}

  selectSubMenu(routePath: string, appType: string) {
    if (routePath) {
      this.selected.emit({ routePath, appType });
    }
  }
  backEvent() {
    this.back.emit(this.subMenu.menuKey);
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);
}
