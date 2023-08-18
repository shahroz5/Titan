import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
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
import { PossTepUiRefundPaymentModeFieldsModule } from '@poss-web/poss/tep/ui-refund-payment-mode-fields';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedFileUploadUiFileMultiUploadModule } from '@poss-web/shared/file-upload/ui-file-multi-upload';
import { SharedComponentsUiItemPreviewPopupModule } from '@poss-web/shared/components/ui-item-preview-popup';
import { SharedDiscountsSelectionFeatureDiscountsSelectionPopUpModule } from '@poss-web/shared/discounts-selection/feature-discounts-selection-pop-up';
import { PossTepUiTepDetailsModule } from '@poss-web/poss/tep/ui-tep-details';
import { TepRequestViewComponent } from './tep-request-view/tep-request-view.component';
import { PossTepUiCutPieceTepItemGridModule } from '@poss-web/poss/tep/ui-cut-piece-tep-item-grid';
import { PossGrnDataAccessGrnModule } from '@poss-web/poss/grn/data-access-grn';
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
    SharedFileUploadDataAccessFileUploadModule,
    PossTepUiRefundPaymentModeFieldsModule,
    SharedComponentsUiFormFieldControlsModule,
    PossTepUiTepDetailsModule,
    SharedFileUploadUiFileMultiUploadModule,
    SharedComponentsUiItemPreviewPopupModule,
    PossGrnDataAccessGrnModule,
    SharedDiscountsSelectionFeatureDiscountsSelectionPopUpModule,
    PossTepUiCutPieceTepItemGridModule
  ],
  declarations: [TepRequestViewComponent],
  exports: [TepRequestViewComponent]
})
export class PossTepFeatureTepRequestViewModule {}
