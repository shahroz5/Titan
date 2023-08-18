import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

import { TepExceptionFormComponent } from './tep-exception-form.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFocusableListModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [TepExceptionFormComponent],
  exports: [TepExceptionFormComponent]
})
export class EpossTepExceptionConfigUiTepExceptionConfigDetailModule {}
