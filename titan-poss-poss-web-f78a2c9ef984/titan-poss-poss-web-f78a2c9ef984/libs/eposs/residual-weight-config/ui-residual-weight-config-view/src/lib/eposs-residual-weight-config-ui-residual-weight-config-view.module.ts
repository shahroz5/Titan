import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResidualWeightConfigViewComponent } from './residual-weight-config-view/residual-weight-config-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [ResidualWeightConfigViewComponent],
  exports: [ResidualWeightConfigViewComponent]
})
export class EpossResidualWeightConfigUiResidualWeightConfigViewModule {}
