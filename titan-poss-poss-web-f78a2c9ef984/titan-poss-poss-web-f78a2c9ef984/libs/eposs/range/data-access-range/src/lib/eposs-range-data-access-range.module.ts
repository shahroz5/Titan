import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RangeEffects } from './+state/range.effects';
import { RangeReducer, RANGE_FEATURE_KEY } from './+state/range.reducer';
import { RangeFacade } from './+state/range.facade';
import { RangeService } from './range.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(RANGE_FEATURE_KEY, RangeReducer),
    EffectsModule.forFeature([RangeEffects])
  ],
  providers: [RangeFacade, RangeService]
})
export class EpossRangeDataAccessRangeModule {}
