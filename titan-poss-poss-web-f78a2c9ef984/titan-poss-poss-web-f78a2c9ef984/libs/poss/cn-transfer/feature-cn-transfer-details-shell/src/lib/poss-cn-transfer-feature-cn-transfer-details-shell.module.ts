import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { SharedFileUploadFeatureFileMultiUploadModule } from '@poss-web/shared/file-upload/feature-file-multi-upload';
import { CnTransferDetailsContainerComponent } from './cn-transfer-details-container/cn-transfer-details-container.component';
import { PossCnTransferFeatureCnTransferDetailsModule } from '@poss-web/poss/cn-transfer/feature-cn-transfer-details';

const routes: Routes = [
  {
    path: '',
    component: CnTransferDetailsContainerComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedToolbarFeatureToolbarModule,
    PossCnTransferFeatureCnTransferDetailsModule,
    SharedCustomerFeatureCustomerSearchModule,
    SharedFileUploadFeatureFileMultiUploadModule
  ],
  declarations: [CnTransferDetailsContainerComponent]
})
export class PossCnTransferFeatureCnTransferDetailsShellModule {}
