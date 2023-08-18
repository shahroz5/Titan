import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BinDetailsAdvancedFilterComponent } from './bin-details-advanced-filter/bin-details-advanced-filter.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import {
  MAT_DATE_FORMATS
} from '@angular/material/core';
import { BinDetailsListingComponent } from './bin-details-listing/bin-details-listing.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

export const CUSTOME_DATE_FORMAT = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [BinDetailsAdvancedFilterComponent, BinDetailsListingComponent],
  entryComponents: [
    BinDetailsAdvancedFilterComponent,
    BinDetailsListingComponent
  ],
  exports: [BinDetailsAdvancedFilterComponent, BinDetailsListingComponent],
  providers: [
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE]
    // },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOME_DATE_FORMAT }
  ]
})
export class EpossNewBinRequestUiBinDetailsPopupModule {}
