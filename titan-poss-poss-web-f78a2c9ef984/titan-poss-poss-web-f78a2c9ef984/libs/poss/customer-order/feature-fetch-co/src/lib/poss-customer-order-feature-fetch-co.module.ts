import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetchCustomerOrderComponent } from './fetch-customer-order/fetch-customer-order.component';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossCustomerOrderUiCoModule } from '@poss-web/poss/customer-order/ui-co';
import { PossCustomerOrderDataAccessCoModule } from '@poss-web/poss/customer-order/data-access-co'; 
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FetchCustomerOrderComponent }
    ]),
    CommonCustomMaterialModule,
    PossCustomerOrderUiCoModule,
    PossCustomerOrderDataAccessCoModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [FetchCustomerOrderComponent]
})
export class PossCustomerOrderFeatureFetchCoModule {}
