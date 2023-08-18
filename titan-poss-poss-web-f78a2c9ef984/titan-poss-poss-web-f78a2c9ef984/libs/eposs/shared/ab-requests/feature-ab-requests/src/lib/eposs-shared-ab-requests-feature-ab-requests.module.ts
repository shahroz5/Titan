import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbRequestsComponent } from './ab-requests/ab-requests.component';
import { EpossSharedAbRequestsUiAbRequestsModule } from '@poss-web/eposs/shared/ab-requests/ui-ab-requests';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossSharedAbRequestsDataAccessAbRequestsModule } from '@poss-web/eposs/shared/ab-requests/data-access-ab-requests';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedFileUploadUiFileDownloadPopupModule } from '@poss-web/shared/file-upload/ui-file-download-popup';
@NgModule({
  imports: [
    CommonModule,
    EpossSharedAbRequestsUiAbRequestsModule,
    EpossSharedAbRequestsDataAccessAbRequestsModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedComponentsUiLoaderModule,
    SharedFileUploadUiFileDownloadPopupModule
  ],
  declarations: [AbRequestsComponent],
  exports: [AbRequestsComponent]
})
export class EpossSharedAbRequestsFeatureAbRequestsModule {}
