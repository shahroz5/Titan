import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { FileMultiUploadComponent } from './file-multi-upload/file-multi-upload.component';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedFileUploadUiFileMultiUploadModule } from '@poss-web/shared/file-upload/ui-file-multi-upload';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedFileUploadUiFileMultiUploadModule,
    SharedCustomerDataAccessCustomerModule
  ],
  declarations: [FileMultiUploadComponent],
  exports: [FileMultiUploadComponent]
})
export class SharedFileUploadFeatureFileMultiUploadModule {}
