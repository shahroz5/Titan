import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadServicePossComponent } from './upload-service-poss/upload-service-poss.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUploadServicePossBankDepositDataAccessUploadServicePossModule } from '@poss-web/shared/upload-service-poss-bank-deposit/data-access-upload-service-poss';
import { SharedComponentsUiFileuploadConfirmationPopupModule } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiErrorGridPopupModule } from '@poss-web/shared/components/ui-error-grid-popup';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';

const routes: Routes = [
  {
    path: '',
    component: UploadServicePossComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedUploadServicePossBankDepositDataAccessUploadServicePossModule,
    SharedComponentsUiFileuploadConfirmationPopupModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiErrorGridPopupModule,
    SharedFileUploadDataAccessFileUploadModule
  ],
  declarations: [UploadServicePossComponent]
})
export class SharedUploadServicePossBankDepositFeatureUploadServicePossModule {}