import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { TepProductGroupFormComponent } from './tep-product-group-form/tep-product-group-form.component';
import { TepProductGroupEditDialogComponent } from './tep-product-group-edit-dialog/tep-product-group-edit-dialog.component';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';

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
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiSortDialogModule
  ],
  declarations: [
    TepProductGroupFormComponent,
    TepProductGroupEditDialogComponent
  ],
  exports: [TepProductGroupFormComponent, TepProductGroupEditDialogComponent]
})
export class EpossTepProductGroupUiTepProductGroupDetailModule {}
