import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountTsssConfigComponent } from './discount-tsss-config/discount-tsss-config.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [DiscountTsssConfigComponent],
  exports: [DiscountTsssConfigComponent]
})
export class EpossDiscountConfigUiDiscountTsssConfigModule {}
