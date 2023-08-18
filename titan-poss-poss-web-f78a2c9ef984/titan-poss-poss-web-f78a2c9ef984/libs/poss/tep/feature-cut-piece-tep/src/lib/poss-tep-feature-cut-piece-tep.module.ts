import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedToolbarDataAccessToolbarModule } from '@poss-web/shared/toolbar/data-access-toolbar';
import { PossTepUiRsoNamesListModule } from '@poss-web/poss/tep/ui-rso-names-list';
import { SharedItemMasterUiProductSearchAutocompleteModule } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { SharedTepUiTepItemsGridModule } from '@poss-web/shared/tep/ui-tep-items-grid';
import { SharedTepFeatureTepItemPopUpModule } from '@poss-web/shared/tep/feature-tep-item-pop-up';
import { SharedTepDataAccessDirectTepModule } from '@poss-web/shared/tep/data-access-direct-tep';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossTepUiCutPieceTepItemGridModule } from '@poss-web/poss/tep/ui-cut-piece-tep-item-grid';
import { CutPieceTepComponent } from './cut-piece-tep/cut-piece-tep.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedToolbarDataAccessToolbarModule,
    PossTepUiRsoNamesListModule,
    SharedItemMasterUiProductSearchAutocompleteModule,
    PossSharedProductDataAccessProductModule,
    SharedTepUiTepItemsGridModule,
    SharedTepFeatureTepItemPopUpModule,
    SharedTepDataAccessDirectTepModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiLoaderModule,
    PossTepUiCutPieceTepItemGridModule,
    RouterModule.forChild([{ path: '', component: CutPieceTepComponent }])
  ],
  declarations: [CutPieceTepComponent],
  exports: [CutPieceTepComponent]
})
export class PossTepFeatureCutPieceTepModule {}
