import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { SharedPaymentMasterDataAccessPaymentMasterModule } from '@poss-web/shared/payment-master/data-access-payment-master';
import { SharedPaymentMasterUiPaymentMasterListModule } from '@poss-web/shared/payment-master/ui-payment-master-list';
import { SharedPaymentMasterUiPaymentMasterDetailModule } from '@poss-web/shared/payment-master/ui-payment-master-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PaymentMasterListComponent } from './payment-master-list/payment-master-list.component';
const route: Route[] = [{ path: '', component: PaymentMasterListComponent }];
@NgModule({
  imports: [
    CommonModule,
    SharedPaymentMasterDataAccessPaymentMasterModule,
    SharedPaymentMasterUiPaymentMasterListModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule,
    SharedPaymentMasterUiPaymentMasterDetailModule
  ],
  declarations: [PaymentMasterListComponent]
})
export class SharedPaymentMasterFeaturePaymentMasterModule {}
