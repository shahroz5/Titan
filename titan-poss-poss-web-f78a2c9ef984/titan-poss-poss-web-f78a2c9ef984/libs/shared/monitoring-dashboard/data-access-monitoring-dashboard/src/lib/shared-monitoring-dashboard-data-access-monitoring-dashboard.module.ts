import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { MonitoringDashboardReducer } from './+state/monitoring-dashboard.reducer';
import { EffectsModule } from '@ngrx/effects';
import { MonitoringDashboardEffects } from './+state/monitoring-dashboard.effects';
import { MonitoringDashboardFacade } from './+state/monitoring-dashboard.facade';
import { MonitoringDashboardService } from './monitoring-dashboard.service';
import { monitoringDashboardFeatureKey } from './+state/monitoring-dashboard.state';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      monitoringDashboardFeatureKey,
      MonitoringDashboardReducer
    ),
    EffectsModule.forFeature([MonitoringDashboardEffects])
  ],
  providers: [MonitoringDashboardFacade, MonitoringDashboardService]
})
export class SharedMonitoringDashboardDataAccessMonitoringDashboardModule {}
