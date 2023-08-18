import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

import { TepStoneConfigFormComponent } from './tep-stone-config-form.component';
import { TepStoneConfigEditDialogComponent } from './tep-stone-config-edit-dialog/tep-stone-config-edit-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFocusableListModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [
    TepStoneConfigFormComponent,
    TepStoneConfigEditDialogComponent
  ],
  exports: [TepStoneConfigFormComponent, TepStoneConfigEditDialogComponent]
})
export class EpossTepStoneConfigUiTepStoneConfigDetailModule {}
