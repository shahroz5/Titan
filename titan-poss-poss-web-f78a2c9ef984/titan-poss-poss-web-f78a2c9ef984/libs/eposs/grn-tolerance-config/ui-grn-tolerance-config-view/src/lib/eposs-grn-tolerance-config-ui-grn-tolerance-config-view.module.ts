import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnToleranceConfigViewComponent } from './grn-tolerance-config-view/grn-tolerance-config-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormattersModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [GrnToleranceConfigViewComponent],
  exports: [GrnToleranceConfigViewComponent]
})
export class EpossGrnToleranceConfigUiGrnToleranceConfigViewModule {}
