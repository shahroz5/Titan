import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleButtonComponent } from './toggle-button.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [ToggleButtonComponent],
  exports: [ToggleButtonComponent]
})
export class SharedComponentsUiToggleButtonModule {}
