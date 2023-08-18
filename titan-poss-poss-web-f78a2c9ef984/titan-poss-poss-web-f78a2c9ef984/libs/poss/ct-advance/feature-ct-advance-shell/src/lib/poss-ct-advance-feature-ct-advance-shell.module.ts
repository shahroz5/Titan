import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { PossSharedFeatureCommonModule } from '@poss-web/poss/shared/feature-common';
// import { PossCtAdvanceFeatureAcceptAdvanceModule } from '@poss-web/poss/ct-advance/feature-accept-advance';
// import { PossCtAdvanceFeatureManualAcceptAdvanceModule } from '@poss-web/poss/ct-advance/feature-manual-accept-advance';
// import { PossCtAdvanceFeatureAcceptAdvanceHistoryModule } from '@poss-web/poss/ct-advance/feature-accept-advance-history';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { CtAdvanceShellComponent } from './ct-advance-shell/ct-advance-shell.component';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
// import { PossCtAdvanceDataAccessCtAcceptAdvanceModule } from '@poss-web/poss/ct-advance/data-access-ct-accept-advance';
// import { PossCtAdvanceFeatureAcceptAdvanceMenuModule } from '@poss-web/poss/ct-advance/feature-accept-advance-menu';
import { PossSharedProductFeatureProductModule } from '@poss-web/poss/shared/product/feature-product';
import { SharedOrderDetailFeatureOrderDetailModule } from '@poss-web/shared/order-detail/feature-order-detail';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: CtAdvanceShellComponent,
    children: [
      {
        path: 'accept-advance/:_id',
        loadChildren: () =>
          import('@poss-web/poss/ct-advance/feature-accept-advance').then(m => {
            return m.PossCtAdvanceFeatureAcceptAdvanceModule;
          })
      },
      {
        path: 'manual-accept-advance',
        loadChildren: () =>
          import(
            '@poss-web/poss/ct-advance/feature-manual-accept-advance'
          ).then(m => {
            return m.PossCtAdvanceFeatureManualAcceptAdvanceModule;
          })
      },
      {
        path: 'history',
        loadChildren: () =>
          import(
            '@poss-web/poss/ct-advance/feature-accept-advance-history'
          ).then(m => {
            return m.PossCtAdvanceFeatureAcceptAdvanceHistoryModule;
          })
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedCustomerFeatureCustomerSearchModule,
    PossSharedFeatureCommonModule,
    SharedPaymentFeaturePaymentModule,
    // PossCtAdvanceFeatureAcceptAdvanceModule,
    // PossCtAdvanceFeatureManualAcceptAdvanceModule,
    // PossCtAdvanceFeatureAcceptAdvanceHistoryModule,
    SharedToolbarFeatureToolbarModule,
    // PossCtAdvanceDataAccessCtAcceptAdvanceModule,
    PossSharedProductFeatureProductModule,
    // PossCtAdvanceFeatureAcceptAdvanceMenuModule,
    SharedOrderDetailFeatureOrderDetailModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [CtAdvanceShellComponent]
})
export class PossCtAdvanceFeatureCtAdvanceShellModule {}
