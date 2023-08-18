import { AbRequestApprovalComponent } from './ab-request-approval/ab-request-approval.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedItemMasterUiProductSearchAutocompleteModule } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { PossAdvanceBookingDataAccessAdvanceBookingModule } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { PossAdvanceBookingUiAdvanceBookingModule } from '@poss-web/poss/advance-booking/ui-advance-booking';
import { SharedComponentsUiProductViewModule } from '@poss-web/shared/components/ui-product-view';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossAdvanceBookingUiAdvanceBookingModule,
    SharedComponentsUiProductViewModule,
    SharedCustomerDataAccessCustomerModule,
    SharedComponentsUiLoaderModule,
    SharedItemMasterUiProductSearchAutocompleteModule,
    SharedComponentsUiFormattersModule,
    SharedPaymentDataAccessPaymentModule,
    SharedCommonDataAccessCommonModule,
    PossAdvanceBookingDataAccessAdvanceBookingModule,
    SharedLocationSettingsDataAccessLocationSettingsModule
  ],
  declarations: [AbRequestApprovalComponent],
  exports: [AbRequestApprovalComponent]
})
export class PossAdvanceBookingFeatureAbRequestingModule {}
