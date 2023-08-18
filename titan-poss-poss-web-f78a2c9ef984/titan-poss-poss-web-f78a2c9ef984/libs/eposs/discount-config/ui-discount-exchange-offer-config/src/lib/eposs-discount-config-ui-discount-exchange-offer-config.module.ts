import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { DiscountExchangeOfferConfigComponent } from './discount-exchange-offer-config/discount-exchange-offer-config.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiFormFieldControlsModule,
    CommonCustomMaterialModule
  ],
  declarations: [DiscountExchangeOfferConfigComponent],
  exports: [DiscountExchangeOfferConfigComponent]
})
export class EpossDiscountConfigUiDiscountExchangeOfferConfigModule {}
