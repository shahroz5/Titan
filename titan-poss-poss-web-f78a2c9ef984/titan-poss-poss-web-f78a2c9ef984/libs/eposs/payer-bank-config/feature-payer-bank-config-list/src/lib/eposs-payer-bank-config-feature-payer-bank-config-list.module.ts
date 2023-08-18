import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayerBankConfigListComponent } from './payer-bank-config-list/payer-bank-config-list.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossPayerBankConfigDataAccessPayerBankConfigModule } from '@poss-web/eposs/payer-bank-config/data-access-payer-bank-config';
import { EpossPayerBankConfigUiPayerBankConfigItemListModule } from '@poss-web/eposs/payer-bank-config/ui-payer-bank-config-item-list';
const routes: Routes = [
  {
    path: '',
    component: PayerBankConfigListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossPayerBankConfigDataAccessPayerBankConfigModule,
    EpossPayerBankConfigUiPayerBankConfigItemListModule
  ],
  declarations: [PayerBankConfigListComponent]
})
export class EpossPayerBankConfigFeaturePayerBankConfigListModule {}
