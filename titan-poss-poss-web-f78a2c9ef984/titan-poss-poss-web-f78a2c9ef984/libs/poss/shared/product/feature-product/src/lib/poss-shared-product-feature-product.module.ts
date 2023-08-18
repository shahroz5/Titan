import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { PossSharedProductDataAccessProductModule } from '@poss-web/poss/shared/product/data-access-product';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { PossSharedProductUiProductModule } from '@poss-web/poss/shared/product/ui-product';
import { SharedItemMasterUiProductSearchAutocompleteModule } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { SharedOrderConfirmationDataAccessOrderConfirmationModule } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';

import { PossCashMemoUiAddFocPopupModule } from '@poss-web/poss/cash-memo/ui-add-foc-popup';
import { PossCashMemoUiAddManaulFocPopupModule } from '@poss-web/poss/cash-memo/ui-add-manaul-foc-popup';
import { PossSharedUiAddCoinPopupModule } from '@poss-web/poss/shared/ui-add-coin-popup';
import { PossSharedUiAddCnPopupModule } from '@poss-web/poss/shared/ui-add-cn-popup';

import { PossFocUiFocPopupsModule } from '@poss-web/poss/foc/ui-foc-popups';
import { PossFocDataAccessFocModule } from '@poss-web/poss/foc/data-access-foc';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { PossSharedDiscountDataAccessDiscountModule } from '@poss-web/poss/shared/discount/data-access-discount';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { PossSharedViewTcsUiViewTcsModule } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { SharedUserMgmtDataAccessUserModule } from '@poss-web/shared/user-mgmt/data-access-user';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

@NgModule({
  imports: [
    CommonModule,
    PossSharedProductDataAccessProductModule,
    CommonCustomMaterialModule,
    PossSharedProductUiProductModule,
    SharedItemMasterUiProductSearchAutocompleteModule,
    SharedPaymentDataAccessPaymentModule,
    SharedCommonDataAccessCommonModule,
    SharedOrderConfirmationDataAccessOrderConfirmationModule,
    PossCashMemoUiAddFocPopupModule,
    PossSharedUiAddCoinPopupModule,
    SharedComponentsUiLoaderModule,
    SharedCustomerDataAccessCustomerModule,
    PossFocDataAccessFocModule,
    PossFocUiFocPopupsModule,
    SharedComponentsUiFormattersModule,
    PossCashMemoDataAccessCashMemoModule,
    PossSharedDiscountDataAccessDiscountModule,
    SharedFileUploadDataAccessFileUploadModule,
    PossSharedViewTcsUiViewTcsModule,
    PossCashMemoUiAddManaulFocPopupModule,
    PossSharedUiAddCnPopupModule,
    SharedUserMgmtDataAccessUserModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [ProductComponent],
  exports: [ProductComponent]
})
export class PossSharedProductFeatureProductModule {}
