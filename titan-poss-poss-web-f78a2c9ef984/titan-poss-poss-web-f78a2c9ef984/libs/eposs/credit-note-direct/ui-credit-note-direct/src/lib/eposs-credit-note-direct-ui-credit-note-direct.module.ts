import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditNoteDirectSearchComponent } from './credit-note-direct-search/credit-note-direct-search.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { CreditNoteDirectGridComponent } from './credit-note-direct-grid/credit-note-direct-grid.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiFormFieldControlsModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [
    CreditNoteDirectSearchComponent,
    CreditNoteDirectGridComponent
  ],
  exports: [CreditNoteDirectSearchComponent, CreditNoteDirectGridComponent]
})
export class EpossCreditNoteDirectUiCreditNoteDirectModule {}
