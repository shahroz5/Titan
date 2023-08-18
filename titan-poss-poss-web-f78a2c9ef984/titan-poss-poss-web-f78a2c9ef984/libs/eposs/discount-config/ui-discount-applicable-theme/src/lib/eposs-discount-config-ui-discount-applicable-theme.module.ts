import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountApplicableThemeComponent } from './discount-applicable-theme/discount-applicable-theme.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [DiscountApplicableThemeComponent],
  exports: [DiscountApplicableThemeComponent]
})
export class EpossDiscountConfigUiDiscountApplicableThemeModule {}
