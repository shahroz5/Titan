import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SubMenuComponent } from './sub-menu/sub-menu.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MenuItemComponent } from './menu-item.component';
import { SideMenuItemsComponent } from './side-menu-items/side-menu-items.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [
    SideMenuComponent,
    MenuItemComponent,
    SubMenuComponent,
    SideMenuItemsComponent
  ],
  exports: [SideMenuComponent]
})
export class SharedNavigationUiSideMenuModule {}
