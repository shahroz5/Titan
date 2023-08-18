import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { DocumentsSearchListComponent } from './documents-search-list/documents-search-list.component';
import { DocumentsSearchListItemComponent } from './documents-search-list-item/documents-search-list-item.component';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [
    DocumentsSearchListComponent,
    DocumentsSearchListItemComponent
  ],
  exports: [DocumentsSearchListItemComponent, DocumentsSearchListComponent]
})
export class EpossDigitizationDocumentsSearchUiDocumentsListModule {}
