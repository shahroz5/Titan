import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { GiftCardsHistoryItemListingComponent } from './gift-cards-history-item-listing/gift-cards-history-item-listing.component';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [GiftCardsHistoryItemListingComponent],
  exports: [GiftCardsHistoryItemListingComponent]
})
export class PossGiftCardsUiGcHistoryItemListingModule {}
