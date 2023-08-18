import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { CustomerOrderShellComponent } from './customer-order-shell/customer-order-shell.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { PossSharedDiscountFeatureDiscountModule } from '@poss-web/poss/shared/discount/feature-discount';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { PossSharedProductFeatureCoProductModule } from '@poss-web/poss/shared/product/feature-co-product';
import { SharedOrderDetailFeatureOrderDetailModule } from '@poss-web/shared/order-detail/feature-order-detail';

const routes: Routes = [
  {
    path: '',
    component: CustomerOrderShellComponent,
    children: [
      {
        path: 'fetch',
        loadChildren: () =>
          import('@poss-web/poss/customer-order/feature-fetch-co').then(m => {
            return m.PossCustomerOrderFeatureFetchCoModule;
          })
      },
      {
        path: 'search',
        loadChildren: () =>
          import('@poss-web/poss/customer-order/feature-search-co').then(m => {
            return m.PossCustomerOrderFeatureSearchCoModule;
          })
      },
      {
        path: ':_id',
        loadChildren: () =>
          import('@poss-web/poss/customer-order/feature-new-co').then(m => {
            return m.PossCustomerOrderFeatureNewCoModule;
          })
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedToolbarFeatureToolbarModule,
    SharedPaymentFeaturePaymentModule,
    PossSharedDiscountFeatureDiscountModule,
    SharedCustomerFeatureCustomerSearchModule,
    PossSharedProductFeatureCoProductModule,
    SharedOrderDetailFeatureOrderDetailModule
  ],
  declarations: [CustomerOrderShellComponent]
})
export class PossCustomerOrderFeatureCoShellModule {}
