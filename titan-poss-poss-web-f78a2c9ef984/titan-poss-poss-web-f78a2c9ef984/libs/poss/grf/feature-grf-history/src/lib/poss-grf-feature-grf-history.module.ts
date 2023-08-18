import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { PossGiftCardsUiRsoNameModule } from '@poss-web/poss/gift-cards/ui-so-name';
import { PossGrfUiGrfHistoryItemListingModule } from '@poss-web/poss/grf/ui-grf-history-item-listing';
import { PossCtAdvanceUiAdvanceHistoryListPopUpModule } from '@poss-web/poss/ct-advance/ui-advance-history-list-pop-up';
import { GrfHistoryComponent } from './grf-history/grf-history.component';
import { RouterModule } from '@angular/router';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule,
    PossGiftCardsUiRsoNameModule,
    PossGrfUiGrfHistoryItemListingModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    PossCtAdvanceUiAdvanceHistoryListPopUpModule,
    RouterModule.forChild([{ path: '', component: GrfHistoryComponent }]),
    SharedBodEodDataAccessBodEodModule
  ],
  declarations: [GrfHistoryComponent],
  exports: [GrfHistoryComponent]
})
export class PossGrfFeatureGrfHistoryModule {}
