import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestListComponent } from './request-list/request-list.component';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [CommonModule,
    SharedComponentsUiCardListModule,
    CommonCustomMaterialModule,
    SharedComponentsUiSelectionDialogModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [RequestListComponent],
  exports: [RequestListComponent]
})
export class PossGrfRequestStatusUiRequestListModule {}
