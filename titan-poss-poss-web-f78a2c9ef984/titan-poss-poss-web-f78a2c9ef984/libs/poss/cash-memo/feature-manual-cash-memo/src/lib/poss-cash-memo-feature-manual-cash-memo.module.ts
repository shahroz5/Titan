import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualCashMemoComponent } from './manual-cash-memo.component';
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
import { PossCashMemoUiOccasionSelectionModule } from '@poss-web/poss/cash-memo/ui-occasion-selection';
import { PossSharedViewTcsUiViewTcsModule } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { SharedCustomerFeatureCustomerCreateModule } from '@poss-web/shared/customer/feature-customer-create';

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
    RouterModule.forChild([{ path: '', component: ManualCashMemoComponent }]),
    PossCashMemoUiOccasionSelectionModule,
    PossSharedViewTcsUiViewTcsModule,
    SharedCustomerFeatureCustomerCreateModule
  ],
  declarations: [ManualCashMemoComponent],
  exports: [ManualCashMemoComponent]
})
export class PossCashMemoFeatureManualCashMemoModule {}
