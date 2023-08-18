import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueService } from './revenue.service';
import { RevenueFacade } from './+state/revenue.facade';
import { RevenueEffect } from './+state/revenue.effect';
import { EffectsModule } from '@ngrx/effects';
import { REVENUE_FEATURE_KEY } from './+state/revenue.state';
import { RevenueReducer } from './+state/revenue.reducer';
import { StoreModule } from '@ngrx/store';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(REVENUE_FEATURE_KEY, RevenueReducer),
    EffectsModule.forFeature([RevenueEffect])
  ],
  providers: [RevenueFacade, RevenueService]
})
export class SharedRevenueDataAccessRevenueModule {}
