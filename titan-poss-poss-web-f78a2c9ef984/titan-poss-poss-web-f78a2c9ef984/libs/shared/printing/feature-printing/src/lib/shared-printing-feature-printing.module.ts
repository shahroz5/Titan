import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintingService } from './printing.service';
import {
  PrintingEffects,
  printingReducer,
  printingFeatureKey,
  SharedPrintingDataAccessPrintingModule
} from '@poss-web/shared/printing/data-access-printing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PrintingServiceAbstraction } from '@poss-web/shared/models';

@NgModule({
  imports: [
    CommonModule,
    SharedPrintingDataAccessPrintingModule,
    StoreModule.forFeature(printingFeatureKey, printingReducer),
    EffectsModule.forFeature([PrintingEffects])
  ],
  providers: [
    {
      provide: PrintingServiceAbstraction,
      useClass: PrintingService
    }
  ]
})
export class SharedPrintingFeaturePrintingModule {}
