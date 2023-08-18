import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGiftCardsUiRsoNameModule } from '@poss-web/poss/gift-cards/ui-so-name';
import { PossGiftCardsDataAccessGiftCardsModule } from '@poss-web/poss/gift-cards/data-access-gift-cards';
import { PossGiftCardsUiGiftCardsGridModule } from '@poss-web/poss/gift-cards/ui-gift-cards-grid';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import {
  SharedPaymentUiPaymentModule,
  PaymentUnipayCardRetryPopupComponent
} from '@poss-web/shared/payment/ui-payment';

import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

import { GiftCardsSaleComponent } from './gift-cards-sale/gift-cards-sale.component';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedUtilConfigModule } from '@poss-web/shared/util-config';
import { PossSharedGiftCardsUiGiftCardNumberInputModule } from '@poss-web/poss/shared/gift-cards/ui-gift-card-number-input';
import { SharedOrderConfirmationDataAccessOrderConfirmationModule } from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { RouterModule } from '@angular/router';
import { SharedCustomerFeatureCustomerCreateModule } from '@poss-web/shared/customer/feature-customer-create';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossGiftCardsUiRsoNameModule,
    PossGiftCardsDataAccessGiftCardsModule,
    SharedComponentsUiLoaderModule,
    PossGiftCardsUiGiftCardsGridModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedPaymentUiPaymentModule,
    SharedPaymentDataAccessPaymentModule,
    SharedCommonDataAccessCommonModule,
    PossCashMemoDataAccessCashMemoModule,
    PossSharedGiftCardsUiGiftCardNumberInputModule,
    SharedUtilFieldValidatorsModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedUtilConfigModule,
    SharedOrderConfirmationDataAccessOrderConfirmationModule,
    RouterModule.forChild([{ path: '', component: GiftCardsSaleComponent }]),
    SharedCustomerFeatureCustomerCreateModule
  ],
  declarations: [GiftCardsSaleComponent],
  entryComponents: [PaymentUnipayCardRetryPopupComponent],
  exports: [GiftCardsSaleComponent]
})
export class PossGiftCardsFeatureGiftCardsSaleModule {}
