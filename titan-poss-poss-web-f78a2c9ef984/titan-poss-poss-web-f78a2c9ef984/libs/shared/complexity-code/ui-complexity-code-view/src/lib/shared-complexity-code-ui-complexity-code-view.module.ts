import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexityCodeViewComponent } from './view/complexity-code-view/complexity-code-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [ComplexityCodeViewComponent],
  exports: [ComplexityCodeViewComponent]
})
export class SharedComplexityCodeUiComplexityCodeViewModule {}
