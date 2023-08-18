import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionViewComponent } from './region-view/region-view/region-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [RegionViewComponent],
  exports: [RegionViewComponent]
})
export class SharedRegionUiRegionViewModule {}
