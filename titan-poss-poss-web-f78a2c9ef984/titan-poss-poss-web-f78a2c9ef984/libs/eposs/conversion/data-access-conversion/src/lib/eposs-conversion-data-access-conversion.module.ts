import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { ConversionEffect } from './+state/conversion.effects';
import { ConversionFacade } from './+state/conversion.facade';
import {
  conversionFeatureKey,
  ConversionReducer
} from './+state/conversion.reducer';
import { ConversionService } from './conversion.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(conversionFeatureKey, ConversionReducer),
    EffectsModule.forFeature([ConversionEffect])
  ],
  providers: [ConversionFacade, ConversionService]
})
export class EpossConversionDataAccessConversionModule {}
