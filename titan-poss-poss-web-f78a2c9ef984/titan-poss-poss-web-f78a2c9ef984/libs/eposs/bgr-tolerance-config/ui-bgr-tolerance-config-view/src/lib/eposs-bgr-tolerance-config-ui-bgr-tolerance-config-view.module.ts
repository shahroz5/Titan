import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgrToleranceConfigViewComponent } from './bgr-tolerance-config-view/bgr-tolerance-config-view.component';
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
  declarations: [BgrToleranceConfigViewComponent],
  exports: [BgrToleranceConfigViewComponent]
})
export class EpossBgrToleranceConfigUiBgrToleranceConfigViewModule {}
