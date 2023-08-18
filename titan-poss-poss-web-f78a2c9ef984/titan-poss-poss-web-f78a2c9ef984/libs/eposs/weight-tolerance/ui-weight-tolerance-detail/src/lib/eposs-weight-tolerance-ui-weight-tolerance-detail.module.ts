import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeightToleranceDetailsItemComponent } from './weight-tolerance-details-item/weight-tolerance-details-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { TolerancePopUpComponent } from './tolerance-pop-up/tolerance-pop-up.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import {SharedUtilFieldValidatorsModule} from '@poss-web/shared/util-field-validators'
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [WeightToleranceDetailsItemComponent, TolerancePopUpComponent],
  exports: [WeightToleranceDetailsItemComponent]
})
export class EpossWeightToleranceUiWeightToleranceDetailModule {}
