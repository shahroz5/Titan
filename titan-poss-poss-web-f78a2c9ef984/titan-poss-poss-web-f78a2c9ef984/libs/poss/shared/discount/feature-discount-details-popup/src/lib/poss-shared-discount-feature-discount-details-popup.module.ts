import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountDetailsPopupComponent } from './discount-details-popup.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { DiscountDetailsPopupServiceAbstraction } from '@poss-web/shared/models';
import { DiscountDetailsPopupService } from './discount-details-popup.service';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedItemUiItemDetailsHeaderModule } from '@poss-web/shared/item/ui-item-details-header';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { DiscountDetailsBillLevelDiscountComponent } from './discount-details-bill-level-discount/discount-details-bill-level-discount.component';
import { DiscountDetailsCoinOfferDiscountComponent } from './discount-details-coin-offer-discount/discount-details-coin-offer-discount.component';
import { DiscountDetailsExchangeOfferDiscountComponent } from './discount-details-exchange-offer-discount/discount-details-exchange-offer-discount.component';
import { DiscountDetailsItemLevelDiscountComponent } from './discount-details-item-level-discount/discount-details-item-level-discount.component';
import { DiscountDetailsSystemDiscountComponent } from './discount-details-system-discount/discount-details-system-discount.component';
import { PossSharedDiscountDataAccessDiscountModule } from '@poss-web/poss/shared/discount/data-access-discount';
import { DiscountDetailsKaratExchangeOfferDiscountComponent } from './discount-details-karat-exchange-offer-discount/discount-details-karat-exchange-offer-discount.component';
import { DiscountDetailsGepPurityDiscountComponent } from './discount-details-gep-purity-discount/discount-details-gep-purity-discount.component';
import { DiscountDetailsRivaahDiscountComponent } from './discount-details-rivaah-discount/discount-details-rivaah-discount.component';
import { PossSharedViewTcsUiViewTcsModule } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedItemUiItemDetailsHeaderModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    PossSharedDiscountDataAccessDiscountModule,
    PossSharedViewTcsUiViewTcsModule,
    SharedPaymentDataAccessPaymentModule
  ],
  declarations: [
    DiscountDetailsPopupComponent,
    DiscountDetailsBillLevelDiscountComponent,
    DiscountDetailsItemLevelDiscountComponent,
    DiscountDetailsSystemDiscountComponent,
    DiscountDetailsCoinOfferDiscountComponent,
    DiscountDetailsExchangeOfferDiscountComponent,
    DiscountDetailsKaratExchangeOfferDiscountComponent,
    DiscountDetailsRivaahDiscountComponent,
    DiscountDetailsGepPurityDiscountComponent
  ],
  entryComponents: [DiscountDetailsPopupComponent],
  providers: [
    {
      provide: DiscountDetailsPopupServiceAbstraction,
      useClass: DiscountDetailsPopupService
    }
  ]
})
export class PossSharedDiscountFeatureDiscountDetailsPopupModule {}
