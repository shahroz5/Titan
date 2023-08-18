import { SharedProductCategoryMappingFeaturePcMappingModule } from '@poss-web/shared/product-category-mapping/feature-pc-mapping';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { SharedPrintingFeaturePrintingModule } from '@poss-web/shared/printing/feature-printing';
import { PossSharedDiscountFeatureDiscountDetailsPopupModule } from '@poss-web/poss/shared/discount/feature-discount-details-popup';
import { environment } from '../environments/environment';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HotkeyModule } from 'angular2-hotkeys';

/* App-specific libraries */
import { SharedAuthFeatureAuthModule } from '@poss-web/shared/auth/feature-auth';
import { SharedItemFeatureItemDetailsPopupModule } from '@poss-web/shared/item/feature-item-details-popup';
import { SharedAppsettingFeatureAppsettingModule } from '@poss-web/shared/appsetting/feature-appsetting';
import { SharedNavigationFeatureNavigationModule } from '@poss-web/shared/navigation/feature-navigation';
import { SharedNgrxRouterFeatureRouterModule } from '@poss-web/shared/ngrx-router/feature-router';
import { SharedLocationMappingFeatureLocationMappingModule } from '@poss-web/shared/location-mapping/feature-location-mapping';
import { SharedOverlayNotificationFeatureOverlayNotificationModule } from '@poss-web/shared/overlay-notification/feature-overlay-notification';
import { SharedLocationSettingsFeatureLocationSettingsModule } from '@poss-web/shared/location-settings/feature-location-settings';
import { metaReducers } from '@poss-web/shared/util-meta-reducer';

import { NxModule } from '@nrwl/angular';

import { ErrorPageComponent } from './error-page/error-page.component';
import { GuestLayoutComponent } from './layout/guest-layout/guest-layout.component';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';
import { SharedProfileFeatureProfileModule } from '@poss-web/shared/profile/feature-profile';
import { SharedUtilLoggerModule } from '@poss-web/shared/util-logger';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedProductGroupMappingFeatureProductGroupMappingModule } from '@poss-web/shared/product-group-mapping/feature-product-group-mapping';

import { SharedNotificationsFeatureNotificationsModule } from '@poss-web/shared/notifications/feature-notifications';
import { SharedShortcutFeatureShortcutModule } from '@poss-web/shared/shortcut/feature-shortcut';
import { SharedAlertPopupFeatureAlertPopupModule } from '@poss-web/shared/alert-popup/feature-alert-popup';
import { SharedBodEodFeatureBodEodModule } from '@poss-web/shared/bod-eod/feature-bod-eod';
import { UserLayoutSecondaryComponent } from './layout/user-layout-secondary/user-layout-secondary.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUtilCommonModule } from '@poss-web/shared/util-common';
import { SharedPanFormVerifyFeaturePanFormVerifyPopupModule } from '../../../../libs/shared/pan-form-verify/feature-pan-form-verify-popup/src/lib/shared-pan-form-verify-feature-pan-form-verify-popup.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  console.log('HttpLoaderFactory');
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    GuestLayoutComponent,
    UserLayoutComponent,
    UserLayoutSecondaryComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NxModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CommonCustomMaterialModule,
    StoreModule.forRoot(
      {},
      {
        metaReducers: environment.production === false ? metaReducers : [],
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true
        }
      }
    ),
    EffectsModule.forRoot([]),
    environment.production === false
      ? StoreDevtoolsModule.instrument({
          maxAge: 25,
          logOnly: environment.production // isDevMode()
        })
      : [],
    HotkeyModule.forRoot(),
    SharedAppsettingFeatureAppsettingModule, // loading the appsetting
    SharedAuthFeatureAuthModule, //loading the Authentication module
    SharedLocationSettingsFeatureLocationSettingsModule,
    SharedNavigationFeatureNavigationModule,
    SharedNgrxRouterFeatureRouterModule,
    SharedLocationMappingFeatureLocationMappingModule,
    SharedItemFeatureItemDetailsPopupModule,
    SharedOverlayNotificationFeatureOverlayNotificationModule,
    SharedProfileFeatureProfileModule,
    PossSharedDiscountFeatureDiscountDetailsPopupModule,
    SharedUtilLoggerModule,
    SharedUtilFieldValidatorsModule,
    SharedPrintingFeaturePrintingModule,
    SharedProductGroupMappingFeatureProductGroupMappingModule,
    SharedProductCategoryMappingFeaturePcMappingModule,
    SharedNotificationsFeatureNotificationsModule,
    SharedShortcutFeatureShortcutModule,
    SharedAlertPopupFeatureAlertPopupModule,
    SharedPanFormVerifyFeaturePanFormVerifyPopupModule,
    SharedBodEodFeatureBodEodModule,
    SharedComponentsUiLoaderModule,
    SharedUtilCommonModule
  ],
  providers: [
    TranslateService,
    {
      provide: 'env',
      useValue: environment
    }
  ],
  exports: [TranslateModule],
  bootstrap: [AppComponent]
})
export class AppModule {

}
