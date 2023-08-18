import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { SharedMastersDataAccessMastersModule } from '@poss-web/shared/masters/data-access-masters';
import {
  LOCATION_MAPPING_FEATURE_KEY,
  LocationMappingReducer
} from './+state/location-mapping.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LocationMappingEffect } from './+state/location-mapping.effect';
import { LocationMappingFacade } from './+state/location-mapping.facade';
import { LocationMappingDataAccessService } from './location-mapping-data-access.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    SharedMastersDataAccessMastersModule,
    StoreModule.forFeature(
      LOCATION_MAPPING_FEATURE_KEY,
      LocationMappingReducer
    ),
    EffectsModule.forFeature([LocationMappingEffect])
  ],
  providers: [LocationMappingFacade, LocationMappingDataAccessService]
})
export class SharedLocationMappingDataAccessLocationMappingModule {}
