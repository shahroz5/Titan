import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { CashMemoShellComponent } from './cash-memo-shell.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { PossSharedProductFeatureProductModule } from '@poss-web/poss/shared/product/feature-product';
import { PossCashMemoFeatureToleranceDetailsModule } from '@poss-web/poss/cash-memo/feature-tolerance-details';
import { PossSharedDiscountFeatureDiscountModule } from '@poss-web/poss/shared/discount/feature-discount';
import { PossSharedOtherChargesFeatureOtherChargesModule } from '@poss-web/poss/shared/other-charges/feature-other-charges';
import { SharedShortcutUiShortcutModule } from '@poss-web/shared/shortcut/ui-shortcut';

import { SharedFileUploadFeatureFileMultiUploadModule } from '@poss-web/shared/file-upload/feature-file-multi-upload';
import { SharedOrderDetailFeatureOrderDetailModule } from '@poss-web/shared/order-detail/feature-order-detail';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: CashMemoShellComponent,
    children: [
      {
        path: 'history',
        loadChildren: () =>
          import('@poss-web/poss/cash-memo/feature-cash-memo-history').then(
            m => {
              return m.PossCashMemoFeatureCashMemoHistoryModule;
            }
          )
      },
      {
        path: 'manual-bill/:_id',
        loadChildren: () =>
          import('@poss-web/poss/cash-memo/feature-manual-cash-memo').then(
            m => {
              return m.PossCashMemoFeatureManualCashMemoModule;
            }
          )
      },
      {
        path: ':_id',
        loadChildren: () =>
          import('@poss-web/poss/cash-memo/feature-regular-cash-memo').then(
            m => {
              return m.PossCashMemoFeatureRegularCashMemoModule;
            }
          )
      }
    ]
  }
];

@NgModule({
  declarations: [CashMemoShellComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedCustomerFeatureCustomerSearchModule,
    SharedPaymentFeaturePaymentModule,
    SharedToolbarFeatureToolbarModule,
    PossSharedProductFeatureProductModule,
    // PossCashMemoFeatureCmMenuModule,
    PossCashMemoFeatureToleranceDetailsModule,
    PossSharedOtherChargesFeatureOtherChargesModule,
    PossSharedDiscountFeatureDiscountModule,
    SharedFileUploadFeatureFileMultiUploadModule,
    SharedOrderDetailFeatureOrderDetailModule,
    SharedShortcutUiShortcutModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ]
})
export class PossCashMemoFeatureCmShellModule {}
