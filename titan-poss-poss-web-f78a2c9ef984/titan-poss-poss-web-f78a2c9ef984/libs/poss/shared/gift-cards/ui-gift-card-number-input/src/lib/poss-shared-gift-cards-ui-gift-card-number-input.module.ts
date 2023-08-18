import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { UiGcBarCodeComponent } from './ui-gc-bar-code/ui-gc-bar-code.component';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { UiGcNumberManualEntryComponent } from './ui-gc-number-manual-entry/ui-gc-number-manual-entry.component';
import { SharedUtilBarcodeReaderModule } from '@poss-web/shared/util-barcode-reader';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilBarcodeReaderModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [UiGcBarCodeComponent, UiGcNumberManualEntryComponent],
  exports: [UiGcBarCodeComponent, UiGcNumberManualEntryComponent]
})
export class PossSharedGiftCardsUiGiftCardNumberInputModule {}
