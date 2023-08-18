import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocProductGridComponent } from './foc-product-grid/foc-product-grid.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilCommonModule } from 'libs/shared/util-common/src/lib/shared-util-common.module';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedUtilCommonModule
  ],
  declarations: [FocProductGridComponent],
  exports: [FocProductGridComponent]
})
export class PossFocUiPendingFocProductGridModule {}
