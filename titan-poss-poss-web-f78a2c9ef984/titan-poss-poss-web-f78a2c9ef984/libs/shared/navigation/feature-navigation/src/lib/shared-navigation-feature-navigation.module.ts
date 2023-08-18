import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedNavigationUiTopMenuModule } from '@poss-web/shared/navigation/ui-top-menu';
import { SharedNavigationUiSideMenuModule } from '@poss-web/shared/navigation/ui-side-menu';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedAuthDataAccessAuthModule } from '@poss-web/shared/auth/data-access-auth';
import { SharedNavigationDataAccessNavigationModule } from '@poss-web/shared/navigation/data-access-navigation';
import { NavigationComponent } from './navigation.component';
import { SharedAppsettingDataAccessAppsettingModule } from '@poss-web/shared/appsetting/data-access-appsetting';

// import { SharedSseNotificationsDataAccessSseNotificationsModule } from '@poss-web/shared/sse-notifications/data-access-sse-notifications';

import { SharedNotificationsDataAccessNotificationsModule } from '@poss-web/shared/notifications/data-access-notifications';
// import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedToolbarDataAccessToolbarModule } from '@poss-web/shared/toolbar/data-access-toolbar';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';

@NgModule({
  declarations: [NavigationComponent],
  imports: [
    CommonCustomMaterialModule,
    RouterModule,
    SharedComponentsUiLoaderModule,
    SharedAuthDataAccessAuthModule,
    SharedNavigationDataAccessNavigationModule,
    SharedNavigationUiTopMenuModule,
    SharedNavigationUiSideMenuModule,
    SharedAppsettingDataAccessAppsettingModule,
    // SharedSseNotificationsDataAccessSseNotificationsModule
    SharedNotificationsDataAccessNotificationsModule,
    // SharedToolbarFeatureToolbarModule,
    SharedCustomerDataAccessCustomerModule,
    SharedCommonDataAccessCommonModule,
    SharedToolbarDataAccessToolbarModule
  ],
  exports: [NavigationComponent]
})
export class SharedNavigationFeatureNavigationModule {}
