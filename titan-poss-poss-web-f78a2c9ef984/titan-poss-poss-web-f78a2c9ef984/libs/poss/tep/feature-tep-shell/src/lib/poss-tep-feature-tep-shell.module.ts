import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { PossSharedFeatureCommonModule } from '@poss-web/poss/shared/feature-common';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedUtilSiteRoutesModule } from '@poss-web/shared/util-site-routes';
import { TepShellComponent } from './tep-shell/tep-shell.component';

import { SharedFileUploadFeatureFileMultiUploadModule } from '@poss-web/shared/file-upload/feature-file-multi-upload';
import { SharedOrderDetailFeatureOrderDetailModule } from '@poss-web/shared/order-detail/feature-order-detail';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: TepShellComponent,
    children: [
      {
        path: 'create-tep/:_id',
        loadChildren: () =>
          import('@poss-web/poss/tep/feature-create-tep').then(m => {
            return m.PossTepFeatureCreateTepModule;
          })
      },
      {
        path: 'cut-piece-tep/:_id',
        loadChildren: () =>
          import('@poss-web/poss/tep/feature-cut-piece-tep').then(m => {
            return m.PossTepFeatureCutPieceTepModule;
          })
      },
      {
        path: 'manual-tep/:_id',
        loadChildren: () =>
          import('@poss-web/poss/tep/feature-manual-tep').then(m => {
            return m.PossTepFeatureManualTepModule;
          })
      },
      {
        path: 'cancel-tep',
        loadChildren: () =>
          import('@poss-web/poss/tep/feature-tep-cancel').then(m => {
            return m.PossTepFeatureTepCancelModule;
          })
      },
      {
        path: 'tep-history',
        loadChildren: () =>
          import('@poss-web/poss/tep/feature-tep-history').then(m => {
            return m.PossTepFeatureTepHistoryModule;
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
    SharedToolbarFeatureToolbarModule,
    SharedUtilSiteRoutesModule,
    SharedFileUploadFeatureFileMultiUploadModule,
    SharedOrderDetailFeatureOrderDetailModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [TepShellComponent]
})
export class PossTepFeatureTepShellModule {}
