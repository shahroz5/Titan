import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PayeeBankDetailComponent } from './payee-bank-detail/payee-bank-detail.component';
import { SharedPayeeBankUiPayeeBankDetailModule } from '@poss-web/shared/payee-bank/ui-payee-bank-detail';
import { SharedPayeeBankDataAccessPayeeBankModule } from '@poss-web/shared/payee-bank/data-access-payee-bank';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedPayeeBankUiPayeeBankViewModule } from '@poss-web/shared/payee-bank/ui-payee-bank-view';
const route = [{ path: '', component: PayeeBankDetailComponent }];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    SharedPayeeBankDataAccessPayeeBankModule,
    SharedPayeeBankUiPayeeBankDetailModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedPayeeBankUiPayeeBankViewModule
  ],
  declarations: [PayeeBankDetailComponent]
})
export class SharedPayeeBankFeaturePayeeBankDetailModule {}
