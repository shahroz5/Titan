import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppVersionDashboardEffect } from './+state/app-version-dashboard.effect';
import { AppVersionDashboardFacade } from './+state/app-version-dashboard.facade';
import {
  AppVersionDashboardReducer,
  APPVERSION_DASHBOARD_FEATURE_KEY
} from './+state/app-version-dashboard.reducer';
import { AppVersionDashboardService } from './app-version-dashboard.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      APPVERSION_DASHBOARD_FEATURE_KEY,
      AppVersionDashboardReducer
    ),
    EffectsModule.forFeature([AppVersionDashboardEffect])
  ],
  providers: [AppVersionDashboardFacade, AppVersionDashboardService]
})
export class SharedAppVersionDashboardDataAccessAppVersionDashboardModule {}
