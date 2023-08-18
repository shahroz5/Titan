import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgrConfigViewComponent } from './bgr-config-view/bgr-config-view.component';
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
  declarations: [BgrConfigViewComponent],
  exports: [BgrConfigViewComponent]
})
export class EpossBgrConfigUiBgrConfigViewModule {}
