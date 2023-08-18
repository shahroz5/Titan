import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossAdvanceBookingDataAccessAdvanceBookingModule } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { PossAdvanceBookingUiAdvanceBookingModule } from '@poss-web/poss/advance-booking/ui-advance-booking';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { AgGridModule } from 'ag-grid-angular';
import { SearchAdvanceBookingComponent } from './search-advance-booking.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedComponentsUiFormattersModule,
    RouterModule.forChild([
      { path: '', component: SearchAdvanceBookingComponent }
    ]),
    AgGridModule.withComponents(),
    SharedLocationSettingsDataAccessLocationSettingsModule,
    PossAdvanceBookingUiAdvanceBookingModule,
    SharedBodEodDataAccessBodEodModule,
    PossAdvanceBookingDataAccessAdvanceBookingModule
  ],
  declarations: [SearchAdvanceBookingComponent],
  exports: [SearchAdvanceBookingComponent]
})
export class PossAdvanceBookingFeatureSearchAdvanceBookingModule {}
