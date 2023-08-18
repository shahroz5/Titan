import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AuthnGuard, AuthzGuard } from '@poss-web/shared/auth/feature-auth';
import { PossBodAndGoldRateCheckGuard } from '@poss-web/shared/bod-eod/feature-bod-eod';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { PossCnTransferFeatureCnTransferRequestListingModule } from '@poss-web/poss/cn-transfer/feature-cn-transfer-request-listing';
import { PossCnTransferFeatureCnTransferMenuModule } from '@poss-web/poss/cn-transfer/feature-cn-transfer-menu';
import { CnTransferComponent } from './cn-transfer/cn-transfer.component';
import { PossCnTransferFeatureCnTransferModule } from '@poss-web/poss/cn-transfer/feature-cn-transfer';
const routes: Routes = [
  {
    path: '',
    component: CnTransferComponent,
    children: [
      {
        path: 'search',
        loadChildren: () =>
          import('@poss-web/poss/cn-transfer/feature-cn-transfer').then(m => {
            return m.PossCnTransferFeatureCnTransferModule;
          }),
        canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
      },
      {
        path: 'sent',
        loadChildren: () =>
          import(
            '@poss-web/poss/cn-transfer/feature-cn-transfer-request-listing'
          ).then(m => {
            return m.PossCnTransferFeatureCnTransferRequestListingModule;
          }),
        canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
      },
      {
        path: 'received',
        loadChildren: () =>
          import(
            '@poss-web/poss/cn-transfer/feature-cn-transfer-request-listing'
          ).then(m => {
            return m.PossCnTransferFeatureCnTransferRequestListingModule;
          }),
        canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
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
    PossCnTransferFeatureCnTransferModule,
    PossCnTransferFeatureCnTransferRequestListingModule,
    PossCnTransferFeatureCnTransferMenuModule
  ],
  declarations: [CnTransferComponent]
})
export class PossCnTransferFeatureCnTransferShellModule {}
