import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CNTransactionComponent } from './cn-transaction/cn-transaction.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { PossCreditNoteFeatureCnDetailsModule } from '@poss-web/poss/credit-note/feature-cn-details';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedFileUploadFeatureFileMultiUploadModule } from '@poss-web/shared/file-upload/feature-file-multi-upload';

const routes: Routes = [
  {
    path: '',
    component: CNTransactionComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedCustomerFeatureCustomerSearchModule,
    PossCreditNoteFeatureCnDetailsModule,
    SharedToolbarFeatureToolbarModule,
    SharedFileUploadFeatureFileMultiUploadModule,
  ],
  declarations: [CNTransactionComponent],
  exports: [CNTransactionComponent]
})
export class PossCreditNoteFeatureCnShellModule {}
