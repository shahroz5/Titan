import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { OfferDetailsPopUpComponent } from './offer-details-pop-up/offer-details-pop-up.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CardDetailsComponent } from './card-details/card-details.component';

import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [
    BankDetailsComponent,
    OfferDetailsComponent,
    OfferDetailsPopUpComponent,
    CardDetailsComponent
  ],
  exports: [BankDetailsComponent, OfferDetailsComponent, CardDetailsComponent],
  entryComponents: [OfferDetailsPopUpComponent]
})
export class EpossCashbackOfferConfigUiCashbackOfferConfigDetailModule {}
