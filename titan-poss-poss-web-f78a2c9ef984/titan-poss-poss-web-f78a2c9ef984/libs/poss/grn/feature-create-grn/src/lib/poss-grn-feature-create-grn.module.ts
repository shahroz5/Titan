import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGrnComponent } from './create-grn/create-grn.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { PossGrnDataAccessGrnModule } from '@poss-web/poss/grn/data-access-grn';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedProfileDataAccessProfileModule } from '@poss-web/shared/profile/data-access-profile';
import { SharedComponentsUiProductViewModule } from '@poss-web/shared/components/ui-product-view';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { PossGrnUiCreateGrnModule } from '@poss-web/poss/grn/ui-create-grn';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
import { PossSharedProductUiProductModule } from '@poss-web/poss/shared/product/ui-product';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedFileUploadFeatureFileMultiUploadModule } from '@poss-web/shared/file-upload/feature-file-multi-upload';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    PossGrnDataAccessGrnModule,
    SharedComponentsUiFormattersModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedComponentsUiProductViewModule,
    PossSharedProductDataAccessProductModule,
    SharedProfileDataAccessProfileModule,
    PossGrnUiCreateGrnModule,
    SharedComponentsUiSelectionDialogModule,
    SharedComponentsUiFileUploadModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    PossSharedProductUiProductModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedBodEodDataAccessBodEodModule,
    SharedFileUploadFeatureFileMultiUploadModule
  ],
  declarations: [CreateGrnComponent],
  exports: [CreateGrnComponent]
})
export class PossGrnFeatureCreateGrnModule {}
