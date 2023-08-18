import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import {
  GiftCardsFacade,
  PossGiftCardsDataAccessGiftCardsModule
} from '@poss-web/poss/gift-cards/data-access-gift-cards';
import { PossSharedGiftCardsUiGiftCardNumberInputModule } from '@poss-web/poss/shared/gift-cards/ui-gift-card-number-input';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { GiftCardsBalanceInquiryComponent } from './gift-cards-balance-inquiry/gift-cards-balance-inquiry.component';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossGiftCardsDataAccessGiftCardsModule,
    PossSharedGiftCardsUiGiftCardNumberInputModule,
    SharedComponentsUiLoaderModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    RouterModule.forChild([
      { path: '', component: GiftCardsBalanceInquiryComponent }
    ])
  ],
  declarations: [GiftCardsBalanceInquiryComponent],
  providers: [GiftCardsFacade],
  exports: [GiftCardsBalanceInquiryComponent]
})
export class PossGiftCardsFeatureGiftCardsBalanceInquiryModule {}
