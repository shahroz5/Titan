import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SideMenuContentComponent } from './side-menu-content/side-menu-content.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
// import { SharedSseNotificationsFeatureSseNotificationsModule } from '@poss-web/shared/sse-notifications/feature-sse-notifications';

import { SharedNotificationsFeatureNotificationsModule } from '@poss-web/shared/notifications/feature-notifications';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SideMenuContentSecondaryComponent } from './side-menu-content-secondary/side-menu-content-secondary.component';
import { TopMenuSecondaryComponent } from './top-menu-secondary/top-menu.component-secondary';
// import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedToolbarUiToolbarModule } from '@poss-web/shared/toolbar/ui-toolbar';
import { FocusableTopMenuItemComponent } from './focusable-top-menu-item/focusable-top-menu-item.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CommonCustomMaterialModule,
    SharedPermissionUiPermissionModule,
    // SharedSseNotificationsFeatureSseNotificationsModule,
    SharedNotificationsFeatureNotificationsModule,
    SharedComponentsUiFormattersModule,
    // SharedToolbarFeatureToolbarModule,
    SharedToolbarUiToolbarModule
  ],
  declarations: [
    TopMenuComponent,
    SideMenuContentComponent,
    SideMenuContentSecondaryComponent,
    TopMenuSecondaryComponent,
    FocusableTopMenuItemComponent
  ],
  exports: [
    TopMenuComponent,
    SideMenuContentComponent,
    SideMenuContentSecondaryComponent,
    TopMenuSecondaryComponent
  ]
})
export class SharedNavigationUiTopMenuModule {}
