import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewGrnComponent } from './view-grn/view-grn.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { PossGrnDataAccessGrnModule } from '@poss-web/poss/grn/data-access-grn';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedProfileDataAccessProfileModule } from '@poss-web/shared/profile/data-access-profile';
import { SharedComponentsUiProductViewModule } from '@poss-web/shared/components/ui-product-view';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedFileUploadUiFileMultiUploadModule } from '@poss-web/shared/file-upload/ui-file-multi-upload';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    CommonCustomMaterialModule,
    PossGrnDataAccessGrnModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedProfileDataAccessProfileModule,
    SharedComponentsUiProductViewModule,
    PossSharedProductDataAccessProductModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedFileUploadUiFileMultiUploadModule
  ],
  declarations: [ViewGrnComponent],
  exports: [ViewGrnComponent]
})
export class PossGrnFeatureViewGrnModule {}
