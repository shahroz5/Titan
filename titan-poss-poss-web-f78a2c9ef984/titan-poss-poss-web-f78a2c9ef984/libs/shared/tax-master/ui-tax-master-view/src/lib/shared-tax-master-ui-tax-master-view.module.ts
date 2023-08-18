import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { TaxMasterViewComponent } from './tax-master-view.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [TaxMasterViewComponent],
  exports: [TaxMasterViewComponent]
})
export class SharedTaxMasterUiTaxMasterViewModule {}
