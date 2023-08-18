import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerNotSelectedPopupComponent } from './customer-not-selected-popup/customer-not-selected-popup.component';
import { ManualGepDetailsComponent } from './manual-gep-details/manual-gep-details.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [CustomerNotSelectedPopupComponent, ManualGepDetailsComponent],
  exports: [ManualGepDetailsComponent, CustomerNotSelectedPopupComponent],
  entryComponents: [CustomerNotSelectedPopupComponent]
})
export class PossGepUiManualGepModule {}
