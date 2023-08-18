import { GiftCardsCancellationComponent } from './gift-cards-cancellation/gift-cards-cancellation.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGiftCardsUiRsoNameModule } from '@poss-web/poss/gift-cards/ui-so-name';
import { PossGiftCardsUiGiftCardsCmListModule } from '@poss-web/poss/gift-cards/ui-gift-cards-cm-list';
import { PossGiftCardsDataAccessGiftCardsModule } from '@poss-web/poss/gift-cards/data-access-gift-cards';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { PossGiftCardsUiGiftCardsGridModule } from '@poss-web/poss/gift-cards/ui-gift-cards-grid';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { PossGiftCardsUiCmListGridPopUpModule } from '@poss-web/poss/gift-cards/ui-cm-list-grid-pop-up';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { PossGiftCardsUiGiftCardsCancellationReasonsModule } from '@poss-web/poss/gift-cards/ui-gift-cards-cancellation-reasons';
import { PossGiftCardsUiGiftCardsCmPaymentDetailsModule } from '@poss-web/poss/gift-cards/ui-gift-cards-cm-payment-details';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossGiftCardsUiRsoNameModule,
    PossGiftCardsDataAccessGiftCardsModule,
    SharedComponentsUiAgGridModule,
    PossGiftCardsUiGiftCardsGridModule,
    SharedCommonDataAccessCommonModule,
    SharedCustomerDataAccessCustomerModule,
    PossGiftCardsUiGiftCardsCmListModule,
    PossGiftCardsUiCmListGridPopUpModule,
    SharedComponentsUiLoaderModule,
    SharedPaymentDataAccessPaymentModule,
    PossGiftCardsUiGiftCardsCancellationReasonsModule,
    PossGiftCardsUiGiftCardsCmPaymentDetailsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    RouterModule.forChild([
      { path: '', component: GiftCardsCancellationComponent }
    ])
  ],
  declarations: [GiftCardsCancellationComponent],
  exports: [GiftCardsCancellationComponent]
})
export class PossGiftCardsFeatureGiftCardsCancellationModule {}
