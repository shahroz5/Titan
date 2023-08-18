import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedUserAgentDataAccessUserAgentModule } from '@poss-web/shared/user-agent/data-access-user-agent';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { AuthEffect } from './+state/auth.effects';
import { AuthFacade } from './+state/auth.facade';
import { authReducer, Auth_FEATURE_KEY } from './+state/auth.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(Auth_FEATURE_KEY, authReducer),
    EffectsModule.forFeature([AuthEffect]),
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedUserAgentDataAccessUserAgentModule
  ],
  providers: [AuthFacade]
})
export class SharedAuthDataAccessAuthModule {}
