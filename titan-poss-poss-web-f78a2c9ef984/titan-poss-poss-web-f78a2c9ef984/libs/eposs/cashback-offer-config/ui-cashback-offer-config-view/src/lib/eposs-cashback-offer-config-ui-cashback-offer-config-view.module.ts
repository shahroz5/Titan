import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferDetailsViewComponent } from './offer-details-view/offer-details-view.component';
import { CardDetailsViewComponent } from './card-details-view/card-details-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { CashbackOfferConfigViewComponent } from './cashback-offer-config-view/cashback-offer-config-view.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    OfferDetailsViewComponent,
    CardDetailsViewComponent,
    CashbackOfferConfigViewComponent
  ],
  exports: [
    OfferDetailsViewComponent,
    CardDetailsViewComponent,
    CashbackOfferConfigViewComponent
  ]
})
export class EpossCashbackOfferConfigUiCashbackOfferConfigViewModule {}
