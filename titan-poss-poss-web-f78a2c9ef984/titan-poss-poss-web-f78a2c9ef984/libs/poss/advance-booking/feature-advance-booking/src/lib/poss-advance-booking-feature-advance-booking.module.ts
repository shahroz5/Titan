import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossAdvanceBookingDataAccessAdvanceBookingModule } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { PossAdvanceBookingUiAdvanceBookingModule } from '@poss-web/poss/advance-booking/ui-advance-booking';
import { PossFocDataAccessFocModule } from '@poss-web/poss/foc/data-access-foc';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedItemMasterUiProductSearchAutocompleteModule } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedOrderConfirmationDataAccessOrderConfirmationModule } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { AdvanceBookingComponent } from './advance-booking.component';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedCustomerFeatureCustomerCreateModule } from '@poss-web/shared/customer/feature-customer-create';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossAdvanceBookingUiAdvanceBookingModule,
    SharedCustomerDataAccessCustomerModule,
    SharedComponentsUiLoaderModule,
    SharedItemMasterUiProductSearchAutocompleteModule,
    SharedComponentsUiFormattersModule,
    SharedPaymentDataAccessPaymentModule,
    SharedCommonDataAccessCommonModule,
    PossAdvanceBookingDataAccessAdvanceBookingModule,
    RouterModule.forChild([{ path: '', component: AdvanceBookingComponent }]),
    SharedOrderConfirmationDataAccessOrderConfirmationModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    PossFocDataAccessFocModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedCustomerFeatureCustomerCreateModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [AdvanceBookingComponent],
  exports: [AdvanceBookingComponent]
})
export class PossAdvanceBookingFeatureAdvanceBookingModule {}
