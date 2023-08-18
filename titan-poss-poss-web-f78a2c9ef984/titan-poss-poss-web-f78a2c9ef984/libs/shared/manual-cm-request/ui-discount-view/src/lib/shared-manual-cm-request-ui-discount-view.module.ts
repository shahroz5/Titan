import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountViewComponent } from './discount-view/discount-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [DiscountViewComponent],
  exports: [DiscountViewComponent]
})
export class SharedManualCmRequestUiDiscountViewModule {}
