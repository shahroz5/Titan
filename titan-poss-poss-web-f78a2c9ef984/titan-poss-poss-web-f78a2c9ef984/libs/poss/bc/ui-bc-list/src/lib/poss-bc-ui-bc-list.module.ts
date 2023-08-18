import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcGridComponent } from './bc-grid/bc-grid.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CmFilterPopupComponent } from './cm-filter-popup/cm-filter-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [BcGridComponent, CmFilterPopupComponent],
  exports: [BcGridComponent, CmFilterPopupComponent],
  entryComponents: [CmFilterPopupComponent]
})
export class PossBcUiBcListModule {}
