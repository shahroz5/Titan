import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { BinGroupViewComponent } from './bin-group-view.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [BinGroupViewComponent],
  exports: [BinGroupViewComponent]
})
export class SharedBinGroupUiBinGroupViewModule {}
