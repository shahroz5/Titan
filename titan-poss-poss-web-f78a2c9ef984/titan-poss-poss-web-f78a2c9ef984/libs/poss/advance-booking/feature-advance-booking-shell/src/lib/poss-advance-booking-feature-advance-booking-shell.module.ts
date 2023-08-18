import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossSharedDiscountFeatureDiscountModule } from '@poss-web/poss/shared/discount/feature-discount';
import { PossSharedProductFeatureProductModule } from '@poss-web/poss/shared/product/feature-product';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { SharedOrderDetailFeatureOrderDetailModule } from '@poss-web/shared/order-detail/feature-order-detail';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { AdvanceBookingShellComponent } from './advance-booking-shell.component';
import { SharedFileUploadFeatureFileMultiUploadModule } from '@poss-web/shared/file-upload/feature-file-multi-upload';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: AdvanceBookingShellComponent,
    children: [
      {
        path: 'search',
        loadChildren: () =>
          import(
            '@poss-web/poss/advance-booking/feature-search-advance-booking'
          ).then(m => {
            return m.PossAdvanceBookingFeatureSearchAdvanceBookingModule;
          })
      },
      {
        path: 'manual/:_id',
        loadChildren: () =>
          import(
            '@poss-web/poss/advance-booking/feature-manual-advance-booking'
          ).then(m => {
            return m.PossAdvanceBookingFeatureManualAdvanceBookingModule;
          })
      },
      {
        path: ':_id',
        loadChildren: () =>
          import('@poss-web/poss/advance-booking/feature-advance-booking').then(
            m => {
              return m.PossAdvanceBookingFeatureAdvanceBookingModule;
            }
          )
      }
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    PossSharedDiscountFeatureDiscountModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedCustomerFeatureCustomerSearchModule,
    SharedPaymentFeaturePaymentModule,
    SharedToolbarFeatureToolbarModule,
    PossSharedProductFeatureProductModule,
    SharedFileUploadFeatureFileMultiUploadModule,
    SharedOrderDetailFeatureOrderDetailModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [AdvanceBookingShellComponent]
})
export class PossAdvanceBookingFeatureAdvanceBookingShellModule {}
