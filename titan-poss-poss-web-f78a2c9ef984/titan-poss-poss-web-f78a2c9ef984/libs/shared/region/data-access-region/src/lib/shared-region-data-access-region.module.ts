import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RegionEffect } from './+state/region.effect';
import { RegionFacade } from './+state/region.facade';
import { RegionService } from './region.service';
import { REGIONS_FEATURE_KEY, RegionReducer } from './+state/region.reducer';

@NgModule({
  imports: [CommonModule,
    StoreModule.forFeature(REGIONS_FEATURE_KEY, RegionReducer),
    EffectsModule.forFeature([RegionEffect])],
    providers: [RegionFacade, RegionService]
})
export class SharedRegionDataAccessRegionModule {}
