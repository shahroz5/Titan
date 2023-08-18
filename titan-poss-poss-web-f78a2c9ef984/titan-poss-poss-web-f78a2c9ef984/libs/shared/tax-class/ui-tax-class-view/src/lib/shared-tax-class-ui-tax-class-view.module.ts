import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { TaxClassViewComponent } from './tax-class-view.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [TaxClassViewComponent],
  exports: [TaxClassViewComponent]
})
export class SharedTaxClassUiTaxClassViewModule {}
