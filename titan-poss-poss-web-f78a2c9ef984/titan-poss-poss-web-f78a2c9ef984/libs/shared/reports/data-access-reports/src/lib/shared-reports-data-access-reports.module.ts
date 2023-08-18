import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { REPORTS_FEATURE_KEY } from './+state/reports.state';
import { ReportsReducer } from './+state/reports.reducer';
import { ReportsEffect } from './+state/reports.effect';
import { ReportsFacade } from './+state/reports.facade';
import { ReportsService } from './reports.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(REPORTS_FEATURE_KEY, ReportsReducer),
    EffectsModule.forFeature([ReportsEffect])
  ],
  providers: [ReportsFacade, ReportsService]
})
export class SharedReportsDataAccessReportsModule {}
