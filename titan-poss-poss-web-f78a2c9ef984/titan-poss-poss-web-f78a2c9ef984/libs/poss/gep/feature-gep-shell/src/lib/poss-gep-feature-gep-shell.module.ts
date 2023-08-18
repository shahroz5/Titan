import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GepTransactionComponent } from './gep-transaction/gep-transaction.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

// import { PossGepFeatureNewGepModule } from '@poss-web/poss/gep/feature-new-gep';
// import { PossGepFeatureManualGepModule } from '@poss-web/poss/gep/feature-manual-gep';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { PossGepFeatureGepOnHoldModule } from '@poss-web/poss/gep/feature-gep-on-hold';
// import { PossGepFeatureCancelGepModule } from '@poss-web/poss/gep/feature-cancel-gep';
// import { PossGepFeatureGepMenuModule } from '@poss-web/poss/gep/feature-gep-menu';
// import { PossGepFeatureGepHistoryModule } from '@poss-web/poss/gep/feature-gep-history';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedFileUploadFeatureFileMultiUploadModule } from '@poss-web/shared/file-upload/feature-file-multi-upload';
import { SharedOrderDetailFeatureOrderDetailModule } from '@poss-web/shared/order-detail/feature-order-detail';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: GepTransactionComponent,
    children: [
      {
        path: 'new',
        loadChildren: () =>
          import('@poss-web/poss/gep/feature-new-gep').then(m => {
            return m.PossGepFeatureNewGepModule;
          })
      },
      {
        path: 'manual',
        loadChildren: () =>
          import('@poss-web/poss/gep/feature-manual-gep').then(m => {
            return m.PossGepFeatureManualGepModule;
          })
      },
      {
        path: 'cancel',
        loadChildren: () =>
          import('@poss-web/poss/gep/feature-cancel-gep').then(m => {
            return m.PossGepFeatureCancelGepModule;
          })
      },
      {
        path: 'history',
        loadChildren: () =>
          import('@poss-web/poss/gep/feature-gep-history').then(m => {
            return m.PossGepFeatureGepHistoryModule;
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
    SharedCustomerFeatureCustomerSearchModule,
    SharedComponentsUiFormattersModule,
    // PossGepFeatureGepMenuModule,
    // PossGepFeatureNewGepModule,
    // PossGepFeatureManualGepModule,
    PossGepFeatureGepOnHoldModule,
    // PossGepFeatureCancelGepModule,
    // PossGepFeatureGepHistoryModule,
    SharedToolbarFeatureToolbarModule,
    SharedFileUploadFeatureFileMultiUploadModule,
    SharedOrderDetailFeatureOrderDetailModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [GepTransactionComponent],
  exports: [GepTransactionComponent]
})
export class PossGepFeatureGepShellModule {}
