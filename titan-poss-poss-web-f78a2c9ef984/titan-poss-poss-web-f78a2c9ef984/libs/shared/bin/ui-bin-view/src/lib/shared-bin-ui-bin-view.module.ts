import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { BinViewComponent } from './bin-view.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [BinViewComponent],
  exports: [BinViewComponent]
})
export class SharedBinUiBinViewModule {}
