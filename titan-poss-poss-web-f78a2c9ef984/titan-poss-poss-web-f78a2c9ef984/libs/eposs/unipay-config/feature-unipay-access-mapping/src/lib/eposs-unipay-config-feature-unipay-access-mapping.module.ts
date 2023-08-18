import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnipayAccessMappingComponent } from './unipay-access-mapping/unipay-access-mapping.component';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossUnipayConfigurationDataAccessUnipayConfigurationModule } from '@poss-web/eposs/unipay-config/data-access-unipay-config';
import { AgGridModule } from 'ag-grid-angular';

import { EpossUnipayConfigurationUiUnipayConfigurationItemListModule } from '@poss-web/eposs/unipay-config/ui-unipay-config-item-list';
import { SharedComponentsUiFileuploadConfirmationPopupModule } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
const route: Route[] = [{ path: '', component: UnipayAccessMappingComponent }];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    EpossUnipayConfigurationUiUnipayConfigurationItemListModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    AgGridModule.withComponents(),
    SharedComponentsUiFileuploadConfirmationPopupModule,
    EpossUnipayConfigurationDataAccessUnipayConfigurationModule,
    SharedFileUploadDataAccessFileUploadModule
  ],
  declarations: [UnipayAccessMappingComponent]
})
export class EpossUnipayConfigurationFeatureUnipayAccessMappingModule {}
