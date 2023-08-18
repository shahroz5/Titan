import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import {
  ViewTcsReducer,
  VIEW_TCS_FEATURE_KEY
} from './+state/view-tcs.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ViewTcsEffect } from './+state/view-tcs.effect';
import { ViewTcsFacade } from './+state/view-tcs.facade';
import { ViewTcsDataService } from './view-tcs.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(VIEW_TCS_FEATURE_KEY, ViewTcsReducer),
    EffectsModule.forFeature([ViewTcsEffect])
  ],
  providers: [ViewTcsFacade, ViewTcsDataService]
})
export class PossSharedViewTcsDataAccessViewTcsModule {}
