import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedFileUploadUiFileMultiUploadModule } from '@poss-web/shared/file-upload/ui-file-multi-upload';

import { GepViewComponent } from './gep-view/gep-view.component';

import { PossGepUiGepDetailsModule } from '@poss-web/poss/gep/ui-gep-details';
import { PossGepUiGepProductGridModule } from '@poss-web/poss/gep/ui-gep-product-grid';
import { PossGepUiCancelGepModule } from '@poss-web/poss/gep/ui-cancel-gep';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { PossGepDataAccessGepModule } from '@poss-web/poss/gep/data-access-gep';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedFileUploadDataAccessFileUploadModule,
    PossGepDataAccessGepModule,
    PossGepUiGepDetailsModule,
    PossGepUiGepProductGridModule,
    PossGepUiCancelGepModule,
    PossSharedProductDataAccessProductModule,
    SharedFileUploadUiFileMultiUploadModule
  ],
  declarations: [GepViewComponent],
  exports: [GepViewComponent]
})
export class PossGepFeatureGepViewModule {}
