import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ProductgroupViewComponent } from './productGroup-view/productgroup-view/productgroup-view.component';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [ProductgroupViewComponent],
  exports: [ProductgroupViewComponent]
})
export class SharedCfaProductUiCfaProductViewModule {}
