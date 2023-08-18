import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptAdvanceHistoryComponent } from './accept-advance-history/accept-advance-history.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { PossGiftCardsUiRsoNameModule } from '@poss-web/poss/gift-cards/ui-so-name';
import { PossCtAdvanceUiAdvanceHistoryItemListingModule } from '@poss-web/poss/ct-advance/ui-advance-history-item-listing';
import { PossCtAdvanceUiAdvanceHistoryListPopUpModule } from '@poss-web/poss/ct-advance/ui-advance-history-list-pop-up';
import { RouterModule } from '@angular/router';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { PossCtAdvanceDataAccessCtAcceptAdvanceModule } from '@poss-web/poss/ct-advance/data-access-ct-accept-advance';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule,
    PossGiftCardsUiRsoNameModule,
    PossCtAdvanceUiAdvanceHistoryItemListingModule,
    PossCtAdvanceUiAdvanceHistoryListPopUpModule,
    RouterModule.forChild([
      { path: '', component: AcceptAdvanceHistoryComponent }
    ]),
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedBodEodDataAccessBodEodModule,
    PossCtAdvanceDataAccessCtAcceptAdvanceModule
  ],
  declarations: [AcceptAdvanceHistoryComponent],
  exports: [AcceptAdvanceHistoryComponent]
})
export class PossCtAdvanceFeatureAcceptAdvanceHistoryModule {}
