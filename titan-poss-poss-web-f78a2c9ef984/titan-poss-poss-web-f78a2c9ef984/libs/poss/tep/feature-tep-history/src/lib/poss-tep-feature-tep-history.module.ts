import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGiftCardsUiRsoNameModule } from '@poss-web/poss/gift-cards/ui-so-name';
import { PossGrfUiGrfHistoryItemListingModule } from '@poss-web/poss/grf/ui-grf-history-item-listing';
import { PossTepDataAccessTepModule } from '@poss-web/poss/tep/data-access-tep';
import { PossTepUiTepDetailsModule } from '@poss-web/poss/tep/ui-tep-details';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { TepHistoryComponent } from './tep-history/tep-history.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule,
    PossGiftCardsUiRsoNameModule,
    PossTepDataAccessTepModule,
    PossGrfUiGrfHistoryItemListingModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    PossTepUiTepDetailsModule,
    SharedBodEodDataAccessBodEodModule,
    RouterModule,
    RouterModule.forChild([{ path: '', component: TepHistoryComponent }])
  ],
  declarations: [TepHistoryComponent],
  exports: [TepHistoryComponent]
})
export class PossTepFeatureTepHistoryModule {}
