import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { MetalTypeViewComponent } from './metal-type-view.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [MetalTypeViewComponent]
})
export class SharedMetalTypeUiMetalTypeViewModule {}
