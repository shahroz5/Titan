import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbToleranceConfigViewComponent } from './ab-tolerance-config-view/ab-tolerance-config-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [AbToleranceConfigViewComponent],
  exports: [AbToleranceConfigViewComponent]
})
export class EpossAbToleranceConfigUiAbToleranceConfigViewModule {}
