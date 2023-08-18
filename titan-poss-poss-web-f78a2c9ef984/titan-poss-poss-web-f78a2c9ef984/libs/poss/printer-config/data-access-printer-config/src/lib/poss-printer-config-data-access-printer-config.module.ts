import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { PrinterConfigEffect } from './+state/printer-config.effects';
import {
  printerConfigurationReducer,
  printerConfigurationKey
} from './+state/printer-config.reducers';
import { PrinterConfigurationFacade } from './+state/printer-config.facade';
import { PrinterConfigService } from './printer-config.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      printerConfigurationKey,
      printerConfigurationReducer
    ),
    EffectsModule.forFeature([PrinterConfigEffect])
  ],
  providers: [PrinterConfigurationFacade, PrinterConfigService]
})
export class PossPrinterConfigDataAccessPrinterConfigModule {}
