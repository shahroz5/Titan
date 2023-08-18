import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { StoneTypeViewComponent } from './stone-type-view.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [StoneTypeViewComponent],
  exports: [StoneTypeViewComponent]
})
export class SharedStoneTypeUiStoneTypeViewModule {}
