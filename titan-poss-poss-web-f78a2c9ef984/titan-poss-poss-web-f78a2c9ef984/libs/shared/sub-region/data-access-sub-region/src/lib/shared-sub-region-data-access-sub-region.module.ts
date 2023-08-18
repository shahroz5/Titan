import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SubRegionService } from './sub-region.service';
import { SubRegionFacade } from './+state/sub-region.facade';
import { SubRegionEffect } from './+state/sub-region.effect';
import {
  SUBREGIONS_FEATURE_KEY,
  SubRegionReducer
} from './+state/sub-region.reducer';

import {
  RegionFacade,
  RegionEffect,
  RegionService
} from '@poss-web/shared/region/data-access-region';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(SUBREGIONS_FEATURE_KEY, SubRegionReducer),
    EffectsModule.forFeature([SubRegionEffect])
  ],
  providers: [
    SubRegionFacade,
    RegionFacade,
    RegionEffect,
    RegionService,
    SubRegionService
  ]
})
export class SharedSubRegionDataAccessSubRegionModule {}
