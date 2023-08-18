import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CNSearchResultListComponent } from './cn-search-result-list/cn-search-result-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [CNSearchResultListComponent],
  exports: [CNSearchResultListComponent]
})
export class PossCreditNoteUiCnSearchResultListModule {}
