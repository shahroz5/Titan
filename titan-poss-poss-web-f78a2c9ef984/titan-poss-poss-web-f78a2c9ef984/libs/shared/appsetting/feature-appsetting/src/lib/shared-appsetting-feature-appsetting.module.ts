import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SharedAppsettingDataAccessAppsettingModule,
  APPSETTING_FEATURE_KEY,
  appsettingReducer,
  AppsettingEffects
} from '@poss-web/shared/appsetting/data-access-appsetting';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppSettingService } from './app-setttings.service';
import { SharedUtilErrorModule } from '@poss-web/shared/util-error';

@NgModule({
  imports: [
    CommonModule,
    SharedAppsettingDataAccessAppsettingModule,
    StoreModule.forFeature(APPSETTING_FEATURE_KEY, appsettingReducer),
    EffectsModule.forFeature([AppsettingEffects]),
    SharedUtilErrorModule
  ],
  providers: [AppSettingService]
})
export class SharedAppsettingFeatureAppsettingModule {}
