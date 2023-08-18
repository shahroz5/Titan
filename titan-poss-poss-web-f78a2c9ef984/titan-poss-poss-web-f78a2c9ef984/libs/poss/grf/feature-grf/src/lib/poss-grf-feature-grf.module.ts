import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGrfUiRsoNamesListModule } from '@poss-web/poss/grf/ui-rso-names-list';
import { PossGrfDataAccessGrfModule } from '@poss-web/poss/grf/data-access-grf';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedToolbarDataAccessToolbarModule } from '@poss-web/shared/toolbar/data-access-toolbar';
import { PossGrfUiGoldPriceChangeConfirmationPopUpModule } from '@poss-web/poss/grf/ui-gold-price-change-confirmation-pop-up';
import { GrfComponent } from './grf/grf.component';
import { SharedOrderConfirmationDataAccessOrderConfirmationModule } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { IsGrfAllowedPopUpComponent } from './is-grf-allowed-pop-up/is-grf-allowed-pop-up.component';
import { RouterModule } from '@angular/router';
import { SharedCustomerFeatureCustomerCreateModule } from '@poss-web/shared/customer/feature-customer-create';

@NgModule({
  imports: [
    CommonModule,
    PossGrfUiRsoNamesListModule,
    PossGrfDataAccessGrfModule,
    SharedComponentsUiLoaderModule,
    SharedCommonDataAccessCommonModule,
    SharedPaymentDataAccessPaymentModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedUtilFieldValidatorsModule,
    SharedToolbarDataAccessToolbarModule,
    PossGrfUiGoldPriceChangeConfirmationPopUpModule,
    SharedOrderConfirmationDataAccessOrderConfirmationModule,
    RouterModule.forChild([{ path: '', component: GrfComponent }]),
    SharedCustomerFeatureCustomerCreateModule
  ],
  declarations: [GrfComponent, IsGrfAllowedPopUpComponent],
  exports: [GrfComponent, IsGrfAllowedPopUpComponent],
  entryComponents: [IsGrfAllowedPopUpComponent]
})
export class PossGrfFeatureGrfModule {}
