import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoProductComponent } from './co-product/co-product.component';
import { PossCustomerOrderUiCoModule } from '@poss-web/poss/customer-order/ui-co';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

@NgModule({
  imports: [
    CommonModule,
    PossCustomerOrderUiCoModule,
    CommonCustomMaterialModule,
    PossSharedProductDataAccessProductModule,
    SharedPaymentDataAccessPaymentModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [CoProductComponent],
  exports: [CoProductComponent]
})
export class PossSharedProductFeatureCoProductModule {}
