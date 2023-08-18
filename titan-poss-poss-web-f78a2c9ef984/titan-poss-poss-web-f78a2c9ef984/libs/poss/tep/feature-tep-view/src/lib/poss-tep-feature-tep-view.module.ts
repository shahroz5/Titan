import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TepViewComponent } from './tep-view/tep-view.component';
import { PossTepUiTepDetailsModule } from '@poss-web/poss/tep/ui-tep-details';
import { PossTepUiRefundDetailsModule } from '@poss-web/poss/tep/ui-refund-details';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedItemMasterUiProductSearchAutocompleteModule } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { SharedTepUiTepItemsGridModule } from '@poss-web/shared/tep/ui-tep-items-grid';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedTepDataAccessDirectTepModule } from '@poss-web/shared/tep/data-access-direct-tep';

@NgModule({
  imports: [
    CommonModule,
    PossTepUiTepDetailsModule,
    PossTepUiRefundDetailsModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    SharedItemMasterUiProductSearchAutocompleteModule,
    PossSharedProductDataAccessProductModule,
    SharedTepUiTepItemsGridModule,
    SharedTepDataAccessDirectTepModule
  ],
  declarations: [TepViewComponent],
  exports: [TepViewComponent]
})
export class PossTepFeatureTepViewModule {}
