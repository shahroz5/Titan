import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDepositComponent } from './bank-deposit/bank-deposit.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedBankDepositDataAccessBankDepositModule } from '@poss-web/shared/bank-deposit/data-access-bank-deposit';
import { SharedBankDepositUiBankDepositModule } from '@poss-web/shared/bank-deposit/ui-bank-deposit';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

const routes: Routes = [
  {
    path: '',
    component: BankDepositComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedBankDepositDataAccessBankDepositModule,
    SharedBankDepositUiBankDepositModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [BankDepositComponent]
})
export class SharedBankDepositFeatureBankDepositModule {}
