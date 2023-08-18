import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountConfigRequestListComponent } from './discount-config-request-list/discount-config-request-list.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    CommonCustomMaterialModule
  ],
  declarations: [DiscountConfigRequestListComponent],
  exports: [DiscountConfigRequestListComponent]
})
export class EpossDiscountConfigUiDiscountConfigRequestListModule {}
