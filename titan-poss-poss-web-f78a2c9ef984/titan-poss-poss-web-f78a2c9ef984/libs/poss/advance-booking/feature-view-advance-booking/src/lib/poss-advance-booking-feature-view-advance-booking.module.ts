import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossAdvanceBookingDataAccessAdvanceBookingModule } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { PossAdvanceBookingUiAdvanceBookingModule } from '@poss-web/poss/advance-booking/ui-advance-booking';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiProductViewModule } from '@poss-web/shared/components/ui-product-view';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedFileUploadUiFileMultiUploadModule } from '@poss-web/shared/file-upload/ui-file-multi-upload';
import { SharedItemMasterUiProductSearchAutocompleteModule } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { ViewAdvanceBookingComponent } from './view-advance-booking/view-advance-booking.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    PossAdvanceBookingUiAdvanceBookingModule,
    SharedComponentsUiProductViewModule,
    SharedCustomerDataAccessCustomerModule,
    SharedComponentsUiLoaderModule,
    SharedItemMasterUiProductSearchAutocompleteModule,
    SharedComponentsUiFormattersModule,
    SharedPaymentDataAccessPaymentModule,
    SharedCommonDataAccessCommonModule,
    PossAdvanceBookingDataAccessAdvanceBookingModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedFileUploadUiFileMultiUploadModule
  ],
  declarations: [ViewAdvanceBookingComponent],
  exports: [ViewAdvanceBookingComponent]
})
export class PossAdvanceBookingFeatureViewAdvanceBookingModule {}
