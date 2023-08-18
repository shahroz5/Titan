import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayerBankConfigDetailsComponent } from './payer-bank-config-details/payer-bank-config-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossPayerBankConfigDataAccessPayerBankConfigModule } from '@poss-web/eposs/payer-bank-config/data-access-payer-bank-config';
import { EpossPayerBankConfigUiPayerBankConfigDetailsModule } from '@poss-web/eposs/payer-bank-config/ui-payer-bank-config-details';
import { EpossPayerBankConfigUiPayerBankConfigViewModule } from '@poss-web/eposs/payer-bank-config/ui-payer-bank-config-view';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
const routes: Routes = [
  {
    path: '',
    component: PayerBankConfigDetailsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossPayerBankConfigDataAccessPayerBankConfigModule,
    EpossPayerBankConfigUiPayerBankConfigDetailsModule,
    EpossPayerBankConfigUiPayerBankConfigViewModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedLocationMappingDataAccessLocationMappingModule,
    SharedComponentsUiToggleButtonModule
  ],
  providers: [SelectionDialogService],
  declarations: [PayerBankConfigDetailsComponent],
  exports: [PayerBankConfigDetailsComponent]
})
export class EpossPayerBankConfigFeaturePayerBankConfigDetailsModule {}
