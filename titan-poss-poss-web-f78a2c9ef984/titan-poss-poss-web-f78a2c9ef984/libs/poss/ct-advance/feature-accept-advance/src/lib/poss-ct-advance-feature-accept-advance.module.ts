import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossCtAdvanceUiRsoNamesListModule } from '@poss-web/poss/ct-advance/ui-rso-names-list';
import { PossCtAdvanceDataAccessCtAcceptAdvanceModule } from '@poss-web/poss/ct-advance/data-access-ct-accept-advance';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { AcceptAdvanceComponent } from './accept-advance/accept-advance.component';
import { SharedOrderConfirmationDataAccessOrderConfirmationModule } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { RouterModule } from '@angular/router';
import { SharedCustomerFeatureCustomerCreateModule } from '@poss-web/shared/customer/feature-customer-create';

@NgModule({
  imports: [
    CommonModule,
    PossCtAdvanceUiRsoNamesListModule,
    PossCtAdvanceDataAccessCtAcceptAdvanceModule,
    SharedComponentsUiLoaderModule,
    SharedCommonDataAccessCommonModule,
    SharedPaymentDataAccessPaymentModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedUtilFieldValidatorsModule,
    SharedOrderConfirmationDataAccessOrderConfirmationModule,
    RouterModule.forChild([{ path: '', component: AcceptAdvanceComponent }]),
    SharedCustomerFeatureCustomerCreateModule
  ],
  declarations: [AcceptAdvanceComponent],
  exports: [AcceptAdvanceComponent]
})
export class PossCtAdvanceFeatureAcceptAdvanceModule {}
