import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { StateDetailsComponent } from './state-details/state-details.component';
import { TaxDetailsComponent } from './tax-details/tax-details.component';
import { TaxDetailsPopupComponent } from './tax-details-popup/tax-details-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [StateDetailsComponent, TaxDetailsComponent, TaxDetailsPopupComponent],
  exports: [StateDetailsComponent, TaxDetailsComponent, TaxDetailsPopupComponent],
  entryComponents: [TaxDetailsPopupComponent]
})
export class EpossStateTaxConfigUiStateTaxConfigDetailModule {}
