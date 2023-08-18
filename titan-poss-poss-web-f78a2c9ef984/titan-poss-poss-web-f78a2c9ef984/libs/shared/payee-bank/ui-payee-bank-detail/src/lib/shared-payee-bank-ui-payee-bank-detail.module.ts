import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { PayeeBankDetailItemComponent } from './payee-bank-detail-item/payee-bank-detail-item.component';
import { PayeeBankGlCodeAgGridComponent } from './payee-bank-gl-code-ag-grid/payee-bank-gl-code-ag-grid.component';
import { SharedPayeeBankUiPayeeBankGlCodePopUpModule } from '@poss-web/shared/payee-bank/ui-payee-bank-gl-code-pop-up';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiAgGridModule,
    SharedPayeeBankUiPayeeBankGlCodePopUpModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [PayeeBankDetailItemComponent, PayeeBankGlCodeAgGridComponent],
  exports: [PayeeBankDetailItemComponent, PayeeBankGlCodeAgGridComponent]
})
export class SharedPayeeBankUiPayeeBankDetailModule {}
