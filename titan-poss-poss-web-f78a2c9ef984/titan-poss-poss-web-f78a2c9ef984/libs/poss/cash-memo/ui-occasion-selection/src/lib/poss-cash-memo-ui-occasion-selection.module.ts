import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OccasionSelectionComponent } from './occasion-selection/occasion-selection.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [OccasionSelectionComponent],
  exports: [OccasionSelectionComponent]
})
export class PossCashMemoUiOccasionSelectionModule {}
