import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadEGHSComponent } from './upload-eghs/upload-eghs.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUploadEghsBankDepositDataAccessUploadEghsModule } from '@poss-web/shared/upload-eghs-bank-deposit/data-access-upload-eghs';
import { SharedComponentsUiFileuploadConfirmationPopupModule } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiErrorGridPopupModule } from '@poss-web/shared/components/ui-error-grid-popup';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';

const routes: Routes = [
  {
    path: '',
    component: UploadEGHSComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedUploadEghsBankDepositDataAccessUploadEghsModule,
    SharedComponentsUiFileuploadConfirmationPopupModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiErrorGridPopupModule,
    SharedFileUploadDataAccessFileUploadModule
  ],
  declarations: [UploadEGHSComponent]
})
export class SharedUploadEghsBankDepositFeatureUploadEghsModule {}
