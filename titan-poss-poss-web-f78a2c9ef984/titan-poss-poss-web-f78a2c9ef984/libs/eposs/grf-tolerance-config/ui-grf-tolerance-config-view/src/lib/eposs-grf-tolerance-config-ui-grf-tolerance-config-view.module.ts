import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrfToleranceConfigViewComponent } from './grf-tolerance-config-view/grf-tolerance-config-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [GrfToleranceConfigViewComponent],
  exports: [GrfToleranceConfigViewComponent]
})
export class EpossGrfToleranceConfigUiGrfToleranceConfigViewModule {}
