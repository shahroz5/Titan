import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossAdvanceBookingDataAccessAdvanceBookingModule } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { PossAdvanceBookingUiAdvanceBookingModule } from '@poss-web/poss/advance-booking/ui-advance-booking';
import { PossSharedUiAddCoinPopupModule } from '@poss-web/poss/shared/ui-add-coin-popup';
import { PossSharedUiManualFormDetailsModule } from '@poss-web/poss/shared/ui-manual-form-details';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedItemMasterUiProductSearchAutocompleteModule } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { ManualAbComponent } from './manual-ab/manual-ab.component';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { SharedCustomerFeatureCustomerCreateModule } from '@poss-web/shared/customer/feature-customer-create';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    PossAdvanceBookingDataAccessAdvanceBookingModule,
    SharedItemMasterUiProductSearchAutocompleteModule,
    SharedCustomerDataAccessCustomerModule,
    PossSharedUiManualFormDetailsModule,
    SharedComponentsUiFormFieldControlsModule,
    PossSharedUiManualFormDetailsModule,
    PossSharedUiAddCoinPopupModule,
    RouterModule.forChild([{ path: '', component: ManualAbComponent }]),
    PossAdvanceBookingUiAdvanceBookingModule,
    SharedComponentsUiFormattersModule,
    SharedCustomerFeatureCustomerCreateModule,
    SharedPermissionUiPermissionModule,
    SharedFileUploadDataAccessFileUploadModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [ManualAbComponent],
  exports: [ManualAbComponent],
  providers: [DecimalPipe]
})
export class PossAdvanceBookingFeatureManualAdvanceBookingModule {}
