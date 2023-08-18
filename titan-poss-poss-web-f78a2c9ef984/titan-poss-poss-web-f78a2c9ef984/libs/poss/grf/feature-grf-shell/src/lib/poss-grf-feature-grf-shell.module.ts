import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGrfFeatureGrfHistoryModule } from '@poss-web/poss/grf/feature-grf-history';
import { PossGrfFeatureGrfModule } from '@poss-web/poss/grf/feature-grf';
import { PossGrfFeatureMergeGrfModule } from '@poss-web/poss/grf/feature-merge-grf';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { PossSharedFeatureCommonModule } from '@poss-web/poss/shared/feature-common';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedUtilSiteRoutesModule } from '@poss-web/shared/util-site-routes';
import { GrfShellComponent } from './grf-shell/grf-shell.component';
import { PossGrfDataAccessGrfModule } from '@poss-web/poss/grf/data-access-grf';
import { SharedFileUploadFeatureFileMultiUploadModule } from '@poss-web/shared/file-upload/feature-file-multi-upload';
import { PossSharedProductFeatureProductModule } from '@poss-web/poss/shared/product/feature-product';
import { SharedOrderDetailFeatureOrderDetailModule } from '@poss-web/shared/order-detail/feature-order-detail';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: GrfShellComponent,
    children: [
      {
        path: 'new-grf/:_id',
        loadChildren: () =>
          import('@poss-web/poss/grf/feature-grf').then(m => {
            return m.PossGrfFeatureGrfModule;
          })
      },
      {
        path: 'manual-grf/:_id',
        loadChildren: () =>
          import('@poss-web/poss/grf/feature-manual-grf').then(m => {
            return m.PossGrfFeatureManualGrfModule;
          })
      },
      {
        path: 'merge-grf',
        loadChildren: () =>
          import('@poss-web/poss/grf/feature-merge-grf').then(m => {
            return m.PossGrfFeatureMergeGrfModule;
          })
      },
      {
        path: 'history',
        loadChildren: () =>
          import('@poss-web/poss/grf/feature-grf-history').then(m => {
            return m.PossGrfFeatureGrfHistoryModule;
          })
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedCustomerFeatureCustomerSearchModule,
    PossSharedFeatureCommonModule,
    CommonCustomMaterialModule,
    PossGrfFeatureGrfHistoryModule,
    PossGrfFeatureGrfModule,
    PossGrfFeatureMergeGrfModule,
    SharedPaymentFeaturePaymentModule,
    SharedToolbarFeatureToolbarModule,
    SharedUtilSiteRoutesModule,
    PossGrfDataAccessGrfModule,
    // PossGrfFeatureGrfMenuModule,
    SharedFileUploadFeatureFileMultiUploadModule,
    PossSharedProductFeatureProductModule,
    SharedOrderDetailFeatureOrderDetailModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [GrfShellComponent]
})
export class PossGrfFeatureGrfShellModule {}
