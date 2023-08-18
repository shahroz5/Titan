import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { CheckboxGridComponent } from './checkbox-grid.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [CheckboxGridComponent],
  exports: [CheckboxGridComponent]
})
export class SharedComponentsUiCheckboxGridModule {}
