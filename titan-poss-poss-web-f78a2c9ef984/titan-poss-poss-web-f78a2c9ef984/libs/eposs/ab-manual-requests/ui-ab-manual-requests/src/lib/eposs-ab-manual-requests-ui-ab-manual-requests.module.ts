import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { FilterPopupComponent } from './filter-popup/filter-popup.component';
import { HeaderViewComponent } from './header-view/header-view.component';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFileUploadModule
  ],
  declarations: [FilterPopupComponent, HeaderViewComponent],
  exports: [FilterPopupComponent, HeaderViewComponent],
  entryComponents: [FilterPopupComponent]
})
export class EpossAbManualRequestsUiAbManualRequestsModule {}
