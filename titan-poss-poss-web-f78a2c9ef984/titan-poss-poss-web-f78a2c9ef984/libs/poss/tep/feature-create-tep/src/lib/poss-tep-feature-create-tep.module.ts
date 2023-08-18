import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTepComponent } from './create-tep/create-tep.component';
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
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
import { SharedComponentsUiItemPreviewPopupModule } from '@poss-web/shared/components/ui-item-preview-popup';
import { SharedDiscountsSelectionFeatureDiscountsSelectionPopUpModule } from '@poss-web/shared/discounts-selection/feature-discounts-selection-pop-up';
import { RouterModule } from '@angular/router';
import { PossGrnDataAccessGrnModule } from '@poss-web/poss/grn/data-access-grn';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';
import { PossTepUiTepExceptionModule } from '@poss-web/poss/tep/ui-tep-exception';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';

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
    SharedPaymentDataAccessPaymentModule,
    PossTepUiRefundPaymentModeFieldsModule,
    SharedComponentsUiFormFieldControlsModule,
    PossCashMemoDataAccessCashMemoModule,
    SharedComponentsUiFileUploadModule,
    SharedComponentsUiItemPreviewPopupModule,
    SharedDiscountsSelectionFeatureDiscountsSelectionPopUpModule,
    PossGrnDataAccessGrnModule,
    PossTepUiTepExceptionModule,
    SharedBodEodDataAccessBodEodModule,
    RouterModule.forChild([{ path: '', component: CreateTepComponent }]),
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [CreateTepComponent],
  exports: [CreateTepComponent]
})
export class PossTepFeatureCreateTepModule {}
