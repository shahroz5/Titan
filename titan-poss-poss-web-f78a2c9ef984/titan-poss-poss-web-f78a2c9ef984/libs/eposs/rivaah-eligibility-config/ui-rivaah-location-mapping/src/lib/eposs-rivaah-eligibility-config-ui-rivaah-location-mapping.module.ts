import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { RivaahLocationMappingComponent } from './rivaah-location-mapping/rivaah-location-mapping.component';
import { LocationDateRangeComponent } from './location-date-range/location-date-range.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiSelectionDialogModule
  ],
  declarations: [RivaahLocationMappingComponent, LocationDateRangeComponent],
  exports: [RivaahLocationMappingComponent],
  entryComponents: [RivaahLocationMappingComponent]
})
export class EpossRivaahEligibilityConfigUiRivaahLocationMappingModule {}
