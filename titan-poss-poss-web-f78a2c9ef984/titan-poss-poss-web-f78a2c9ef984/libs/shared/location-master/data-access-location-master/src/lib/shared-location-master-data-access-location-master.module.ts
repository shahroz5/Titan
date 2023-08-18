import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LocationMasterEffect } from './+state/location-master.effect';
import { LocationMasterFacade } from './+state/location-master.facade';
import {
  LOCATION_MASTER_FEATURE_KEY,
  LocationMasterReducer
} from './+state/location-master.reducer';
import { LocationMasterService } from './location-master.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(LOCATION_MASTER_FEATURE_KEY, LocationMasterReducer),
    EffectsModule.forFeature([LocationMasterEffect])
  ],
  providers: [LocationMasterFacade, LocationMasterService]
})
export class SharedLocationMasterDataAccessLocationMasterModule {}
