import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { BillCancelDetailComponent } from './bill-cancel-detail/bill-cancel-detail.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';

import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

import { SharedComponentsUiProductViewModule } from '@poss-web/shared/components/ui-product-view';

import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { RouterModule, Routes } from '@angular/router';
import { SharedBcRequestsUiBcModule } from '@poss-web/shared/bc-requests/ui-bc';
import { SharedBcRequestsDataAccessBcModule } from '@poss-web/shared/bc-requests/data-access-bc';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { PossFocDataAccessFocModule } from '@poss-web/poss/foc/data-access-foc';
import { PossSharedOtherChargesFeatureOtherChargesModule } from '@poss-web/poss/shared/other-charges/feature-other-charges';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedPaymentUiPaymentModule } from '@poss-web/shared/payment/ui-payment';

const routes: Routes = [
  {
    path: '',
    component: BillCancelDetailComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiProductViewModule,
    RouterModule.forChild(routes),

    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedBcRequestsUiBcModule,
    SharedComponentsUiFormattersModule,
    SharedBcRequestsDataAccessBcModule,
    SharedCommonDataAccessCommonModule,
    SharedCustomerFeatureCustomerSearchModule,
    SharedPaymentFeaturePaymentModule,
    PossSharedProductDataAccessProductModule,
    PossFocDataAccessFocModule,
    PossSharedOtherChargesFeatureOtherChargesModule,
    SharedPaymentDataAccessPaymentModule,
    SharedPaymentUiPaymentModule
  ],
  declarations: [BillCancelDetailComponent],
  exports: [BillCancelDetailComponent]
})
export class SharedBcRequestsFeatureBcStatusDetailModule {}
