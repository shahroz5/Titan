import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewCustomerOrderComponent } from './new-customer-order/new-customer-order.component';
import { RouterModule } from '@angular/router';
import { PossCustomerOrderUiCoModule } from '@poss-web/poss/customer-order/ui-co';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { PossCustomerOrderDataAccessCoModule } from '@poss-web/poss/customer-order/data-access-co';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedOrderConfirmationDataAccessOrderConfirmationModule } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { SharedCustomerFeatureCustomerCreateModule } from '@poss-web/shared/customer/feature-customer-create';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: NewCustomerOrderComponent }]),
    PossCustomerOrderUiCoModule,
    CommonCustomMaterialModule,
    SharedCustomerDataAccessCustomerModule,
    PossCustomerOrderDataAccessCoModule,
    PossSharedProductDataAccessProductModule,
    SharedComponentsUiLoaderModule,
    SharedPaymentDataAccessPaymentModule,
    SharedComponentsUiFormattersModule,
    SharedOrderConfirmationDataAccessOrderConfirmationModule,
    SharedCustomerFeatureCustomerCreateModule
  ],
  declarations: [NewCustomerOrderComponent]
})
export class PossCustomerOrderFeatureNewCoModule {}
