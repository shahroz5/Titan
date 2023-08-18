import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { BoutiqueGeneratePasswordComponent } from './boutique-generate-password/boutique-generate-password.component';
import { CashDepositPasswordComponent } from './cash-deposit-password/cash-deposit-password.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiSelectionDialogModule
  ],
  declarations: [
    BoutiqueGeneratePasswordComponent,
    CashDepositPasswordComponent
  ],
  exports: [BoutiqueGeneratePasswordComponent, CashDepositPasswordComponent]
})
export class EpossPasswordConfigUiGeneratePasswordModule {}
