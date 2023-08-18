import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MergeGrfListComponent } from './merge-grf-list/merge-grf-list.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { AddOtherGrfPopupComponent } from './add-other-grf-popup/add-other-grf-popup.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormattersModule,
    SharedUtilFieldValidatorsModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [MergeGrfListComponent, AddOtherGrfPopupComponent],
  exports: [MergeGrfListComponent],
  entryComponents: [AddOtherGrfPopupComponent]
})
export class PossGrfUiMergeGrfListModule {}
