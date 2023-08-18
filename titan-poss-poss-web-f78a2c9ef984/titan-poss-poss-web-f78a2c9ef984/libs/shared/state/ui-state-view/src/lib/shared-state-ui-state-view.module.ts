import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { StateViewComponent } from './state-view.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [StateViewComponent],
  exports: [StateViewComponent]
})
export class SharedStateUiStateViewModule {}
