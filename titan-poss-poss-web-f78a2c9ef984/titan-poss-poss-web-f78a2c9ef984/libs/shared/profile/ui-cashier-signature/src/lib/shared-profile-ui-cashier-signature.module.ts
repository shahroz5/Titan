import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiSignaturePadModule } from '@poss-web/shared/components/ui-signature-pad';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CashierSignatureComponent } from './cashier-signature/cashier-signature.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiSignaturePadModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFileUploadModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [CashierSignatureComponent],
  exports: [CashierSignatureComponent]
})
export class SharedProfileUiCashierSignatureModule {}
