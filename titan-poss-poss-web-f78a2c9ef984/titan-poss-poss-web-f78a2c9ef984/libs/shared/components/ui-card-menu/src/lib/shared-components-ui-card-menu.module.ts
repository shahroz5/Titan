import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { CardMenuCcontainerComponent } from './card-menu-container/card-menu-container.component';
import { CardMenuComponent } from './card-menu/card-menu.component';
import { CardSubMenuComponent } from './card-sub-menu/card-submenu.component';
import { FocusableMenuItemComponent } from './focusable-menu-item/focusable-menu-item.component';
import { FocusableSubMenuItemComponent } from './focusable-sub-menu-item/focusable-sub-menu-item.component';

@NgModule({
  declarations: [
    CardMenuComponent,
    CardSubMenuComponent,
    CardMenuCcontainerComponent,
    FocusableMenuItemComponent,
    FocusableSubMenuItemComponent
  ],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPermissionUiPermissionModule,
    SharedComponentsUiFocusableListModule,
    SharedComponentsUiCardListModule
  ],
  exports: [CardMenuCcontainerComponent]
})
export class SharedComponentsUiCardMenuModule {}
