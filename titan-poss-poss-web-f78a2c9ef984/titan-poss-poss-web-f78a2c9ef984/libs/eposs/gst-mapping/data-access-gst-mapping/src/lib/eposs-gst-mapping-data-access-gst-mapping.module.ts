import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  GST_MAPPING_FEATURE_KEY,
  GSTMappingReducer
} from './+state/gst-mapping.reducer';
import { GSTMappingEffects } from './+state/gst-mapping.effects';
import { GSTMappingFacade } from './+state/gst-mapping.facade';
import { GSTMappingService } from './gst-mapping.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(GST_MAPPING_FEATURE_KEY, GSTMappingReducer),
    EffectsModule.forFeature([GSTMappingEffects])
  ],
  providers: [GSTMappingFacade, GSTMappingService]
})
export class EpossGstMappingDataAccessGstMappingModule {}
