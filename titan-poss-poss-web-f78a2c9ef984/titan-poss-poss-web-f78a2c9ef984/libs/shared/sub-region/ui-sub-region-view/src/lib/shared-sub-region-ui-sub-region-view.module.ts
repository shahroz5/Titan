import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubRegionViewComponent } from './view/sub-region-view/sub-region-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [SubRegionViewComponent],
  exports: [SubRegionViewComponent]
})
export class SharedSubRegionUiSubRegionViewModule {}
