import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiGvManualEntryComponent } from './ui-gv-manual-entry/ui-gv-manual-entry.component';
import { UiGvBarCodeComponent } from './ui-gv-bar-code/ui-gv-bar-code.component';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

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
  declarations: [UiGvManualEntryComponent, UiGvBarCodeComponent],
  exports: [UiGvManualEntryComponent, UiGvBarCodeComponent]
})
export class PossSharedGiftVoucherUiGiftVoucherModule {}
