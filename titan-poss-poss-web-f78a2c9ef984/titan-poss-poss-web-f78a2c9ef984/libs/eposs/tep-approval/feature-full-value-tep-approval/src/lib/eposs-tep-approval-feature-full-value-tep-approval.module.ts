import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullValueTepApprovalComponent } from './full-value-tep-approval/full-value-tep-approval.component';
import { EpossTepApprovalDataAccessTepApprovalModule } from '@poss-web/eposs/tep-approval/data-access-tep-approval';
import { EpossTepApprovalUiTepApprovalModule } from '@poss-web/eposs/tep-approval/ui-tep-approval';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { RouterModule, Routes } from '@angular/router';
import { EpossTepApprovalUiFullValueTepRequestListGridModule } from '@poss-web/eposs/tep-approval/ui-full-value-tep-request-list-grid';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedFileUploadUiFileDownloadPopupModule } from '@poss-web/shared/file-upload/ui-file-download-popup';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';

const routes: Routes = [
  {
    path: '',
    component: FullValueTepApprovalComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    EpossTepApprovalDataAccessTepApprovalModule,
    SharedComponentsUiFormFieldControlsModule,
    EpossTepApprovalUiTepApprovalModule,
    SharedComponentsUiLoaderModule,
    SharedUtilFieldValidatorsModule,
    EpossTepApprovalUiFullValueTepRequestListGridModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedFileUploadUiFileDownloadPopupModule,
    SharedComponentsUiSortDialogModule,
    SharedComponentsUiFileUploadModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FullValueTepApprovalComponent]
})
export class EpossTepApprovalFeatureFullValueTepApprovalModule {}
