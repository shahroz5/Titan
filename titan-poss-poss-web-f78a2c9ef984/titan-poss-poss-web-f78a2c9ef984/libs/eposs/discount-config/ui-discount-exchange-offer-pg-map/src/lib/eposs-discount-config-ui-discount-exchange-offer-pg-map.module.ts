import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { ExchangeOfferDiscountProductGroupMappingComponent } from './exchange-offer-discount-product-group-mapping/exchange-offer-discount-product-group-mapping.component';
import { MinEligibleKaratagePopupComponent } from './min-eligible-karatage-popup/min-eligible-karatage-popup.component';
import { UiProductGroupOneKTComponent } from './ui-product-group-one-kt/ui-product-group-one-kt.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [
    ExchangeOfferDiscountProductGroupMappingComponent,
    MinEligibleKaratagePopupComponent,
    UiProductGroupOneKTComponent
  ],
  exports: [
    ExchangeOfferDiscountProductGroupMappingComponent,
    MinEligibleKaratagePopupComponent,
    UiProductGroupOneKTComponent
  ],
  entryComponents: [MinEligibleKaratagePopupComponent]
})
export class EpossDiscountConfigUiDiscountExchangeOfferPgMapModule {}
