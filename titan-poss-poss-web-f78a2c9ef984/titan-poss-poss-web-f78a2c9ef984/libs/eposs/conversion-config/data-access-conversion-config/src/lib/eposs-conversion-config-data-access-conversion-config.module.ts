import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { EffectsModule } from '@ngrx/effects';
import { ConversionConfigEffect } from './+state/conversion-config.effects';
import { StoreModule } from '@ngrx/store';
import {
  CONVERSION_CONFIG_KEY,
  ConversionConfigReducer
} from './+state/conversion-config.reducer';
import { ConversionConfigFacade } from './+state/conversion-config.facade';
import { ConversionConfigService } from './conversion-config.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CONVERSION_CONFIG_KEY, ConversionConfigReducer),
    EffectsModule.forFeature([ConversionConfigEffect])
  ],
  providers: [ConversionConfigFacade, ConversionConfigService]
})
export class EpossConversionConfigDataAccessConversionConfigModule {}
