import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualTepComponent } from './manual-tep/manual-tep.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { SharedItemMasterUiProductSearchAutocompleteModule } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { PossSharedUiManualFormDetailsModule } from '@poss-web/poss/shared/ui-manual-form-details';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { PossSharedUiAddCoinPopupModule } from '@poss-web/poss/shared/ui-add-coin-popup';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedOrderConfirmationDataAccessOrderConfirmationModule } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { RouterModule } from '@angular/router';

import { SharedToolbarDataAccessToolbarModule } from '@poss-web/shared/toolbar/data-access-toolbar';
import { PossTepUiRsoNamesListModule } from '@poss-web/poss/tep/ui-rso-names-list';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { SharedTepUiTepItemsGridModule } from '@poss-web/shared/tep/ui-tep-items-grid';
import { SharedTepFeatureTepItemPopUpModule } from '@poss-web/shared/tep/feature-tep-item-pop-up';
import { SharedTepDataAccessDirectTepModule } from '@poss-web/shared/tep/data-access-direct-tep';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { PossTepUiRefundPaymentModeFieldsModule } from '@poss-web/poss/tep/ui-refund-payment-mode-fields';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
import { SharedComponentsUiItemPreviewPopupModule } from '@poss-web/shared/components/ui-item-preview-popup';
import { SharedDiscountsSelectionFeatureDiscountsSelectionPopUpModule } from '@poss-web/shared/discounts-selection/feature-discounts-selection-pop-up';
import { PossGrnDataAccessGrnModule } from '@poss-web/poss/grn/data-access-grn';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
// import { PossTepUiTepExceptionModule } from '@poss-web/poss/tep/ui-tep-exception';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    PossCashMemoDataAccessCashMemoModule,
    SharedItemMasterUiProductSearchAutocompleteModule,
    SharedCustomerDataAccessCustomerModule,
    PossSharedUiManualFormDetailsModule,
    SharedComponentsUiFormFieldControlsModule,
    PossSharedUiManualFormDetailsModule,
    PossSharedUiAddCoinPopupModule,
    SharedComponentsUiFormattersModule,
    SharedOrderConfirmationDataAccessOrderConfirmationModule,
    SharedToolbarDataAccessToolbarModule,
    PossTepUiRsoNamesListModule,
    SharedItemMasterUiProductSearchAutocompleteModule,
    PossSharedProductDataAccessProductModule,
    SharedTepUiTepItemsGridModule,
    SharedTepFeatureTepItemPopUpModule,
    SharedTepDataAccessDirectTepModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiLoaderModule,
    PossTepUiRefundPaymentModeFieldsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFileUploadModule,
    SharedComponentsUiItemPreviewPopupModule,
    SharedDiscountsSelectionFeatureDiscountsSelectionPopUpModule,
    PossGrnDataAccessGrnModule,
    // PossTepUiTepExceptionModule,
    SharedBodEodDataAccessBodEodModule,
    RouterModule.forChild([{ path: '', component: ManualTepComponent }]),
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [ManualTepComponent],
  exports: [ManualTepComponent]
})
export class PossTepFeatureManualTepModule {}
