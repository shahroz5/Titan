import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoToleranceConfigViewComponent } from './co-tolerance-config-view/co-tolerance-config-view.component';
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
  declarations: [CoToleranceConfigViewComponent],
  exports: [CoToleranceConfigViewComponent]
})
export class EpossCoToleranceConfigUiCoToleranceConfigViewModule {}
