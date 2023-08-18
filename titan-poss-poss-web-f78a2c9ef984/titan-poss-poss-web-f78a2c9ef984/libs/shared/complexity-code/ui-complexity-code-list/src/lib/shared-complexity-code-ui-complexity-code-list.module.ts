import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexityCodeItemsComponent } from './complexity-code-items/complexity-code-items.component';
import { ComplexityCodeItemComponent } from './complexity-code-item/complexity-code-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [ComplexityCodeItemsComponent, ComplexityCodeItemComponent],
  exports: [ComplexityCodeItemsComponent, ComplexityCodeItemComponent]
})
export class SharedComplexityCodeUiComplexityCodeListModule {}
