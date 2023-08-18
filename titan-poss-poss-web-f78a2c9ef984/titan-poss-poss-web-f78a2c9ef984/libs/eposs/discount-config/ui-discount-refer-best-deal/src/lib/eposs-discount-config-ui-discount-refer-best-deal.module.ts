import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferBestDealDiscountComponent } from './refer-best-deal-discount/refer-best-deal-discount.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFilterDialogModule
  ],
  declarations: [ReferBestDealDiscountComponent],
  exports: [ReferBestDealDiscountComponent]
})
export class EpossDiscountConfigUiDiscountReferBestDealModule {}
