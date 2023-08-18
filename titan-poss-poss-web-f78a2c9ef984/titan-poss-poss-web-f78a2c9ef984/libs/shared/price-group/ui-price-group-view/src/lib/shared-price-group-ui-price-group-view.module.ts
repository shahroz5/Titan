import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PriceGroupViewComponent } from './price-group-view.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [PriceGroupViewComponent]
})
export class SharedPriceGroupUiPriceGroupViewModule {}
