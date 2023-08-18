import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayeeBankGlCodePopupComponent } from './payee-bank-gl-code-popup/payee-bank-gl-code-popup.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [PayeeBankGlCodePopupComponent],
  entryComponents: [PayeeBankGlCodePopupComponent],
  exports: [PayeeBankGlCodePopupComponent]
})
export class SharedPayeeBankUiPayeeBankGlCodePopUpModule {}
