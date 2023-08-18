import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ProductCategoryViewComponent } from './product-category-view.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [ProductCategoryViewComponent],
  exports: [ProductCategoryViewComponent]
})
export class SharedProductCategoryUiProductCategoryViewModule {}
