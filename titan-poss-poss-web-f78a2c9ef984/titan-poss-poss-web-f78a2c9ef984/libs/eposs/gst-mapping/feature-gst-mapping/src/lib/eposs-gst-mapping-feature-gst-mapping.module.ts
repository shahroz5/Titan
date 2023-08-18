import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GSTMappingComponent } from './gst-mapping.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFileuploadConfirmationPopupModule } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { EpossGstMappingDataAccessGstMappingModule } from '@poss-web/eposs/gst-mapping/data-access-gst-mapping';
import { EpossGstMappingUiGstMappingListModule } from '@poss-web/eposs/gst-mapping/ui-gst-mapping-list';
import { EpossGstMappingUiGstMappingFormModule } from '@poss-web/eposs/gst-mapping/ui-gst-mapping-form';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';

const routes: Routes = [
  {
    path: '',
    component: GSTMappingComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFileuploadConfirmationPopupModule,
    EpossGstMappingDataAccessGstMappingModule,
    EpossGstMappingUiGstMappingListModule,
    EpossGstMappingUiGstMappingFormModule,
    SharedFileUploadDataAccessFileUploadModule
  ],
  declarations: [GSTMappingComponent]
})
export class EpossGstMappingFeatureGstMappingModule {}
