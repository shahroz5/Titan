import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import {
  PIFSeriesReducer,
  PIF_SERIES_FEATURE_KEY
} from './+state/pif-series.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PIFSeriesEffects } from './+state/pif-series.effect';
import { PIFSeriesFacade } from './+state/pif-series.facade';
import { PIFSeriesService } from './pif-series.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(PIF_SERIES_FEATURE_KEY, PIFSeriesReducer),
    EffectsModule.forFeature([PIFSeriesEffects])
  ],
  providers: [PIFSeriesFacade, PIFSeriesService]
})
export class PossPifSeriesDataAccessPifSeriesModule {}
